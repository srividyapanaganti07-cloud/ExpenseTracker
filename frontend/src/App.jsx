import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Main Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

// Dashboard Pages
import Dashboard from "./Dashboard/Dashboard/Dashboard";
import Transactions from "./Dashboard/Transactions/Transactions";
import Analytics from "./Dashboard/Analytics/Analytics";
import Budget from "./Dashboard/Budget/Budget";
import AddExpense from "./Dashboard/AddExpense/AddExpense";
import Profile from "./Dashboard/Profile/Profile";
import Settings from "./Dashboard/Settings/Settings";

// Other Pages
import Reports from "./pages/Reports/Reports";
import Security from "./pages/Security/Security";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  // Apply saved dark mode globally
  useEffect(() => {
  const applySavedSettings = async () => {
    const userId =
      localStorage.getItem("userId");

    // No logged-in user
    if (!userId) {
      document.body.classList.remove(
        "dark-mode"
      );

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
            "Failed to load settings"
        );

        return;
      }

      const savedSettings =
        data.settings;

      if (savedSettings.darkMode) {
        document.body.classList.add(
          "dark-mode"
        );
      } else {
        document.body.classList.remove(
          "dark-mode"
        );
      }

    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    }
  };

  applySavedSettings();
 }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            PUBLIC PAGES
        ===================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
         path="/forgot-password"
         element={<ForgotPassword />}
        />

        <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
       />
        {/* =====================================
            PROTECTED PAGES
        ===================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
