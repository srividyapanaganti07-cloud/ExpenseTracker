import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">

        <div className="logo-icon">
          ₹
        </div>

        <div>

          <h2>
            Expense<span>Tracker</span>
          </h2>

          <p>
            Track. Budget. Grow.
          </p>

        </div>

      </Link>

      {/* Navigation Links */}
      <div className="nav-links">

        <Link
          to="/"
          className="home-btn"
        >
          ⌂ Home
        </Link>

        <Link to="/dashboard">
          📊 Dashboard
        </Link>

        <Link to="/transactions">
          💳 Transactions
        </Link>

        <Link to="/budget">
          💰 Budget
        </Link>

        <Link to="/reports">
          📈 Reports
        </Link>

        <Link to="/profile">
          ♙ Profile
        </Link>

      </div>

      {/* Authentication */}
      <div className="auth-buttons">

        <Link
          to="/register"
          className="register-btn"
        >
          ♙ Register
        </Link>

        <Link
          to="/login"
          className="login-btn"
        >
          🔒 Login
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;