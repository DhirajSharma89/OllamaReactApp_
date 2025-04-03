from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API URL
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"

# Request model
class ChatRequest(BaseModel):
    prompt: str
    model: str

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}

@app.get("/models/")
def get_models():
    try:
        response = requests.get(OLLAMA_TAGS_URL)
        response.raise_for_status()
        data = response.json()

        # Print response for debugging
        print("Ollama API response:", data)

        # Extract models properly
        models = [model["model"] for model in data.get("models", [])]
        print("Extracted models:", models)  # Debugging output

        return {"models": models}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")


@app.post("/chat/")
def chat(request: ChatRequest):
    available_models = get_models()["models"]

    if request.model not in available_models:
        raise HTTPException(status_code=400, detail="Model not found")

    ollama_payload = {
        "model": request.model,
        "prompt": request.prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=ollama_payload)
        response.raise_for_status()
        data = response.json()

        return {"response": data.get("response", "Ollama did not return a response.")}

    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=500, detail="Failed to connect to Ollama. Is it running?")
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama API Error: {str(e)}")
 