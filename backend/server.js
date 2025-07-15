// Enhanced country search route with better debugging
app.get('/api/countries/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  const searchTerm = name.trim();
  console.log('=== COUNTRY SEARCH DEBUG ===');
  console.log('Original search term:', name);
  console.log('Trimmed search term:', searchTerm);
  console.log('Search term length:', searchTerm.length);

  // First, let's see all countries in the database
  db.query('SELECT * FROM countries', (err, allResults) => {
    if (err) {
      console.error('Error fetching all countries:', err);
    } else {
      console.log('All countries in database:');
      allResults.forEach(country => {
        console.log(`- ID: ${country.id}, Name: "${country.name}" (length: ${country.name.length})`);
      });
    }
  });

  // Now do the actual search
  db.query(
    'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
    [searchTerm],
    (err, results) => {
      if (err) {
        console.error('Error searching countries:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      console.log('Search results count:', results.length);
      if (results.length > 0) {
        console.log('Found countries:', results);
      } else {
        console.log('No exact match found, trying partial match...');
        
        // Try a partial match as fallback
        db.query(
          'SELECT * FROM countries WHERE LOWER(name) LIKE LOWER(?)',
          [`%${searchTerm}%`],
          (err, partialResults) => {
            if (err) {
              console.error('Error in partial search:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            
            console.log('Partial search results:', partialResults);
            if (partialResults.length > 0) {
              console.log('Found partial matches, returning first one');
              return res.json([partialResults[0]]);
            } else {
              console.log('No partial matches found either');
              return res.json([]);
            }
          }
        );
        return; // Don't continue to the normal response
      }
      
      console.log('=== END DEBUG ===');
      res.json(results);
    }
  );
});

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

// ==================== EXISTING ROUTES ====================

// Get all names (keep your existing endpoint)
app.get('/api/names', (req, res) => {
  db.query('SELECT * FROM names', (err, results) => {
    res.json(results);
  });
});

// Login endpoint
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
        dateOfBirth: user.dateOfBirth,
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

// User registration endpoint
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

// Profile update endpoint
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

// ==================== MISSING ROUTES - ADD THESE ====================

// Search universities by name
app.get('/api/universities/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  db.query(
    'SELECT * FROM universities WHERE LOWER(name) LIKE LOWER(?)',
    [`%${name.trim()}%`],
    (err, results) => {
      if (err) {
        console.error('Error searching universities:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json(results);
    }
  );
});

// Get universities by country - THIS IS THE MISSING ROUTE!
app.get('/api/universities/by-country', (req, res) => {
  const { country } = req.query;
  
  if (!country) {
    return res.status(400).json({ error: 'Country parameter is required' });
  }

  console.log('Searching for universities in country:', country);

  db.query(
    'SELECT * FROM universities WHERE LOWER(country) = LOWER(?) ORDER BY name',
    [country.trim()],
    (err, results) => {
      if (err) {
        console.error('Error fetching universities by country:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      console.log('Found universities:', results.length);
      res.json(results);
    }
  );
});

// Search countries by name - THIS IS THE OTHER MISSING ROUTE!
app.get('/api/countries/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  console.log('Searching for country:', name);

  db.query(
    'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
    [name.trim()],
    (err, results) => {
      if (err) {
        console.error('Error searching countries:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      console.log('Found countries:', results.length);
      res.json(results);
    }
  );
});

// Get university by ID (for the university profile page)
app.get('/api/universities/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT * FROM universities WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error fetching university:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'University not found' });
      }
      
      res.json(results[0]);
    }
  );
});

app.listen(5000, () => console.log('Server running on port 5000'));