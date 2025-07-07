// components/UniversityProfile.js - Updated with authentication
import React, { useState, useEffect } from 'react';
import './UniversityProfile.css';

const UniversityProfile = ({ token, user, onLogout }) => {
  const [universityData, setUniversityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUniversityData();
    }
  }, [token]);

  const fetchUniversityData = async () => {
    try {
      const response = await fetch('/api/university/essec-business-school', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          onLogout(); // Token expired or invalid
          return;
        }
        throw new Error('Failed to fetch university data');
      }

      const result = await response.json();
      if (result.success) {
        setUniversityData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await fetch('/api/university/essec-business-school/review', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh university data to show new review
        await fetchUniversityData();
      }
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!universityData) return <div className="error">No data available</div>;

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
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="university-profile">
      <div className="header">
        <div className="logo">WanderWise</div>
        <div className="user-info">
          <img src="/api/placeholder/40/40" alt="User" className="user-avatar" />
          <span>Welcome, {user?.name || 'User'}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        <div className="left-column">
          <div className="university-card">
            <div className="university-header">
              <img src={universityData.logo} alt="University Logo" className="university-logo" />
              <div className="university-info">
                <h1>{universityData.name}</h1>
                <div className="country">
                  <img src={universityData.flag} alt="Country Flag" className="flag" />
                  <span>{universityData.country}</span>
                </div>
                <div className="rating">
                  {renderStars(universityData.rating)}
                  <span className="rating-text">{universityData.rating}/5</span>
                </div>
              </div>
            </div>
            <div className="university-description">
              <p>{universityData.description}</p>
            </div>
          </div>

          <div className="reviews-section">
            <h2>Featured Reviews</h2>
            {universityData.reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <img src={review.avatar} alt="Reviewer" className="reviewer-avatar" />
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.name}</div>
                    <div className="reviewer-details">
                      <img src={review.countryFlag} alt="Country" className="small-flag" />
                      <span>{review.university}</span>
                    </div>
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.content}</p>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Review Button */}
            <AddReviewForm onAddReview={handleAddReview} />
          </div>
        </div>

        <div className="right-column">
          <div className="expenses-section">
            <h3>Average Expenses</h3>
            <div className="expense-item">
              <span>Rent</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{width: `${universityData.expenses.rent}%`}}></div>
              </div>
            </div>
            <div className="expense-item">
              <span>Food & Groceries</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{width: `${universityData.expenses.food}%`}}></div>
              </div>
            </div>
            <div className="expense-item">
              <span>Transport</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{width: `${universityData.expenses.transport}%`}}></div>
              </div>
            </div>
          </div>

          <div className="photo-highlights">
            <h3>Photo Highlights</h3>
            <div className="photo-grid">
              {universityData.photoHighlights.map((photo, index) => (
                <img key={index} src={photo} alt={`Highlight ${index + 1}`} className="highlight-photo" />
              ))}
            </div>
          </div>

          <div className="countries-section">
            <h3>Top 3 Countries Travelled To</h3>
            <div className="countries-list">
              {universityData.topCountries.map((country, index) => (
                <div key={index} className="country-item">
                  <img src={country.flag} alt={country.name} className="country-flag" />
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Review Form Component
const AddReviewForm = ({ onAddReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddReview({ content, rating });
      setContent('');
      setRating(5);
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add review:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button 
        className="add-review-btn" 
        onClick={() => setShowForm(true)}
      >
        Add Your Review
      </button>
    );
  }

  return (
    <div className="add-review-form">
      <h3>Add Your Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Your Review:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            required
            placeholder="Share your experience..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Review'}
          </button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniversityProfile;