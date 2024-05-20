import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

function Chat({ documentId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const addMessage = (text, isFromUser = true) => {
    const newMessage = { text, isFromUser };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    addMessage(message); // Add user message to the chat
    setMessage("");

    axios
      .post("http://127.0.0.1:8000/ask/", {
        document_id: documentId,
        question: message,
      })
      .then((response) => {
        addMessage(response.data.answer, false); // Add response message to the chat
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <main className="main-content">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{
              textAlign: msg.isFromUser ? "right" : "left",
              backgroundColor: msg.isFromUser ? "#e0ffff" : "#fff",
            }}
          >
            {msg.text}
          </div>
        ))}
      </main>
      <footer className="footer bg-dark p-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="input-group-append">
            <button onClick={sendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Chat;
