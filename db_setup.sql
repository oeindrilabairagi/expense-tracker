CREATE DATABASE IF NOT EXISTS expense_tracker_db;
USE expense_tracker_db;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT
);

ALTER TABLE expenses
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- INSERT INTO expenses (title, category, amount, expense_date, description)
-- VALUES
-- ('Dinner', 'Food', 120.00, '2026-04-06', 'Dinner with friend'),
-- ('Uber', 'Transport', 25.50, '2026-04-05', 'Ride home'),
-- ('Groceries', 'Food', 80.00, '2026-04-04', 'Weekly groceries');

select * from expenses;