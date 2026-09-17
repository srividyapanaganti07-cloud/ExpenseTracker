import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Security.css";

function Security() {
  // ==========================================
  // CHANGE PASSWORD STATES
  // ==========================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    // Check empty fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/change-password/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to change password."
        );

        return;
      }

      alert(
        "Password changed successfully!"
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="security-page">

      <Navbar />

      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="security-hero">

        <div className="security-hero-content">

          <span className="security-tag">
            🔒 SECURITY & PRIVACY
          </span>

          <h1>
            Your Data,
            <span> Your Privacy.</span>
          </h1>

          <p>
            Your financial information deserves
            to stay private. Expense Tracker is
            designed with security and privacy
            in mind.
          </p>

        </div>

        <div className="security-icon-large">
          🔐
        </div>

      </section>


      {/* ==========================================
          SECURITY FEATURES
      ========================================== */}

      <section className="security-features">

        <div className="security-heading">

          <span>
            YOUR SECURITY MATTERS
          </span>

          <h2>
            Built to keep your information protected
          </h2>

          <p>
            We focus on keeping your account and
            financial information safe while you
            manage your expenses.
          </p>

        </div>


        <div className="security-grid">

          {/* Card 1 */}

          <div className="security-card">

            <div className="security-card-icon">
              🛡️
            </div>

            <h3>
              Data Protection
            </h3>

            <p>
              Your expense information is treated
              as private data and should only be
              accessible through your account.
            </p>

          </div>


          {/* Card 2 */}

          <div className="security-card">

            <div className="security-card-icon">
              🔑
            </div>

            <h3>
              Secure Login
            </h3>

            <p>
              Your account uses login authentication
              to help prevent unauthorized access.
            </p>

          </div>


          {/* Card 3 */}

          <div className="security-card">

            <div className="security-card-icon">
              🔐
            </div>

            <h3>
              Password Protection
            </h3>

            <p>
              Your account password is securely
              protected using password hashing
              on the backend.
            </p>

          </div>


          {/* Card 4 */}

          <div className="security-card">

            <div className="security-card-icon">
              👤
            </div>

            <h3>
              Private Account
            </h3>

            <p>
              Your personal expense records are
              associated with your account so your
              information can remain private.
            </p>

          </div>


          {/* Card 5 */}

          <div className="security-card">

            <div className="security-card-icon">
              💾
            </div>

            <h3>
              Safe Transactions
            </h3>

            <p>
              Your income and expense records can
              be securely managed through your
              account.
            </p>

          </div>


          {/* Card 6 */}

          <div className="security-card">

            <div className="security-card-icon">
              🔒
            </div>

            <h3>
              Privacy First
            </h3>

            <p>
              We believe your financial information
              should remain private and under your
              control.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          CHANGE PASSWORD
      ========================================== */}

      <section className="change-password-section">

        <div className="change-password-heading">

          <span>
            ACCOUNT SECURITY
          </span>

          <h2>
            Change Your Password
          </h2>

          <p>
            Keep your account secure by using a
            strong password.
          </p>

        </div>


        <form
          className="change-password-form"
          onSubmit={handleChangePassword}
        >

          {/* Current Password */}

          <div className="password-field">

            <label>
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder="Enter current password"
            />

          </div>


          {/* New Password */}

          <div className="password-field">

            <label>
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
            />

          </div>


          {/* Confirm Password */}

          <div className="password-field">

            <label>
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
            />

          </div>


          {/* Change Password Button */}

          <button
            type="submit"
            className="change-password-btn"
            disabled={changingPassword}
          >
            {changingPassword
              ? "Changing Password..."
              : "🔐 Change Password"}
          </button>

        </form>

      </section>


      {/* ==========================================
          SECURITY STATUS
      ========================================== */}

      <section className="security-status">

        <div className="status-icon">
          ✓
        </div>

        <div>

          <span>
            SECURITY STATUS
          </span>

          <h2>
            Your information matters to us.
          </h2>

          <p>
            Keep your account credentials private
            and always log out when using a shared
            computer.
          </p>

        </div>

      </section>


      {/* ==========================================
          BACK SECTION
      ========================================== */}

      <section className="security-cta">

        <h2>
          Manage your expenses with confidence.
        </h2>

        <p>
          Keep your financial information organized
          and protected.
        </p>

        <button
          className="security-home-btn"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>

      </section>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="security-footer">

        <div className="security-footer-logo">
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

export default Security;