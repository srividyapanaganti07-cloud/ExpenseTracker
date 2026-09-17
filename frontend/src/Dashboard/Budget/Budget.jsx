import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Budget.css";

function Budget() {
  const [budget, setBudget] = useState(20000);
  const [budgetInput, setBudgetInput] = useState(20000);
  const [transactions, setTransactions] = useState([]);

  // ==========================================
  // LOAD BUDGET + TRANSACTIONS FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.log("No logged-in user found.");
        return;
      }

      try {
        // ------------------------------------------
        // GET BUDGET
        // ------------------------------------------
        const budgetResponse = await fetch(
          `http://localhost:5000/api/budget/user/${userId}`
        );

        const budgetData = await budgetResponse.json();

        if (budgetResponse.ok) {
          const savedBudget =
            Number(budgetData.monthlyBudget) || 20000;

          setBudget(savedBudget);
          setBudgetInput(savedBudget);
        } else {
          console.error(
            budgetData.message || "Failed to fetch budget."
          );
        }

        // ------------------------------------------
        // GET TRANSACTIONS
        // ------------------------------------------
        const transactionResponse = await fetch(
          `http://localhost:5000/api/expenses/user/${userId}`
        );

        const transactionData =
          await transactionResponse.json();

        if (transactionResponse.ok) {
          setTransactions(transactionData.expenses || []);
        } else {
          console.error(
            transactionData.message ||
              "Failed to fetch transactions."
          );
        }
      } catch (error) {
        console.error(
          "Budget page fetch error:",
          error
        );
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // CALCULATE TOTAL EXPENSES
  // ==========================================
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

  // ==========================================
  // CALCULATE REMAINING BUDGET
  // ==========================================
  const remaining = budget - totalExpenses;

  // ==========================================
  // CALCULATE PERCENTAGE USED
  // ==========================================
  const percentage =
    budget > 0
      ? Math.min(
          (totalExpenses / budget) * 100,
          100
        )
      : 0;

  // ==========================================
  // SAVE BUDGET TO MONGODB
  // ==========================================
  const handleSaveBudget = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    const newBudget = Number(budgetInput);

    if (!newBudget || newBudget <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/budget/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            monthlyBudget: newBudget,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save budget."
        );
        return;
      }

      // Update page immediately
      setBudget(newBudget);
      setBudgetInput(newBudget);

      alert("Monthly budget updated successfully!");
    } catch (error) {
      console.error(
        "Save budget error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    }
  };

  // ==========================================
  // FORMAT AMOUNT
  // ==========================================
  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="budget-page">

      {/* HEADER */}
      <header className="budget-header">

        <div>
          <h1>Monthly Budget</h1>

          <p>
            Set and manage your monthly spending limit.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>

      </header>

      {/* BUDGET SUMMARY */}
      <section className="budget-summary">

        <div className="budget-card">

          <span className="budget-icon">
            🎯
          </span>

          <p>Monthly Budget</p>

          <h2>
            {formatAmount(budget)}
          </h2>

        </div>

        <div className="budget-card">

          <span className="budget-icon">
            💸
          </span>

          <p>Total Spent</p>

          <h2>
            {formatAmount(totalExpenses)}
          </h2>

        </div>

        <div className="budget-card">

          <span className="budget-icon">
            💰
          </span>

          <p>
            {remaining >= 0
              ? "Remaining"
              : "Over Budget"}
          </p>

          <h2>
            {formatAmount(
              Math.abs(remaining)
            )}
          </h2>

        </div>

      </section>

      {/* BUDGET PROGRESS */}
      <section className="budget-container">

        <div className="budget-section-header">

          <div>
            <h2>Budget Progress</h2>

            <p>
              Track your spending against your budget.
            </p>
          </div>

          <strong>
            {Math.round(percentage)}%
          </strong>

        </div>

        <div className="progress-background">

          <div
            className={`progress-fill ${
              totalExpenses > budget
                ? "over-budget"
                : ""
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <div className="progress-details">

          <span>
            Spent:{" "}
            <strong>
              {formatAmount(totalExpenses)}
            </strong>
          </span>

          <span>
            Budget:{" "}
            <strong>
              {formatAmount(budget)}
            </strong>
          </span>

        </div>

        {/* STATUS */}
        {remaining >= 0 ? (

          <div className="budget-status success">

            ✅ You have{" "}
            <strong>
              {formatAmount(remaining)}
            </strong>{" "}
            remaining in your budget.

          </div>

        ) : (

          <div className="budget-status warning">

            ⚠️ You have exceeded your budget by{" "}
            <strong>
              {formatAmount(
                Math.abs(remaining)
              )}
            </strong>
            .

          </div>

        )}

      </section>

      {/* SET BUDGET */}
      <section className="budget-container">

        <div className="budget-section-header">

          <div>
            <h2>Set Monthly Budget</h2>

            <p>
              Choose the maximum amount you want
              to spend.
            </p>
          </div>

        </div>

        <form
          className="budget-form"
          onSubmit={handleSaveBudget}
        >

          <div className="budget-input-group">

            <label htmlFor="budget">
              Monthly Budget
            </label>

            <input
              id="budget"
              type="number"
              min="1"
              value={budgetInput}
              onChange={(e) =>
                setBudgetInput(
                  e.target.value
                )
              }
              placeholder="Enter budget amount"
              required
            />

          </div>

          <button
            type="submit"
            className="save-budget-btn"
          >
            Save Budget
          </button>

        </form>

      </section>

      {/* QUICK ACTIONS */}
      <section className="budget-actions">

        <Link
          to="/add-expense"
          className="budget-action-card"
        >
          ➕
          <span>
            Add Expense
          </span>
        </Link>

        <Link
          to="/transactions"
          className="budget-action-card"
        >
          💸
          <span>
            View Transactions
          </span>
        </Link>

        <Link
          to="/dashboard"
          className="budget-action-card"
        >
          📊
          <span>
            View Dashboard
          </span>
        </Link>

      </section>

    </div>
  );
}

export default Budget;