
const express = require("express");
const Budget = require("../models/budget");

const router = express.Router();

console.log("=== BUDGET ROUTES LOADED ===");

// ==========================================
// SAVE / UPDATE MONTHLY BUDGET
// ==========================================
router.post("/save", async (req, res) => {
  try {
    const { userId, monthlyBudget } = req.body;

    console.log("=== SAVE BUDGET REQUEST ===");
    console.log("USER ID:", userId);
    console.log("MONTHLY BUDGET:", monthlyBudget);

    if (!userId || !monthlyBudget) {
      return res.status(400).json({
        message: "User ID and budget amount are required",
      });
    }

    if (Number(monthlyBudget) <= 0) {
      return res.status(400).json({
        message: "Budget must be greater than 0",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId },
      {
        userId,
        monthlyBudget: Number(monthlyBudget),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error("SAVE BUDGET ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// GET USER'S MONTHLY BUDGET
// ==========================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("=== GET BUDGET REQUEST ===");
    console.log("USER ID:", userId);

    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(200).json({
        monthlyBudget: 20000,
        message: "No budget found. Using default budget.",
      });
    }

    res.status(200).json({
      monthlyBudget: budget.monthlyBudget,
      budget,
    });
  } catch (error) {
    console.error("GET BUDGET ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;

