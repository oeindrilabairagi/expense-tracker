export function validateExpenseForm(formData) {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = "Title is required.";
  } else if (formData.title.trim().length < 3) {
    newErrors.title = "Title must be at least 3 characters.";
  }

  if (!formData.category) {
    newErrors.category = "Please select a category.";
  }

  if (!formData.amount) {
    newErrors.amount = "Amount is required.";
  } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
    newErrors.amount = "Amount must be greater than 0.";
  }

  if (!formData.date) {
    newErrors.date = "Date is required.";
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      newErrors.date = "Date cannot be in the future.";
    }
  }

  if (formData.description.trim().length > 300) {
    newErrors.description = "Description cannot exceed 300 characters.";
  }

  return newErrors;
}