from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI, APIError
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# This allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Azure OpenAI
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2025-01-01-preview"
)

# This defines what the frontend sends us
class ChatRequest(BaseModel):
    message: str
    language: str = "en"

@app.get("/")
def health_check():
    return {"status": "OpsIQ backend is running"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
            messages=[
                {
                    "role": "system",
                    "content": "You are OpsIQ, an expert assistant for oil and gas operations."
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            max_tokens=500,
            temperature=0.1
        )
        return {
            "answer": response.choices[0].message.content,
            "language": request.language
        }
    except APIError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))
