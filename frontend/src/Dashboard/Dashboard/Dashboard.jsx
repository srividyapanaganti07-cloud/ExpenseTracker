
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(20000);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");

    // Go to Home and prevent returning to Dashboard
    navigate("/", { replace: true });
  };

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================
  useEffect(() => {
    // ------------------------------------------
    // HANDLE BROWSER BACK BUTTON
    // Dashboard → Back → Home
    // ------------------------------------------
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    // ------------------------------------------
    // GET LOGGED-IN USER
    // ------------------------------------------
    const storedUserId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");

    // If no user is logged in, go to Login
    if (!storedUserId) {
      navigate("/login", { replace: true });

      return () => {
        window.removeEventListener(
          "popstate",
          handleBack
        );
      };
    }

    // Set user details
    if (storedName) {
      setUserName(storedName);
    }

    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    // ------------------------------------------
    // FETCH TRANSACTIONS AND BUDGET
    // ------------------------------------------
    const fetchDashboardData = async () => {
      try {
        // ========================================
        // LOAD TRANSACTIONS
        // ========================================
        const transactionResponse = await fetch(
          `${API_URL}/api/expenses/user/${storedUserId}`
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

        // ========================================
        // LOAD MONTHLY BUDGET
        // ========================================
        const budgetResponse = await fetch(
          `${API_URL}/api/budget/user/${storedUserId}`
        );

        const budgetData =
          await budgetResponse.json();

        if (!budgetResponse.ok) {
          console.error(
            budgetData.message ||
              "Failed to fetch budget."
          );
        } else {
          setMonthlyBudget(
            Number(budgetData.monthlyBudget) || 20000
          );
        }
      } catch (error) {
        console.error(
          "Dashboard data fetch error:",
          error
        );
      }
    };

    fetchDashboardData();

    // ------------------------------------------
    // CLEANUP
    // ------------------------------------------
    return () => {
      window.removeEventListener(
        "popstate",
        handleBack
      );
    };
  }, [navigate]);

  // ==========================================
  // CALCULATE TOTAL INCOME
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
  // CALCULATE BALANCE
  // ==========================================
  const totalBalance =
    totalIncome - totalExpenses;

  // ==========================================
  // CALCULATE REMAINING BUDGET
  // ==========================================
  const remainingBudget =
    monthlyBudget - totalExpenses;

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================
  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================
  // EXPENSE CATEGORY TOTALS
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

  // Get top 5 expense categories
  const categories = Object.entries(
    categoryTotals
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // ==========================================
  // RECENT TRANSACTIONS
  // ==========================================
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  // ==========================================
  // CHART CALCULATIONS
  // ==========================================
  const maxChartValue = Math.max(
    totalIncome,
    totalExpenses,
    1
  );

  const incomeBarHeight =
    (totalIncome / maxChartValue) * 180;

  const expenseBarHeight =
    (totalExpenses / maxChartValue) * 180;

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="dashboard">

      {/* ======================================
          SIDEBAR
      ====================================== */}
      <aside className="sidebar">

        <div className="sidebar-top">

          <h2 className="logo">
            Expense<span>Tracker</span>
          </h2>

          <nav className="sidebar-nav">

            <Link
              to="/dashboard"
              className="nav-item active"
              title="Go to Dashboard"
            >
              <span>🏠</span>
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="nav-item"
              title="View Transactions"
            >
              <span>💸</span>
              Transactions
            </Link>

            <Link
              to="/analytics"
              className="nav-item"
              title="View Analytics"
            >
              <span>📊</span>
              Analytics
            </Link>

            <Link
              to="/budget"
              className="nav-item"
              title="Manage Budget"
            >
              <span>💰</span>
              Budget
            </Link>

            <Link
              to="/add-expense"
              className="nav-item"
              title="Add a new transaction"
            >
              <span>➕</span>
              Add Expense
            </Link>

            <Link
              to="/settings"
              className="nav-item"
              title="Open Settings"
            >
              <span>⚙️</span>
              Settings
            </Link>

          </nav>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="logout-btn"
          title="Logout from your account"
        >
          🚪 Logout
        </button>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <main className="main-content">

        {/* ====================================
            TOP BAR
        ==================================== */}
        <header className="topbar">

          <div className="welcome">

            <h1>
              Good Morning, {userName}! 👋
            </h1>

            <p>
              Here's your financial overview.
            </p>

          </div>

          <Link
            to="/profile"
            className="profile"
            title="Open your profile"
          >
            <div className="profile-icon">
              👤
            </div>

            <div className="profile-info">
              <strong>{userName}</strong>

              <small>
                {userEmail ||
                  "Personal Account"}
              </small>
            </div>
          </Link>

        </header>

        {/* ====================================
            SUMMARY CARDS
        ==================================== */}
        <section className="summary-cards">

          {/* BALANCE */}
          <div className="summary-card">

            <div className="card-top">
              <span className="card-icon">
                💰
              </span>
            </div>

            <p>Total Balance</p>

            <h2>
              {formatAmount(totalBalance)}
            </h2>

            <small>
              Income - Expenses
            </small>

          </div>

          {/* INCOME */}
          <div className="summary-card">

            <div className="card-top">
              <span className="card-icon">
                📈
              </span>
            </div>

            <p>Total Income</p>

            <h2>
              {formatAmount(totalIncome)}
            </h2>

            <small>
              All income
            </small>

          </div>

          {/* EXPENSES */}
          <div className="summary-card">

            <div className="card-top">
              <span className="card-icon">
                📉
              </span>
            </div>

            <p>Total Expenses</p>

            <h2>
              {formatAmount(totalExpenses)}
            </h2>

            <small>
              All expenses
            </small>

          </div>

          {/* BUDGET */}
          <div className="summary-card">

            <div className="card-top">
              <span className="card-icon">
                🎯
              </span>
            </div>

            <p>Monthly Budget</p>

            <h2>
              {formatAmount(monthlyBudget)}
            </h2>

            <small>
              {remainingBudget >= 0
                ? `${formatAmount(
                    remainingBudget
                  )} remaining`
                : `${formatAmount(
                    Math.abs(
                      remainingBudget
                    )
                  )} over budget`}
            </small>

          </div>

        </section>

        {/* ====================================
            CHARTS
        ==================================== */}
        <section className="dashboard-grid">

          {/* INCOME VS EXPENSES */}
          <div className="dashboard-box">

            <div className="box-header">

              <div>

                <h2>
                  Income vs Expenses
                </h2>

                <p>
                  Overall comparison
                </p>

              </div>

              <span>
                All Transactions
              </span>

            </div>

            <div className="chart-area">

              {/* INCOME BAR */}
              <div className="chart-column">

                <div
                  className="chart-bar income-bar"
                  style={{
                    height: `${Math.max(
                      incomeBarHeight,
                      10
                    )}px`,
                  }}
                >
                  <span>
                    {formatAmount(
                      totalIncome
                    )}
                  </span>
                </div>

                <small>
                  Income
                </small>

              </div>

              {/* EXPENSE BAR */}
              <div className="chart-column">

                <div
                  className="chart-bar expense-bar"
                  style={{
                    height: `${Math.max(
                      expenseBarHeight,
                      10
                    )}px`,
                  }}
                >
                  <span>
                    {formatAmount(
                      totalExpenses
                    )}
                  </span>
                </div>

                <small>
                  Expenses
                </small>

              </div>

            </div>

          </div>

          {/* EXPENSE CATEGORIES */}
          <div className="dashboard-box">

            <div className="box-header">

              <div>

                <h2>
                  Expense Categories
                </h2>

                <p>
                  Where your money goes
                </p>

              </div>

              <span>
                All Expenses
              </span>

            </div>

            <div className="category-list">

              {categories.length > 0 ? (
                categories.map(
                  ([category, amount]) => (
                    <div
                      className="category-item"
                      key={category}
                    >

                      <div className="category-name">

                        <span>
                          {categoryIcons[
                            category
                          ] || "📱"}
                        </span>

                        <span>
                          {category}
                        </span>

                      </div>

                      <strong>
                        {formatAmount(amount)}
                      </strong>

                    </div>
                  )
                )
              ) : (
                <div className="no-transactions">

                  <h3>
                    No expenses yet
                  </h3>

                  <p>
                    Add an expense to see
                    your categories.
                  </p>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ====================================
            RECENT TRANSACTIONS
        ==================================== */}
        <section className="dashboard-box transactions-box">

          <div className="box-header">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <p>
                Your latest financial activities
              </p>

            </div>

            <Link
              to="/add-expense"
              title="Add a new transaction"
            >
              <button
                type="button"
                className="add-btn"
              >
                + Add Transaction
              </button>
            </Link>

          </div>

          {recentTransactions.length > 0 ? (

            recentTransactions.map(
              (transaction) => (

                <div
                  className="transaction"
                  key={transaction._id}
                >

                  <div className="transaction-info">

                    <span className="transaction-icon">

                      {transaction.type ===
                      "Income"
                        ? "💼"
                        : categoryIcons[
                            transaction.category
                          ] || "💸"}

                    </span>

                    <div>

                      <strong>
                        {transaction.category}
                      </strong>

                      <small>
                        {transaction.description ||
                          transaction.date}
                      </small>

                    </div>

                  </div>

                  <strong
                    className={
                      transaction.type ===
                      "Income"
                        ? "income"
                        : "expense"
                    }
                  >

                    {transaction.type ===
                    "Income"
                      ? "+"
                      : "-"}

                    {" "}

                    {formatAmount(
                      Number(
                        transaction.amount
                      )
                    )}

                  </strong>

                </div>

              )
            )

          ) : (

            <div className="no-transactions">

              <h3>
                No transactions yet
              </h3>

              <p>
                Add your first transaction
                to see it here.
              </p>

              <Link
                to="/add-expense"
                title="Add a new transaction"
              >
                <button
                  type="button"
                  className="add-transaction-btn"
                >
                  + Add Transaction
                </button>
              </Link>

            </div>

          )}

          {recentTransactions.length > 0 && (

            <div className="view-all">

              <Link
                to="/transactions"
                title="View all transactions"
              >
                View All Transactions →
              </Link>

            </div>

          )}

        </section>

        {/* ====================================
            QUICK ACTIONS
        ==================================== */}
        <section className="quick-actions">

          <Link
            to="/add-expense"
            className="quick-card"
            title="Add a new transaction"
          >

            <span>➕</span>

            <div>

              <h3>
                Add Expense
              </h3>

              <p>
                Record a new transaction
              </p>

            </div>

          </Link>

          <Link
            to="/budget"
            className="quick-card"
            title="Manage Budget"
          >

            <span>🎯</span>

            <div>

              <h3>
                Manage Budget
              </h3>

              <p>
                Check your monthly budget
              </p>

            </div>

          </Link>

          <Link
            to="/analytics"
            className="quick-card"
            title="View Analytics"
          >

            <span>📊</span>

            <div>

              <h3>
                View Analytics
              </h3>

              <p>
                Analyze your spending
              </p>

            </div>

          </Link>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
