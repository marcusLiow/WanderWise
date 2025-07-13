// API Endpoints for University Profile Data
// Add these to your Express.js routes

// 1. Get university details
app.get('/api/universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        u.id,
        u.name,
        u.description,
        u.logo,
        u.country,
        u.flag,
        u.rating,
        u.created_at,
        u.updated_at
      FROM universities u
      WHERE u.id = ?
    `;
    
    const [university] = await db.execute(query, [id]);
    
    if (university.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json(university[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get reviews for a university
app.get('/api/universities/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        or.id,
        or.review_id,
        or.overall_educational_experience,
        u.name as user_name,
        u.avatar as user_avatar,
        u.country as user_country,
        u.country_flag as user_country_flag,
        u.university as user_university,
        AVG(sr.rating) as average_rating,
        or.created_at
      FROM overall_reviews or
      JOIN users u ON or.user_id = u.id
      LEFT JOIN specific_reviews sr ON or.id = sr.overall_review_id
      WHERE or.exchange_university_id = ?
      GROUP BY or.id
      ORDER BY or.created_at DESC
      LIMIT 10
    `;
    
    const [reviews] = await db.execute(query, [id]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get average expenses for a university
app.get('/api/universities/:id/average-expenses', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        AVG(re.food_cost_sgd) as food_cost_sgd,
        AVG(re.shopping_cost_sgd) as shopping_cost_sgd,
        AVG(re.travel_cost_sgd) as travel_cost_sgd,
        AVG(re.rental_cost_sgd) as rental_cost_sgd,
        AVG(re.miscellaneous_cost_sgd) as miscellaneous_cost_sgd,
        MAX(GREATEST(
          AVG(re.food_cost_sgd), 
          AVG(re.shopping_cost_sgd), 
          AVG(re.travel_cost_sgd), 
          AVG(re.rental_cost_sgd), 
          AVG(re.miscellaneous_cost_sgd)
        )) as max_expense
      FROM review_expenses re
      JOIN overall_reviews or ON re.overall_review_id = or.id
      WHERE or.exchange_university_id = ?
      GROUP BY or.exchange_university_id
    `;
    
    const [expenses] = await db.execute(query, [id]);
    
    if (expenses.length === 0) {
      return res.json({
        food_cost_sgd: 0,
        shopping_cost_sgd: 0,
        travel_cost_sgd: 0,
        rental_cost_sgd: 0,
        miscellaneous_cost_sgd: 0,
        max_expense: 0
      });
    }
    
    res.json(expenses[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get photo highlights for a university
app.get('/api/universities/:id/photos', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        ph.id,
        ph.photo_url,
        ph.created_at
      FROM photo_highlights ph
      WHERE ph.university_id = ?
      ORDER BY ph.created_at DESC
      LIMIT 8
    `;
    
    const [photos] = await db.execute(query, [id]);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get top countries students from this university travel to
app.get('/api/universities/:id/top-travel-countries', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        c.id,
        c.name,
        c.flag,
        COUNT(t.id) as visit_count
      FROM travels t
      JOIN countries c ON t.country_id = c.id
      JOIN users u ON t.user_id = u.id
      WHERE u.university_id = ?
      GROUP BY c.id, c.name, c.flag
      ORDER BY visit_count DESC
      LIMIT 10
    `;
    
    const [countries] = await db.execute(query, [id]);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Alternative endpoint for expenses using legacy table (if needed)
app.get('/api/universities/:id/legacy-expenses', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        AVG(e.rent) as rental_cost_sgd,
        AVG(e.food) as food_cost_sgd,
        AVG(e.transport) as travel_cost_sgd,
        MAX(GREATEST(AVG(e.rent), AVG(e.food), AVG(e.transport))) as max_expense
      FROM expenses e
      WHERE e.university_id = ?
      GROUP BY e.university_id
    `;
    
    const [expenses] = await db.execute(query, [id]);
    
    if (expenses.length === 0) {
      return res.json({
        rental_cost_sgd: 0,
        food_cost_sgd: 0,
        travel_cost_sgd: 0,
        max_expense: 0
      });
    }
    
    res.json(expenses[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Get university statistics
app.get('/api/universities/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        COUNT(DISTINCT or.id) as total_reviews,
        AVG(sr.rating) as average_rating,
        COUNT(DISTINCT ph.id) as total_photos,
        COUNT(DISTINCT u.id) as total_students
      FROM universities univ
      LEFT JOIN overall_reviews or ON univ.id = or.exchange_university_id
      LEFT JOIN specific_reviews sr ON or.id = sr.overall_review_id
      LEFT JOIN photo_highlights ph ON univ.id = ph.university_id
      LEFT JOIN users u ON univ.id = u.university_id
      WHERE univ.id = ?
      GROUP BY univ.id
    `;
    
    const [stats] = await db.execute(query, [id]);
    res.json(stats[0] || { total_reviews: 0, average_rating: 0, total_photos: 0, total_students: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});