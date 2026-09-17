
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      // Save logged-in user details
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      alert("Login successful!");

      // Replace Login page in browser history
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the backend server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-logo">₹</div>

        <h1>Welcome Back</h1>
        <p>Login to manage your expenses</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          {/* Password field with Show/Hide button */}
          <div className="password-container">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

          {/* Forgot Password */}
          <div className="forgot">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        {/* Register */}
        <div className="register-text">
          Don't have an account?
          <Link to="/register">
            {" "}Register
          </Link>
        </div>

        {/* Back to Home */}
        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;



