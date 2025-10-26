import React, { useState } from "react";
import axios from "../api/axios";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/Auth/ForgotPassword", { email });
      if (response.status === 200) {
        setMessage("Password reset link sent to your email.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to send reset link. Check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      <p>Enter your email and we’ll send you a reset link.</p>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
