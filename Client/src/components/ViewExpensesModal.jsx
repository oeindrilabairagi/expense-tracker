export default function ViewExpensesModal({
  setShowViewModal,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  loadingExpenses,
  errorMessage,
  fetchExpenses,
  displayedExpenses,
  handleViewExpense,
  handleEditExpense,
  handleDeleteClick,
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
      <div className="view-expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="view-expense-header">
          <h2>View Expenses</h2>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </div>

        <div className="filter-sort-bar">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setSelectedCategory("All");
              setSortOption("newest");
            }}
          >
            Clear
          </button>
        </div>

        {loadingExpenses ? (
          <p className="empty-text">Loading expenses...</p>
        ) : errorMessage ? (
          <div className="error-banner">
            <p>{errorMessage}</p>
            <button onClick={fetchExpenses}>Retry</button>
          </div>
        ) : displayedExpenses.length === 0 ? (
          <p className="empty-text">No expenses found.</p>
        ) : (
          <div className="expense-list">
            {displayedExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-item-info">
                  <h3>{expense.title}</h3>
                  <p>
                    <strong>Category:</strong> {expense.category}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${expense.amount}
                  </p>
                  <p>
                    <strong>Expense Date:</strong>{" "}
                    {new Date(expense.expense_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p>
                    <strong>Recorded At:</strong>{" "}
                    {new Date(expense.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div className="expense-item-actions">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={() => handleViewExpense(expense)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => handleEditExpense(expense)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteClick(expense)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}