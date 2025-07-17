import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import './ReviewDisplay.css'; // Import your existing CSS file

// Initialize Supabase
const supabaseUrl = 'https://aojighzqmzouwhxyndbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Image Gallery Component with Swiper Coverflow
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
    console.log('ImageGallery: No image URLs provided', imageUrls);
    return null;
  }

  console.log('ImageGallery: Received imageUrls:', imageUrls);

  return (
    <>
      <div className="review-card">
        <h2 style={{ marginBottom: '20px', textAlign: 'left', fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>
          📸 Exchange Photos ({imageUrls.length})
        </h2>
        
        {/* Swiper Coverflow Carousel */}
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
                '--swiper-navigation-color': '#FEC89A',
                '--swiper-pagination-color': '#FEC89A',
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
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', url);
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', url);
                        e.target.style.display = 'none';
                      }}
                    />
                    
                    {/* Elegant overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.6))',
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

            {/* Custom Navigation Buttons - Positioned for coverflow */}
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
                    color: '#2563eb',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
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
                    color: '#2563eb',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  ›
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal (keeping your existing modal code) */}
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

      {/* Add fade-in animation and Swiper custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .swiper-pagination-bullet {
          background: #2563eb !important;
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

// ExpenseChart Component with Recharts Animation
const ExpenseChart = ({ expenses, currency }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  
  const expenseData = [
    { label: 'Accommodation', shortLabel: 'Accom.', amount: expenses.expenseRental || 0, color: '#eab308' },
    { label: 'Travel', shortLabel: 'Travel', amount: expenses.expenseTravel || 0, color: '#3b82f6' },
    { label: 'Food', shortLabel: 'Food', amount: expenses.expenseFood || 0, color: '#ef4444' },
    { label: 'Shopping', shortLabel: 'Shop.', amount: expenses.expenseShopping || 0, color: '#f97316' },
    { label: 'Miscellaneous', shortLabel: 'Misc.', amount: expenses.expenseMiscellaneous || 0, color: '#8b5cf6' },
    { label: 'Transport', shortLabel: 'Trans.', amount: expenses.expensePublicTransport || 0, color: '#22c55e' }
  ]
  .filter(item => item.amount > 0)
  .sort((a, b) => b.amount - a.amount);

  // Clean bottom-to-top animation
  useEffect(() => {
    setAnimatedData([]);
    setAnimationStep(0);
    
    if (expenseData.length === 0) return;
    
    // Add bars one by one
    expenseData.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedData(prev => {
          // Check if item already exists to prevent duplicates
          const exists = prev.some(existing => existing.label === item.label);
          if (exists) return prev;
          
          return [...prev, item];
        });
        setAnimationStep(index + 1);
      }, index * 250); // 250ms delay between each bar
    });
  }, [JSON.stringify(expenseData)]);

  if (!expenseData.length) return null;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
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
          <p style={{ margin: 0, fontWeight: '600' }}>{data.label}</p>
          <p style={{ margin: '4px 0 0 0', color: '#fbbf24' }}>
            {currency} {data.amount.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bar Chart */}
      <div style={{ 
        background: '#f9fafb', 
        padding: '24px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={animatedData}
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
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar 
              dataKey="amount" 
              animationDuration={800}
              animationEasing="ease-out"
              animationBegin={0}
              radius={[0, 0, 0, 0]}
            >
              {animatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Legend */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '8px', 
        fontSize: '12px' 
      }}>
        {expenseData.map((item, index) => {
          const isAnimated = animatedData.some(animItem => animItem.label === item.label);
          
          return (
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
                transition: 'all 0.3s ease',
                cursor: 'default',
                opacity: isAnimated ? 1 : 0.3,
                transform: isAnimated ? 'translateY(0)' : 'translateY(10px)'
              }}
              onMouseEnter={(e) => {
                if (isAnimated) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (isAnimated) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
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
          );
        })}
      </div>
    </div>
  );
};

// Main Review Display Component
const ReviewDisplay = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const id = p.get('id');
    if (id) {
      fetchReview(id);
    } else {
      setError('No review ID provided');
      setLoading(false);
    }
  }, []);

  const fetchReview = async (id) => {
    try {
      // Use the review_details view instead of the raw reviews table
      const { data, error } = await supabaseClient
        .from('review_details')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      console.log('Raw data from review_details view:', data);
      console.log('Raw imageUrls field:', data.imageUrls);
      console.log('Type of imageUrls:', typeof data.imageUrls);
      
      // Handle imageUrls field - they should already be public URLs from storage
      if (data.imageUrls) {
        let imageUrls = data.imageUrls;
        
        // If it's stored as a string, try to parse it
        if (typeof imageUrls === 'string') {
          console.log('imageUrls is a string, attempting to parse:', imageUrls);
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
        
        // Ensure we have an array of URLs
        if (Array.isArray(imageUrls)) {
          console.log('ImageUrls is an array:', imageUrls);
          data.imageUrls = imageUrls;
        } else {
          console.log('ImageUrls is not an array, setting to empty array');
          data.imageUrls = [];
        }
      } else {
        console.log('No imageUrls field found or it is null/undefined');
        data.imageUrls = []; // Set empty array if no images
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
      console.log('Final image URLs:', data.imageUrls);
      
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

  // Calculate total expenses using new schema field names
  const total = [
    review.expenseFood, review.expenseShopping, review.expenseRental,
    review.expensePublicTransport, review.expenseTravel, review.expenseMiscellaneous
  ].reduce((s,x)=>s+(x||0), 0);
  
  const code = review.currency ? review.currency.split(' - ')[0] : 'USD';

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
                <p>
                  {review.university_name}, {review.country_name}
                  {review.country_flag && (
                    <img 
                      src={review.country_flag} 
                      alt={review.country_name} 
                      style={{ width: '20px', height: '15px', marginLeft: '8px' }}
                    />
                  )}
                </p>
              </div>
            </div>
            <div className="review-rating-section">
              <div className="review-rating-display">
                <span className="review-overall-rating">{review.overallRating}</span>
                <div>
                  {[1,2,3,4,5].map(star => (
                    <span key={star}
                          className={`star-display ${star <= review.overallRating ? '' : 'star-empty'}`}>
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
              <p>{review.courseStudied}</p>
            </div>
            <div className="review-info-card">
              <h3>GPA</h3>
              <p>{review.gpa}</p>
            </div>
            <div className="review-info-card">
              <h3>Student</h3>
              <p>{review.firstName} {review.lastName}</p>
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
        {console.log('About to render ImageGallery with:', review.imageUrls)}
        <ImageGallery imageUrls={review.imageUrls} />

        <div className="review-main-grid">
          {/* Ratings */}
          <div className="review-ratings-card">
            <h2>Detailed Ratings</h2>
            <div>
              <StarRating rating={review.academicRating} label="Academic" />
              <StarRating rating={review.cultureRating} label="Cultural" />
              <StarRating rating={review.foodRating} label="Food" />
              <StarRating rating={review.accommodationRating} label="Accommodation" />
              <StarRating rating={review.safetyRating} label="Safety" />
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

        {/* Comments & Tips with Custom Tabbed Interface */}
        <div className="review-comments-card">
          <h2>Detailed Reviews</h2>
          <div className="review-overall-experience">
            <h3>Overall Experience</h3>
            <p>{review.reviewText}</p>
          </div>

          {/* Custom Tabbed Interface */}
          {(() => {
            const tabs = [];
            
            if (review.academicComment) {
              tabs.push({ id: 'academic', label: 'Academic', content: review.academicComment, title: 'Academic Experience' });
            }
            if (review.cultureComment) {
              tabs.push({ id: 'culture', label: 'Cultural', content: review.cultureComment, title: 'Cultural Experience' });
            }
            if (review.foodComment) {
              tabs.push({ id: 'food', label: 'Food', content: review.foodComment, title: 'Food' });
            }
            if (review.accommodationComment) {
              tabs.push({ id: 'accommodation', label: 'Accommodation', content: review.accommodationComment, title: 'Accommodation' });
            }
            if (review.safetyComment) {
              tabs.push({ id: 'safety', label: 'Safety', content: review.safetyComment, title: 'Safety' });
            }

            if (tabs.length === 0) return null;

            return (
              <div style={{ marginTop: '24px' }}>
                {/* Tab Navigation */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  background: '#FEC89A',
                  padding: '4px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(index)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: activeTab === index ? 'white' : 'transparent',
                        color: activeTab === index ? '#2563eb' : '#6b7280',
                        boxShadow: activeTab === index ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937' 
                  }}>
                    {tabs[activeTab]?.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#374151', 
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    {tabs[activeTab]?.content}
                  </p>
                </div>
              </div>
            );
          })()}

          {review.tipsText && (
            <div className="review-tips-section">
              <h3>💡 Tips for Future Students</h3>
              <p>{review.tipsText}</p>
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