import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import "./Analytics.css";

function Analytics() {
  const [transactions, setTransactions] = useState([]);

  // Monthly budget from MongoDB
  const [budget, setBudget] = useState(20000);

  // ==========================================
  // LOAD TRANSACTIONS + BUDGET FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.log("No logged-in user found.");
        return;
      }

      try {
        // ==========================================
        // LOAD TRANSACTIONS
        // ==========================================
        const transactionResponse = await fetch(
          `${API_URL}/api/expenses/user/${userId}`
        );

        const transactionData =
          await transactionResponse.json();

        if (!transactionResponse.ok) {
          console.error(
            transactionData.message ||
              "Failed to fetch transactions."
          );
        } else {
          setTransactions(
            transactionData.expenses || []
          );
        }

        // ==========================================
        // LOAD MONTHLY BUDGET
        // ==========================================
        const budgetResponse = await fetch(
          `${API_URL}/api/budget/user/${userId}`
        );

        const budgetData =
          await budgetResponse.json();

        if (!budgetResponse.ok) {
          console.error(
            budgetData.message ||
              "Failed to fetch budget."
          );
        } else {
          setBudget(
            Number(budgetData.monthlyBudget) || 20000
          );
        }
      } catch (error) {
        console.error(
          "Analytics data fetch error:",
          error
        );
      }
    };

    fetchAnalyticsData();
  }, []);

  // ==========================================
  // TOTAL INCOME
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

  // ==========================================
  // TOTAL EXPENSES
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
  // BALANCE
  // ==========================================
  const balance =
    totalIncome - totalExpenses;

  // ==========================================
  // BUDGET USAGE PERCENTAGE
  // ==========================================
  const budgetPercentage =
    budget > 0
      ? Math.round(
          (totalExpenses / budget) * 100
        )
      : 0;

  // ==========================================
  // CATEGORY TOTALS
  // ==========================================
  const categoryTotals = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .forEach((transaction) => {
      const category =
        transaction.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(transaction.amount);
    });

  const categories = Object.entries(
    categoryTotals
  ).sort(
    (a, b) => b[1] - a[1]
  );

  // ==========================================
  // HIGHEST SPENDING CATEGORY
  // ==========================================
  const highestCategory =
    categories.length > 0
      ? categories[0][0]
      : "None";

  const highestCategoryAmount =
    categories.length > 0
      ? categories[0][1]
      : 0;

  // ==========================================
  // AVERAGE EXPENSE
  // ==========================================
  const expenseTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "Expense"
    );

  const averageExpense =
    expenseTransactions.length > 0
      ? totalExpenses /
        expenseTransactions.length
      : 0;

  // ==========================================
  // CURRENCY FORMAT
  // ==========================================
  const formatAmount = (amount) => {
    return `₹${Number(
      amount
    ).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // CATEGORY ICONS
  // ==========================================
  const categoryIcons = {
    Food: "🍔",
    Transport: "🚌",
    Shopping: "🛍️",
    Education: "📚",
    Health: "🏥",
    Entertainment: "🎬",
    Other: "📱",
  };

  return (
    <div className="analytics-page">

      {/* ==========================================
          HEADER
      ========================================== */}
      <header className="analytics-header">

        <div>
          <h1>Analytics</h1>

          <p>
            Understand your spending and financial habits.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="analytics-back-btn"
        >
          ← Dashboard
        </Link>

      </header>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}
      <section className="analytics-summary">

        {/* TOTAL INCOME */}
        <div className="analytics-card">

          <span className="analytics-icon">
            📈
          </span>

          <p>Total Income</p>

          <h2>
            {formatAmount(totalIncome)}
          </h2>

        </div>

        {/* TOTAL EXPENSES */}
        <div className="analytics-card">

          <span className="analytics-icon">
            📉
          </span>

          <p>Total Expenses</p>

          <h2>
            {formatAmount(totalExpenses)}
          </h2>

        </div>

        {/* BALANCE */}
        <div className="analytics-card">

          <span className="analytics-icon">
            💰
          </span>

          <p>Balance</p>

          <h2>
            {formatAmount(balance)}
          </h2>

        </div>

        {/* TOTAL TRANSACTIONS */}
        <div className="analytics-card">

          <span className="analytics-icon">
            🧾
          </span>

          <p>Total Transactions</p>

          <h2>
            {transactions.length}
          </h2>

        </div>

      </section>

      {/* ==========================================
          MAIN GRID
      ========================================== */}
      <section className="analytics-grid">

        {/* ==========================================
            INCOME VS EXPENSES
        ========================================== */}
        <div className="analytics-box">

          <div className="analytics-box-header">

            <div>

              <h2>
                Income vs Expenses
              </h2>

              <p>
                Overall financial comparison
              </p>

            </div>

          </div>

          <div className="comparison-chart">

            {/* INCOME */}
            <div className="comparison-item">

              <div className="comparison-label">

                <span>
                  Income
                </span>

                <strong>
                  {formatAmount(
                    totalIncome
                  )}
                </strong>

              </div>

              <div className="comparison-track">

                <div
                  className="comparison-fill income-fill"
                  style={{
                    width:
                      totalIncome > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

            {/* EXPENSES */}
            <div className="comparison-item">

              <div className="comparison-label">

                <span>
                  Expenses
                </span>

                <strong>
                  {formatAmount(
                    totalExpenses
                  )}
                </strong>

              </div>

              <div className="comparison-track">

                <div
                  className="comparison-fill expense-fill"
                  style={{
                    width:
                      totalIncome > 0
                        ? `${Math.min(
                            (totalExpenses /
                              totalIncome) *
                              100,
                            100
                          )}%`
                        : totalExpenses > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            BUDGET USAGE
        ========================================== */}
        <div className="analytics-box">

          <div className="analytics-box-header">

            <div>

              <h2>
                Budget Usage
              </h2>

              <p>
                Spending compared with your budget
              </p>

            </div>

            <strong>
              {budgetPercentage}%
            </strong>

          </div>

          <div className="budget-analytics-track">

            <div
              className={`budget-analytics-fill ${
                totalExpenses > budget
                  ? "budget-over"
                  : ""
              }`}
              style={{
                width: `${Math.min(
                  budgetPercentage,
                  100
                )}%`,
              }}
            />

          </div>

          <div className="budget-analytics-details">

            <span>
              Spent:{" "}
              <strong>
                {formatAmount(
                  totalExpenses
                )}
              </strong>
            </span>

            <span>
              Budget:{" "}
              <strong>
                {formatAmount(
                  budget
                )}
              </strong>
            </span>

          </div>

        </div>

      </section>

      {/* ==========================================
          CATEGORY ANALYSIS
      ========================================== */}
      <section className="analytics-box category-analysis">

        <div className="analytics-box-header">

          <div>

            <h2>
              Expense by Category
            </h2>

            <p>
              See where most of your money is going.
            </p>

          </div>

        </div>

        {categories.length > 0 ? (

          <div className="analytics-category-list">

            {categories.map(
              ([category, amount]) => {

                const percentage =
                  totalExpenses > 0
                    ? (amount /
                        totalExpenses) *
                      100
                    : 0;

                return (
                  <div
                    className="analytics-category"
                    key={category}
                  >

                    <div className="analytics-category-top">

                      <div className="analytics-category-name">

                        <span>
                          {categoryIcons[
                            category
                          ] || "📱"}
                        </span>

                        <strong>
                          {category}
                        </strong>

                      </div>

                      <strong>
                        {formatAmount(
                          amount
                        )}
                      </strong>

                    </div>

                    <div className="category-progress">

                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <small>
                      {percentage.toFixed(1)}%
                      {" "}
                      of total expenses
                    </small>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="analytics-empty">

            <h3>
              No expense data yet
            </h3>

            <p>
              Add some expenses to see your
              spending analysis.
            </p>

            <Link to="/add-expense">

              <button>
                + Add Expense
              </button>

            </Link>

          </div>

        )}

      </section>

      {/* ==========================================
          INSIGHTS
      ========================================== */}
      <section className="analytics-insights">

        {/* HIGHEST SPENDING */}
        <div className="insight-card">

          <span>
            🏆
          </span>

          <div>

            <p>
              Highest Spending
            </p>

            <h3>
              {highestCategory}
            </h3>

            <small>
              {formatAmount(
                highestCategoryAmount
              )}
            </small>

          </div>

        </div>

        {/* AVERAGE EXPENSE */}
        <div className="insight-card">

          <span>
            🧮
          </span>

          <div>

            <p>
              Average Expense
            </p>

            <h3>
              {formatAmount(
                Math.round(
                  averageExpense
                )
              )}
            </h3>

            <small>
              Per expense transaction
            </small>

          </div>

        </div>

        {/* AVAILABLE BALANCE */}
        <div className="insight-card">

          <span>
            💵
          </span>

          <div>

            <p>
              Available Balance
            </p>

            <h3>
              {formatAmount(balance)}
            </h3>

            <small>
              Income minus expenses
            </small>

          </div>

        </div>

      </section>

      {/* ==========================================
          ACTIONS
      ========================================== */}
      <section className="analytics-actions">

        <Link
          to="/add-expense"
          className="analytics-action"
        >
          ➕ Add Transaction
        </Link>

        <Link
          to="/transactions"
          className="analytics-action"
        >
          💸 View Transactions
        </Link>

        <Link
          to="/budget"
          className="analytics-action"
        >
          🎯 Manage Budget
        </Link>

      </section>

    </div>
  );
}

export default Analytics;