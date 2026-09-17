const express = require("express");
const Expense = require("../models/expense");

const router = express.Router();

// ==========================================
// Add a new transaction
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const {
      userId,
      amount,
      category,
      date,
      payment,
      description,
      type,
    } = req.body;
     console.log("TYPE RECEIVED FROM FRONTEND:", type);
    // Check required fields
    if (!userId || !amount || !category || !date || !payment) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Create new transaction
    const newExpense = new Expense({
      userId,
      amount,
      category,
      date,
      payment,
      description,
      type: type || "Expense",
    });

    await newExpense.save();

    res.status(201).json({
      message: "Transaction added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Add expense error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// Get all transactions for a user
// ==========================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const expenses = await Expense.find({ userId }).sort({
      date: -1,
    });

    res.status(200).json({
      message: "Expenses fetched successfully",
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// Update a transaction
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      category,
      date,
      payment,
      description,
      type,
    } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        amount,
        category,
        date,
        payment,
        description,
        type,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// Delete a transaction
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;