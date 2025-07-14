// Backend API endpoints (Express.js example)
// You'll need to adapt this to your backend framework

const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Database connection setup
const dbConfig = {
  host: 'your-host',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database'
};

// Search universities by name
router.get('/api/universities/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM universities WHERE LOWER(name) = LOWER(?)',
      [name.trim()]
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error searching universities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get universities by country
router.get('/api/universities/by-country', async (req, res) => {
  try {
    const { country } = req.query;
    
    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required' });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM universities WHERE LOWER(country) = LOWER(?) ORDER BY name',
      [country.trim()]
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search countries by name
router.get('/api/countries/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
      [name.trim()]
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error searching countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get university by ID (for the university profile page)
router.get('/api/universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM universities WHERE id = ?',
      [id]
    );
    
    await connection.end();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;