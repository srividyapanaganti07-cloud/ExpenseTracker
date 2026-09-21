import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../api";
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
        `${API_URL}/api/auth/login`,
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
        alert(data.message || "Login failed");
        return;
      }

      // Save user information
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      alert("Login successful!");

      // Go to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Login</h2>
        <p>Welcome back! Please login to continue.</p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

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
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* Register */}
        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;