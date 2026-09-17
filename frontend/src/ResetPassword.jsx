
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Password reset failed");
        return;
      }

      setMessage(data.message);

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Reset password error:", error);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Reset Password</h2>

        <p>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        {message && (
          <p style={{ color: "green" }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Link to="/login">
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ResetPassword;
