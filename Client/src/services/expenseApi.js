const API_BASE_URL = "http://localhost:5000";

export async function getExpenses() {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch expenses.");
  }

  return data;
}

export async function createExpense(formData) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to save expense.");
  }

  return data;
}

export async function updateExpense(id, formData) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update expense.");
  }

  return data;
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete expense.");
  }

  return data;
}