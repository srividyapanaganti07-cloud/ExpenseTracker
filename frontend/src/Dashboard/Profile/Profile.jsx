
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Expense Tracker User",
    email: "user@example.com",
    phone: "",
    bio: "I manage my expenses and keep track of my financial goals.",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);

  // ==========================================
  // FETCH PROFILE FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.log("No logged-in user found.");
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/profile/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            data.message || "Failed to fetch profile."
          );

          setLoadingProfile(false);
          return;
        }

        setProfile({
          name: data.user.name || "Expense Tracker User",
          email: data.user.email || "user@example.com",
          phone: data.user.phone || "",
          bio:
            data.user.bio ||
            "I manage my expenses and keep track of my financial goals.",
        });

        // Keep localStorage synchronized
        localStorage.setItem(
          "userName",
          data.user.name
        );

        localStorage.setItem(
          "userEmail",
          data.user.email
        );
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // FETCH TRANSACTIONS FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.log("No logged-in user found.");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/expenses/user/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            data.message ||
              "Failed to fetch transactions."
          );
          return;
        }

        setTransactions(data.expenses || []);
      } catch (error) {
        console.error(
          "Profile transaction fetch error:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SAVE PROFILE TO MONGODB
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            bio: profile.bio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update profile."
        );
        return;
      }

      // Update profile with MongoDB response
      setProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        bio: data.user.bio || "",
      });

      // Keep login information synchronized
      localStorage.setItem(
        "userName",
        data.user.name
      );

      localStorage.setItem(
        "userEmail",
        data.user.email
      );

      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    }
  };

  // ==========================================
  // TRANSACTION STATISTICS
  // ==========================================
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "Income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const balance = totalIncome - totalExpenses;

  // ==========================================
  // LOADING
  // ==========================================
  if (loadingProfile) {
    return (
      <div className="profile-page">
        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <h2>Loading Profile...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="profile-page">

      {/* Header */}
      <header className="profile-header">

        <div>
          <h1>My Profile</h1>

          <p>
            Manage your personal information
            and account.
          </p>
        </div>

        <Link to="/dashboard">
          <button className="back-dashboard-btn">
            ← Dashboard
          </button>
        </Link>

      </header>

      {/* Profile Layout */}
      <div className="profile-layout">

        {/* Profile Card */}
        <section className="profile-card">

          <div className="profile-avatar">
            {profile.name
              ? profile.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <h2>{profile.name}</h2>

          <p className="profile-email">
            {profile.email}
          </p>

          <div className="profile-divider"></div>

          <div className="profile-info">

            <div>
              <span>Phone</span>

              <strong>
                {profile.phone ||
                  "Not added"}
              </strong>
            </div>

            <div>
              <span>Account</span>

              <strong>
                Personal
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong className="active-status">
                Active
              </strong>
            </div>

          </div>

        </section>

        {/* Profile Details */}
        <section className="profile-details">

          <div className="details-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Update your profile
                information below.
              </p>
            </div>

            {!isEditing && (
              <button
                className="edit-profile-btn"
                onClick={() =>
                  setIsEditing(true)
                }
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>

          {/* EDIT MODE */}
          {isEditing ? (

            <form
              className="profile-form"
              onSubmit={handleSave}
            >

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

              <div className="form-group">

                <label>
                  About Me
                </label>

                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us something about yourself"
                />

              </div>

              <div className="profile-buttons">

                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={() =>
                    setIsEditing(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          ) : (

            /* VIEW MODE */
            <div className="profile-view">

              <div className="view-item">

                <span>
                  Full Name
                </span>

                <strong>
                  {profile.name}
                </strong>

              </div>

              <div className="view-item">

                <span>
                  Email Address
                </span>

                <strong>
                  {profile.email}
                </strong>

              </div>

              <div className="view-item">

                <span>
                  Phone Number
                </span>

                <strong>
                  {profile.phone ||
                    "Not added"}
                </strong>

              </div>

              <div className="view-item">

                <span>
                  About Me
                </span>

                <p>
                  {profile.bio}
                </p>

              </div>

            </div>

          )}

        </section>

      </div>

      {/* Account Statistics */}
      <section className="profile-statistics">

        <div className="statistics-header">

          <h2>
            Account Overview
          </h2>

          <p>
            Your current expense
            tracker activity.
          </p>

        </div>

        <div className="statistics-grid">

          <div className="stat-card">

            <span>
              Total Transactions
            </span>

            <strong>
              {transactions.length}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Total Income
            </span>

            <strong className="income-value">
              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Total Expenses
            </span>

            <strong className="expense-value">
              ₹
              {totalExpenses.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Current Balance
            </span>

            <strong className="balance-value">
              ₹
              {balance.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Profile;
