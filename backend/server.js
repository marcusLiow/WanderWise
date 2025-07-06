const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wanderwise'
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Connected to database!');
  }
});

// Get all names
app.get('/api/names', (req, res) => {
  db.query('SELECT * FROM names', (err, results) => {
    res.json(results);
  });
});

// Add a name
app.post('/api/names', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO names (name) VALUES (?)', [name], (err, result) => {
    res.json({ message: 'Added!' });
  });
});

// User registration
app.post('/api/register', (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
      if (err) {
        console.log('Insert error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log('User created successfully!');
      res.json({ message: 'User created successfully!' });
    });
  });
});

app.listen(5000, () => console.log('Server running'));