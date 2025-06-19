import React, { useState, useEffect, useRef } from "react";
import "./MainContent.css";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

function MainContent() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const sidebarRef = useRef(null);
  const email = localStorage.getItem("userEmail");

  // Load saved prompts on component mount
  useEffect(() => {
    if (email) {
      const saved = localStorage.getItem(`prompts_${email}`);
      setSavedPrompts(saved ? JSON.parse(saved) : []);
    }
  }, [email]);

  // Fetch models
  useEffect(() => {
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

  // Dropdown logic
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Format bot response
  const formatBotResponse = (text) => {
    return text
      .replace(/\n/g, "<br/>")
      .replace(/• (.*)/g, "<li>$1</li>")
      .replace(/(?:<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`)
      .replace(/``````/g, '<pre>$1</pre>');
  };

  // Submit prompt and update prompt history
  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // Save prompt to history
    if (email) {
      const updatedPrompts = [...savedPrompts, prompt];
      setSavedPrompts(updatedPrompts);
      localStorage.setItem(`prompts_${email}`, JSON.stringify(updatedPrompts));
    }

    // Chat handling
    const userMessage = { text: prompt, sender: "user" };
    setChatHistory((prevChat) => [...prevChat, userMessage]);

    try {
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const botMessage = {
        text: formatBotResponse(data.response), // <-- FIXED: no this.
        sender: "bot"
      };
      setChatHistory((prevChat) => [...prevChat, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = {
        text: "<strong>Error:</strong> Unable to fetch response.",
        sender: "bot"
      };
      setChatHistory((prevChat) => [...prevChat, errorMessage]);
    }

    setPrompt("");
  };

  // Speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setPrompt(speechToText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  };

  return (
    <main className="main-content">
      <div className="settings-container">
        <FaCog className="settings-icon" onClick={toggleDropdown} />
      </div>

      <div ref={sidebarRef} className={`sidebar ${isDropdownOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/generate-image" className="nav-link">
              Generate Images
            </Link>
          </li>
          {email && (
            <div className="prompt-history">
              <h4>Your Prompt History</h4>
              <ul>
                {savedPrompts.map((savedPrompt, index) => (
                  <li key={index} className="saved-prompt">
                    {savedPrompt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ul>
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
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "bot-message"}
            dangerouslySetInnerHTML={msg.sender === "bot" ? { __html: msg.text } : undefined}
          >
            {msg.sender === "user" ? msg.text : null}
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
        <button className="mic-button" onClick={startListening}>
          {isListening ? "Listening..." : "🎤"}
        </button>
      </div>
    </main>
  );
}

export default MainContent;
