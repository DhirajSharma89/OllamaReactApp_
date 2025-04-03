import React, { useState, useEffect } from "react";
import "./MainContent.css";
import { FaCog } from "react-icons/fa";

function MainContent() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);

  useEffect(() => {
    // Fetch available models from FastAPI
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:8000/models/");
        if (!res.ok) throw new Error("Failed to fetch models");
        const data = await res.json();
        setModels(data.models);
        setSelectedModel(data.models[0] || "");
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    };
    fetchModels();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = async () => {
    if (!prompt) return;

    const userMessage = { text: prompt, sender: "user" };
    setChatHistory((prevChat) => [...prevChat, userMessage]);

    try {
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const botMessage = { text: data.response, sender: "bot" };
      setChatHistory((prevChat) => [...prevChat, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
      setChatHistory((prevChat) => [...prevChat, errorMessage]);
    }

    setPrompt("");
  };

  return (
    <main className="main-content">
      <div className="settings-container">
        <FaCog className="settings-icon" onClick={toggleDropdown} />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )}
      </div>

      <div className="model-selector-container">
        <select
          className="model-selector"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="hill-container">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            fill="black"
            d="M0,224L48,192C96,160,192,96,288,90.7C384,85,480,139,576,170.7C672,203,768,213,864,197.3C960,181,1056,139,1152,144C1248,149,1344,203,1392,229.3L1440,256V320H0Z"
          />
        </svg>
      </div>

      <h2 className="model-name">{selectedModel}</h2>

      <div className="chat-container">
        {chatHistory.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="prompt-box">
        <input
          type="text"
          placeholder="Enter prompt"
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="prompt-button" onClick={handleSubmit}>
          Enter
        </button>
      </div>
    </main>
  );
}

export default MainContent;
