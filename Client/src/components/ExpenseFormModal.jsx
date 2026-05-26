export default function ExpenseFormModal({
  title,
  formData,
  setFormData,
  errors,
  handleSubmit,
  resetExpenseForm,
  closeModal,
  submitText,
  showResetButton,
}) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {errors.title && <p className="error-text">{errors.title}</p>}

          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}

          <label>Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />
          {errors.date && <p className="error-text">{errors.date}</p>}

          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              {submitText}
            </button>

            {showResetButton && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetExpenseForm}
              >
                Reset
              </button>
            )}

            <button type="button" className="cancel-btn" onClick={closeModal}>
              {showResetButton ? "Close" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}