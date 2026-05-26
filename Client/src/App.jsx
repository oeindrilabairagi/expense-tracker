import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import ExpenseFormModal from "./components/ExpenseFormModal";
import ViewExpensesModal from "./components/ViewExpensesModal";
import ExpenseDetailModal from "./components/ExpenseDetailModal";
import DashboardSummary from "./components/DashboardSummary";
import TrendModal from "./components/TrendModal";

export default function App() {
  // ====================
  // Authentication State
  // ====================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState("User");
  const [authMode, setAuthMode] = useState("login");
  const [tempUsername, setTempUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempConfirmPassword, setTempConfirmPassword] = useState("");

  // ====================
  // Expense Form + CRUD State
  // ====================
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // ====================
  // Filter / Sort State
  // ====================
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  // ====================
  // Trend / Analytics State
  // ====================
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [activeTrendTab, setActiveTrendTab] = useState("monthly");
  const [selectedTrendMonth, setSelectedTrendMonth] = useState("");

  // ====================
  // Constants / Helpers
  // ====================
  const COLORS = [
    "#8B5CF6",
    "#F472B6",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#A78BFA",
  ];

  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const resetExpenseForm = () => {
    setFormData({
      title: "",
      category: "",
      amount: "",
      date: "",
      description: "",
    });
    setErrors({});
  };

  const formatMonthFull = (monthKey) => {
    const date = new Date(`01 ${monthKey}`);
    return date.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  const parseMonthKey = (monthKey) => new Date(`01 ${monthKey}`);

  const getCurrentMonthKey = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  // ====================
  // Validation
  // ====================
  const validateForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================
  // Authentication Handlers
  // ====================
  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (!tempUsername.trim() || !tempPassword.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    if (authMode === "signup") {
      if (!tempConfirmPassword.trim()) {
        alert("Please confirm your password.");
        return;
      }

      if (tempPassword !== tempConfirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    setUsername(tempUsername);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setTempUsername("");
    setTempPassword("");
    setTempConfirmPassword("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("User");
    setAuthMode("login");
    setShowLoginModal(true);
  };

  // ====================
  // Fetch / Load Data
  // ====================
  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:5000/expenses");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setErrorMessage("Unable to load. Please try again.");
      setExpenses([]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ====================
  // CRUD Handlers
  // ====================
  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/expenses", {
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

      alert("Expense added successfully!");
      await fetchExpenses();
      resetExpenseForm();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Could not save expense. Please try again.");
    }
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.expense_date?.split("T")[0] || expense.expense_date,
      description: expense.description || "",
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleEditExpenseSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !selectedExpense) return;

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${selectedExpense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update expense.");
      }

      alert("Expense updated successfully!");
      setShowEditModal(false);
      setSelectedExpense(null);
      resetExpenseForm();
      await fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Could not update expense.");
    }
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${expenseToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete expense.");
      }

      alert("Expense deleted successfully!");
      setShowDeleteModal(false);
      setExpenseToDelete(null);
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Could not delete expense.");
    }
  };

  // ====================
  // Filtered / Sorted Expense List
  // ====================
  const displayedExpenses = expenses
    .filter((expense) => {
      if (selectedCategory === "All") return true;
      return expense.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.expense_date) - new Date(a.expense_date);
      }

      if (sortOption === "oldest") {
        return new Date(a.expense_date) - new Date(b.expense_date);
      }

      if (sortOption === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortOption === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      return 0;
    });

  // ====================
  // Section 4: Expense Summary Data
  // ====================
  const categoryTotalsMap = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;
    return acc;
  }, {});

  const categorySummaryData = Object.entries(categoryTotalsMap).map(
    ([category, total], index) => ({
      name: category,
      value: Number(total.toFixed(2)),
      fill: COLORS[index % COLORS.length],
    })
  );

  const totalSpend = categorySummaryData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const topCategory =
    categorySummaryData.length > 0
      ? categorySummaryData.reduce((max, item) =>
          item.value > max.value ? item : max
        )
      : null;

  const totalEntries = expenses.length;

  // ====================
  // Section 5: Dashboard Trend Preview
  // ====================
  const currentMonthKey = getCurrentMonthKey();

  const dailyTotalsMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date) return acc;

    const date = new Date(expense.expense_date);
    const monthKey = date.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    if (monthKey !== currentMonthKey) return acc;

    const day = date.getDate();
    const amount = Number(expense.amount) || 0;

    if (!acc[day]) acc[day] = 0;
    acc[day] += amount;

    return acc;
  }, {});

  const currentMonthDisplay = formatMonthFull(currentMonthKey);
  const fullMonthName = currentMonthDisplay.split(" ")[0];

  const dailyTrendData = Object.entries(dailyTotalsMap)
    .map(([day, total]) => ({
      day: Number(day),
      fullDate: `${Number(day)} ${fullMonthName}`,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => a.day - b.day);

  const currentMonthTotal = dailyTrendData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const highestSpendDay =
    dailyTrendData.length > 0
      ? dailyTrendData.reduce((max, item) =>
          item.total > max.total ? item : max
        )
      : null;

  const currentMonthShort = currentMonthKey.split(" ")[0];
  const currentYear = currentMonthKey.split(" ")[1];

  const highestSpendDateDisplay = highestSpendDay
    ? `${String(highestSpendDay.day).padStart(2, "0")}-${
        monthMap[currentMonthShort]
      }-${currentYear}`
    : null;

  // ====================
  // Trend Modal Data
  // ====================
  const availableMonthKeys = [
    ...new Set(
      expenses
        .filter((expense) => expense.expense_date)
        .map((expense) =>
          new Date(expense.expense_date).toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
          })
        )
    ),
  ].sort((a, b) => parseMonthKey(a) - parseMonthKey(b));

  useEffect(() => {
    if (!selectedTrendMonth && availableMonthKeys.length > 0) {
      setSelectedTrendMonth(
        availableMonthKeys.includes(currentMonthKey)
          ? currentMonthKey
          : availableMonthKeys[availableMonthKeys.length - 1]
      );
    }
  }, [selectedTrendMonth, availableMonthKeys, currentMonthKey]);

  const selectedMonthDisplay = selectedTrendMonth
    ? formatMonthFull(selectedTrendMonth)
    : "";

  const selectedMonthParts = selectedTrendMonth.split(" ");
  const selectedMonthFullName = selectedMonthDisplay
    ? selectedMonthDisplay.split(" ")[0]
    : "";

  const selectedMonthDailyMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date || !selectedTrendMonth) return acc;

    const date = new Date(expense.expense_date);
    const monthKey = date.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    if (monthKey !== selectedTrendMonth) return acc;

    const day = date.getDate();
    const amount = Number(expense.amount) || 0;
    const category = expense.category || "Other";

    if (!acc[day]) {
      acc[day] = {
        total: 0,
        categories: {},
      };
    }

    acc[day].total += amount;

    if (!acc[day].categories[category]) {
      acc[day].categories[category] = 0;
    }

    acc[day].categories[category] += amount;

    return acc;
  }, {});

  const selectedMonthTrendData = Object.entries(selectedMonthDailyMap)
    .map(([day, data]) => ({
      day: Number(day),
      fullDate: `${Number(day)} ${selectedMonthFullName} ${
        selectedMonthParts[1] || ""
      }`.trim(),
      total: Number(data.total.toFixed(2)),
      categories: Object.entries(data.categories)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value),
    }))
    .sort((a, b) => a.day - b.day);

  const selectedMonthCategoryTotals = selectedMonthTrendData
    .flatMap((item) => item.categories)
    .reduce((acc, category) => {
      if (!acc[category.name]) {
        acc[category.name] = 0;
      }
      acc[category.name] += category.value;
      return acc;
    }, {});

  const selectedMonthCategoryBreakdown = Object.entries(
    selectedMonthCategoryTotals
  )
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  const selectedMonthTotal = selectedMonthTrendData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const selectedMonthPeakDay =
    selectedMonthTrendData.length > 0
      ? selectedMonthTrendData.reduce((max, item) =>
          item.total > max.total ? item : max
        )
      : null;

  const yearlyTotalsMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date) return acc;

    const monthKey = new Date(expense.expense_date).toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    const amount = Number(expense.amount) || 0;
    const category = expense.category || "Other";

    if (!acc[monthKey]) {
      acc[monthKey] = {
        total: 0,
        categories: {},
      };
    }

    acc[monthKey].total += amount;

    if (!acc[monthKey].categories[category]) {
      acc[monthKey].categories[category] = 0;
    }

    acc[monthKey].categories[category] += amount;

    return acc;
  }, {});

  const yearlyTrendData = Object.entries(yearlyTotalsMap)
    .map(([monthKey, data]) => ({
      monthKey,
      monthLabel: formatMonthFull(monthKey),
      shortMonthLabel: monthKey,
      total: Number(data.total.toFixed(2)),
      categories: Object.entries(data.categories)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value),
    }))
    .sort((a, b) => parseMonthKey(a.monthKey) - parseMonthKey(b.monthKey));

  const yearlyCategoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;
    return acc;
  }, {});

  const yearlyCategoryBreakdown = Object.entries(yearlyCategoryTotals)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  const highestYearMonth =
    yearlyTrendData.length > 0
      ? yearlyTrendData.reduce((max, item) =>
          item.total > max.total ? item : max
        )
      : null;

  const latestYearMonth =
    yearlyTrendData.length > 0
      ? yearlyTrendData[yearlyTrendData.length - 1]
      : null;

  // ====================
  // Render
  // ====================
  return (
    <div className="app">
      <div className="background-animation">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
      </div>

      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        setAuthMode={setAuthMode}
        setShowLoginModal={setShowLoginModal}
        handleLogout={handleLogout}
      />

      <main className="dashboard">
        <div className="action-grid">
          <div className="action-card" onClick={() => setShowAddModal(true)}>
            <div className="card-icon">➕</div>
            <h2>Add New Expense</h2>
            <p>Log a new expense with category, amount, and details.</p>
          </div>

          <div
            className="action-card"
            onClick={() => {
              setShowViewModal(true);
              fetchExpenses();
            }}
          >
            <div className="card-icon">📄</div>
            <h2>View Expenses</h2>
            <p>Browse, edit, and manage your recorded expenses.</p>
          </div>
        </div>

        <DashboardSummary
          errorMessage={errorMessage}
          fetchExpenses={fetchExpenses}
          expenses={expenses}
          totalSpend={totalSpend}
          topCategory={topCategory}
          totalEntries={totalEntries}
          categorySummaryData={categorySummaryData}
          COLORS={COLORS}
          dailyTrendData={dailyTrendData}
          currentMonthKey={currentMonthKey}
          currentMonthDisplay={currentMonthDisplay}
          currentMonthTotal={currentMonthTotal}
          highestSpendDay={highestSpendDay}
          highestSpendDateDisplay={highestSpendDateDisplay}
          setShowTrendModal={setShowTrendModal}
        />
      </main>

      {showLoginModal && (
        <LoginModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          tempUsername={tempUsername}
          setTempUsername={setTempUsername}
          tempPassword={tempPassword}
          setTempPassword={setTempPassword}
          tempConfirmPassword={tempConfirmPassword}
          setTempConfirmPassword={setTempConfirmPassword}
          handleAuthSubmit={handleAuthSubmit}
        />
      )}
      
      {showAddModal && (
        <ExpenseFormModal
          title="Add New Expense"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleSubmit={handleAddExpenseSubmit}
          resetExpenseForm={resetExpenseForm}
          closeModal={() => setShowAddModal(false)}
          submitText="Submit"
          showResetButton={true}
        />
      )}

      {showViewModal && (
        <ViewExpensesModal
          setShowViewModal={setShowViewModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
          loadingExpenses={loadingExpenses}
          errorMessage={errorMessage}
          fetchExpenses={fetchExpenses}
          displayedExpenses={displayedExpenses}
          handleViewExpense={handleViewExpense}
          handleEditExpense={handleEditExpense}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {showDetailModal && selectedExpense && (
        <ExpenseDetailModal
          selectedExpense={selectedExpense}
          setShowDetailModal={setShowDetailModal}
        />
      )}

      {showEditModal && (
        <ExpenseFormModal
          title="Edit Expense"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleSubmit={handleEditExpenseSubmit}
          resetExpenseForm={resetExpenseForm}
          closeModal={() => setShowEditModal(false)}
          submitText="Save Changes"
          showResetButton={false}
        />
      )}
      
      {showDeleteModal && expenseToDelete && (
        <DeleteConfirmModal
          expenseToDelete={expenseToDelete}
          handleConfirmDelete={handleConfirmDelete}
          setShowDeleteModal={setShowDeleteModal}
          setExpenseToDelete={setExpenseToDelete}
        />
      )}

      {showTrendModal && (
        <TrendModal
          setShowTrendModal={setShowTrendModal}
          activeTrendTab={activeTrendTab}
          setActiveTrendTab={setActiveTrendTab}
          selectedTrendMonth={selectedTrendMonth}
          setSelectedTrendMonth={setSelectedTrendMonth}
          availableMonthKeys={availableMonthKeys}
          formatMonthFull={formatMonthFull}
          selectedMonthDisplay={selectedMonthDisplay}
          selectedMonthTotal={selectedMonthTotal}
          selectedMonthPeakDay={selectedMonthPeakDay}
          selectedMonthTrendData={selectedMonthTrendData}
          selectedMonthCategoryBreakdown={selectedMonthCategoryBreakdown}
          yearlyTrendData={yearlyTrendData}
          highestYearMonth={highestYearMonth}
          latestYearMonth={latestYearMonth}
          yearlyCategoryBreakdown={yearlyCategoryBreakdown}
          COLORS={COLORS}
        />
      )}

    </div>
  );
}