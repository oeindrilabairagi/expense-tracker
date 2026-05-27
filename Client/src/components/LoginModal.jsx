export default function LoginModal({
  authMode,
  setAuthMode,
  tempUsername,
  setTempUsername,
  tempEmail,
  setTempEmail,
  tempPassword,
  setTempPassword,
  tempConfirmPassword,
  setTempConfirmPassword,
  handleAuthSubmit,
  authErrors,
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
          {authMode === "signup" && (
            <>
              <label>Display Name</label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter display name"
              />
              <p className="helper-text">
                This name will be shown on your profile and can be changed later.
              </p>
              {authErrors.username && (
                <p className="error-text">{authErrors.username}</p>
              )}
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
            placeholder="Enter email"
          />
          {authErrors.email && <p className="error-text">{authErrors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Enter password"
          />
          {authErrors.password && <p className="error-text">{authErrors.password}</p>}

          {authMode === "signup" && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                value={tempConfirmPassword}
                onChange={(e) => setTempConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              {authErrors.confirmPassword && (
                <p className="error-text">{authErrors.confirmPassword}</p>
              )}
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