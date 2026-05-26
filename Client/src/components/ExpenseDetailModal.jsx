export default function ExpenseDetailModal({
  selectedExpense,
  setShowDetailModal,
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
      <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Expense Details</h2>

        <div className="detail-content">
          <p>
            <strong>Title:</strong> {selectedExpense.title}
          </p>

          <p>
            <strong>Category:</strong> {selectedExpense.category}
          </p>

          <p>
            <strong>Amount:</strong> ${selectedExpense.amount}
          </p>

          <p>
            <strong>Expense Date:</strong>{" "}
            {new Date(selectedExpense.expense_date).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>

          {selectedExpense.created_at && (
            <p>
              <strong>Recorded At:</strong>{" "}
              {new Date(selectedExpense.created_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          )}

          <p>
            <strong>Description:</strong>{" "}
            {selectedExpense.description || "No description"}
          </p>
        </div>

        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowDetailModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}