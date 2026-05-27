export default function Header({
  isLoggedIn,
  username,
  setAuthMode,
  setShowLoginModal,
  setShowProfileModal,
  handleLogout,
}) {
  return (
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

          <div className="user-actions">
            <button
              className="profile-btn"
              onClick={() => setShowProfileModal(true)}
            >
              Profile
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        )}
      </div>
    </header>
  );
}