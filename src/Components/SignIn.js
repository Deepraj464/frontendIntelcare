import React, { useState } from "react";
import { auth, googleProvider,facebookProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "../firebase";
import "../Styles/SignIn.css";

const SignIn = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);


  if (!show) return null;

  // Handle Sign In or Sign Up
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show loader

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      }
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      onClose(); // Close popup after login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Sign-In successful!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, facebookProvider);
      alert("Facebook Sign-In successful!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        {/* <button className="close-btn" onClick={onClose}>×</button> */}

        <div className="divider">
          <hr />
          <span style={{ color: "#ffffff" }}>Sign-in with Social Media</span>
          <hr />
        </div>

        <div className="social-buttons">
          <button className="social-btn" onClick={handleGoogleSignIn} disabled={loading}>G</button>
          <button className="social-btn" onClick={handleFacebookSignIn} disabled={loading}>f</button>
          <button className="social-btn" disabled={loading}>X</button>
        </div>

        <div className="divider">
          <hr />
          <span style={{ color: "#ffffff" }}>or continue with</span>
          <hr />
        </div>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loading ? (
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div className="loader"></div>
            </div>
          ) : (
            <button type="submit" className="signin-btn" disabled={loading}>
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          )}

        </form>

        {error && <p className="error-message">User Does Not Exist ! Create Account</p>}

        <p className="register-text">{isSignUp ? "Already have an account?" : "Don't have an account yet?"}</p>
        <a href="#" className="register-link" onClick={(e) => {
          e.preventDefault(); // Prevent URL change
          setIsSignUp(!isSignUp);
        }}>
          {isSignUp ? "Sign In" : "Create Account"}
        </a>

        <a href="#" className="forgot-link">Forgot password?</a>
      </div>
    </div>
  );
};

export default SignIn;
