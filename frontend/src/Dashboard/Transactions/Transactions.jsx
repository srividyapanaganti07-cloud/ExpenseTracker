
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [typeFilter, setTypeFilter] =
    useState("All Types");

  // Edit state
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  // Standard categories
  const standardCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Education",
    "Health",
    "Entertainment",
    "Other",
  ];

  // ==========================================
  // Fetch transactions from MongoDB
  // ==========================================
  const fetchTransactions = async () => {
   const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/expenses/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch transactions."
        );
        return;
      }

      setTransactions(data.expenses || []);
    } catch (error) {
      console.error(
        "Fetch transactions error:",
        error
      );

      alert(
        "Unable to connect to the backend server."
      );
    }
  };

  // Load transactions when page opens
  useEffect(() => {
    fetchTransactions();
  }, []);

  // ==========================================
  // Delete transaction
  // ==========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete transaction."
        );
        return;
      }

      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) =>
            transaction._id !== id
        )
      );

      alert(
        "Transaction deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete transaction error:",
        error
      );

      alert(
        "Unable to connect to the backend server."
      );
    }
  };

  // ==========================================
  // Start editing
  // ==========================================
  const handleEdit = (transaction) => {
    const isStandardCategory =
      standardCategories.includes(
        transaction.category
      );

    setEditingTransaction({
      ...transaction,

      // Make sure type always has a value
      type: transaction.type || "Expense",

      // If category is standard, keep it.
      // Otherwise show Custom Category.
      category: isStandardCategory
        ? transaction.category
        : "Custom Category",

      // Store existing custom category
      customCategory: isStandardCategory
        ? ""
        : transaction.category || "",

      date: transaction.date
        ? transaction.date.substring(0, 10)
        : "",
    });
  };

  // ==========================================
  // Update edit form
  // ==========================================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Save edited transaction
  // ==========================================
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    // Determine final category
    const finalCategory =
      editingTransaction.category ===
      "Custom Category"
        ? editingTransaction.customCategory.trim()
        : editingTransaction.category;

    // Validate custom category
    if (
      editingTransaction.category ===
        "Custom Category" &&
      !editingTransaction.customCategory.trim()
    ) {
      alert("Please enter your custom category.");
      return;
    }

    // Validate amount
    if (
      !editingTransaction.amount ||
      Number(editingTransaction.amount) <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    // Validate date
    if (!editingTransaction.date) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/expenses/${editingTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: Number(
              editingTransaction.amount
            ),

            category: finalCategory,

            date: editingTransaction.date,

            payment:
              editingTransaction.payment ||
              "UPI",

            description:
              editingTransaction.description ||
              "",

            type:
              editingTransaction.type ||
              "Expense",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update transaction."
        );
        return;
      }

      setTransactions((prevTransactions) =>
        prevTransactions.map(
          (transaction) =>
            transaction._id ===
            editingTransaction._id
              ? data.expense
              : transaction
        )
      );

      setEditingTransaction(null);

      alert(
        "Transaction updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update transaction error:",
        error
      );

      alert(
        "Unable to connect to the backend server."
      );
    }
  };

  // ==========================================
  // Filter transactions
  // ==========================================
  const filteredTransactions =
    transactions.filter((transaction) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        transaction.description
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter ===
          "All Categories" ||
        transaction.category ===
          categoryFilter;

      const matchesType =
        typeFilter === "All Types" ||
        transaction.type?.toLowerCase() ===
          typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });

  // ==========================================
  // Calculate totals
  // ==========================================
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "Income"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  // ==========================================
  // Format amount
  // ==========================================
  const formatAmount = (amount) => {
    return `₹${Number(
      amount
    ).toLocaleString("en-IN")}`;
  };

  return (
    <div className="transactions-page">

      {/* ==========================================
          HEADER
      ========================================== */}
      <header className="page-header">

        <div>
          <h1>Transactions</h1>

          <p>
            View and manage all your
            transactions.
          </p>
        </div>

        <Link to="/add-expense">
          <button className="add-transaction-btn">
            + Add Expense
          </button>
        </Link>

      </header>

      {/* ==========================================
          SUMMARY
      ========================================== */}
      <div className="transaction-summary">

        <div>
          <span>
            Total Transactions
          </span>

          <strong>
            {transactions.length}
          </strong>
        </div>

        <div>
          <span>
            Total Income
          </span>

          <strong>
            {formatAmount(totalIncome)}
          </strong>
        </div>

        <div>
          <span>
            Total Expenses
          </span>

          <strong>
            {formatAmount(totalExpenses)}
          </strong>
        </div>

      </div>

      {/* ==========================================
          TRANSACTIONS
      ========================================== */}
      <section className="transactions-container">

        {/* ==========================================
            FILTERS
        ========================================== */}
        <div className="transaction-filter">

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

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

            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Health</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
          >
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>

        </div>

        {/* ==========================================
            TABLE
        ========================================== */}
        <div className="transaction-table">

          <div className="table-header">

            <span>Category</span>

            <span>Description</span>

            <span>Date</span>

            <span>Amount</span>

            <span>Action</span>

          </div>

          {filteredTransactions.length > 0 ? (

            filteredTransactions.map(
              (transaction) => (

                <div
                  className="table-row"
                  key={transaction._id}
                >

                  {/* Category */}
                  <span>

                    {transaction.type ===
                    "Income"
                      ? "💼"
                      : "💸"}{" "}

                    {transaction.category}

                  </span>

                  {/* Description */}
                  <span>

                    {transaction.description ||
                      "No description"}

                  </span>

                  {/* Date */}
                  <span>

                    {transaction.date
                      ? transaction.date.substring(
                          0,
                          10
                        )
                      : ""}

                  </span>

                  {/* Amount */}
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
                      : "-"}{" "}

                    ₹
                    {Number(
                      transaction.amount
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                  {/* Actions */}
                  <div className="transaction-actions">

                    {/* Edit */}
                    <button
                      type="button"
                      title="Edit"
                      onClick={() =>
                        handleEdit(
                          transaction
                        )
                      }
                    >
                      ✏️
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        handleDelete(
                          transaction._id
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="no-transactions">

              <h3>
                No transactions found
              </h3>

              <p>
                Add a transaction to see
                it here.
              </p>

              <Link to="/add-expense">

                <button className="add-transaction-btn">
                  + Add Transaction
                </button>

              </Link>

            </div>

          )}

        </div>

      </section>

      {/* ==========================================
          EDIT MODAL
      ========================================== */}
      {editingTransaction && (

        <div className="edit-overlay">

          <div className="edit-modal">

            <h2>
              Edit Transaction
            </h2>

            <p>
              Update your transaction
              details.
            </p>

            <form
              onSubmit={handleSaveEdit}
            >

              {/* ==================================
                  TRANSACTION TYPE
              ================================== */}
              <label>
                Transaction Type
              </label>

              <select
                name="type"
                value={
                  editingTransaction.type ||
                  "Expense"
                }
                onChange={
                  handleEditChange
                }
              >

                <option value="Expense">
                  Expense
                </option>

                <option value="Income">
                  Income
                </option>

              </select>

              {/* ==================================
                  AMOUNT
              ================================== */}
              <label>
                Amount
              </label>

              <input
                type="number"
                name="amount"
                min="1"
                value={
                  editingTransaction.amount
                }
                onChange={
                  handleEditChange
                }
                required
              />

              {/* ==================================
                  CATEGORY
              ================================== */}
              <label>
                Category
              </label>

              <select
                name="category"
                value={
                  editingTransaction.category
                }
                onChange={
                  handleEditChange
                }
              >

                <option value="Food">
                  Food
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Other">
                  Other
                </option>

                <option value="Custom Category">
                  Custom Category
                </option>

              </select>

              {/* ==================================
                  CUSTOM CATEGORY
              ================================== */}
              {editingTransaction.category ===
                "Custom Category" && (

                <input
                  type="text"
                  name="customCategory"
                  className="custom-category-input"
                  placeholder="Enter your category"
                  value={
                    editingTransaction.customCategory ||
                    ""
                  }
                  onChange={
                    handleEditChange
                  }
                  maxLength="40"
                  required
                />

              )}

              {/* ==================================
                  DATE
              ================================== */}
              <label>
                Date
              </label>

              <input
                type="date"
                name="date"
                value={
                  editingTransaction.date
                }
                onChange={
                  handleEditChange
                }
                required
              />

              {/* ==================================
                  PAYMENT
              ================================== */}
              <label>
                Payment Method
              </label>

              <select
                name="payment"
                value={
                  editingTransaction.payment ||
                  "UPI"
                }
                onChange={
                  handleEditChange
                }
              >

                <option value="UPI">
                  UPI
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

              </select>

              {/* ==================================
                  DESCRIPTION
              ================================== */}
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  editingTransaction.description ||
                  ""
                }
                onChange={
                  handleEditChange
                }
                placeholder="Enter description"
              />

              {/* ==================================
                  BUTTONS
              ================================== */}
              <div className="edit-buttons">

                <button
                  type="button"
                  onClick={() =>
                    setEditingTransaction(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button type="submit">
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transactions;

