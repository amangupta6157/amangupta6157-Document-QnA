import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import Chat from "./components/Chat.js";
import Upload from "./components/Upload.js";
import "./App.css";

function App() {
  const [documentId, setDocumentId] = useState(null);

  const handleUpload = (id, message) => {
    setDocumentId(id);
    alert(message);
  };

  return (
    <div className="app">
      <nav className="navbar navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <img
            src="https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg"
            srcSet="https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg?scale-down-to=512 512w, https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg?scale-down-to=1024 1024w, https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg 1280w"
            sizes="(max-width: 512px) 512px, (max-width: 1024px) 1024px, 1280px"
            alt="Logo"
            className="logo"
          />
        </Link>
        <Upload onUpload={handleUpload} />
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="welcome-message">
              <h2>Welcome! Upload a PDF to start chatting.</h2>
            </div>
          }
        />
        <Route
          path="/chat"
          element={
            documentId ? (
              <Chat documentId={documentId} />
            ) : (
              <h2 className="text-center">Please upload a document first.</h2>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
