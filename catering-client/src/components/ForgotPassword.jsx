import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";  // Import Firebase Auth
import axios from "axios";
const ForgotPassword = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isOpen, setIsOpen] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset previous messages
    setMessage("");
    setMessageType("");
  
    // Check if the email is empty
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return; // Prevent further execution if the email is empty
    }
  
    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return; // Prevent further execution if the email is invalid
    }
  
    // Proceed with email existence check in the database
    try {
      const response = await axios.post(`${BASE_URL}/users/check-email`, { email });
  
      if (response.data.exists) {
        // If email exists in the database, send the password reset email using Firebase
        const auth = getAuth(); // Get the Firebase Auth instance
        await sendPasswordResetEmail(auth, email);
        
        // If successful, show success message
        setMessage("Password reset email sent! Please check your inbox.");
        setMessageType("success");
      } else {
        // If email doesn't exist in the database, show an error message
        setMessage("Email does not exist.");
        setMessageType("error"); // This will display red text
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      setMessage("There was an error checking the email. Please try again.");
      setMessageType("error");
    }
  };

  const closeModalAndReset = () => {
    setEmail("");
    setMessage("");
    setMessageType("");
    setIsOpen(false);
    closeModal(); // Ensure parent modal close handler is also triggered
  };

  return (
    isOpen && (
      <dialog id="forgotPasswordModal" className="modal" open>
        <div className="modal-box">
          <form method="dialog" onSubmit={handleSubmit}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModalAndReset}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Reset Your Password</h3>
          <p className="py-4">Enter your email below to reset your password.</p>

          <div className="form-control mt-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && (
            <p
              className={`text-xs mt-2 ${messageType === "success" ? "text-green-500" : "text-red"}`}
            >
              {message}
            </p>
          )}

          <div className="form-control mt-4">
            <button onClick={handleSubmit} className="btn bg-prime text-white">
              Send Reset Link
            </button>
          </div>
        </div>
      </dialog>
    )
  );
};

export default ForgotPassword;
