import React, { useEffect, useState } from "react";
import "./App.css";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

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
  // Custom Tooltips
  // ====================
  const MonthlyTrendTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
      <div className="trend-tooltip">
        <p className="tooltip-title">{point.fullDate}</p>
        <p className="tooltip-total">Total: ${point.total.toFixed(2)}</p>

        <div className="tooltip-category-list">
          {point.categories.map((category) => (
            <div key={category.name} className="tooltip-category-row">
              <span>{category.name}</span>
              <span>${category.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const YearlyTrendTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
      <div className="trend-tooltip">
        <p className="tooltip-title">{point.monthLabel}</p>
        <p className="tooltip-total">Total: ${point.total.toFixed(2)}</p>

        <div className="tooltip-category-list">
          {point.categories.map((category) => (
            <div key={category.name} className="tooltip-category-row">
              <span>{category.name}</span>
              <span>${category.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

      <header className="header">
        <div className="logo-section">
          <div className="logo-circle">ET</div>
          <div className="logo-text">
            <h2>Expense Tracker</h2>
            <p>Track smarter, spend better</p>
          </div>
        </div>

        <div className="title-section">
          <h1>My Expense Tracker</h1>
        </div>

        <div className="user-section">
          {!isLoggedIn ? (
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("login");
                setShowLoginModal(true);
              }}
            >
              Login
            </button>
          ) : (
            <div className="user-card">
              <p>Welcome, {username}</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

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

        <div className="summary-grid">
          <div className="info-card summary-dashboard-card">
            <h2>Expense Summary</h2>

            {errorMessage ? (
              <div className="error-banner">
                <p>{errorMessage}</p>
                <button onClick={fetchExpenses}>Retry</button>
              </div>
            ) : expenses.length === 0 ? (
              <p>No expenses yet...</p>
            ) : (
              <>
                <div className="summary-top-grid dashboard-summary-top-grid">
                  <div className="summary-stat-card compact-stat-card">
                    <span className="summary-stat-label">Total Spend</span>
                    <span className="summary-stat-value">
                      ${totalSpend.toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-stat-card compact-stat-card">
                    <span className="summary-stat-label">Top Category</span>
                    <span className="summary-stat-value">
                      {topCategory ? topCategory.name : "N/A"}
                    </span>
                  </div>

                  <div className="summary-stat-card compact-stat-card">
                    <span className="summary-stat-label">Entries</span>
                    <span className="summary-stat-value">{totalEntries}</span>
                  </div>
                </div>

                <div className="summary-content-row dashboard-summary-content-row">
                  <div className="summary-chart-wrapper">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={categorySummaryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          nameKey="name"
                          label={false}
                          stroke="#F3F4F6"
                          strokeWidth={2}
                        />
                        <Tooltip
                          formatter={(value) =>
                            `$${Number(value).toFixed(2)}`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="summary-breakdown-side dashboard-summary-breakdown-side">
                    <h3>Category Breakdown</h3>

                    <div className="summary-breakdown-list">
                      {categorySummaryData.map((item, index) => (
                        <div key={item.name} className="summary-breakdown-item">
                          <div className="summary-breakdown-left">
                            <span
                              className="summary-color-dot"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></span>
                            <span>{item.name}</span>
                          </div>
                          <span>${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            className="info-card interactive-card"
            onClick={() => setShowTrendModal(true)}
          >
            <h2>Spending Trend</h2>

            {errorMessage ? (
              <div className="error-banner">
                <p>{errorMessage}</p>
                <button onClick={fetchExpenses}>Retry</button>
              </div>
            ) : dailyTrendData.length === 0 ? (
              <p>No data for {currentMonthKey} yet.</p>
            ) : (
              <>
                <p className="trend-subtitle">For {currentMonthDisplay}</p>

                <div className="trend-preview-chart">
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart
                      data={dailyTrendData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                      />
                      <XAxis
                        dataKey="day"
                        label={{
                          value: "Day",
                          position: "insideBottom",
                          offset: -8,
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `$${Number(value).toFixed(2)}`,
                          "Spent",
                        ]}
                        labelFormatter={(label, payload) =>
                          payload && payload.length > 0
                            ? payload[0].payload.fullDate
                            : label
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="trend-summary-text compact">
                  Total spent for this month was{" "}
                  <strong>${currentMonthTotal.toFixed(2)}</strong>.
                  {highestSpendDay && (
                    <>
                      {" "}
                      Highest spend was on{" "}
                      <strong>{highestSpendDateDisplay}</strong> with{" "}
                      <strong>${highestSpendDay.total.toFixed(2)}</strong>. Hover
                      over the graph for more information.
                    </>
                  )}
                </p>

                <div className="summary-hint-wrap">
                  <span className="summary-hint-badge">
                    Click to view more trends
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {showLoginModal && (
        <div className="modal-overlay auth-overlay">
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-logo-section">
              <div className="logo-circle">ET</div>
              <div className="logo-text auth-logo-text">
                <h2>Expense Tracker</h2>
                <p>Track smarter, spend better</p>
              </div>
            </div>

            <div className="auth-toggle">
              <button
                type="button"
                className={authMode === "login" ? "auth-tab active" : "auth-tab"}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "signup" ? "auth-tab active" : "auth-tab"}
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <h2 className="auth-title">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              <label>Username</label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter username"
              />

              <label>Password</label>
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter password"
              />

              {authMode === "signup" && (
                <>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={tempConfirmPassword}
                    onChange={(e) => setTempConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </>
              )}

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {authMode === "login" ? "Login" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Expense</h2>

            <form onSubmit={handleAddExpenseSubmit}>
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
                <button className="submit-btn">Submit</button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetExpenseForm}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div
            className="view-expense-modal"
            onClick={(e) => e.stopPropagation()}
          >
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
      )}

      {showDetailModal && selectedExpense && (
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
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Expense</h2>

            <form onSubmit={handleEditExpenseSubmit}>
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
                  Save Changes
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && expenseToDelete && (
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
      )}

      {showTrendModal && (
        <div className="modal-overlay" onClick={() => setShowTrendModal(false)}>
          <div className="trend-modal" onClick={(e) => e.stopPropagation()}>
            <div className="view-expense-header">
              <h2>Spending Trend</h2>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowTrendModal(false)}
              >
                Close
              </button>
            </div>

            <div className="trend-tabs">
              <button
                type="button"
                className={activeTrendTab === "monthly" ? "active" : ""}
                onClick={() => setActiveTrendTab("monthly")}
              >
                Monthly View
              </button>

              <button
                type="button"
                className={activeTrendTab === "yearly" ? "active" : ""}
                onClick={() => setActiveTrendTab("yearly")}
              >
                Yearly View
              </button>
            </div>

            {activeTrendTab === "monthly" && (
              <>
                <div className="trend-controls">
                  <div className="filter-group">
                    <label>Select Month</label>
                    <select
                      value={selectedTrendMonth}
                      onChange={(e) => setSelectedTrendMonth(e.target.value)}
                    >
                      {availableMonthKeys.map((monthKey) => (
                        <option key={monthKey} value={monthKey}>
                          {formatMonthFull(monthKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="summary-top-grid">
                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Selected Month</span>
                    <span className="summary-stat-value">
                      {selectedMonthDisplay || "N/A"}
                    </span>
                  </div>

                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Total Spend</span>
                    <span className="summary-stat-value">
                      ${selectedMonthTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Peak Day</span>
                    <span className="summary-stat-value">
                      {selectedMonthPeakDay
                        ? `${selectedMonthPeakDay.fullDate} ($${selectedMonthPeakDay.total.toFixed(
                            2
                          )})`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {selectedMonthTrendData.length === 0 ? (
                  <p className="empty-text">No data available for this month.</p>
                ) : (
                  <div className="trend-content-row">
                    <div className="trend-chart-panel">
                      <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                          data={selectedMonthTrendData}
                          margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="day"
                            label={{
                              value: "Day",
                              position: "insideBottom",
                              offset: -8,
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip content={<MonthlyTrendTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="summary-breakdown-side">
                      <div className="trend-secondary-breakdown">
                        <h3>Category Breakdown</h3>
                        <div className="summary-breakdown-list">
                          {selectedMonthCategoryBreakdown.map((item, index) => (
                            <div
                              key={item.name}
                              className="summary-breakdown-item"
                            >
                              <div className="summary-breakdown-left">
                                <span
                                  className="summary-color-dot"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                ></span>
                                <span>{item.name}</span>
                              </div>
                              <span>${item.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTrendTab === "yearly" && (
              <>
                <div className="summary-top-grid">
                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Months Tracked</span>
                    <span className="summary-stat-value">
                      {yearlyTrendData.length}
                    </span>
                  </div>

                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Highest Month</span>
                    <span className="summary-stat-value">
                      {highestYearMonth
                        ? `${highestYearMonth.monthLabel} ($${highestYearMonth.total.toFixed(
                            2
                          )})`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="summary-stat-card">
                    <span className="summary-stat-label">Latest Month</span>
                    <span className="summary-stat-value">
                      {latestYearMonth
                        ? `${latestYearMonth.monthLabel} ($${latestYearMonth.total.toFixed(
                            2
                          )})`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {yearlyTrendData.length === 0 ? (
                  <p className="empty-text">No yearly trend data available.</p>
                ) : (
                  <div className="trend-content-row">
                    <div className="trend-chart-panel">
                      <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                          data={yearlyTrendData}
                          margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="shortMonthLabel"
                            label={{
                              value: "Month",
                              position: "insideBottom",
                              offset: -8,
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip content={<YearlyTrendTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#F472B6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="summary-breakdown-side">
                      <div className="trend-secondary-breakdown no-divider">
                        <h3>Category Breakdown</h3>
                        <div className="summary-breakdown-list">
                          {yearlyCategoryBreakdown.map((item, index) => (
                            <div
                              key={item.name}
                              className="summary-breakdown-item"
                            >
                              <div className="summary-breakdown-left">
                                <span
                                  className="summary-color-dot"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                ></span>
                                <span>{item.name}</span>
                              </div>
                              <span>${item.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}