import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const defaultSettings = {
    notifications: true,
    emailAlerts: false,
    budgetAlerts: true,
    darkMode: false,
    compactView: false,
  };

  const [settings, setSettings] =
    useState(defaultSettings);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH SETTINGS FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchSettings = async () => {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        console.log(
          "No logged-in user found."
        );

        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/settings/user/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            data.message ||
              "Failed to fetch settings."
          );

          setLoading(false);
          return;
        }

        const savedSettings =
          data.settings;

        setSettings({
          notifications:
            savedSettings.notifications,
          emailAlerts:
            savedSettings.emailAlerts,
          budgetAlerts:
            savedSettings.budgetAlerts,
          darkMode:
            savedSettings.darkMode,
          compactView:
            savedSettings.compactView,
        });
      } catch (error) {
        console.error(
          "Settings fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================
  // APPLY DARK MODE / COMPACT VIEW
  // ==========================================
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add(
        "dark-mode"
      );
    } else {
      document.body.classList.remove(
        "dark-mode"
      );
    }
  }, [settings.darkMode]);

  // ==========================================
  // HANDLE SWITCHES
  // ==========================================
  const handleChange = (e) => {
    const { name, checked } = e.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: checked,
    }));
  };

  // ==========================================
  // SAVE SETTINGS TO MONGODB
  // ==========================================
  const handleSave = async () => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/settings/user/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save settings."
        );
        return;
      }

      setSettings({
        notifications:
          data.settings.notifications,
        emailAlerts:
          data.settings.emailAlerts,
        budgetAlerts:
          data.settings.budgetAlerts,
        darkMode:
          data.settings.darkMode,
        compactView:
          data.settings.compactView,
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RESET SETTINGS IN MONGODB
  // ==========================================
  const handleReset = async () => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/settings/user/${userId}/reset`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to reset settings."
        );
        return;
      }

      setSettings({
        notifications:
          data.settings.notifications,
        emailAlerts:
          data.settings.emailAlerts,
        budgetAlerts:
          data.settings.budgetAlerts,
        darkMode:
          data.settings.darkMode,
        compactView:
          data.settings.compactView,
      });

      document.body.classList.remove(
        "dark-mode"
      );

      alert("Settings reset successfully!");
    } catch (error) {
      console.error(
        "Settings reset error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="settings-page">
        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <h2>
            Loading Settings...
          </h2>

          <p>
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div
      className={`settings-page ${
        settings.compactView
          ? "compact-theme"
          : ""
      }`}
    >

      {/* HEADER */}
      <header className="settings-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your Expense Tracker
            preferences.
          </p>
        </div>

        <Link to="/dashboard">

          <button className="back-dashboard-btn">
            ← Dashboard
          </button>

        </Link>

      </header>

      {/* NOTIFICATIONS */}
      <section className="settings-section">

        <div className="settings-section-header">

          <h2>
            🔔 Notifications
          </h2>

          <p>
            Control how you receive
            notifications and alerts.
          </p>

        </div>

        <div className="settings-list">

          {/* Notifications */}
          <div className="setting-item">

            <div>
              <h3>
                Enable Notifications
              </h3>

              <p>
                Receive notifications
                about your account activity.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="notifications"
                checked={
                  settings.notifications
                }
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* Email Alerts */}
          <div className="setting-item">

            <div>
              <h3>
                Email Alerts
              </h3>

              <p>
                Receive important account
                updates by email.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="emailAlerts"
                checked={
                  settings.emailAlerts
                }
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* Budget Alerts */}
          <div className="setting-item">

            <div>
              <h3>
                Budget Alerts
              </h3>

              <p>
                Get alerts when your spending
                approaches your budget.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="budgetAlerts"
                checked={
                  settings.budgetAlerts
                }
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>

      </section>

      {/* APPEARANCE */}
      <section className="settings-section">

        <div className="settings-section-header">

          <h2>
            🎨 Appearance
          </h2>

          <p>
            Customize how the application
            looks.
          </p>

        </div>

        <div className="settings-list">

          {/* DARK MODE */}
          <div className="setting-item">

            <div>
              <h3>
                Dark Mode
              </h3>

              <p>
                Change the entire application
                to a dark appearance.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="darkMode"
                checked={
                  settings.darkMode
                }
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* COMPACT VIEW */}
          <div className="setting-item">

            <div>
              <h3>
                Compact View
              </h3>

              <p>
                Reduce spacing throughout
                the settings page.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="compactView"
                checked={
                  settings.compactView
                }
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>

      </section>

      {/* ACCOUNT */}
      <section className="settings-section">

        <div className="settings-section-header">

          <h2>
            👤 Account
          </h2>

          <p>
            Manage your account-related
            options.
          </p>

        </div>

        <div className="account-options">

          <Link
            to="/profile"
            className="account-option"
          >

            <div>
              <strong>
                My Profile
              </strong>

              <span>
                Update your personal
                information.
              </span>
            </div>

            <span className="arrow">
              →
            </span>

          </Link>

          <Link
            to="/security"
            className="account-option"
          >

            <div>
              <strong>
                Security
              </strong>

              <span>
                Manage your account
                security.
              </span>
            </div>

            <span className="arrow">
              →
            </span>

          </Link>

        </div>

      </section>

      {/* ACTION BUTTONS */}
      <div className="settings-actions">

        <button
          className="reset-settings-btn"
          onClick={handleReset}
        >
          Reset Settings
        </button>

        <button
          className="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>

      </div>

    </div>
  );
}

export default Settings;