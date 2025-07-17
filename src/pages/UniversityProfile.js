import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './UniversityProfile.css';

// Supabase client
const supabase = createClient(
  'https://aojighzqmzouwhxyndbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ'
);

const UniversityProfile = () => {
  const { universitySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Add this line to get the navigate function
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [photoHighlights, setPhotoHighlights] = useState([]);
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

  // Helper function to create URL-friendly slugs
  const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const mockUniversity = {
    id: '1',
    name: universitySlug ? slugToName(universitySlug) : "IE University",
    description: "IE University is a private university with innovative programs. Known for its entrepreneurship focus and international perspective.",
    countries: { name: "Spain", flag: "https://flagcdn.com/w40/es.png" },
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
          const { data: uniData, error: uniError } = await supabase
            .from('universities')
            .select(`
              *,
              countries!universities_country_fkey (
                name,
                flag
              )
            `)
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
          const { data: uniData, error: uniError } = await supabase
            .from('universities')
            .select(`
              *,
              countries!universities_country_fkey (
                name,
                flag
              )
            `)
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

      // Fetch reviews with user and university data
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            users!reviews_user_fkey (
              firstName,
              lastName,
              email,
              profileImage,
              countries!users_nationality_fkey (
                name,
                flag
              )
            )
          `)
          .eq('university_id', universityData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsError) {
          console.warn('Error fetching reviews:', reviewsError);
          setReviews([]);
        } else {
          setReviews(reviewsData || []);
          
          // Process photo highlights from reviews
          const photos = [];
          reviewsData?.forEach(review => {
            if (review.imageUrls && Array.isArray(review.imageUrls)) {
              photos.push(...review.imageUrls);
            }
          });
          setPhotoHighlights(photos.slice(0, 8)); // Get first 8 photos
          
          // Process top countries from review users' nationalities
          const countryCount = {};
          reviewsData?.forEach(review => {
            if (review.users?.countries?.name) {
              const countryName = review.users.countries.name;
              countryCount[countryName] = (countryCount[countryName] || 0) + 1;
            }
          });
          
          // Sort countries by count and get top 3
          const sortedCountries = Object.entries(countryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
          
          // Get country details for top countries
          if (sortedCountries.length > 0) {
            const countryNames = sortedCountries.map(([name]) => name);
            const { data: countryData, error: countryError } = await supabase
              .from('countries')
              .select('name, flag')
              .in('name', countryNames);
            
            if (!countryError && countryData) {
              const topCountriesWithFlags = sortedCountries.map(([name, count]) => {
                const countryInfo = countryData.find(c => c.name === name);
                return {
                  name,
                  count,
                  flag: countryInfo?.flag || `https://flagcdn.com/w40/${name.toLowerCase().substring(0, 2)}.png`
                };
              });
              setTopCountries(topCountriesWithFlags);
            }
          }
        }
      } catch (err) {
        console.warn('Reviews fetch failed:', err);
        setReviews([]);
      }

      setUniversity(universityData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setUniversity(mockUniversity);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getAverageExpenses = () => {
    if (reviews.length === 0) return { rental: 0, food: 0, transport: 0 };
    
    const totals = reviews.reduce((acc, review) => {
      acc.rental += review.expenseRental || 0;
      acc.food += review.expenseFood || 0;
      acc.transport += review.expensePublicTransport || 0;
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

  const getProfileImage = (user) => {
    if (user?.profileImage) {
      return user.profileImage;
    }
    const seed = user?.email ? user.email.split('@')[0] : Math.random().toString();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const getUserName = (user) => {
    if (!user) return 'Anonymous';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    }
    return 'Anonymous';
  };

  const getUserNationality = (user) => {
    if (user?.countries?.name) {
      return user.countries.name;
    }
    return 'Unknown';
  };

  const getDefaultPhotoHighlights = () => {
    return [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    ];
  };

  const getDefaultTopCountries = () => {
    return [
      { name: "France", flag: "https://flagcdn.com/w40/fr.png", count: 5 },
      { name: "Netherlands", flag: "https://flagcdn.com/w40/nl.png", count: 3 },
      { name: "Italy", flag: "https://flagcdn.com/w40/it.png", count: 2 }
    ];
  };

  // Handle review click - redirect to ReviewDisplay page
  const handleReviewClick = (reviewId) => {
    navigate(`/review?id=${reviewId}`);
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
                <img 
                  src={university.countries?.flag || mockUniversity.countries.flag} 
                  alt={`${university.countries?.name || mockUniversity.countries.name} Flag`} 
                  className="country-flag" 
                />
                <span>{university.countries?.name || mockUniversity.countries.name}</span>
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
            <h2>Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews available yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="review-card clickable-review"
                    onClick={() => handleReviewClick(review.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '16px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <div className="review-header">
                      <div className="reviewer-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <div className="reviewer-avatar" style={{ marginRight: '12px' }}>
                          <img 
                            src={getProfileImage(review.users)} 
                            alt="Reviewer Avatar"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div className="reviewer-details">
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {getUserName(review.users)}
                          </h4>
                          <div className="reviewer-location" style={{ fontSize: '14px', color: '#6b7280' }}>
                            <span>{review.courseStudied}</span>
                            {review.users?.countries?.name && (
                              <span> • {getUserNationality(review.users)}</span>
                            )}
                          </div>
                        </div>
                        <div className="review-date" style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <div className="review-rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        {renderStars(review.overallRating || 0)}
                        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
                          {review.overallRating}/5
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '0 0 12px 0', 
                        color: '#374151', 
                        lineHeight: '1.6',
                        fontSize: '14px'
                      }}>
                        {review.reviewText && review.reviewText.length > 150 
                          ? `${review.reviewText.substring(0, 150)}...` 
                          : review.reviewText
                        }
                      </p>
                      
                      {/* Tags */}
                      {review.tags && review.tags.length > 0 && (
                        <div className="review-tags" style={{ marginBottom: '12px' }}>
                          {review.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              style={{
                                display: 'inline-block',
                                background: '#f3f4f6',
                                color: '#374151',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                marginRight: '6px',
                                marginBottom: '4px'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {review.tags.length > 3 && (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              +{review.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Quick stats */}
                      <div className="review-quick-stats" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                          {review.academicRating && (
                            <span>Academic: {review.academicRating}/5</span>
                          )}
                          {review.cultureRating && (
                            <span>Culture: {review.cultureRating}/5</span>
                          )}
                          {review.foodRating && (
                            <span>Food: {review.foodRating}/5</span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#3b82f6',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          View Full Review →
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reviews.length > 10 && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0' }}>
                      Showing first 10 reviews
                    </p>
                    <button
                      onClick={() => {/* TODO: Implement view all reviews */}}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                      View All Reviews
                    </button>
                  </div>
                )}
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
            {reviews.length === 0 ? (
              <div className="no-photos">
                <p>No pics to show, upload a review now! 😋</p>
              </div>
            ) : photoHighlights.length === 0 ? (
              <div className="no-photos">
                <p>No pics to show, upload a review now! 😋</p>
              </div>
            ) : (
              <div className="photo-grid">
                {photoHighlights.slice(0, 4).map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img 
                      src={photo} 
                      alt={`University highlight ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Countries */}
          <div className="top-countries">
            <h3>Most Visited Countries While on Exchange</h3>
            {reviews.length === 0 ? (
              <div className="no-countries">
                <p>No countries to show, tell us about your experience!</p>
              </div>
            ) : topCountries.length === 0 ? (
              <div className="no-countries">
                <p>No countries to show, tell us about your experience!</p>
              </div>
            ) : (
              <div className="countries-list">
                {topCountries.map((country, index) => (
                  <div key={index} className="country-item">
                    <img 
                      src={country.flag} 
                      alt={`${country.name} flag`} 
                      className="country-flag"
                      onError={(e) => {
                        e.target.src = `https://flagcdn.com/w40/${country.name.toLowerCase().substring(0, 2)}.png`;
                      }}
                    />
                    <span>{country.name}</span>
                    {country.count && <span className="country-count">({country.count})</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;