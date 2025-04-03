import React from "react";
import "./SignIn.css";

function SignIn() {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <p className="redirect-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
