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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UniversityProfile.css';

const UniversityProfile = () => {
  const { id, searchQuery } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageExpenses, setAverageExpenses] = useState(null);
  const [photoHighlights, setPhotoHighlights] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredExpense, setHoveredExpense] = useState(null);

  // New states for search functionality
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null); // 'university', 'country', or 'not-found'
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    if (id) {
      // Direct university ID access
      fetchUniversityData(id);
    } else if (searchQuery) {
      // Search mode
      handleSearchQuery(searchQuery);
    }
  }, [id, searchQuery]);

  // UPDATED handleSearchQuery function
  const handleSearchQuery = async (query) => {
    try {
      setLoading(true);
      setIsSearchMode(true);
      
      // First, try to find exact university match
      // Changed from '/api/search/universities' to '/api/universities/search'
      const universityResponse = await fetch(`/api/universities/search?name=${encodeURIComponent(query)}`);
      if (universityResponse.ok) {
        const universityData = await universityResponse.json();
        
        if (universityData.length === 1) {
          // Exact match found - redirect to university page
          navigate(`/university/${universityData[0].id}`);
          return;
        } else if (universityData.length > 1) {
          // Multiple universities found
          setSearchResults(universityData);
          setSearchType('university');
          setLoading(false);
          return;
        }
      }
      
      // If no university found, try country search
      // Changed from '/api/search/countries' to '/api/countries/search'
      const countryResponse = await fetch(`/api/countries/search?name=${encodeURIComponent(query)}`);
      if (countryResponse.ok) {
        const countryData = await countryResponse.json();
        
        if (countryData.length > 0) {
          // Get universities for this country
          const universitiesResponse = await fetch(`/api/universities/by-country?country=${encodeURIComponent(query)}`);
          if (universitiesResponse.ok) {
            const universitiesData = await universitiesResponse.json();
            setSearchResults(universitiesData);
            setSearchType('country');
            setLoading(false);
            return;
          }
        }
      }
      
      // No results found
      setSearchType('not-found');
      setLoading(false);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUniversityData = async (universityId) => {
    try {
      setLoading(true);
      setIsSearchMode(false);
      
      // Fetch university details
      const universityResponse = await fetch(`/api/universities/${universityId}`);
      if (!universityResponse.ok) throw new Error('University not found');
      const universityData = await universityResponse.json();
      setUniversity(universityData);

      // Fetch reviews for this university
      const reviewsResponse = await fetch(`/api/universities/${universityId}/reviews`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      }

      // Fetch average expenses
      const expensesResponse = await fetch(`/api/universities/${universityId}/average-expenses`);
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json();
        setAverageExpenses(expensesData);
      }

      // Fetch photo highlights
      const photosResponse = await fetch(`/api/universities/${universityId}/photos`);
      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        setPhotoHighlights(photosData);
      }

      // Fetch top countries students travel to
      const countriesResponse = await fetch(`/api/universities/${universityId}/top-travel-countries`);
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

  const handleUniversityClick = (universityId) => {
    navigate(`/university/${universityId}`);
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

  // UPDATED renderSearchResults function
  const renderSearchResults = () => {
    if (searchType === 'not-found') {
      return (
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>Sorry, we couldn't find any universities or countries matching "{searchQuery}".</p>
          <p>Please try a different search term.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Search
          </button>
        </div>
      );
    }

    if (searchType === 'university' || searchType === 'country') {
      return (
        <div className="search-results">
          <h2>
            {searchType === 'country' 
              ? `Universities in ${searchQuery}` 
              : `Universities matching "${searchQuery}"`}
          </h2>
          <div className="universities-grid">
            {searchResults.map((uni) => (
              <div 
                key={uni.id} 
                className="university-card"
                onClick={() => handleUniversityClick(uni.id)}
              >
                <div className="university-card-header">
                  <img src={uni.logo} alt={uni.name} className="university-logo-small" />
                  <div className="university-card-info">
                    <h3>{uni.name}</h3>
                    <div className="country-info">
                      <img src={uni.flag} alt={uni.country} className="country-flag-small" />
                      <span>{uni.country}</span>
                    </div>
                    <div className="rating">
                      {renderStars(uni.rating)}
                      <span className="rating-number">{uni.rating}/5</span>
                    </div>
                  </div>
                </div>
                <p className="university-description">{uni.description}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Search
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="university-profile">
        <div className="loading">
          {isSearchMode ? 'Searching...' : 'Loading university information...'}
        </div>
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

  // Render search results if in search mode
  if (isSearchMode) {
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
          {renderSearchResults()}
        </div>
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

  // Original university profile render
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