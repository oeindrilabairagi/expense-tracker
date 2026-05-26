export default function DeleteConfirmModal({
  expenseToDelete,
  handleConfirmDelete,
  setShowDeleteModal,
  setExpenseToDelete,
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div
        className="delete-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Delete Expense</h2>
        <p>
          Are you sure you want to delete{" "}
          <strong>{expenseToDelete.title}</strong>?
        </p>

        <div className="modal-buttons">
          <button
            type="button"
            className="delete-btn"
            onClick={handleConfirmDelete}
          >
            Yes, Delete
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setShowDeleteModal(false);
              setExpenseToDelete(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}