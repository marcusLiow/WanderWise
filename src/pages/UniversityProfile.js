import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './UniversityProfile.css';

const supabase = createClient(
  'https://aojighzqmzouwhxyndbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ'
);

const UniversityProfile = () => {
  const { universitySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsFromTable, setReviewsFromTable] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [photoHighlights, setPhotoHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredExpense, setHoveredExpense] = useState(null);

  const universityId = location.state?.universityId;

  const slugToName = (slug) => {
    if (!slug) return "";
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  useEffect(() => {
    fetchUniversityData();
  }, [universitySlug, universityId]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      setError(null);

      let universityData = null;
      
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
          
          if (!uniError && uniData) {
            universityData = uniData;
          }
        } catch (err) {
          console.warn('Error fetching university by ID:', err);
        }
      }
      
      if (!universityData && universitySlug) {
        try {
          const searchName = slugToName(universitySlug);
          
          let { data: uniData, error: uniError } = await supabase
            .from('universities')
            .select(`
              *,
              countries!universities_country_fkey (
                name,
                flag
              )
            `)
            .eq('name', searchName)
            .single();
          
          if (uniError) {
            const { data: fuzzyData, error: fuzzyError } = await supabase
              .from('universities')
              .select(`
                *,
                countries!universities_country_fkey (
                  name,
                  flag
                )
              `)
              .ilike('name', `%${searchName}%`)
              .limit(1);
            
            if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
              universityData = fuzzyData[0];
            }
          } else {
            universityData = uniData;
          }
        } catch (err) {
          console.warn('Error fetching university by name:', err);
        }
      }

      if (!universityData) {
        throw new Error('University not found');
      }

      try {
        console.log('Fetching reviews from reviews table for university ID:', universityData.id);
        
        const { data: reviewsTableData, error: reviewsTableError } = await supabase
          .from('reviews')
          .select('*')
          .eq('university_id', universityData.id);

        if (reviewsTableError) {
          console.error('Error fetching reviews from reviews table:', reviewsTableError);
          setReviewsFromTable([]);
        } else {
          console.log('Reviews from reviews table:', reviewsTableData?.length || 0);
          setReviewsFromTable(reviewsTableData || []);
          
          const countryCount = {};
          reviewsTableData?.forEach(review => {
            if (review.visitedCountries && Array.isArray(review.visitedCountries)) {
              review.visitedCountries.forEach(country => {
                if (country && country.trim()) {
                  countryCount[country] = (countryCount[country] || 0) + 1;
                }
              });
            }
          });
          
          const sortedCountries = Object.entries(countryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
          
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
            } else {
              const topCountriesWithFlags = sortedCountries.map(([name, count]) => ({
                name,
                count,
                flag: `https://flagcdn.com/w40/${name.toLowerCase().substring(0, 2)}.png`
              }));
              setTopCountries(topCountriesWithFlags);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching reviews from reviews table:', err);
        setReviewsFromTable([]);
      }

      try {
        console.log('Fetching reviews for university:', universityData.name);
        console.log('University ID:', universityData.id);
        
        let { data: reviewsData, error: reviewsError } = await supabase
          .from('review_details')
          .select('*')
          .eq('university_name', universityData.name)
          .order('created_at', { ascending: false });

        console.log('Reviews query result (exact match):', { reviewsData, reviewsError });

        if ((!reviewsData || reviewsData.length === 0) && !reviewsError) {
          console.log('Trying case-insensitive search by university name...');
          
          const { data: fallbackReviewsData, error: fallbackReviewsError } = await supabase
            .from('review_details')
            .select('*')
            .ilike('university_name', universityData.name)
            .order('created_at', { ascending: false });
            
          console.log('Case-insensitive search result:', { fallbackReviewsData, fallbackReviewsError });
          
          if (!fallbackReviewsError && fallbackReviewsData) {
            reviewsData = fallbackReviewsData;
            reviewsError = null;
          }
        }

        if ((!reviewsData || reviewsData.length === 0) && !reviewsError) {
          console.log('Trying partial match search...');
          
          const { data: partialMatchData, error: partialMatchError } = await supabase
            .from('review_details')
            .select('*')
            .ilike('university_name', `%${universityData.name}%`)
            .order('created_at', { ascending: false });
            
          console.log('Partial match search result:', { partialMatchData, partialMatchError });
          
          if (!partialMatchError && partialMatchData) {
            reviewsData = partialMatchData;
            reviewsError = null;
          }
        }

        const { data: allUniversityNames, error: namesError } = await supabase
          .from('review_details')
          .select('university_name')
          .limit(10);
        
        console.log('Available university names in review_details:', allUniversityNames);
        console.log('Searching for:', JSON.stringify(universityData.name));

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          setReviews([]);
        } else {
          console.log('Final reviews found:', reviewsData?.length || 0);
          console.log('Review data sample:', reviewsData?.[0]);
          setReviews(reviewsData || []);
          
          const photoHighlightsData = [];
          reviewsData?.forEach(review => {
            if (review.imageUrls && Array.isArray(review.imageUrls)) {
              review.imageUrls.forEach(imageUrl => {
                photoHighlightsData.push({
                  imageUrl,
                  reviewId: review.id,
                  reviewerName: getUserName(review),
                  reviewerAvatar: getProfileImage(review)
                });
              });
            }
          });
          setPhotoHighlights(photoHighlightsData);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews([]);
      }

      setUniversity(universityData);
    } catch (err) {
      console.error('Error fetching university data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTopExpenseCategories = () => {
    if (reviewsFromTable.length === 0) return [];
    
    const expenseCategories = [
      { name: 'Rental', field: 'expenseRental', total: 0, count: 0 },
      { name: 'Food', field: 'expenseFood', total: 0, count: 0 },
      { name: 'Public Transport', field: 'expensePublicTransport', total: 0, count: 0 },
      { name: 'Shopping', field: 'expenseShopping', total: 0, count: 0 },
      { name: 'Travel', field: 'expenseTravel', total: 0, count: 0 },
      { name: 'Miscellaneous', field: 'expenseMiscellaneous', total: 0, count: 0 }
    ];

    reviewsFromTable.forEach(review => {
      expenseCategories.forEach(category => {
        const value = review[category.field];
        if (value && value > 0) {
          category.total += parseFloat(value);
          category.count += 1;
        }
      });
    });

    const averages = expenseCategories
      .map(category => ({
        name: category.name,
        average: category.count > 0 ? category.total / category.count : 0,
        count: category.count
      }))
      .filter(category => category.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);

    return averages;
  };

  const getAverageRating = () => {
    if (reviewsFromTable.length === 0) return null;
    
    const ratingsWithValues = reviewsFromTable.filter(review => 
      review.overallRating && review.overallRating > 0
    );
    
    if (ratingsWithValues.length === 0) return null;
    
    const total = ratingsWithValues.reduce((sum, review) => sum + review.overallRating, 0);
    return total / ratingsWithValues.length;
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

  const getProfileImage = (review) => {
    if (review?.profileImage) {
      return review.profileImage;
    }
    const seed = review?.firstName && review?.lastName 
      ? `${review.firstName}${review.lastName}` 
      : review?.id?.toString() || Math.random().toString();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const getUserName = (review) => {
    if (!review) return 'Anonymous';
    if (review.firstName && review.lastName) {
      return `${review.firstName} ${review.lastName}`;
    }
    if (review.firstName) {
      return review.firstName;
    }
    return 'Anonymous';
  };

  const getUserNationality = (review) => {
    if (review?.country_name) {
      return review.country_name;
    }
    return 'Unknown';
  };

  const handleReviewClick = (reviewId) => {
    console.log('Navigating to review with ID:', reviewId);
    navigate(`/review/1?id=${reviewId}`);
  };

  const handlePhotoClick = (reviewId) => {
    console.log('Navigating to review from photo with ID:', reviewId);
    navigate(`/review/1?id=${reviewId}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading university data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading university data: {error}</p>
        <button onClick={fetchUniversityData}>Retry</button>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="error">
        <p>University not found</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const topExpenseCategories = getTopExpenseCategories();
  const maxExpense = topExpenseCategories.length > 0 ? Math.max(...topExpenseCategories.map(cat => cat.average)) : 0;
  const averageRating = getAverageRating();

  return (
    <div className="university-profile">
      <div className="main-content">
        <div className="left-section">
          {/* University Header */}
          <div className="university-header">
            <div className="university-logo">
              <img src={university.logo || "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center"} alt={`${university.name} Logo`} />
            </div>
            <div className="university-info">
              <h1>{university.name}</h1>
              <div className="country-info">
                <img 
                  src={university.countries?.flag || "https://flagcdn.com/w40/es.png"} 
                  alt={`${university.countries?.name || "Country"} Flag`} 
                  className="country-flag" 
                />
                <span>{university.countries?.name || "Unknown"}</span>
              </div>
              <div className="rating">
                {averageRating !== null ? (
                  <>
                    {renderStars(Math.round(averageRating))}
                    <span className="rating-number">{averageRating.toFixed(1)}/5</span>
                  </>
                ) : (
                  <span className="no-rating">No Rating</span>
                )}
              </div>
              <p className="description">{university.description || "No description available."}</p>
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
                {reviews.slice(0, 10).map((review) => (
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
                            src={getProfileImage(review)} 
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
                            {getUserName(review)}
                          </h4>
                          <div className="reviewer-location" style={{ fontSize: '14px', color: '#6b7280' }}>
                            <span>{review.courseStudied}</span>
                            {review.country_name && (
                              <span> • {getUserNationality(review)}</span>
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
                          {review.overallRating || 0}/5
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
                          : review.reviewText || "No review text available."
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
          {/* Average Expenses - Top 3 Categories */}
          <div className="expenses-section">
            <h3>Highest Average Expenses</h3>
            {topExpenseCategories.length === 0 ? (
              <div className="no-expense-data">
                <p>No expense data available yet.</p>
              </div>
            ) : (
              <div className="expenses-chart">
                {topExpenseCategories.map((category, index) => (
                  <div key={index} className="expense-item">
                    <div className="expense-label">{category.name}</div>
                    <div className="expense-bar">
                      <div 
                        className="expense-fill"
                        style={{ width: maxExpense > 0 ? `${(category.average / maxExpense) * 100}%` : '0%' }}
                        onMouseEnter={() => setHoveredExpense({ type: category.name, amount: category.average })}
                        onMouseLeave={() => setHoveredExpense(null)}
                        title={`$${category.average.toFixed(0)}`}
                      />
                      {hoveredExpense && hoveredExpense.type === category.name && (
                        <div className="expense-tooltip">
                          ${hoveredExpense.amount.toFixed(0)}
                        </div>
                      )}
                    </div>
                    <div className="expense-amount">${category.average.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Highlights with Swiper Carousel */}
          <div className="photo-highlights">
            <h3>Photo Highlights</h3>
            {photoHighlights.length === 0 ? (
              <div className="no-photos">
                <p>No pics to show, upload a review now! 😋</p>
              </div>
            ) : (
              <div className="photo-carousel">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={10}
                  slidesPerView={2}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  loop={photoHighlights.length > 2}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 5,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                  }}
                  style={{
                    paddingBottom: '35px'
                  }}
                >
                  {photoHighlights.map((photo, index) => (
                    <SwiperSlide key={index}>
                      <div 
                        className="photo-slide"
                        onClick={() => handlePhotoClick(photo.reviewId)}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          height: '180px',
                          backgroundColor: '#f3f4f6',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <img 
                          src={photo.imageUrl} 
                          alt={`University highlight ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop";
                          }}
                        />
                        {/* Overlay with user info */}
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                          color: 'white',
                          padding: '20px 12px 12px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <img 
                            src={photo.reviewerAvatar} 
                            alt="Reviewer"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid white'
                            }}
                          />
                          <span style={{ fontWeight: '500' }}>
                            {photo.reviewerName}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Top Countries */}
          <div className="top-countries">
            <h3>Most Visited Countries While On Exchange</h3>
            {topCountries.length === 0 ? (
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