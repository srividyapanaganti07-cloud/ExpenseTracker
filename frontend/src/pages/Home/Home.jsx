
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">

          <span className="hero-tag">
            SMART • SIMPLE • SECURE
          </span>

          <h1>
            Take Control of Your
            <span> Money.</span>
          </h1>

          <p>
            Track your expenses, manage your budget, and understand
            your spending habits — all in one simple place.
          </p>

          {/* HERO BUTTONS */}
          <div className="hero-buttons">

            <Link to="/register">
              <button className="primary-btn">
                Get Started →
              </button>
            </Link>

            <Link to="/dashboard">
              <button className="secondary-btn">
                View Dashboard
              </button>
            </Link>

            <Link to="/profile">
              <button className="secondary-btn">
                My Profile
              </button>
            </Link>

          </div>

          <div className="trust-text">
            ✓ Easy to use &nbsp;&nbsp;
            ✓ Secure &nbsp;&nbsp;
            ✓ Free
          </div>

        </div>

        {/* ================= DASHBOARD PREVIEW ================= */}
        <div className="dashboard-preview">

          <div className="preview-header">

            <div>
              <small>Total Balance</small>
              <h2>₹24,850</h2>
            </div>

            <div className="balance-icon">
              ₹
            </div>

          </div>

          <div className="preview-stats">

            <div className="mini-card">
              <small>Income</small>
              <strong>₹35,000</strong>
              <span>↗ This month</span>
            </div>

            <div className="mini-card">
              <small>Expenses</small>
              <strong>₹10,150</strong>
              <span>↘ This month</span>
            </div>

          </div>

          <div className="chart-box">

            <div className="chart-title">
              <span>Monthly Spending</span>
              <span>2026</span>
            </div>

            <div className="chart">

              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
              <div className="bar bar-4"></div>
              <div className="bar bar-5"></div>
              <div className="bar bar-6"></div>
              <div className="bar bar-7"></div>

            </div>

            <div className="months">

              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>

            </div>

          </div>

        </div>
      </section>


      {/* ================= FEATURES SECTION ================= */}
      <section className="features">

        <div className="section-heading">

          <span>
            FEATURES
          </span>

          <h2>
            Everything you need to manage your money
          </h2>

          <p>
            Simple tools designed to help you make better financial decisions.
          </p>

        </div>


        {/* ================= FOUR CLICKABLE FEATURES ================= */}
        <div className="feature-grid">

          {/* 1. TRACK EXPENSES */}
          <Link
            to="/add-expense"
            className="feature-link"
          >
            <div className="feature-card">

              <div className="feature-icon">
                💳
              </div>

              <h3>
                Track Expenses
              </h3>

              <p>
                Record and organize your daily expenses with ease.
              </p>

            </div>
          </Link>


          {/* 2. SET BUDGETS */}
          <Link
            to="/budget"
            className="feature-link"
          >
            <div className="feature-card">

              <div className="feature-icon">
                🎯
              </div>

              <h3>
                Set Budgets
              </h3>

              <p>
                Create monthly budgets and stay within your spending limits.
              </p>

            </div>
          </Link>


          {/* 3. VIEW REPORTS */}
          <Link
            to="/reports"
            className="feature-link"
          >
            <div className="feature-card">

              <div className="feature-icon">
                📊
              </div>

              <h3>
                View Reports
              </h3>

              <p>
                Understand your spending with clear charts and reports.
              </p>

            </div>
          </Link>


          {/* 4. SECURE DATA */}
          <Link
            to="/security"
            className="feature-link"
          >
            <div className="feature-card">

              <div className="feature-icon">
                🔒
              </div>

              <h3>
                Secure Data
              </h3>

              <p>
                Keep your financial information protected and private.
              </p>

            </div>
          </Link>

        </div>

      </section>


      {/* ================= CTA SECTION ================= */}
      <section className="cta">

        <div>

          <span>
            START TODAY
          </span>

          <h2>
            Make every rupee count.
          </h2>

          <p>
            Start tracking your expenses and build better financial habits.
          </p>

        </div>

        <Link to="/register">
          <button className="primary-btn">
            Get Started →
          </button>
        </Link>

      </section>


      {/* ================= FOOTER ================= */}
      <footer>

        <div className="footer-logo">
          Expense<span>Tracker</span>
        </div>

        <p>
          Manage your money. Achieve your goals.
        </p>

        <small>
          © 2026 Expense Tracker. All rights reserved.
        </small>

      </footer>

    </div>
  );
}

export default Home;

