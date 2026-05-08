import os
import hashlib
from azure.storage.blob import BlobServiceClient
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex, SimpleField, SearchableField, SearchFieldDataType
)
from azure.core.credentials import AzureKeyCredential
from PyPDF2 import PdfReader
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

def recreate_search_index(index_client, index_name):
    try:
        index_client.delete_index(index_name)
        print(f"Deleted existing index '{index_name}'")
    except Exception:
        pass
    index = SearchIndex(
        name=index_name,
        fields=[
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SearchableField(name="content", type=SearchFieldDataType.String),
            SimpleField(name="document_title", type=SearchFieldDataType.String, filterable=True),
            SimpleField(name="section", type=SearchFieldDataType.String),
            SimpleField(name="page_number", type=SearchFieldDataType.Int32),
        ]
    )
    index_client.create_index(index)
    print(f"Created index '{index_name}' with new schema")

def index_blob_documents():
    # Connect to Blob Storage
    blob_service = BlobServiceClient.from_connection_string(
        os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    )
    container = blob_service.get_container_client(
        os.getenv("AZURE_STORAGE_CONTAINER")
    )

    # Connect to AI Search
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX")
    credential = AzureKeyCredential(search_key)

    index_client = SearchIndexClient(endpoint=search_endpoint, credential=credential)
    recreate_search_index(index_client, search_index)

    search_client = SearchClient(
        endpoint=search_endpoint,
        index_name=search_index,
        credential=credential
    )

    # Loop through all blobs
    blobs = list(container.list_blobs())
    print(f"Found {len(blobs)} documents in Blob Storage")

    for blob in blobs:
        print(f"\nProcessing: {blob.name}")

        # Download PDF
        blob_client = container.get_blob_client(blob.name)
        pdf_bytes = blob_client.download_blob().readall()

        # Extract text
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
        full_text = ""
        for page in pdf_reader.pages:
            full_text += page.extract_text() or ""

        print(f"  Extracted {len(full_text)} characters")

        # Chunk the text
        chunks = []
        chunk_size = 1000
        overlap = 100
        start = 0
        while start < len(full_text):
            end = min(start + chunk_size, len(full_text))
            chunk = full_text[start:end]
            if len(chunk.strip()) > 50:
                chunks.append(chunk)
            start += chunk_size - overlap

        print(f"  Created {len(chunks)} chunks")

        # Index chunks
        documents = []
        for i, chunk in enumerate(chunks):
            doc_id = hashlib.md5(
                f"{blob.name}_{i}".encode()
            ).hexdigest()
            documents.append({
                "id": doc_id,
                "content": chunk,
                "document_title": blob.name,
                "section": f"chunk_{i}",
                "page_number": i
            })

        # Upload to AI Search in batches
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i+batch_size]
            search_client.upload_documents(documents=batch)

        print(f"  Indexed {len(documents)} chunks")

    print(f"\nAll documents indexed successfully!")

if __name__ == "__main__":
    index_blob_documents()
