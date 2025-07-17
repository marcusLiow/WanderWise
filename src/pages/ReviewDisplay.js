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

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < imageUrls.length - 1 ? prev + 1 : prev
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
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

  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <>
      <div className="review-card">
        <h2 className="review-card-title">
          📸 Exchange Photos ({imageUrls.length})
        </h2>
        <div className="image-gallery-grid">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Exchange photo ${index + 1}`}
              className="gallery-image"
              onClick={() => openModal(index)}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('Failed to load image:', url);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div 
          className={`modal-overlay ${modalOpen ? 'show' : ''}`}
          onClick={closeModal}
        >
          <button className="modal-close" onClick={closeModal}>
            ×
          </button>
          
          {imageUrls.length > 1 && (
            <>
              <button 
                className="modal-nav prev"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                disabled={currentImageIndex === 0}
              >
                ‹
              </button>
              <button 
                className="modal-nav next"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                disabled={currentImageIndex === imageUrls.length - 1}
              >
                ›
              </button>
            </>
          )}

          <img
            src={imageUrls[currentImageIndex]}
            alt={`Exchange photo ${currentImageIndex + 1}`}
            className="modal-image"
            onClick={(e) => e.stopPropagation()}
          />

          {imageUrls.length > 1 && (
            <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '4px 12px', borderRadius: '999px', fontSize: '14px', fontWeight: '500' }}>
                {currentImageIndex + 1} of {imageUrls.length}
              </div>
            </div>
          )}
        </div>
      )}
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
      setReview(data);
    } catch {
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