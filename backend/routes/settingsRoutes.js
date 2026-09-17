const express = require("express");
const Settings = require("../models/settings");

const router = express.Router();

console.log("=== SETTINGS ROUTES LOADED ===");

// ==========================================
// GET USER SETTINGS
// ==========================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("GET SETTINGS REQUEST:", userId);

    let settings = await Settings.findOne({ userId });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        userId,
        notifications: true,
        emailAlerts: false,
        budgetAlerts: true,
        darkMode: false,
        compactView: false,
      });
    }

    res.status(200).json({
      message: "Settings fetched successfully",
      settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// SAVE / UPDATE USER SETTINGS
// ==========================================
router.put("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      notifications,
      emailAlerts,
      budgetAlerts,
      darkMode,
      compactView,
    } = req.body;

    console.log("UPDATE SETTINGS REQUEST:", userId);
    console.log("SETTINGS:", req.body);

    const updatedSettings =
      await Settings.findOneAndUpdate(
        { userId },
        {
          userId,
          notifications: Boolean(notifications),
          emailAlerts: Boolean(emailAlerts),
          budgetAlerts: Boolean(budgetAlerts),
          darkMode: Boolean(darkMode),
          compactView: Boolean(compactView),
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Settings saved successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// RESET USER SETTINGS
// ==========================================
router.put("/user/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("RESET SETTINGS REQUEST:", userId);

    const defaultSettings = {
      userId,
      notifications: true,
      emailAlerts: false,
      budgetAlerts: true,
      darkMode: false,
      compactView: false,
    };

    const resetSettings =
      await Settings.findOneAndUpdate(
        { userId },
        defaultSettings,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Settings reset successfully",
      settings: resetSettings,
    });
  } catch (error) {
    console.error("RESET SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;