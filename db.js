const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // You can change this to use a file-based database

// Create tables for users, transactions, and categories
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      category TEXT,
      amount REAL,
      date TEXT,
      description TEXT,
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT
    )
  `);
});

module.exports = db;
