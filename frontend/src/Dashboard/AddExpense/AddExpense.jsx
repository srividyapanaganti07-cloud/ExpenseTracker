import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "./AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    customCategory: "",
    date: "",
    payment: "UPI",
    description: "",
    type: "Expense",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ADD EXPENSE FORM SUBMITTED");
    console.log("SELECTED TYPE:", formData.type);

    const finalCategory =
      formData.category === "Custom Category"
        ? formData.customCategory.trim()
        : formData.category;

    if (
      formData.category === "Custom Category" &&
      !formData.customCategory.trim()
    ) {
      alert("Please enter your custom category.");
      return;
    }

    if (!formData.amount) {
      alert("Please enter the amount.");
      return;
    }

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }
     const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const transactionData = {
      userId: userId,
      amount: Number(formData.amount),
      category: finalCategory,
      date: formData.date,
      payment: formData.payment,
      description: formData.description,
      type: formData.type,
    };

    console.log("TRANSACTION BEING SENT:", transactionData);

    try {
      const response = await fetch(
        `${API_URL}/api/expenses/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add transaction.");
        return;
      }

      console.log("BACKEND SAVED TYPE:", data.expense.type);
      console.log("FULL SAVED TRANSACTION:", data.expense);

      alert(`${formData.type} added successfully!`);

      navigate("/transactions");
    } catch (error) {
      console.error("Add transaction error:", error);
      alert("Unable to connect to the backend server.");
    }
  };

  return (
    <div className="add-expense-page">

      <div className="expense-header">
        <h1>Add Expense</h1>
        <p>Record a new income or expense.</p>
      </div>

      <form
        className="expense-form"
        onSubmit={handleSubmit}
      >

        {/* Transaction Type */}
        <div className="form-group">
          <label>Transaction Type</label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            min="1"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
            <option value="Custom Category">
              Custom Category
            </option>
          </select>

          {formData.category === "Custom Category" && (
            <input
              type="text"
              name="customCategory"
              className="custom-category-input"
              placeholder="Enter your category"
              value={formData.customCategory}
              onChange={handleChange}
              maxLength="40"
              required
            />
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Payment */}
        <div className="form-group">
          <label>Payment Method</label>

          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">
              Bank Transfer
            </option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="form-buttons">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-expense-btn"
          >
            Save Transaction
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddExpense;