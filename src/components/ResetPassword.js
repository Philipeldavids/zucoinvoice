import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import styles from "./ResetPassword.module.css";
import {useNavigate} from 'react-router-dom'

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newpassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Load email & token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
    setToken(params.get("token") || "");
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newpassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("api/Auth/ResetPassword", {
        email,
        token,
        newpassword
      });

      if (response.status === 200) {
        setMessage("Password reset successful. You can now log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reset password. Link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Reset Password</h2>

      {!email || !token ? (
        <p className={styles.error}>
          Invalid reset link. Please check your email again.
        </p>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New password"
            value={newpassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default ResetPassword;
