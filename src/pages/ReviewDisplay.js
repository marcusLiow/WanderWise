import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import './ReviewDisplay.css';

// Initialize Supabase
const supabaseUrl = 'https://aojighzqmzouwhxyndbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';
const supabaseClient = createClient(supabaseUrl, supabaseKey); 

// Image Gallery Component
const ImageGallery = ({ imageUrls }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    setImageLoading(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
      setImageLoading(true);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
      setImageLoading(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {};
  }, [modalOpen]);

  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <>
      <div className="review-card">
        <h2 style={{ marginBottom: '20px', textAlign: 'left', fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>
          📸 Exchange Photos ({imageUrls.length})
        </h2>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{ 
            maxWidth: '900px',
            width: '100%',
            position: 'relative'
          }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={imageUrls.length > 1}
              style={{
                '--swiper-navigation-color': '#FF5722',
                '--swiper-pagination-color': '#FF5722',
                '--swiper-navigation-size': '20px',
                padding: '40px 60px 60px 60px'
              }}
            >
              {imageUrls.map((url, index) => (
                <SwiperSlide 
                  key={index}
                  style={{
                    width: '280px',
                    height: 'auto'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      background: '#f0f0f0',
                      height: '200px'
                    }}
                    onClick={() => openModal(index)}
                  >
                    <img
                      src={url}
                      alt={`Exchange photo ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 0.2s ease'
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', url);
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', url);
                        e.target.style.display = 'none';
                      }}
                    />
                    
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.8), rgba(255, 112, 67, 0.6))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      🔍 View Full Size
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {imageUrls.length > 1 && (
              <>
                <div 
                  className="swiper-button-prev-custom"
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    fontSize: '20px',
                    color: '#FF5722',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  ‹
                </div>
                <div 
                  className="swiper-button-next-custom"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    fontSize: '20px',
                    color: '#FF5722',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  ›
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={closeModal}
        >
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              zIndex: 1001
            }}
            onClick={closeModal}
          >
            ×
          </button>
          
          {imageUrls.length > 1 && (
            <>
              <button
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  color: 'white',
                  fontSize: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  opacity: currentImageIndex === 0 ? 0.5 : 1,
                  zIndex: 1001
                }}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                disabled={currentImageIndex === 0}
              >
                ‹
              </button>
              <button
                style={{
                  position: 'absolute',
                  right: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  color: 'white',
                  fontSize: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  opacity: currentImageIndex === imageUrls.length - 1 ? 0.5 : 1,
                  zIndex: 1001
                }}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                disabled={currentImageIndex === imageUrls.length - 1}
              >
                ›
              </button>
            </>
          )}

          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '18px'
              }}>
                Loading...
              </div>
            )}
            <img
              src={imageUrls[currentImageIndex]}
              alt={`Exchange photo ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                transition: 'opacity 0.3s ease',
                opacity: imageLoading ? 0 : 1
              }}
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                console.error('Modal image failed to load:', imageUrls[currentImageIndex]);
                setImageLoading(false);
              }}
            />
          </div>

          {imageUrls.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)'
            }}>
              {currentImageIndex + 1} of {imageUrls.length}
            </div>
          )}

          {imageUrls.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              maxWidth: '80vw',
              overflowX: 'auto',
              padding: '10px'
            }}>
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    width: '60px',
                    height: '40px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: index === currentImageIndex ? '2px solid white' : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                    setImageLoading(true);
                  }}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: index === currentImageIndex ? 1 : 0.6
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .swiper-pagination-bullet {
          background: #FF5722 !important;
          opacity: 0.5 !important;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
        
        .swiper-slide {
          text-align: center;
          font-size: 18px;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
};

// Star Rating Component
const StarRating = ({ rating, label }) => {
  const validRating = rating && !isNaN(rating) ? Number(rating) : 0;
  
  return (
    <div className="review-rating-item">
      <span className="review-rating-label">{label}:</span>
      <div className="review-rating-stars">
        {[1,2,3,4,5].map(star => (
          <span key={star}
                className={`star-display ${star <= validRating ? '' : 'star-empty'}`}>
            ★
          </span>
        ))}
      </div>
      <span className="review-rating-score">({validRating}/5)</span>
    </div>
  );
};

// ExpenseChart Component
const ExpenseChart = ({ expenses, currency }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const expenseData = [
    { 
      label: 'Rental', 
      shortLabel: 'Accom.', 
      amount: expenses.expenseRental || 0, 
      color: '#FF5722' 
    },
    { 
      label: 'Travel', 
      shortLabel: 'Travel', 
      amount: expenses.expenseTravel || 0, 
      color: '#FF7043' 
    },
    { 
      label: 'Food', 
      shortLabel: 'Food', 
      amount: expenses.expenseFood || 0, 
      color: '#FF9800' 
    },
    { 
      label: 'Shopping', 
      shortLabel: 'Shopping', 
      amount: expenses.expenseShopping || 0, 
      color: '#E64A19' 
    },
    { 
      label: 'Miscellaneous', 
      shortLabel: 'Misc.', 
      amount: expenses.expenseMiscellaneous || 0, 
      color: '#BF360C' 
    },
    { 
      label: 'Transport', 
      shortLabel: 'Transport', 
      amount: expenses.expensePublicTransport || 0, 
      color: '#FF8A65' 
    }
  ]
  .filter(item => item.amount > 0)
  .sort((a, b) => b.amount - a.amount);

  useEffect(() => {
    if (!expenseData.length) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [expenseData.length]);

  if (!expenseData.length) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: '#1f2937',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: 'none'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#FFFffF' }}>{data.label}</p>
          <p style={{ margin: '4px 0 0 0', color: '#FF9800' }}>
            {currency} {data.amount.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      position: 'relative',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ 
        background: '#f9fafb', 
        padding: '24px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={expenseData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis 
              dataKey="shortLabel" 
              axisLine={false}
              tickLine={false}
              tick={false}
              height={0}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#6b7280'
              }}
              tickFormatter={(value) => `${currency} ${value}`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 87, 34, 0.1)' }}
            />
            <Bar 
              dataKey="amount" 
              animationDuration={1200}
              animationEasing="ease-out"
              animationBegin={200}
              radius={[4, 4, 0, 0]}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '8px', 
        fontSize: '12px' 
      }}>
        {expenseData.map((item, index) => (
          <div 
            key={item.label} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 10px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: `2px solid ${item.color}20`,
              cursor: 'default',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${(index * 100) + 400}ms`
            }}
          >
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              backgroundColor: item.color,
              boxShadow: `0 1px 3px ${item.color}40`,
              flexShrink: 0
            }} />
            <span style={{ 
              fontSize: '11px', 
              color: '#374151',
              fontWeight: '500',
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.shortLabel}:
            </span>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '600',
              color: '#111827',
              flexShrink: 0
            }}>
              {currency} {item.amount.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Review Display Component - FIXED VERSION
const ReviewDisplay = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log('Review ID from URL:', id);
    
    if (id) {
      fetchReview(id);
    } else {
      setError('No review ID provided');
      setLoading(false);
    }
  }, []);

  const fetchReview = async (id) => {
    try {
      console.log('Fetching review with ID:', id);
      setLoading(true);
      setError(null);

      // FIXED: Separate queries to avoid relationship issues
      // Step 1: Get the main review data
      const { data: reviewData, error: reviewError } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();
      
      console.log('Review query result:', { reviewData, reviewError });
      
      if (reviewError) {
        console.error('Review fetch error:', reviewError);
        throw reviewError;
      }
      
      if (!reviewData) {
        throw new Error('No review found with this ID');
      }

      // Step 2: Get university data separately
      let universityData = null;
      if (reviewData.university_id) {
        const { data: uniData, error: uniError } = await supabaseClient
          .from('universities')
          .select('*')
          .eq('id', reviewData.university_id)
          .single();
        
        if (!uniError && uniData) {
          universityData = uniData;
          
          // Step 3: Get country data for the university
          if (uniData.country_code) {
            const { data: countryData, error: countryError } = await supabaseClient
              .from('countries')
              .select('name, flag')
              .eq('code', uniData.country_code)
              .single();
            
            if (!countryError && countryData) {
              universityData.countries = countryData;
            }
          }
        }
      }

      // Step 4: Get user data separately
      let userData = null;
      if (reviewData.user_id) {
        const { data: userDataResult, error: userError } = await supabaseClient
          .from('users')
          .select('firstName, lastName')
          .eq('id', reviewData.user_id)
          .single();
        
        if (!userError && userDataResult) {
          userData = userDataResult;
        }
      }

      // Combine all data
      const combinedData = {
        ...reviewData,
        universities: universityData,
        users: userData
      };

      // Process imageUrls - ensure they're valid URLs
      if (combinedData.imageUrls && Array.isArray(combinedData.imageUrls)) {
        combinedData.imageUrls = combinedData.imageUrls
          .filter(url => url && url.trim()) // Remove empty URLs
          .map(url => {
            if (url.startsWith('http')) {
              return url;
            } else {
              // Convert storage path to public URL
              const { data: publicUrl } = supabaseClient.storage
                .from('wanderwise')
                .getPublicUrl(url);
              return publicUrl.publicUrl;
            }
          });
      } else {
        combinedData.imageUrls = [];
      }

      // Process visitedCountries - ensure it's an array
      console.log('Raw visitedCountries from database:', combinedData.visitedCountries);
      if (combinedData.visitedCountries && Array.isArray(combinedData.visitedCountries)) {
        combinedData.visitedCountries = combinedData.visitedCountries.filter(country => country && country.trim());
      } else if (combinedData.visitedCountries && typeof combinedData.visitedCountries === 'string') {
        try {
          combinedData.visitedCountries = JSON.parse(combinedData.visitedCountries);
        } catch {
          combinedData.visitedCountries = combinedData.visitedCountries.split(',').map(country => country.trim()).filter(country => country);
        }
      } else {
        combinedData.visitedCountries = [];
      }
      
      console.log('Processed review data:', combinedData);
      setReview(combinedData);
    } catch (err) {
      console.error('Error fetching review:', err);
      setError(`Failed to load review: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle back button - navigate to university profile
  const handleBackClick = () => {
    if (review && review.universities) {
      // Create a slug from the university name
      const universitySlug = review.universities.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      navigate(`/university/${universitySlug}`, {
        state: { universityId: review.universities.id }
      });
    } else {
      navigate(-1); // Fallback to browser back
    }
  };

  if (loading) return (
    <div className="review-loading">
      <div className="review-loading-content">
        <div className="review-loading-spinner"/>
        <p>Loading review...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="review-error">
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  if (!review) return (
    <div className="review-error">
      <p>Review not found</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  // Calculate average rating from detailed ratings
  const detailRatings = [
    review.academicRating,
    review.cultureRating,
    review.accommodationRating,
    review.safetyRating
  ].map(r => Number(r) || 0).filter(r => r > 0);

  // Compute an un‑rounded average
  const rawAvg = detailRatings.reduce((sum, r) => sum + r, 0) / detailRatings.length;

  // Round to 2 decimal places
  const averageRating = Math.round(rawAvg * 100) / 100;
  const formattedRating = averageRating.toFixed(2);
  
  // Calculate total expenses
  const total = [
    review.expenseFood, 
    review.expenseShopping, 
    review.expenseRental,
    review.expensePublicTransport, 
    review.expenseTravel, 
    review.expenseMiscellaneous
  ].reduce((s,x)=>s+(Number(x)||0), 0);
  
  const currency = review.currency || 'USD';

  return (
    <div className="review-container">
      <div className="review-content">
        <div className="review-card">
          <div className="review-header">
            <div className="review-logo-section">
              <div className="review-logo">
                <span>SMU</span>
              </div>
              <div className="review-title">
                <h1>Exchange Review</h1>
                <p>
                  {review.universities?.name || 'Unknown University'}, {review.universities?.countries?.name || 'Unknown Country'}
                  {review.universities?.countries?.flag && (
                    <img 
                      src={review.universities.countries.flag} 
                      alt={review.universities.countries.name} 
                      style={{ width: '20px', height: '15px', marginLeft: '8px' }}
                    />
                  )}
                </p>
              </div>
            </div>
            <div className="review-rating-section">
              <div className="review-rating-display">
                <span className="review-overall-rating">
                  {formattedRating}
                </span>
                <div>
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      className={`star-display ${star <= Math.round(averageRating) ? '' : 'star-empty'}`}
                     >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-rating-label">Overall Rating</p>
            </div>
          </div>

          <div className="review-info-grid">
            <div className="review-info-card">
              <h3>Course</h3>
              <p>{review.courseStudied || 'N/A'}</p>
            </div>
            <div className="review-info-card">
              <h3>GPA</h3>
              <p>{review.gpa || 'N/A'}</p>
            </div>
            {review.users && (
              <div className="review-info-card">
                <h3>Student</h3>
                <p>{review.users.firstName} {review.users.lastName}</p>
              </div>
            )}
            <div className="review-info-card">
              <h3>Date</h3>
              <p>{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {review.tags?.length > 0 && (
            <div className="review-tags">
              <h3>Highlights</h3>
              <div className="review-tags-container">
                {review.tags.map((t,i) => (
                  <span key={i} className="review-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <ImageGallery imageUrls={review.imageUrls} />

        {/* Main two-column grid: left for Ratings+Visited, right for Expenses */}
        <div className="review-main-grid">
          {/* LEFT COLUMN */}
          <div className="review-left-column">
            {/* Detailed Ratings card */}
            <div className="review-ratings-card">
              <h2>Detailed Ratings</h2>
              <div>
                <StarRating rating={review.academicRating}      label="Academic"       />
                <StarRating rating={review.cultureRating}       label="Cultural"        />
                <StarRating rating={review.accommodationRating} label="Rental"  />
                <StarRating rating={review.safetyRating}        label="Safety"          />
              </div>
            </div>

            {/* Visited Countries card */}
            <div className="review-visited-card">
              <h2>Visited Countries</h2>
              {review.visitedCountries && review.visitedCountries.length > 0 ? (
                <div className="visited-list">
                  {review.visitedCountries.map((country,i) => (
                    <span key={i} className="visited-chip">
                      {country}
                    </span>
                  ))}
                </div>
              ) : (
                <p>None</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          {total > 0 && (
            <div className="review-expenses-card">
              <h2>Expenses Breakdown</h2>
              <ExpenseChart expenses={review} currency={currency} />
              <div style={{ borderTop: '2px solid #d1d5db', marginTop: 24, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
                    Total Expenses:
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 'bold', color: '#FF5722' }}>
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="review-comments-card">
          <h2>Detailed Reviews</h2>
          <div className="review-overall-experience">
            <h3>Overall Experience</h3>
            <p>{review.reviewText || 'No review text provided.'}</p>
          </div>

          {(() => {
            const tabs = [];
            
            if (review.academicComment) {
              tabs.push({ 
                id: 'academic', 
                label: 'Academic', 
                content: review.academicComment, 
                title: 'Academic Experience' 
              });
            }
            if (review.cultureComment) {
              tabs.push({ 
                id: 'culture', 
                label: 'Cultural', 
                content: review.cultureComment, 
                title: 'Cultural Experience' 
              });
            }
            if (review.foodComment) {
              tabs.push({ 
                id: 'food', 
                label: 'Food', 
                content: review.foodComment, 
                title: 'Food' 
              });
            }
            if (review.accommodationComment) {
              tabs.push({ 
                id: 'accommodation', 
                label: 'Accommodation', 
                content: review.accommodationComment, 
                title: 'Accommodation' 
              });
            }
            if (review.safetyComment) {
              tabs.push({ 
                id: 'safety', 
                label: 'Safety', 
                content: review.safetyComment, 
                title: 'Safety' 
              });
            }

            if (tabs.length === 0) return null;

            return (
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  background: 'linear-gradient(135deg, #FF5722, #FF7043)',
                  padding: '6px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 15px rgba(255, 87, 34, 0.2)'
                }}>
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(index)}
                      style={{
                        flex: 1,
                        padding: '14px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: activeTab === index ? 'white' : 'transparent',
                        color: activeTab === index ? '#FF5722' : 'rgba(255, 255, 255, 0.9)',
                        boxShadow: activeTab === index ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                        transform: activeTab === index ? 'translateY(-2px)' : 'translateY(0)',
                        textShadow: activeTab === index ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== index) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== index) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #FFF3E0, #FFEBE0)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 87, 34, 0.1)',
                  boxShadow: '0 2px 8px rgba(255, 87, 34, 0.1)'
                }}>
                  <h4 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#E64A19',
                    borderBottom: '2px solid #FF5722',
                    paddingBottom: '8px',
                    display: 'inline-block'
                  }}>
                    {tabs[activeTab]?.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#5D4037', 
                    lineHeight: '1.7',
                    fontSize: '15px',
                    letterSpacing: '0.2px'
                  }}>
                    {tabs[activeTab]?.content}
                  </p>
                </div>
              </div>
            );
          })()}

          {review.tipsText && (
            <div className="review-tips-section" style={{
              marginTop: '32px',
              background: 'linear-gradient(135deg, #E8F5E8, #F1F8E9)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2E7D32',
                margin: '0 0 16px 0',
                borderBottom: '2px solid #4CAF50',
                paddingBottom: '8px',
                display: 'inline-block'
              }}>
                💡 Tips for Future Students
              </h3>
              <p style={{
                color: '#1B5E20',
                lineHeight: '1.7',
                margin: 0,
                fontSize: '15px',
                letterSpacing: '0.2px'
              }}>
                {review.tipsText}
              </p>
            </div>
          )}
        </div>

        <div className="review-navigation">
          <button
            onClick={handleBackClick}
            className="review-back-button"
            style={{
              background: '#FF5722',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E64A19';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 87, 34, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FF5722';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 87, 34, 0.3)';
            }}
          >
            ← Back to {review.universities?.name || 'University'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDisplay;