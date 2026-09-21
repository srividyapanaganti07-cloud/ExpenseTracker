import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">

        <div className="register-logo">₹</div>

        <h1>Create Account</h1>
        <p>Start managing your expenses today</p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          {/* Password field with Show/Hide button */}
          <div className="register-password-container">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="register-show-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

          <button type="submit">
            Create Account
          </button>

        </form>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}

        {message && (
          <p
            style={{
              color: "green",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}

        <div className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;
