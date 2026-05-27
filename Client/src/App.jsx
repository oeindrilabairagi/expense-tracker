import React, { useEffect, useState } from "react";
import "./App.css";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "./services/authApi";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import ExpenseFormModal from "./components/ExpenseFormModal";
import ViewExpensesModal from "./components/ViewExpensesModal";
import ExpenseDetailModal from "./components/ExpenseDetailModal";
import DashboardSummary from "./components/DashboardSummary";
import TrendModal from "./components/TrendModal";
import { validateExpenseForm } from "./utils/validation";
import {
  formatMonthFull,
  parseMonthKey,
  getCurrentMonthKey,
} from "./utils/dateUtils";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./services/expenseApi";
import {
  getDisplayedExpenses,
  getExpenseSummary,
  getDashboardTrendPreview,
  getAvailableMonthKeys,
  getSelectedMonthTrendData,
  getCategoryBreakdownFromTrendData,
  getTotalFromTrendData,
  getPeakTrendItem,
  getYearlyTrendData,
} from "./utils/expenseAnalytics";
import AdminPanelModal from "./components/AdminPanelModal";

export default function App() {
  // ====================
  // Authentication State
  // ====================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState("User");
  const [authMode, setAuthMode] = useState("login");
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempConfirmPassword, setTempConfirmPassword] = useState("");
  const [authErrors, setAuthErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // ====================
  // Expense Form + CRUD State
  // ====================
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const validateForm = () => {
    const newErrors = validateExpenseForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================
  // Authentication Handlers
  // ====================
   // ====================
// Authentication Handlers
// ====================
const handleAuthSubmit = async (e) => {
  e.preventDefault();

  const newAuthErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!tempEmail.trim()) {
    newAuthErrors.email = "Email is required.";
  } else if (!emailPattern.test(tempEmail.trim())) {
    newAuthErrors.email = "Please enter a valid email address.";
  }

  if (!tempPassword.trim()) {
    newAuthErrors.password = "Password is required.";
  } else if (tempPassword.length < 6) {
    newAuthErrors.password = "Password must be at least 6 characters.";
  }

  if (authMode === "signup") {
    if (!tempConfirmPassword.trim()) {
      newAuthErrors.confirmPassword = "Please confirm your password.";
    } else if (tempPassword !== tempConfirmPassword) {
      newAuthErrors.confirmPassword = "Passwords do not match.";
    }
  }

  setAuthErrors(newAuthErrors);

  if (Object.keys(newAuthErrors).length > 0) return;

  try {
    if (authMode === "signup") {
      await registerUser({
        username: tempUsername,
        email: tempEmail,
        password: tempPassword,
      });

      alert("Account created successfully. Please log in.");
      setAuthMode("login");
      setTempUsername("");
      setTempEmail("");
      setTempPassword("");
      setTempConfirmPassword("");
      setAuthErrors({});
      return;
    }

    const data = await loginUser({
      email: tempEmail,
      password: tempPassword,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUsername(data.user.username);
    setCurrentUser(data.user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setTempUsername("");
    setTempEmail("");
    setTempPassword("");
    setTempConfirmPassword("");
    setAuthErrors({});
  } catch (error) {
    console.error("Authentication error:", error);
    alert(error.message || "Authentication failed.");
  }
};

const handleLogout = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    try {
      await logoutUser({
        userId: storedUser.id,
        username: storedUser.username,
      });
    } catch (error) {
      console.error("Logout logging failed:", error);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setUsername("User");
  setCurrentUser(null);
  setExpenses([]);
  setSelectedExpense(null);
  setExpenseToDelete(null);
  setShowAddModal(false);
  setShowViewModal(false);
  setShowDetailModal(false);
  setShowEditModal(false);
  setShowDeleteModal(false);
  setShowTrendModal(false);
  setErrorMessage("");
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

      const data = await getExpenses();
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
      await createExpense(formData);

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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setIsLoggedIn(true);
      setUsername(parsedUser.username);
      setCurrentUser(parsedUser);
      setShowLoginModal(false);
    }
  }, []);

  const handleEditExpenseSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !selectedExpense) return;

    try {
      await updateExpense(selectedExpense.id, formData);

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
      await deleteExpense(expenseToDelete.id);

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
// Derived Expense Data
// ====================
const displayedExpenses = getDisplayedExpenses(
  expenses,
  selectedCategory,
  sortOption,
  searchTerm
);

const {
  categorySummaryData,
  totalSpend,
  topCategory,
  totalEntries,
} = getExpenseSummary(expenses, COLORS);

const currentMonthKey = getCurrentMonthKey();
const currentMonthDisplay = formatMonthFull(currentMonthKey);

const {
  dailyTrendData,
  currentMonthTotal,
  highestSpendDay,
  highestSpendDateDisplay,
} = getDashboardTrendPreview(
  expenses,
  currentMonthKey,
  currentMonthDisplay,
  monthMap
);

const availableMonthKeys = getAvailableMonthKeys(expenses, parseMonthKey);

useEffect(() => {
  if (availableMonthKeys.length === 0) {
    setSelectedTrendMonth("");
    return;
  }

  if (!selectedTrendMonth || !availableMonthKeys.includes(selectedTrendMonth)) {
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

const selectedMonthTrendData = getSelectedMonthTrendData(
  expenses,
  selectedTrendMonth,
  selectedMonthDisplay
);

const selectedMonthCategoryBreakdown =
  getCategoryBreakdownFromTrendData(selectedMonthTrendData);

const selectedMonthTotal = getTotalFromTrendData(selectedMonthTrendData);

const selectedMonthPeakDay = getPeakTrendItem(selectedMonthTrendData);

const yearlyTrendData = getYearlyTrendData(
  expenses,
  formatMonthFull,
  parseMonthKey
);

const yearlyCategoryBreakdown =
  getCategoryBreakdownFromTrendData(yearlyTrendData);

const highestYearMonth = getPeakTrendItem(yearlyTrendData);

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
        {currentUser?.role === "admin" && (
          <>
            <div className="admin-banner">
              <div className="admin-banner-left">
                <div className="admin-icon">🛡️</div>

                <div>
                  <h3>Admin Controls</h3>
                  <p>
                    Manage users and monitor system activities.
                  </p>
                </div>
              </div>

              <button
                className="admin-panel-btn"
                onClick={() => setShowAdminPanel(true)}
              >
                Open Admin Panel
              </button>
            </div>

            <div className="admin-divider"></div>
          </>
        )}

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
          tempEmail={tempEmail}
          setTempEmail={setTempEmail}
          tempPassword={tempPassword}
          setTempPassword={setTempPassword}
          tempConfirmPassword={tempConfirmPassword}
          setTempConfirmPassword={setTempConfirmPassword}
          handleAuthSubmit={handleAuthSubmit}
          authErrors={authErrors}
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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
      
      {showAdminPanel && (
        <AdminPanelModal setShowAdminPanel={setShowAdminPanel} />
      )}

    </div>
  );
}