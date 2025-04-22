import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../Styles/FeedbackModal.css";

const FeedbackModal = (props) => {
  console.log(props);
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setErrorMessage("Please enter your feedback before submitting.");
      return;
    }

    setErrorMessage(""); // Clear the error message if feedback is provided
    setIsFeedbackLoading(true);

    // Create the data object for EmailJS
    const templateParams = {
      message: feedback,
      email_id: props.userEmail,
    };

    emailjs
      .send(
        "service_6otxz7o",         // your EmailJS service ID
        "template_axg34kt",        // your EmailJS template ID
        templateParams,
        "hp6wyNEGYtFRXcOSs"        // your public key
      )
      .then(
        (result) => {
          setIsFeedbackLoading(false);
          // alert("Feedback sent successfully!");
          setFeedback("");
          setIsOpen(false);
        },
        (error) => {
          setIsFeedbackLoading(false);
          alert("Failed to send feedback. Error: " + JSON.stringify(error));
        }
      );
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {isFeedbackLoading ? (
          <div className="feedbackloader"></div>
        ) : (
          <button className="submit-button" onClick={handleSubmit}>
            Submit feedback
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
