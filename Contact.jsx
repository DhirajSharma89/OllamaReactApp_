import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-wrapper">
      {/* Contact Box */}
      <div className="contact-container">
        <h1 className="contact-title">CONTACT</h1>
        <p className="contact-subtitle">We'd like to help!</p>
        <p className="contact-description">
          We like to create things with fun, open-minded people. Feel free to say hello!
        </p>

        <div className="contact-content">
          {/* Left Side - Contact Form */}
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Message" required></textarea>
            <button type="submit" className="contact-button">Send</button>
          </form>

          {/* Right Side - Contact Info */}
          <div className="contact-info">
            <p><strong>Local Ollama</strong></p>
            <p>Uttar Pradesh, India</p>
            <p>📞 6901163754</p>
            <p>📧 rhombahu@gmail.com</p>
            <div className="contact-socials">
              <a href="#">🌍</a>
              <a href="#">🔗</a>
              <a href="#">📷</a>
              <a href="#">🐦</a>
            </div>
          </div>
        </div>
      </div>

      {/* Curvy Hill Background */}
      <div className="hill-container">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2a2a2a" d="M0,256L48,240C96,224,192,192,288,170.7C384,149,480,139,576,165.3C672,192,768,256,864,282.7C960,309,1056,299,1152,277.3C1248,256,1344,224,1392,208L1440,192V320H0Z" />
        </svg>
      </div>
    </div>
  );
};

export default Contact;
