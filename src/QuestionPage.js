import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAskQuestion = async () => {
    try {
      const response = await axios.post("http://localhost:8000/ask/", {
        document_id: id,
        question: question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  return (
    <div>
      <h1>Ask a Question</h1>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question about the PDF"
      />
      <button onClick={handleAskQuestion}>Ask</button>
      {answer && (
        <div>
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
