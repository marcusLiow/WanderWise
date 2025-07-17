import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './UniversityProfile.css';

// Supabase clients
const universitiesClient = createClient(
  'https://aojighzqmzouwhxyndbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ'
);

const reviewsClient = createClient(
  'https://aojighzqmzouwhxyndbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ'
);

const UniversityProfile = () => {
  const { universitySlug } = useParams();
  const location = useLocation();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredExpense, setHoveredExpense] = useState(null);

  const universityId = location.state?.universityId;

  const slugToName = (slug) => {
    if (!slug) return "IE University";
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const mockUniversity = {
    id: '1',
    name: universitySlug ? slugToName(universitySlug) : "IE University",
    description: "IE University is a private university with innovative programs. Known for its entrepreneurship focus and international perspective.",
    country: "Spain",
    flag: "https://flagcdn.com/w40/es.png",
    rating: 4.4,
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center"
  };

  useEffect(() => {
    fetchUniversityData();
  }, [universitySlug, universityId]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 800));

      let universityData;
      
      if (universityId) {
        try {
          const { data: uniData, error: uniError } = await universitiesClient
            .from('universities')
            .select('*')
            .eq('id', universityId)
            .single();
          
          if (uniError) {
            console.warn('University not found by ID, trying by name');
            universityData = null;
          } else {
            universityData = uniData;
          }
        } catch (err) {
          console.warn('Supabase connection failed, using mock data');
          universityData = null;
        }
      }
      
      if (!universityData && universitySlug) {
        try {
          const searchName = slugToName(universitySlug);
          const { data: uniData, error: uniError } = await universitiesClient
            .from('universities')
            .select('*')
            .ilike('name', `%${searchName}%`)
            .single();
          
          if (uniError) {
            console.warn('University not found by name, using mock data');
            universityData = { ...mockUniversity, name: searchName };
          } else {
            universityData = uniData;
          }
        } catch (err) {
          console.warn('Supabase connection failed, using mock data');
          universityData = { ...mockUniversity, name: slugToName(universitySlug) };
        }
      }
      
      if (!universityData) {
        universityData = mockUniversity;
      }

      // Fetch REAL reviews from Supabase - no more mock data
      try {
        const { data: reviewsData, error: reviewsError } = await reviewsClient
          .from('reviews')
          .select('*')
          .eq('university', universityData.name)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsError) {
          console.warn('Error fetching reviews:', reviewsError);
          setReviews([]); // Set empty array instead of mock data
        } else {
          setReviews(reviewsData || []); // Use real data or empty array
        }
      } catch (err) {
        console.warn('Reviews fetch failed:', err);
        setReviews([]); // Set empty array instead of mock data
      }

      setUniversity(universityData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setUniversity(mockUniversity);
      setReviews([]); // Set empty array instead of mock data
    } finally {
      setLoading(false);
    }
  };

  const getAverageExpenses = () => {
    if (reviews.length === 0) return { rental: 0, food: 0, transport: 0 };
    
    const totals = reviews.reduce((acc, review) => {
      acc.rental += review.expense_rental || 0;
      acc.food += review.expense_food || 0;
      acc.transport += review.expense_public_transport || 0;
      return acc;
    }, { rental: 0, food: 0, transport: 0 });

    const count = reviews.length;
    return {
      rental: totals.rental / count,
      food: totals.food / count,
      transport: totals.transport / count
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getProfileImage = (email) => {
    const seed = email ? email.split('@')[0] : Math.random().toString();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const getUniversityName = (email) => {
    if (!email) return 'Unknown University';
    const domain = email.split('@')[1];
    if (domain === 'stanford.edu') return 'Stanford University, USA';
    if (domain === 'mit.edu') return 'MIT, USA';
    if (domain === 'harvard.edu') return 'Harvard University, USA';
    if (domain === 'columbia.edu') return 'Columbia University, USA';
    if (domain === 'berkeley.edu') return 'UC Berkeley, USA';
    return domain;
  };

  const getUserName = (email) => {
    if (!email) return 'Anonymous';
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading university data...</div>
      </div>
    );
  }

  if (error && !university) {
    return (
      <div className="error">
        <p>Error loading university data: {error}</p>
        <button onClick={fetchUniversityData}>Retry</button>
      </div>
    );
  }

  const averageExpenses = getAverageExpenses();
  const maxExpense = Math.max(averageExpenses.rental, averageExpenses.food, averageExpenses.transport);

  return (
    <div className="university-profile">
      <div className="main-content">
        <div className="left-section">
          {/* University Header */}
          <div className="university-header">
            <div className="university-logo">
              <img src={university.logo || mockUniversity.logo} alt={`${university.name} Logo`} />
            </div>
            <div className="university-info">
              <h1>{university.name}</h1>
              <div className="country-info">
                <img src={university.flag} alt={`${university.country} Flag`} className="country-flag" />
                <span>{university.country}</span>
              </div>
              <div className="rating">
                {renderStars(Math.round(university.rating))}
                <span className="rating-number">{university.rating}/5</span>
              </div>
              <p className="description">{university.description}</p>
            </div>
          </div>

          {/* Featured Reviews */}
          <div className="featured-reviews">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews available yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div>
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <img src={getProfileImage(review.user_email)} alt="Reviewer Avatar" />
                        </div>
                        <div className="reviewer-details">
                          <h4>{getUserName(review.user_email)}, {review.course_studied}</h4>
                          <div className="reviewer-location">
                            <span>{getUniversityName(review.user_email)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="review-content">
                      <p>{review.review_text}</p>
                      <div className="review-rating">
                        {renderStars(review.overall_rating || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          {/* Average Expenses */}
          <div className="expenses-section">
            <h3>Average Expenses</h3>
            {reviews.length === 0 ? (
              <div className="no-expense-data">
                <p>No expense data available yet.</p>
              </div>
            ) : (
              <div className="expenses-chart">
                <div className="expense-item">
                  <div className="expense-label">Rent</div>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill"
                      style={{ width: maxExpense > 0 ? `${(averageExpenses.rental / maxExpense) * 100}%` : '0%' }}
                      onMouseEnter={() => setHoveredExpense({ type: 'rental', amount: averageExpenses.rental })}
                      onMouseLeave={() => setHoveredExpense(null)}
                      title={`$${averageExpenses.rental.toFixed(0)}`}
                    />
                    {hoveredExpense && hoveredExpense.type === 'rental' && (
                      <div className="expense-tooltip">
                        ${hoveredExpense.amount.toFixed(0)}
                      </div>
                    )}
                  </div>
                  <div className="expense-amount">${averageExpenses.rental.toFixed(0)}</div>
                </div>
                
                <div className="expense-item">
                  <div className="expense-label">Food</div>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill"
                      style={{ width: maxExpense > 0 ? `${(averageExpenses.food / maxExpense) * 100}%` : '0%' }}
                      onMouseEnter={() => setHoveredExpense({ type: 'food', amount: averageExpenses.food })}
                      onMouseLeave={() => setHoveredExpense(null)}
                      title={`$${averageExpenses.food.toFixed(0)}`}
                    />
                    {hoveredExpense && hoveredExpense.type === 'food' && (
                      <div className="expense-tooltip">
                        ${hoveredExpense.amount.toFixed(0)}
                      </div>
                    )}
                  </div>
                  <div className="expense-amount">${averageExpenses.food.toFixed(0)}</div>
                </div>
                
                <div className="expense-item">
                  <div className="expense-label">Transport</div>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill"
                      style={{ width: maxExpense > 0 ? `${(averageExpenses.transport / maxExpense) * 100}%` : '0%' }}
                      onMouseEnter={() => setHoveredExpense({ type: 'transport', amount: averageExpenses.transport })}
                      onMouseLeave={() => setHoveredExpense(null)}
                      title={`$${averageExpenses.transport.toFixed(0)}`}
                    />
                    {hoveredExpense && hoveredExpense.type === 'transport' && (
                      <div className="expense-tooltip">
                        ${hoveredExpense.amount.toFixed(0)}
                      </div>
                    )}
                  </div>
                  <div className="expense-amount">${averageExpenses.transport.toFixed(0)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Photo Highlights */}
          <div className="photo-highlights">
            <h3>Photo Highlights</h3>
            <div className="photo-grid">
              <div className="photo-item">
                <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop" alt="University" />
              </div>
              <div className="photo-item">
                <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop" alt="Spain" />
              </div>
              <div className="photo-item">
                <img src="https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=200&h=200&fit=crop" alt="Madrid" />
              </div>
              <div className="photo-item">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Study abroad" />
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="top-countries">
            <h3>Top 3 Countries Travelled To</h3>
            <div className="countries-list">
              <div className="country-item">
                <img src="https://flagcdn.com/w40/fr.png" alt="France" className="country-flag" />
                <span>France</span>
              </div>
              <div className="country-item">
                <img src="https://flagcdn.com/w40/nl.png" alt="Netherlands" className="country-flag" />
                <span>Netherlands</span>
              </div>
              <div className="country-item">
                <img src="https://flagcdn.com/w40/it.png" alt="Italy" className="country-flag" />
                <span>Italy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;