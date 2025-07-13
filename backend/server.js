const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

// Helper function to extract university from email domain
function extractUniversityFromDomain(domain) {
  const universityMapping = {
    'nus.edu.sg': 'National University of Singapore',
    'ntu.edu.sg': 'Nanyang Technological University',
    'smu.edu.sg': 'Singapore Management University',
    'sutd.edu.sg': 'Singapore University of Technology and Design',
    'singaporetech.edu.sg': 'Singapore Institute of Technology',
    'suss.edu.sg': 'Singapore University of Social Sciences',
    'uas.edu.sg': 'University of the Arts Singapore',
    'lasalle.edu.sg': 'LASALLE College of the Arts',
    'nafa.edu.sg': 'Nanyang Academy of Fine Arts'
  };
  
  return universityMapping[domain] || 'Unknown University';
}

// Helper function to validate Singapore university email
function isValidSingaporeUniversityEmail(email) {
  const validDomains = [
    'nus.edu.sg',
    'ntu.edu.sg', 
    'smu.edu.sg',
    'sutd.edu.sg',
    'singaporetech.edu.sg',
    'suss.edu.sg',
    'uas.edu.sg',
    'lasalle.edu.sg',
    'nafa.edu.sg'
  ];
  
  const domain = email.split('@')[1];
  return validDomains.some(validDomain => domain && domain.includes(validDomain));
}

// Get all names (keep your existing endpoint)
app.get('/api/names', (req, res) => {
  db.query('SELECT * FROM names', (err, results) => {
    res.json(results);
  });
});

// Add a name (keep your existing endpoint)
app.post('/api/names', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO names (name) VALUES (?)', [name], (err, result) => {
    res.json({ message: 'Added!' });
  });
});

// Updated User registration endpoint
app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { email, firstName, lastName, nationality, password } = req.body;
  
  // Validate all required fields
  if (!email || !firstName || !lastName || !nationality || !password) {
    return res.status(400).json({ 
      error: 'All fields are required: email, firstName, lastName, nationality, password' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate Singapore university email
  if (!isValidSingaporeUniversityEmail(email)) {
    return res.status(400).json({ 
      error: 'Please use a valid Singapore university email address' 
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long' 
    });
  }

  // Extract university from email domain
  const domain = email.split('@')[1];
  const university = extractUniversityFromDomain(domain);

  try {
    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user into database
        const insertQuery = `
          INSERT INTO users (firstName, lastName, email, password, nationality, university, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        
        db.query(insertQuery, [firstName, lastName, email, hashedPassword, nationality, university], (err, result) => {
          if (err) {
            console.log('Insert error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Failed to create user account' });
          }
          
          console.log('User created successfully!');
          res.status(201).json({ 
            message: 'User registered successfully!',
            userId: result.insertId,
            user: {
              id: result.insertId,
              firstName,
              lastName,
              email,
              nationality,
              university
            }
          });
        });
        
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return res.status(500).json({ error: 'Registration failed' });
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Basic login endpoint (you'll need to update this later)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // For now, just return success - you'll implement proper login later
  res.json({ message: 'Login endpoint - implementation needed' });
});

app.listen(5000, () => console.log('Server running on port 5000'));