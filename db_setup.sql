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

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action_type VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

ALTER TABLE expenses
ADD COLUMN user_id INT NULL;

ALTER TABLE expenses
ADD CONSTRAINT fk_expenses_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

UPDATE users
SET role = 'admin'
WHERE email = 'admin@test.com';

-- INSERT INTO expenses (title, category, amount, expense_date, description)
-- VALUES
-- ('Dinner', 'Food', 120.00, '2026-04-06', 'Dinner with friend'),
-- ('Uber', 'Transport', 25.50, '2026-04-05', 'Ride home'),
-- ('Groceries', 'Food', 80.00, '2026-04-04', 'Weekly groceries');

select * from expenses;
select * from users;
select * from user_activity;