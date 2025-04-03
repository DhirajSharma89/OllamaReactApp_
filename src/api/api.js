const API_BASE_URL = "http://localhost:8000"; // FastAPI Backend URL
const OLLAMA_BASE_URL = "http://127.0.0.1:11434"; // Ollama API URL

// Fetch available models from FastAPI
export const fetchModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models/`);
    if (!response.ok) throw new Error(`Failed to fetch models: ${response.status}`);
    
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

// Send a prompt to FastAPI backend
export const sendPrompt = async (prompt, model) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Response failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error sending prompt:", error);
    return "Error: Unable to fetch response.";
  }
};

// Send a prompt directly to Ollama
export const sendOllamaPrompt = async (prompt, model = "deepseek-coder") => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }), // stream: false for single response
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.response; // Ollama's response
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    return "Error: Unable to fetch response from Ollama.";
  }
};
