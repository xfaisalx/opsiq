from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI, APIError
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex, SimpleField, SearchableField, SearchFieldDataType
)
from azure.storage.blob import BlobServiceClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
import PyPDF2
import hashlib
import io
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure OpenAI
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2025-01-01-preview"
)

# Azure AI Search
search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
search_key = os.getenv("AZURE_SEARCH_KEY")
search_index = os.getenv("AZURE_SEARCH_INDEX")
search_client = SearchClient(
    endpoint=search_endpoint,
    index_name=search_index,
    credential=AzureKeyCredential(search_key)
)
index_client = SearchIndexClient(
    endpoint=search_endpoint,
    credential=AzureKeyCredential(search_key)
)

# Azure Blob Storage
blob_service = BlobServiceClient.from_connection_string(
    os.getenv("AZURE_STORAGE_CONNECTION_STRING")
)
blob_container = os.getenv("AZURE_STORAGE_CONTAINER")


def ensure_search_index():
    try:
        index_client.get_index(search_index)
    except Exception:
        index = SearchIndex(
            name=search_index,
            fields=[
                SimpleField(name="id", type=SearchFieldDataType.String, key=True),
                SearchableField(name="content", type=SearchFieldDataType.String),
                SimpleField(name="document_title", type=SearchFieldDataType.String, filterable=True),
                SimpleField(name="section", type=SearchFieldDataType.String),
                SimpleField(name="page_number", type=SearchFieldDataType.Int32),
            ]
        )
        index_client.create_index(index)


ensure_search_index()


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


class ChatRequest(BaseModel):
    message: str
    language: str = "en"


@app.get("/")
def health_check():
    return {"status": "OpsIQ backend is running"}


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()

    # Upload raw PDF to blob storage
    blob_client = blob_service.get_blob_client(container=blob_container, blob=file.filename)
    blob_client.upload_blob(contents, overwrite=True)

    # Extract text from PDF
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
    full_text = ""
    for page in pdf_reader.pages:
        full_text += page.extract_text() or ""

    if not full_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF")

    # Chunk and index in Azure AI Search
    chunks = chunk_text(full_text)
    documents = [
        {
            "id": hashlib.md5(f"{file.filename}_{i}".encode()).hexdigest(),
            "content": chunk,
            "document_title": file.filename,
            "section": f"chunk_{i}",
            "page_number": i,
        }
        for i, chunk in enumerate(chunks)
    ]
    search_client.upload_documents(documents)

    return {"filename": file.filename, "chunks_indexed": len(chunks)}


@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        # Retrieve relevant chunks from Azure AI Search
        results = search_client.search(search_text=request.message, top=3)
        context_chunks = [r["content"] for r in results]
        context = "\n\n".join(context_chunks)

        system_prompt = "You are OpsIQ, an expert assistant for oil and gas operations."
        if context:
            system_prompt += (
                "\n\nUse the following document excerpts to inform your answer. "
                "If the answer is in the documents, cite them. "
                "If not, answer from your general knowledge.\n\n"
                f"DOCUMENTS:\n{context}"
            )

        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message},
            ],
            max_tokens=1500,
            temperature=0.1
        )
        return {
            "answer": response.choices[0].message.content,
            "language": request.language,
            "sources": list({r["document_title"] for r in search_client.search(search_text=request.message, top=3)}),
        }
    except APIError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))
