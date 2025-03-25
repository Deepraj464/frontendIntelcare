import React from "react";
import '../Styles/SignIn.css';

const SignIn = ({ show, onClose }) => {
  if (!show) return null; // If not visible, return nothing

  return (
    <div className="overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Social Media Section */}
        <div className="divider">
          <hr />
          <span style={{color:'#ffffff'}}>Sign-in with Social Media</span>
          <hr />
        </div>

        <div className="social-buttons">
          <button className="social-btn">G</button>
          <button className="social-btn">f</button>
          <button className="social-btn">X</button>
        </div>

        {/* Continue with email/password */}
        <div className="divider">
          <hr />
          <span style={{color:'#ffffff'}}>or continue with</span>
          <hr />
        </div>

        <form>
          <input type="email" placeholder="Email Address *" required />
          <input type="password" placeholder="Password *" required />
          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="register-text">Don't have an account yet?</p>
        <a href="#" className="register-link">Register Now</a>

        <a href="#" className="forgot-link">Forgot password?</a>
      </div>
    </div>
  );
};

export default SignIn;
