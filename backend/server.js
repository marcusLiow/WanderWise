const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload size limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
  const universityMapping = [
    { pattern: 'nus.edu.sg', name: 'National University of Singapore' },
    { pattern: 'ntu.edu.sg', name: 'Nanyang Technological University' },
    { pattern: 'smu.edu.sg', name: 'Singapore Management University' },
    { pattern: 'sutd.edu.sg', name: 'Singapore University of Technology and Design' },
    { pattern: 'singaporetech.edu.sg', name: 'Singapore Institute of Technology' },
    { pattern: 'suss.edu.sg', name: 'Singapore University of Social Sciences' },
    { pattern: 'uas.edu.sg', name: 'University of the Arts Singapore' },
    { pattern: 'lasalle.edu.sg', name: 'LASALLE College of the Arts' },
    { pattern: 'nafa.edu.sg', name: 'Nanyang Academy of Fine Arts' }
  ];
  
  // Check if domain contains any of the university patterns
  for (const university of universityMapping) {
    if (domain.includes(university.pattern)) {
      return university.name;
    }
  }
  
  return 'Unknown University';
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


// COMPLETE REPLACEMENT for your login endpoint in backend/server.js
// This ensures ALL user data is returned from the database

app.post('/api/login', async (req, res) => {
  console.log('Login request received:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // SELECT ALL COLUMNS from users table - this is key!
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // No user found with that email
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = results[0];
    console.log('Found user in database:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      nationality: user.nationality,
      university: user.university,
      hasProfileImage: !!user.profileImage
    });
    
    try {
      // Compare the plain text password with the hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Password mismatch for:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Login successful - RETURN ALL USER DATA FROM DATABASE
      console.log('Login successful for:', email);

      const responseData = { 
        message: 'Login successful',
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.firstName + ' ' + user.lastName,
        nationality: user.nationality,
        dateOfBirth: user.dateOfBirth,          // ← ADD THIS LINE
        university: user.university,
        profileImage: user.profileImage
      };

      console.log('Sending login response:', {
        ...responseData,
        profileImage: responseData.profileImage ? 'INCLUDED' : 'NULL'
      });

      res.status(200).json(responseData);
      
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return res.status(500).json({ error: 'Login error' });
    }
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
// Update your registration endpoint in backend/server.js to include dateOfBirth

app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { email, firstName, lastName, nationality, dateOfBirth, password } = req.body;
  
  // Validate all required fields (dateOfBirth is optional)
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
        
        // Insert new user into database (including dateOfBirth)
        const insertQuery = `
          INSERT INTO users (firstName, lastName, email, password, nationality, dateOfBirth, university, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        db.query(insertQuery, [firstName, lastName, email, hashedPassword, nationality, dateOfBirth, university], (err, result) => {
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
              dateOfBirth,
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

// Update your profile endpoint in backend/server.js to include dateOfBirth

app.put('/api/profile', async (req, res) => {
  console.log('Profile update request received:', req.body);
  
  const { userId, firstName, lastName, nationality, dateOfBirth, profileImage } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  
  try {
    // Check if user exists
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const currentUser = results[0];
      
      // Update user profile (including dateOfBirth)
      const updateQuery = `
        UPDATE users 
        SET firstName = ?, lastName = ?, nationality = ?, dateOfBirth = ?, profileImage = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(updateQuery, [firstName, lastName, nationality, dateOfBirth, profileImage, userId], (err, result) => {
        if (err) {
          console.log('Update error:', err);
          return res.status(500).json({ error: 'Failed to update profile' });
        }
        
        // Return updated user data
        db.query('SELECT * FROM users WHERE id = ?', [userId], (err, updatedResults) => {
          if (err) {
            console.log('Fetch updated user error:', err);
            return res.status(500).json({ error: 'Profile updated but failed to fetch updated data' });
          }
          
          const updatedUser = updatedResults[0];
          
          console.log('Profile updated successfully for user:', userId);
          res.status(200).json({
            message: 'Profile updated successfully',
            user: {
              id: updatedUser.id,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              nationality: updatedUser.nationality,
              dateOfBirth: updatedUser.dateOfBirth,
              university: updatedUser.university,
              profileImage: updatedUser.profileImage
            }
          });
        });
      });
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));