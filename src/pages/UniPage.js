import React, { useState, useEffect } from 'react';
import './UniversityProfile.css';

function UniversityProfile() {
  const [universityData, setUniversityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniversityData();
  }, []);

  const fetchUniversityData = async () => {
    try {
      // need to change this (fetch from db)
      const response = await fetch('/api/university/essec-business-school');
      if (!response.ok) {
        throw new Error('Failed to fetch university data');
      }
      const data = await response.json();
      setUniversityData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!universityData) return <div className="error">No data available</div>;

  return (
    <div className="university-profile">
      <div className="header">
        <div className="logo">WanderWise</div>
        <div className="user-info">
          <img src="/api/placeholder/40/40" alt="User" className="user-avatar" />
          <span>Welcome, Jinhong!</span>
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
          </div>
        </div>

        <div className="right-column">
          <div className="expenses-section">
            <h3>Average Expenses</h3>
            <div className="expense-item">
              <span>Rent</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{ width: `${universityData.expenses.rent}%` }}></div>
              </div>
            </div>
            <div className="expense-item">
              <span>Food & Groceries</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{ width: `${universityData.expenses.food}%` }}></div>
              </div>
            </div>
            <div className="expense-item">
              <span>Transport</span>
              <div className="expense-bar">
                <div className="expense-fill" style={{ width: `${universityData.expenses.transport}%` }}></div>
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
}

export default UniversityProfile;

