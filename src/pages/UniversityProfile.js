import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UniversityProfile.css';

const UniversityProfile = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageExpenses, setAverageExpenses] = useState(null);
  const [photoHighlights, setPhotoHighlights] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredExpense, setHoveredExpense] = useState(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        
        // Fetch university details
        const universityResponse = await fetch(`/api/universities/${id}`);
        if (!universityResponse.ok) throw new Error('University not found');
        const universityData = await universityResponse.json();
        setUniversity(universityData);

        // Fetch reviews for this university
        const reviewsResponse = await fetch(`/api/universities/${id}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        }

        // Fetch average expenses
        const expensesResponse = await fetch(`/api/universities/${id}/average-expenses`);
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          setAverageExpenses(expensesData);
        }

        // Fetch photo highlights
        const photosResponse = await fetch(`/api/universities/${id}/photos`);
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          setPhotoHighlights(photosData);
        }

        // Fetch top countries students travel to
        const countriesResponse = await fetch(`/api/universities/${id}/top-travel-countries`);
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json();
          setTopCountries(countriesData);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUniversityData();
    }
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(amount);
  };

  const handleExpenseHover = (expenseType, amount, event) => {
    setHoveredExpense({
      type: expenseType,
      amount: amount,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleExpenseLeave = () => {
    setHoveredExpense(null);
  };

  if (loading) {
    return (
      <div className="university-profile">
        <div className="loading">Loading university information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="university-profile">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="university-profile">
        <div className="error">University not found</div>
      </div>
    );
  }

  return (
    <div className="university-profile">
      <div className="header">
        <div className="brand">
          <span className="brand-name">Wander</span>
          <span className="brand-accent">Wise</span>
        </div>
        <div className="user-info">
          <span>Welcome, Jinhong!</span>
          <div className="user-avatar">
            <img src="/images/user-avatar.png" alt="User" />
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          {/* University Header */}
          <div className="university-header">
            <div className="university-logo">
              <img src={university.logo} alt={university.name} />
            </div>
            <div className="university-info">
              <h1>{university.name}</h1>
              <div className="country-info">
                <img src={university.flag} alt={university.country} className="country-flag" />
                <span>{university.country}</span>
              </div>
              <div className="rating">
                {renderStars(university.rating)}
                <span className="rating-number">{university.rating}/5</span>
              </div>
              <p className="description">{university.description}</p>
            </div>
          </div>

          {/* Featured Reviews */}
          <div className="featured-reviews">
            <h2>Featured Reviews</h2>
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review, index) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <img src={review.user_avatar || '/images/default-avatar.png'} alt={review.user_name} />
                      </div>
                      <div className="reviewer-details">
                        <h4>{review.user_name}</h4>
                        <div className="reviewer-location">
                          <img src={review.user_country_flag} alt={review.user_country} className="mini-flag" />
                          <span>{review.user_country}</span>
                        </div>
                        <div className="reviewer-university">{review.user_university}</div>
                      </div>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.overall_educational_experience}</p>
                    <div className="review-rating">
                      {renderStars(review.average_rating)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews available yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          {/* Average Expenses */}
          <div className="expenses-section">
            <h3>Average Expenses</h3>
            {averageExpenses ? (
              <div className="expenses-chart">
                <div className="expense-item">
                  <span className="expense-label">Rent</span>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill" 
                      style={{width: `${(averageExpenses.rental_cost_sgd / averageExpenses.max_expense) * 100}%`}}
                      onMouseEnter={(e) => handleExpenseHover('Rent', averageExpenses.rental_cost_sgd, e)}
                      onMouseLeave={handleExpenseLeave}
                      onMouseMove={(e) => handleExpenseHover('Rent', averageExpenses.rental_cost_sgd, e)}
                    ></div>
                  </div>
                  <span className="expense-amount">{formatCurrency(averageExpenses.rental_cost_sgd)}</span>
                </div>
                <div className="expense-item">
                  <span className="expense-label">Food & Groceries</span>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill" 
                      style={{width: `${(averageExpenses.food_cost_sgd / averageExpenses.max_expense) * 100}%`}}
                      onMouseEnter={(e) => handleExpenseHover('Food & Groceries', averageExpenses.food_cost_sgd, e)}
                      onMouseLeave={handleExpenseLeave}
                      onMouseMove={(e) => handleExpenseHover('Food & Groceries', averageExpenses.food_cost_sgd, e)}
                    ></div>
                  </div>
                  <span className="expense-amount">{formatCurrency(averageExpenses.food_cost_sgd)}</span>
                </div>
                <div className="expense-item">
                  <span className="expense-label">Transport</span>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill" 
                      style={{width: `${(averageExpenses.travel_cost_sgd / averageExpenses.max_expense) * 100}%`}}
                      onMouseEnter={(e) => handleExpenseHover('Transport', averageExpenses.travel_cost_sgd, e)}
                      onMouseLeave={handleExpenseLeave}
                      onMouseMove={(e) => handleExpenseHover('Transport', averageExpenses.travel_cost_sgd, e)}
                    ></div>
                  </div>
                  <span className="expense-amount">{formatCurrency(averageExpenses.travel_cost_sgd)}</span>
                </div>
              </div>
            ) : (
              <p>No expense data available</p>
            )}
          </div>

          {/* Photo Highlights */}
          <div className="photo-highlights">
            <h3>Photo Highlights</h3>
            <div className="photo-grid">
              {photoHighlights.length > 0 ? (
                photoHighlights.slice(0, 4).map((photo, index) => (
                  <div key={photo.id} className="photo-item">
                    <img src={photo.photo_url} alt={`${university.name} highlight ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="no-photos">
                  <p>No photos available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Countries Travelled To */}
          <div className="top-countries">
            <h3>Top 3 Countries Travelled To</h3>
            {topCountries.length > 0 ? (
              <div className="countries-list">
                {topCountries.slice(0, 3).map((country, index) => (
                  <div key={country.id} className="country-item">
                    <img src={country.flag} alt={country.name} className="country-flag" />
                    <span>{country.name}</span>
                    <span className="visit-count">({country.visit_count} visits)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No travel data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredExpense && (
        <div 
          className="expense-tooltip"
          style={{
            position: 'fixed',
            left: hoveredExpense.x + 10,
            top: hoveredExpense.y - 30,
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <strong>{hoveredExpense.type}:</strong> {formatCurrency(hoveredExpense.amount)}
        </div>
      )}
    </div>
  );
};

export default UniversityProfile;
