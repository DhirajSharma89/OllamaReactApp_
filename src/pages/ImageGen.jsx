import React, { useState } from "react";
import "./ImageGen.css";

const ImageGen = () => {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate-image/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageData(data.image_data); // base64 image
    } catch (err) {
      alert("Image generation failed");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="image-gen-container">
      <h2>Generate Image from Text</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {imageData && (
        <div className="generated-image">
          <img src={`data:image/png;base64,${imageData}`} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default ImageGen;
