const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

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

app.post("/expenses", (req, res) => {
  const { title, category, amount, date, description } = req.body;

  const sql = `
    INSERT INTO expenses (title, category, amount, expense_date, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, category, amount, date, description], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Failed to save expense." });
    }

    res.status(201).json({
      message: "Expense added successfully.",
      id: result.insertId,
    });
  });
});

app.get("/expenses", (req, res) => {
  const sql = `
    SELECT id, title, category, amount, expense_date, description, created_at
    FROM expenses
    ORDER BY created_at DESC, id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch expenses." });
    }

    res.json(results);
  });
});

app.put("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { title, category, amount, date, description } = req.body;

  const sql = `
    UPDATE expenses
    SET title = ?, category = ?, amount = ?, expense_date = ?, description = ?
    WHERE id = ?
  `;

  db.query(sql, [title, category, amount, date, description, id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update expense." });
    }

    res.json({ message: "Expense updated successfully." });
  });
});

app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM expenses WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete expense." });
    }

    res.json({ message: "Expense deleted successfully." });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});