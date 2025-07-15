const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Check if Supabase is installed
let supabase;
try {
  const { createClient } = require('@supabase/supabase-js');
  
  // Supabase connection (Updated with your credentials)
  const supabaseUrl = 'https://jjcobexdfpcrbswgkcas.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY29iZXhkZnBjcmJzd2drY2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjYyNjAsImV4cCI6MjA2ODE0MjI2MH0.IPUMt-oAFZ_jQP5NMh51P6EI2vU-V8Y_lx1Yz5788rU';
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client created successfully');
} catch (error) {
  console.log('❌ Failed to load Supabase:', error.message);
  console.log('📦 Run: npm install @supabase/supabase-js');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MySQL connection (keep for universities/search for now)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wanderwise'
});

// Test connections
db.connect((err) => {
  if (err) {
    console.log('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL (for universities)!');
  }
});

async function testSupabase() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('❌ Supabase test failed:', error);
      console.log('💡 Make sure you created the users table in Supabase dashboard');
    } else {
      console.log('✅ Connected to Supabase (for users)!');
    }
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
  }
}
testSupabase();

// Helper functions (keep existing)
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
  
  for (const university of universityMapping) {
    if (domain.includes(university.pattern)) {
      return university.name;
    }
  }
  return 'Unknown University';
}

function isValidSingaporeUniversityEmail(email) {
  const validDomains = [
    'nus.edu.sg', 'ntu.edu.sg', 'smu.edu.sg', 'sutd.edu.sg',
    'singaporetech.edu.sg', 'suss.edu.sg', 'uas.edu.sg',
    'lasalle.edu.sg', 'nafa.edu.sg'
  ];
  
  const domain = email.split('@')[1];
  return validDomains.some(validDomain => domain && domain.includes(validDomain));
}

// ===========================================
// USER ENDPOINTS (Now using Supabase)
// ===========================================

// REGISTER - Now using Supabase with detailed logging
app.post('/api/register', async (req, res) => {
  console.log('\n🚀 Registration request received:', req.body);
  
  const { email, firstName, lastName, nationality, dateOfBirth, password } = req.body;
  
  // Step 1: Validate required fields
  if (!email || !firstName || !lastName || !nationality || !password) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ 
      error: 'All fields are required: email, firstName, lastName, nationality, password' 
    });
  }
  console.log('✅ All required fields present');

  // Step 2: Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Invalid email format:', email);
    return res.status(400).json({ error: 'Invalid email format' });
  }
  console.log('✅ Email format valid');

  // Step 3: Validate Singapore university email
  if (!isValidSingaporeUniversityEmail(email)) {
    console.log('❌ Not a Singapore university email:', email);
    return res.status(400).json({ 
      error: 'Please use a valid Singapore university email address' 
    });
  }
  console.log('✅ Singapore university email valid');

  // Step 4: Validate password
  if (password.length < 8) {
    console.log('❌ Password too short');
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long' 
    });
  }
  console.log('✅ Password length valid');

  const domain = email.split('@')[1];
  const university = extractUniversityFromDomain(domain);
  console.log('🏫 Extracted university:', university);

  try {
    // Step 5: Check if user already exists in Supabase
    console.log('🔍 Checking if user exists in Supabase...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (checkError) {
      console.log('❌ Supabase check error:', checkError);
      return res.status(500).json({ error: 'Database error during user check: ' + checkError.message });
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('❌ User already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    console.log('✅ User does not exist, proceeding with registration');
    
    // Step 6: Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed successfully');
    
    // Step 7: Insert new user into Supabase
    console.log('💾 Inserting user into Supabase...');
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      nationality,
      dateOfBirth,
      university
    };
    console.log('📝 User data to insert:', { ...userData, password: '[HASHED]' });

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Supabase insert error:', insertError);
      if (insertError.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to create user account: ' + insertError.message });
    }
    
    console.log('✅ User created successfully in Supabase!');
    console.log('👤 New user ID:', newUser.id);
    
    res.status(201).json({ 
      message: 'User registered successfully!',
      userId: newUser.id,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        nationality: newUser.nationality,
        dateOfBirth: newUser.dateOfBirth,
        university: newUser.university
      }
    });
    
  } catch (error) {
    console.log('❌ Unexpected registration error:', error);
    console.log('📋 Error stack:', error.stack);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// LOGIN - Now using Supabase with detailed logging
app.post('/api/login', async (req, res) => {
  console.log('\n🔐 Login request received for:', req.body.email);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    // Get user from Supabase
    console.log('🔍 Looking up user in Supabase...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.log('❌ Supabase error:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
    
    if (!users || users.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    console.log('✅ Found user:', user.email);
    
    // Compare password
    console.log('🔐 Comparing password...');
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('✅ Login successful');

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

    res.status(200).json(responseData);
    
  } catch (error) {
    console.log('❌ Login error:', error);
    return res.status(500).json({ error: 'Login error: ' + error.message });
  }
});

// PROFILE UPDATE - Now using Supabase
app.put('/api/profile', async (req, res) => {
  console.log('\n✏️ Profile update request received for user:', req.body.userId);
  
  const { userId, firstName, lastName, nationality, dateOfBirth, profileImage } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  
  try {
    // Check if user exists in Supabase
    console.log('🔍 Checking if user exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        console.log('❌ User not found');
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('❌ Supabase check error:', checkError);
      return res.status(500).json({ error: 'Database error: ' + checkError.message });
    }
    
    console.log('✅ User found, updating profile...');
    
    // Update user profile in Supabase
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        firstName,
        lastName,
        nationality,
        dateOfBirth,
        profileImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.log('❌ Supabase update error:', updateError);
      return res.status(500).json({ error: 'Failed to update profile: ' + updateError.message });
    }
    
    console.log('✅ Profile updated successfully');
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
    
  } catch (error) {
    console.log('❌ Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed: ' + error.message });
  }
});

// ===========================================
// EXISTING ENDPOINTS (Still using MySQL)
// ===========================================

app.get('/api/names', (req, res) => {
  db.query('SELECT * FROM names', (err, results) => {
    res.json(results);
  });
});

app.post('/api/names', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO names (name) VALUES (?)', [name], (err, result) => {
    res.json({ message: 'Added!' });
  });
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim() === '') {
    return res.status(400).json({ 
      error: 'Search query is required',
      universities: []
    });
  }
  
  const searchTerm = `%${q.trim()}%`;
  
  const searchQuery = `
    SELECT id, name, description, country, rating, logo, flag, created_at
    FROM universities 
    WHERE name LIKE ? 
       OR country LIKE ? 
       OR description LIKE ?
    ORDER BY 
      CASE 
        WHEN name LIKE ? THEN 1
        WHEN country LIKE ? THEN 2
        ELSE 3
      END,
      rating DESC,
      name ASC
    LIMIT 50
  `;
  
  db.query(
    searchQuery, 
    [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], 
    (err, results) => {
      if (err) {
        console.error('Database search error:', err);
        return res.status(500).json({ 
          error: 'Database error occurred during search',
          universities: []
        });
      }
      
      res.json({
        success: true,
        query: q,
        count: results.length,
        universities: results
      });
    }
  );
});

app.listen(5000, () => {
  console.log('\n🚀 Server running on port 5000');
  console.log('📊 Using Supabase for: Users, Authentication, Profiles');
  console.log('🗄️  Using MySQL for: Universities, Search');
  console.log('🔗 Ready to accept connections...\n');
});