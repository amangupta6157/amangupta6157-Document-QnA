import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Upload.css";

function Upload({ onUpload }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData
      );
      onUpload(response.data.id, `File uploaded: ${response.data.filename}`);
      navigate("/chat"); // Redirect to /chat after successful upload
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        ref={fileInputRef}
        className="file-upload d-none"
        accept="application/pdf"
        onChange={handleFileUpload}
        id="fileUpload"
      />
      <button
        className="btn btn-outline-light"
        onClick={() => fileInputRef.current.click()}
      >
        Upload PDF
      </button>
    </div>
  );
}

export default Upload;
