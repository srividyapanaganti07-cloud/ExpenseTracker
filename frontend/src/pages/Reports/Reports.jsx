
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import API_URL from "../../api";
import "./Reports.css";

function Reports() {
  const [transactions, setTransactions] = useState([]);

  const [typeFilter, setTypeFilter] =
    useState("All Types");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [monthFilter, setMonthFilter] =
    useState("All Months");

  // ==========================================
  // LOAD TRANSACTIONS FROM MONGODB
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
          "Reports transaction fetch error:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================
  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================
  // AVAILABLE MONTHS
  // ==========================================
  const availableMonths = [
    ...new Set(
      transactions
        .map((transaction) => transaction.date)
        .filter(Boolean)
        .map((date) =>
          String(date).slice(0, 7)
        )
    ),
  ].sort().reverse();

  // ==========================================
  // FORMAT MONTH
  // ==========================================
  const formatMonth = (month) => {
    if (!month) return "";

    const [year, monthNumber] =
      month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1
    );

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // FILTER TRANSACTIONS
  // ==========================================
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "All Types" ||
        transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        transaction.category === categoryFilter;

      const matchesMonth =
        monthFilter === "All Months" ||
        (
          transaction.date &&
          String(transaction.date).startsWith(
            monthFilter
          )
        );

      return (
        matchesType &&
        matchesCategory &&
        matchesMonth
      );
    });
  }, [
    transactions,
    typeFilter,
    categoryFilter,
    monthFilter,
  ]);

  // ==========================================
  // TOTAL INCOME
  // ==========================================
  const totalIncome = filteredTransactions
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
  const totalExpenses = filteredTransactions
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
  // CATEGORY-WISE EXPENSES
  // ==========================================
  const categoryTotals = {};

  filteredTransactions
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

  const categoryData = Object.entries(
    categoryTotals
  ).sort(
    (a, b) => b[1] - a[1]
  );

  // ==========================================
  // RESET FILTERS
  // ==========================================
  const resetFilters = () => {
    setTypeFilter("All Types");
    setCategoryFilter("All Categories");
    setMonthFilter("All Months");
  };

  // ==========================================
  // EXPORT CSV
  // ==========================================
  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert(
        "There are no transactions to export."
      );
      return;
    }

    const headers = [
      "Date",
      "Type",
      "Category",
      "Description",
      "Amount",
      "Payment",
    ];

    const rows = filteredTransactions.map(
      (transaction) => [
        transaction.date || "",
        transaction.type || "",
        transaction.category || "",
        transaction.description || "",
        transaction.amount || 0,
        transaction.payment || "",
      ]
    );

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "expense-report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // EXPORT EXCEL
  // ==========================================
  const exportExcel = () => {
    if (filteredTransactions.length === 0) {
      alert(
        "There are no transactions to export."
      );
      return;
    }

    const excelData =
      filteredTransactions.map(
        (transaction) => ({
          Date:
            transaction.date || "",

          Type:
            transaction.type || "",

          Category:
            transaction.category || "",

          Description:
            transaction.description ||
            "",

          Amount:
            Number(transaction.amount) || 0,

          Payment:
            transaction.payment || "",
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Transactions"
    );

    XLSX.writeFile(
      workbook,
      "expense-report.xlsx"
    );
  };

  // ==========================================
  // PRINT / SAVE AS PDF
  // ==========================================
  const printReport = () => {
    window.print();
  };

  return (
    <div className="reports-page">

      {/* ==========================================
          HEADER
      ========================================== */}
      <header className="reports-header">

        <div>
          <h1>
            Reports
          </h1>

          <p>
            Analyze your income, expenses and
            spending patterns.
          </p>
        </div>

        <Link to="/dashboard">

          <button
            className="back-dashboard-btn"
          >
            ← Dashboard
          </button>

        </Link>

      </header>


      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}
      <section className="report-summary">

        <div className="report-card income-card">

          <span>
            Total Income
          </span>

          <h2>
            {formatAmount(totalIncome)}
          </h2>

          <p>
            Based on filtered transactions
          </p>

        </div>


        <div className="report-card expense-card">

          <span>
            Total Expenses
          </span>

          <h2>
            {formatAmount(totalExpenses)}
          </h2>

          <p>
            Based on filtered transactions
          </p>

        </div>


        <div className="report-card balance-card">

          <span>
            Balance
          </span>

          <h2>
            {formatAmount(balance)}
          </h2>

          <p>
            {balance >= 0
              ? "Positive balance"
              : "Expenses exceed income"}
          </p>

        </div>


        <div className="report-card transaction-card">

          <span>
            Transactions
          </span>

          <h2>
            {filteredTransactions.length}
          </h2>

          <p>
            Transactions included
          </p>

        </div>

      </section>


      {/* ==========================================
          FILTERS
      ========================================== */}
      <section className="report-section">

        <div className="section-title">

          <div>

            <h2>
              Report Filters
            </h2>

            <p>
              Filter the report according
              to your needs.
            </p>

          </div>

          <button
            className="reset-btn"
            onClick={resetFilters}
          >
            Reset Filters
          </button>

        </div>


        <div className="report-filters">

          {/* TYPE */}
          <div className="filter-group">

            <label>
              Transaction Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
            >
              <option>
                All Types
              </option>

              <option>
                Income
              </option>

              <option>
                Expense
              </option>

            </select>

          </div>


          {/* CATEGORY */}
          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >

              <option>
                All Categories
              </option>

              <option>
                Food
              </option>

              <option>
                Transport
              </option>

              <option>
                Shopping
              </option>

              <option>
                Education
              </option>

              <option>
                Health
              </option>

              <option>
                Entertainment
              </option>

              <option>
                Other
              </option>

            </select>

          </div>


          {/* MONTH */}
          <div className="filter-group">

            <label>
              Month
            </label>

            <select
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(
                  e.target.value
                )
              }
            >

              <option value="All Months">
                All Months
              </option>

              {availableMonths.map(
                (month) => (

                  <option
                    key={month}
                    value={month}
                  >
                    {formatMonth(month)}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

      </section>


      {/* ==========================================
          CATEGORY BREAKDOWN
      ========================================== */}
      <section className="report-section">

        <div className="section-title">

          <div>

            <h2>
              Category-wise Expenses
            </h2>

            <p>
              See how your expenses are
              distributed across categories.
            </p>

          </div>

        </div>


        {categoryData.length > 0 ? (

          <div className="category-report">

            {categoryData.map(
              ([category, amount], index) => {

                const percentage =
                  totalExpenses > 0
                    ? (amount /
                        totalExpenses) *
                      100
                    : 0;

                return (
                  <div
                    className="category-item"
                    key={category}
                  >

                    <div className="category-info">

                      <div>

                        <strong>
                          {index + 1}.
                          {" "}
                          {category}
                        </strong>

                        <span>
                          {percentage.toFixed(
                            1
                          )}
                          %
                        </span>

                      </div>

                      <strong>
                        {formatAmount(
                          amount
                        )}
                      </strong>

                    </div>


                    <div className="progress-background">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="empty-report">

            <h3>
              No expense data available
            </h3>

            <p>
              Add some expenses to generate
              category reports.
            </p>

          </div>

        )}

      </section>


      {/* ==========================================
          TRANSACTION REPORT
      ========================================== */}
      <section className="report-section">

        <div className="section-title">

          <div>

            <h2>
              Transaction Report
            </h2>

            <p>
              Detailed list of your
              filtered transactions.
            </p>

          </div>


          {/* EXPORT BUTTONS */}
          <div className="export-buttons">

            <button
              className="export-btn"
              onClick={exportCSV}
            >
              ↓ Export CSV
            </button>


            <button
              className="export-btn"
              onClick={exportExcel}
            >
              📊 Export Excel
            </button>


            <button
              className="print-btn"
              onClick={printReport}
            >
              🖨 Print / Save PDF
            </button>

          </div>

        </div>


        {/* ==========================================
            REPORT TABLE
        ========================================== */}
        <div className="report-table">

          <div className="report-table-header">

            <span>
              Date
            </span>

            <span>
              Type
            </span>

            <span>
              Category
            </span>

            <span>
              Description
            </span>

            <span>
              Amount
            </span>

          </div>


          {filteredTransactions.length > 0 ? (

            [...filteredTransactions]
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ) -
                  new Date(
                    a.createdAt
                  )
              )
              .map(
                (transaction) => (

                  <div
                    className="report-table-row"
                    key={transaction._id}
                  >

                    <span>
                      {transaction.date ||
                        "-"}
                    </span>


                    <span>

                      <span
                        className={
                          transaction.type ===
                          "Income"
                            ? "type-income"
                            : "type-expense"
                        }
                      >
                        {transaction.type}
                      </span>

                    </span>


                    <span>
                      {transaction.category}
                    </span>


                    <span>
                      {transaction.description ||
                        "No description"}
                    </span>


                    <strong
                      className={
                        transaction.type ===
                        "Income"
                          ? "amount-income"
                          : "amount-expense"
                      }
                    >

                      {transaction.type ===
                      "Income"
                        ? "+"
                        : "-"}{" "}

                      {formatAmount(
                        transaction.amount
                      )}

                    </strong>

                  </div>

                )
              )

          ) : (

            <div className="empty-report">

              <h3>
                No transactions found
              </h3>

              <p>
                Try changing your filters
                or add a new transaction.
              </p>

              <Link to="/add-expense">

                <button
                  className="add-report-btn"
                >
                  + Add Transaction
                </button>

              </Link>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Reports;

