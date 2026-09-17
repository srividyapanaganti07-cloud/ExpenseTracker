const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    emailAlerts: {
      type: Boolean,
      default: false,
    },

    budgetAlerts: {
      type: Boolean,
      default: true,
    },

    darkMode: {
      type: Boolean,
      default: false,
    },

    compactView: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);