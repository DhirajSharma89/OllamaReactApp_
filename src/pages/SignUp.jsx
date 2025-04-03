import React from "react";
import "./SignUp.css";

function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" required />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="redirect-text">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
