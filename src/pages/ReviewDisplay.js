import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './ReviewDisplay.css'; // Import the CSS file

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
    return () => {}; // Always return cleanup function
  }, [modalOpen]);

  // Move the early return AFTER all hooks
  if (!imageUrls || imageUrls.length === 0) {
    console.log('ImageGallery: No image URLs provided', imageUrls);
    return null;
  }

  console.log('ImageGallery: Received imageUrls:', imageUrls);

  return (
    <>
      <div className="review-card">
        <h2 className="review-card-title" style={{ marginBottom: '20px', textAlign: 'left' }}>
          📸 Exchange Photos ({imageUrls.length})
        </h2>
        
        {/* Centered Image Grid with smaller, more compact sizing */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: imageUrls.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            maxWidth: '800px',
            width: '100%'
          }}>
            {imageUrls.map((url, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                aspectRatio: '3/2',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                background: '#f0f0f0',
                maxHeight: '120px'
              }}
              onClick={() => openModal(index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
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
                onLoad={(e) => {
                  console.log('Image loaded successfully:', url);
                }}
                onError={(e) => {
                  console.error('Failed to load image:', url);
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Smaller overlay on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
              >
                View
              </div>
            </div>
                      ))}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
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
          {/* Close button */}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
          
          {/* Navigation arrows */}
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
                onMouseEnter={(e) => {
                  if (currentImageIndex > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
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
                onMouseEnter={(e) => {
                  if (currentImageIndex < imageUrls.length - 1) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Main image with loading state */}
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
              onError={(e) => {
                console.error('Modal image failed to load:', imageUrls[currentImageIndex]);
                setImageLoading(false);
              }}
            />
          </div>

          {/* Image counter */}
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

          {/* Thumbnail strip for multiple images */}
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

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

// Star Rating Component
const StarRating = ({ rating, label }) => (
  <div className="review-rating-item">
    <span className="review-rating-label">{label}:</span>
    <div className="review-rating-stars">
      {[1,2,3,4,5].map(star => (
        <span key={star}
              className={`star-display ${star <= rating ? '' : 'star-empty'}`}>
          ★
        </span>
      ))}
    </div>
    <span className="review-rating-score">({rating}/5)</span>
  </div>
);

// ExpenseChart Component
const ExpenseChart = ({ expenses, currency }) => {
  const [tooltip, setTooltip] = useState({ show: false, x:0, y:0, content: '' });
  
  const expenseData = [
    { label: 'Accom.', full: 'Accommodation', amount: expenses.expense_rental || 0,          color: '#eab308' },
    { label: 'Travel', full: 'Travel',         amount: expenses.expense_travel || 0,         color: '#3b82f6' },
    { label: 'Food',   full: 'Food',           amount: expenses.expense_food || 0,           color: '#ef4444' },
    { label: 'Shop.',  full: 'Shopping',       amount: expenses.expense_shopping || 0,       color: '#f97316' },
    { label: 'Misc.',  full: 'Miscellaneous',  amount: expenses.expense_miscellaneous || 0,  color: '#8b5cf6' },
    { label: 'Trans.', full: 'Transport',      amount: expenses.expense_public_transport || 0, color: '#22c55e' }
  ]
  .filter(i => i.amount > 0)
  .sort((a,b) => b.amount - a.amount);

  if (!expenseData.length) return null;
  const maxAmt = Math.max(...expenseData.map(i => i.amount));

  const handleEnter = (e, item) => {
    const { left, width, top } = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      x: left + width/2,
      y: top - 6,
      content: `${item.full}: ${currency} ${item.amount.toFixed(2)}`
    });
  };
  const handleLeave = () => setTooltip({ show:false, x:0, y:0, content: '' });

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '256px', gap: '16px' }}>
          {expenseData.map(item => {
            const pct = (item.amount / maxAmt)*100;
            const h = Math.max(pct, 8);
            return (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '256px', width: '100%' }}>
                  <div
                    className="expense-bar"
                    style={{ height: `${h}%`, backgroundColor: item.color, width: '100%', borderRadius: '8px 8px 0 0' }}
                    onMouseEnter={e => handleEnter(e, item)}
                    onMouseLeave={handleLeave}
                  />
                </div>
                <div style={{ fontSize: '10px', color: '#374151', marginTop: '8px', textAlign: 'center', fontWeight: '500' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
        {expenseData.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color }} />
            <span style={{ fontSize: '10px', color: '#374151' }}>{item.label}:</span>
            <span style={{ fontSize: '10px', fontWeight: '500', marginLeft: 'auto' }}>
              {currency} {item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {tooltip.show && (
        <div
          className="tooltip show"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// Main Review Display Component
const ReviewDisplay = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('demo') === 'true') {
      loadSample();
    } else {
      const id = p.get('id');
      if (id) fetchReview(id);
      else {
        setError('No review ID – add ?demo=true');
        setLoading(false);
      }
    }
  }, []);

  const loadSample = () => {
    const sample = {
      id:1, created_at:'2024-01-15T10:30:00Z',
      country:'United States', university:'Stanford University',
      course_studied:'Computer Science', gpa:3.85,
      overall_rating:5,
      academic_rating:5, academic_comment:'World-class CS program with cutting-edge research opportunities and incredible faculty mentorship that pushed me to excel beyond my expectations.',
      culture_rating:4, culture_comment:'Entrepreneurial mindset is contagious here. The innovation ecosystem and networking opportunities are unparalleled, though the competitive atmosphere can be intense.',
      food_rating:4, food_comment:'Great dining options on campus and amazing food trucks. Palo Alto has excellent restaurants, though they can be quite expensive for students.',
      accommodation_rating:4, accommodation_comment:'Comfortable housing with great facilities. The dorms foster community well, though some buildings are older. Campus is beautiful year-round.',
      safety_rating:5, safety_comment:'Very safe campus with excellent security. Never felt unsafe walking around at night. The surrounding area is also very secure and well-maintained.',
      tags:['Life-changing','Rigorous','Career Boost','Diverse'],
      review_text:'My semester at Stanford was truly transformative. The academic rigor pushed me to new heights, while the entrepreneurial ecosystem opened doors I never knew existed. The connections I made and the mindset I developed will benefit me for years to come.',
      tips_text:'Network early and often! Attend startup events in the valley, join student organizations, and don\'t be afraid to reach out to professors. The weather is perfect for exploring San Francisco on weekends.',
      currency:'USD - US Dollar',
      expense_food:1200, expense_shopping:800, expense_rental:2500,
      expense_public_transport:300, expense_travel:1500, expense_miscellaneous:400,
      image_urls: [
        'https://images.unsplash.com/photo-1606103819203-2ea3e5c9c7ee?w=500',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500'
      ]
    };
    setReview(sample);
    setLoading(false);
  };

  const fetchReview = async (id) => {
    try {
      const { data, error } = await supabaseClient
        .from('reviews').select('*').eq('id', id).single();
      if (error) throw error;
      
      console.log('Raw data from database:', data);
      console.log('Raw image_urls field:', data.image_urls);
      console.log('Type of image_urls:', typeof data.image_urls);
      
      // Handle image_urls field - convert storage paths to public URLs
      if (data.image_urls) {
        let imageUrls = data.image_urls;
        
        // If it's stored as a string, try to parse it
        if (typeof imageUrls === 'string') {
          console.log('image_urls is a string, attempting to parse:', imageUrls);
          try {
            // Try parsing as JSON first
            imageUrls = JSON.parse(imageUrls);
            console.log('Successfully parsed as JSON:', imageUrls);
          } catch (parseError) {
            console.log('JSON parse failed, trying comma split:', parseError);
            // If not JSON, split by comma
            imageUrls = imageUrls.split(',').map(url => url.trim()).filter(url => url);
            console.log('Split by comma:', imageUrls);
          }
        }
        
        // Convert storage paths to public URLs if needed
        if (Array.isArray(imageUrls)) {
          console.log('Converting storage paths to public URLs...');
          data.image_urls = imageUrls.map(url => {
            if (url.startsWith('http')) {
              // Already a full URL
              console.log('Already full URL:', url);
              return url;
            } else {
              // Convert storage path to public URL
              const { data: publicUrl } = supabaseClient.storage
                .from('wanderwise')
                .getPublicUrl(url);
              console.log(`Converted ${url} to ${publicUrl.publicUrl}`);
              return publicUrl.publicUrl;
            }
          });
        }
      } else {
        console.log('No image_urls field found or it is null/undefined');
        data.image_urls = []; // Set empty array if no images
      }
      
      // Handle tags field similarly
      if (data.tags && typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags);
        } catch {
          data.tags = data.tags.split(',').map(tag => tag.trim());
        }
      }
      
      console.log('Processed review data:', data);
      console.log('Final image URLs:', data.image_urls);
      
      setReview(data);
    } catch (err) {
      console.error('Error fetching review:', err);
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="review-loading">
      <div className="review-loading-content">
        <div className="review-loading-spinner"/>
        <p>Loading…</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="review-error">
      <p>{error}</p>
    </div>
  );
  
  if (!review) return null;

  const total = [
    review.expense_food, review.expense_shopping, review.expense_rental,
    review.expense_public_transport, review.expense_travel, review.expense_miscellaneous
  ].reduce((s,x)=>s+(x||0), 0);
  const code = review.currency.split(' - ')[0];

  return (
    <div className="review-container">
      <div className="review-content">
        {/* Header */}
        <div className="review-card">
          <div className="review-header">
            <div className="review-logo-section">
              <div className="review-logo">
                <span>SMU</span>
              </div>
              <div className="review-title">
                <h1>Exchange Review</h1>
                <p>{review.university}, {review.country}</p>
              </div>
            </div>
            <div className="review-rating-section">
              <div className="review-rating-display">
                <span className="review-overall-rating">{review.overall_rating}</span>
                <div>
                  {[1,2,3,4,5].map(star => (
                    <span key={star}
                          className={`star-display ${star <= review.overall_rating ? '' : 'star-empty'}`}>
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
              <p>{review.course_studied}</p>
            </div>
            <div className="review-info-card">
              <h3>GPA</h3>
              <p>{review.gpa}</p>
            </div>
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

        {/* Image Gallery */}
        {console.log('About to render ImageGallery with:', review.image_urls)}
        <ImageGallery imageUrls={review.image_urls} />

        <div className="review-main-grid">
          {/* Ratings */}
          <div className="review-ratings-card">
            <h2>Detailed Ratings</h2>
            <div>
              <StarRating rating={review.academic_rating}   label="Academic" />
              <StarRating rating={review.culture_rating}    label="Cultural" />
              <StarRating rating={review.food_rating}       label="Food" />
              <StarRating rating={review.accommodation_rating} label="Accommodation" />
              <StarRating rating={review.safety_rating}     label="Safety" />
            </div>
          </div>

          {/* Expenses */}
          {total > 0 && (
            <div className="review-expenses-card">
              <h2>Expenses Breakdown</h2>
              <ExpenseChart expenses={review} currency={code} />
              <div style={{ borderTop: '2px solid #d1d5db', marginTop: '24px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                    Total Expenses:
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                    {code} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comments & Tips */}
        <div className="review-comments-card">
          <h2>Detailed Reviews</h2>
          <div className="review-overall-experience">
            <h3>Overall Experience</h3>
            <p>{review.review_text}</p>
          </div>
          <div className="review-details-grid">
            {review.academic_comment && (
              <div className="review-detail-section">
                <h4>Academic Experience</h4>
                <p>{review.academic_comment}</p>
              </div>
            )}
            {review.culture_comment && (
              <div className="review-detail-section">
                <h4>Cultural Experience</h4>
                <p>{review.culture_comment}</p>
              </div>
            )}
            {review.food_comment && (
              <div className="review-detail-section">
                <h4>Food</h4>
                <p>{review.food_comment}</p>
              </div>
            )}
            {review.accommodation_comment && (
              <div className="review-detail-section">
                <h4>Accommodation</h4>
                <p>{review.accommodation_comment}</p>
              </div>
            )}
            {review.safety_comment && (
              <div className="review-detail-section">
                <h4>Safety</h4>
                <p>{review.safety_comment}</p>
              </div>
            )}
          </div>

          {review.tips_text && (
            <div className="review-tips-section">
              <h3>💡 Tips for Future Students</h3>
              <p>{review.tips_text}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="review-navigation">
          <button
            onClick={() => window.history.back()}
            className="review-back-button"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDisplay;