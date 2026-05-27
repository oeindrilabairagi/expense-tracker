require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "temporary_secret_key";

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "expense_tracker_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

function logActivity(userId, actionType, description) {
  const sql = `
    INSERT INTO user_activity (user_id, action_type, description)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [userId, actionType, description], (err) => {
    if (err) {
      console.error("Activity log error:", err);
    }
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }

  next();
}

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [username, email, hashedPassword, "user"], (err, result) => {
      if (err) {
        console.error("Register error:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already exists." });
        }

        return res.status(500).json({ error: "Failed to register user." });
      }

      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const sql = `
    SELECT id, username, email, password_hash, role
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    logActivity(user.id, "LOGIN", `${user.username} logged in.`);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
});

app.post("/logout", (req, res) => {
  const { userId, username } = req.body;

  if (userId && username) {
    logActivity(userId, "LOGOUT", `${username} logged out.`);
  }

  res.json({ message: "Logout successful." });
});

app.post("/expenses", authenticateToken, (req, res) => {
  const { title, category, amount, date, description, user_id } = req.body;

  const sql = `
    INSERT INTO expenses (title, category, amount, expense_date, description, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, category, amount, date, description, req.user.id], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Failed to save expense." });
    }

    logActivity(
      req.user.id,
      "CREATE_EXPENSE",
      `${req.user.username} created expense: ${title}`
    );

    res.status(201).json({
      message: "Expense added successfully.",
      id: result.insertId,
    });
  });
});

app.get("/expenses", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, title, category, amount, expense_date, description, created_at
    FROM expenses
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch expenses." });
    }

    res.json(results);
  });
});

app.put("/expenses/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, category, amount, date, description } = req.body;

  const selectSql = "SELECT * FROM expenses WHERE id = ? AND user_id = ?";

  db.query(selectSql, [id, req.user.id], (selectErr, oldResults) => {
    if (selectErr) {
      console.error("Select old expense error:", selectErr);
      return res.status(500).json({ error: "Failed to find expense." });
    }

    if (oldResults.length === 0) {
      return res.status(404).json({ error: "Expense not found." });
    }

    const oldExpense = oldResults[0];

    const sql = `
      UPDATE expenses
      SET title = ?, category = ?, amount = ?, expense_date = ?, description = ?
      WHERE id = ? AND user_id = ?
    `;

    db.query(
      sql,
      [title, category, amount, date, description, id, req.user.id],
      (err, result) => {
        if (err) {
          console.error("Update error:", err);
          return res.status(500).json({ error: "Failed to update expense." });
        }

        const changes = [];

        if (oldExpense.title !== title) changes.push("title");
        if (oldExpense.category !== category) changes.push("category");
        if (Number(oldExpense.amount) !== Number(amount)) changes.push("amount");
        if (oldExpense.description !== description) changes.push("description");

        logActivity(
          req.user.id,
          "UPDATE_EXPENSE",
          `${req.user.username} updated expense: ${title}. Changed: ${
            changes.length ? changes.join(", ") : "no major fields"
          }`
        );

        res.json({ message: "Expense updated successfully." });
      }
    );
  });
});

app.delete("/expenses/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT * FROM expenses WHERE id = ? AND user_id = ?";

  db.query(selectSql, [id, req.user.id], (selectErr, results) => {
    if (selectErr) {
      console.error("Select delete expense error:", selectErr);
      return res.status(500).json({ error: "Failed to find expense." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Expense not found." });
    }

    const deletedExpense = results[0];

    const deleteSql = "DELETE FROM expenses WHERE id = ? AND user_id = ?";

    db.query(deleteSql, [id, req.user.id], (err, result) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ error: "Failed to delete expense." });
      }

      logActivity(
        req.user.id,
        "DELETE_EXPENSE",
        `${req.user.username} deleted expense: ${deletedExpense.title}`
      );

      res.json({ message: "Expense deleted successfully." });
    });
  });
});

app.get("/admin/users", authenticateToken, authorizeAdmin, (req, res) => {
  const sql = `
    SELECT id, username, email, role, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch users error:", err);
      return res.status(500).json({ error: "Failed to fetch users." });
    }

    res.json(results);
  });
});

app.get("/admin/activity", authenticateToken, authorizeAdmin, (req, res) => {
  const sql = `
    SELECT 
      user_activity.id,
      user_activity.user_id,
      users.username,
      users.email,
      user_activity.action_type,
      user_activity.description,
      user_activity.created_at
    FROM user_activity
    LEFT JOIN users ON user_activity.user_id = users.id
    ORDER BY user_activity.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch activity error:", err);
      return res.status(500).json({ error: "Failed to fetch activity logs." });
    }

    res.json(results);
  });
});

app.delete("/admin/users/:id", authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  if (Number(id) === Number(req.user.id)) {
    return res.status(400).json({ error: "You cannot delete your own admin account." });
  }

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete user error:", err);
      return res.status(500).json({ error: "Failed to delete user." });
    }

    res.json({ message: "User deleted successfully." });
  });
});

app.get("/profile", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, username, email, role, created_at
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("Profile fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch profile." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(results[0]);
  });
});

app.put("/profile", authenticateToken, (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      error: "Display name and email are required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({
      error: "Display name must be at least 3 characters.",
    });
  }

  const sql = `
    UPDATE users
    SET username = ?, email = ?
    WHERE id = ?
  `;

  db.query(sql, [username, email, req.user.id], (err) => {
    if (err) {
      console.error("Profile update error:", err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already exists." });
      }

      return res.status(500).json({ error: "Failed to update profile." });
    }

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: req.user.id,
        username,
        email,
        role: req.user.role,
      },
    });
  });
});

app.put("/profile/password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Current password and new password are required.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: "New password must be at least 6 characters.",
    });
  }

  const selectSql = `
    SELECT password_hash
    FROM users
    WHERE id = ?
  `;

  db.query(selectSql, [req.user.id], async (err, results) => {
    if (err) {
      console.error("Password fetch error:", err);
      return res.status(500).json({ error: "Failed to verify password." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      results[0].password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updateSql = `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
    `;

    db.query(updateSql, [newHashedPassword, req.user.id], (updateErr) => {
      if (updateErr) {
        console.error("Password update error:", updateErr);
        return res.status(500).json({ error: "Failed to update password." });
      }

      res.json({ message: "Password updated successfully." });
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});