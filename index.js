const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./auth');
const authenticateJWT = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());

// Authentication routes
app.use('/auth', authRoutes);

// POST /transactions: Adds a new transaction (income or expense)
app.post('/transactions', authenticateJWT, (req, res) => {
    const transactions = Array.isArray(req.body) ? req.body : [req.body]; // If not array, wrap it in an array
  
    const insertTransaction = (transaction) => {
      return new Promise((resolve, reject) => {
        const { type, category, amount, date, description } = transaction;
        const userId = req.user.id;
  
        const query = `INSERT INTO transactions (type, category, amount, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [type, category, amount, date, description, userId];
  
        db.run(query, values, function (err) {
          if (err) {
            return reject(err);
          }
          resolve({ transactionId: this.lastID });
        });
      });
    };
  
    const promises = transactions.map(insertTransaction);
  
    Promise.all(promises)
      .then((results) => {
        res.status(201).json({ message: 'Transaction(s) added successfully', results });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  

// GET /transactions: Retrieves all transactions with pagination
app.get('/transactions', authenticateJWT, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `SELECT * FROM transactions WHERE userId = ? LIMIT ? OFFSET ?`;
  db.all(query, [req.user.id, limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const countQuery = `SELECT COUNT(*) as total FROM transactions WHERE userId = ?`;
    db.get(countQuery, [req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const total = result.total;
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        page,
        totalPages,
        limit,
        totalTransactions: total,
        transactions: rows,
      });
    });
  });
});

// GET /transactions/:id: Retrieves a transaction by ID
app.get('/transactions/:id', authenticateJWT, (req, res) => {
  const query = `SELECT * FROM transactions WHERE id = ? AND userId = ?`;
  db.get(query, [req.params.id, req.user.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(row);
  });
});

// PUT /transactions/:id: Updates a transaction by ID
app.put('/transactions/:id', authenticateJWT, (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ? AND userId = ?`;
  db.run(query, [type, category, amount, date, description, req.params.id, req.user.id], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found or no changes made' });
    }
    res.status(200).json({ message: 'Transaction updated successfully' });
  });
});

// DELETE /transactions/:id: Deletes a transaction by ID
app.delete('/transactions/:id', authenticateJWT, (req, res) => {
  const query = `DELETE FROM transactions WHERE id = ? AND userId = ?`;
  db.run(query, [req.params.id, req.user.id], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
});

// Delete all transactions
app.delete('/transactions', authenticateJWT, (req, res) => {
    const userId = req.user.id;
  
    const query = `DELETE FROM transactions WHERE userId = ?`;
  
    db.run(query, [userId], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.status(200).json({ message: `${this.changes} transactions deleted successfully.` });
    });
  });
  

// GET /summary: Retrieves a summary of transactions
app.get('/summary', authenticateJWT, (req, res) => {
  const { startDate, endDate, category, timePeriod } = req.query;
  let query = `SELECT type, SUM(amount) as total FROM transactions WHERE userId = ?`;
  const params = [req.user.id];

  if (startDate && endDate) {
    query += ` AND date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (timePeriod === 'monthly') {
    query += ` GROUP BY strftime('%Y-%m', date), type`;
  } else if (timePeriod === 'yearly') {
    query += ` GROUP BY strftime('%Y', date), type`;
  } else {
    query += ` GROUP BY type`;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
