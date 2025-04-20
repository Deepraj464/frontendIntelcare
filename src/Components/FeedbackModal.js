import React, { useState } from "react";
import "../Styles/FeedbackModal.css"; // Import the CSS file

const FeedbackModal = () => {
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback before submitting.");
      return;
    }
    alert(`Feedback submitted: ${feedback}`);
    setIsOpen(false);
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <div className="modal-title">Session feedback</div>
        <p className="modal-subtitle">Please Submit Your Feedback</p>
        <textarea
          className="feedback-input"
          placeholder="My feedback!!"
          value={feedback}
          required
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
