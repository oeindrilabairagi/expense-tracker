export default function LoginModal({
  authMode,
  setAuthMode,
  tempUsername,
  setTempUsername,
  tempPassword,
  setTempPassword,
  tempConfirmPassword,
  setTempConfirmPassword,
  handleAuthSubmit,
}) {
  return (
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
  );
}