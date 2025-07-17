import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './WriteReview.css';

// Initialize Supabase
const supabaseUrl = 'https://aojighzqmzouwhxyndbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Image Upload Component
const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      return isImage;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="write-review-section">
      <label className="write-review-label">
        Share Photos from Your Exchange
      </label>
      <p className="write-review-help-text">
        Upload as many images as you'd like! Show off your campus, city, food, or memorable moments!
      </p>
      
      {/* Upload Area */}
      <div
        className={`write-review-upload-area ${isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="write-review-upload-content">
          <svg className="write-review-upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="write-review-upload-text">
            <span className="write-review-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="write-review-upload-help">
            PNG, JPG, JPEG supported
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="write-review-image-grid">
          {images.map(image => (
            <div key={image.id} className="write-review-image-preview">
              <img src={image.preview} alt={image.name} />
              <button
                onClick={() => removeImage(image.id)}
                className="write-review-remove-image"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="write-review-image-count">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

// StarRating component
const StarRating = ({ rating, setRating, label, readOnly = false, comment, setComment, placeholder }) => (
  <div className="write-review-rating-section">
    <label className="write-review-label">
      {label} *
      {readOnly && <span className="write-review-auto-calc">(Auto-calculated)</span>}
    </label>
    <div className="write-review-stars">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating(star)}
          className={`write-review-star ${star <= rating ? 'filled' : ''}`}
          disabled={readOnly}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
    {!readOnly && setComment && (
      <div>
        <textarea
          value={comment || ''}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className="write-review-textarea"
          rows="3"
          minLength="50"
        />
        <div className="write-review-char-count">
          {comment ? comment.trim().length : 0}/50 characters minimum
        </div>
      </div>
    )}
  </div>
);

function WriteReview() {
  const navigate = useNavigate();
  
  // Database state
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state hooks
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [courseStudied, setCourseStudied] = useState('');
  const [gpa, setGpa] = useState('');
  const [academicRating, setAcademicRating] = useState(0);
  const [academicComment, setAcademicComment] = useState('');
  const [cultureRating, setCultureRating] = useState(0);
  const [cultureComment, setCultureComment] = useState('');
  const [foodRating, setFoodRating] = useState(0);
  const [foodComment, setFoodComment] = useState('');
  const [accommodationRating, setAccommodationRating] = useState(0);
  const [accommodationComment, setAccommodationComment] = useState('');
  const [safetyRating, setSafetyRating] = useState(0);
  const [safetyComment, setSafetyComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [currency, setCurrency] = useState('');
  const [expenses, setExpenses] = useState({
    food: '',
    shopping: '',
    rental: '',
    public_transport: '',
    travel: '',
    miscellaneous: ''
  });

  // Load countries and universities from database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load countries
        const { data: countriesData, error: countriesError } = await supabaseClient
          .from('countries')
          .select('*')
          .order('name');
        
        if (countriesError) throw countriesError;
        setCountries(countriesData);

        // Load universities
        const { data: universitiesData, error: universitiesError } = await supabaseClient
          .from('universities')
          .select(`
            *,
            countries(name, code)
          `)
          .order('name');
        
        if (universitiesError) throw universitiesError;
        setUniversities(universitiesData);

      } catch (error) {
        console.error('Error loading data:', error);
        setSubmitMessage('Error loading data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter universities when country changes
  useEffect(() => {
    if (selectedCountry) {
      const filtered = universities.filter(uni => uni.countries.name === selectedCountry);
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities([]);
    }
  }, [selectedCountry, universities]);

  // Helper functions
  const handleNext = () => {
    // Basic validation before proceeding
    if (!selectedCountry || !selectedUniversity || !courseStudied || !gpa || 
        academicRating === 0 || cultureRating === 0 || foodRating === 0 || 
        accommodationRating === 0 || safetyRating === 0 || selectedTags.length === 0 || 
        !reviewText.trim()) {
      setSubmitMessage('Please fill in all required fields before proceeding.');
      return;
    }

    // Check minimum character requirements
    const textFields = [
      { value: academicComment, name: 'Academic Experience comment' },
      { value: cultureComment, name: 'Cultural Experience comment' },
      { value: foodComment, name: 'Food comment' },
      { value: accommodationComment, name: 'Accommodation comment' },
      { value: safetyComment, name: 'Safety comment' },
      { value: reviewText, name: 'Overall exchange experience' }
    ];

    for (const field of textFields) {
      if (!field.value || field.value.trim().length < 50) {
        setSubmitMessage(`${field.name} must be at least 50 characters long.`);
        return;
      }
    }

    setSubmitMessage('');
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleExpenseChange = (category, value) => {
    setExpenses(prev => ({ ...prev, [category]: value }));
  };

  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    setSelectedUniversity(''); // Reset university selection
  };

  // Auto-compute overall rating
  const computedOverallRating = useMemo(() => {
    const ratings = [academicRating, cultureRating, foodRating, accommodationRating, safetyRating];
    const validRatings = ratings.filter(rating => rating > 0);
    if (validRatings.length === 0) return 0;
    const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
    return Math.round(average);
  }, [academicRating, cultureRating, foodRating, accommodationRating, safetyRating]);

  // Upload images to Supabase Storage
  const uploadImagesToSupabase = async () => {
    if (images.length === 0) return [];
    
    const imageUrls = [];
    
    for (const image of images) {
      try {
        // Generate unique filename
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `reviews/${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabaseClient.storage
          .from('wanderwise')
          .upload(filePath, image.file);
        
        if (error) {
          console.error('Upload error:', error);
          continue; // Skip this image but continue with others
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
          .from('wanderwise')
          .getPublicUrl(filePath);
        
        imageUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    return imageUrls;
  };

  // Static data
  const experienceTags = [
    'Friendly Locals', 'Beautiful Campus',
    'Travel Opportunities', 'Supportive Professors',
    'Great Nightlife', 'Rich History',
    'Safe Environment', 'Delicious Food'
  ];

  const currencies = [
    'USD - US Dollar',
    'EUR - Euro',
    'GBP - British Pound',
    'JPY - Japanese Yen',
    'AUD - Australian Dollar',
    'CAD - Canadian Dollar',
    'CHF - Swiss Franc',
    'CNY - Chinese Yuan',
    'KRW - South Korean Won',
    'SGD - Singapore Dollar',
    'HKD - Hong Kong Dollar',
    'NOK - Norwegian Krone',
    'SEK - Swedish Krona',
    'DKK - Danish Krone',
    'BRL - Brazilian Real',
    'TRY - Turkish Lira',
    'CZK - Czech Koruna',
    'PLN - Polish Zloty',
    'HUF - Hungarian Forint',
    'ISK - Icelandic Krona',
    'KZT - Kazakhstani Tenge',
    'PHP - Philippine Peso',
    'THB - Thai Baht',
    'TWD - Taiwan Dollar'
  ];

  // Tag click handler
  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!currency) {
      setSubmitMessage('Please select a currency before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Get the selected university ID
      const selectedUniversityObj = filteredUniversities.find(uni => uni.name === selectedUniversity);
      if (!selectedUniversityObj) {
        throw new Error('Selected university not found');
      }

      // For now, create a temporary user (in a real app, this would come from authentication)
      // You'll need to replace this with actual user authentication
      const tempUser = {
        firstName: 'Anonymous',
        lastName: 'User',
        email: `user${Date.now()}@example.com`,
        password: 'temp_password'
      };

      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .insert([tempUser])
        .select()
        .single();

      if (userError) throw userError;

      // Upload images to Supabase Storage
      const imageUrls = await uploadImagesToSupabase();

      // Prepare review data using new schema field names
      const reviewData = {
        user_id: userData.id,
        university_id: selectedUniversityObj.id,
        courseStudied: courseStudied,
        gpa: parseFloat(gpa),
        overallRating: computedOverallRating,
        academicRating: academicRating,
        academicComment: academicComment,
        cultureRating: cultureRating,
        cultureComment: cultureComment,
        foodRating: foodRating,
        foodComment: foodComment,
        accommodationRating: accommodationRating,
        accommodationComment: accommodationComment,
        safetyRating: safetyRating,
        safetyComment: safetyComment,
        tags: selectedTags,
        reviewText: reviewText,
        tipsText: tipsText,
        imageUrls: imageUrls,
        currency: currency,
        expenseFood: parseFloat(expenses.food) || 0,
        expenseShopping: parseFloat(expenses.shopping) || 0,
        expenseRental: parseFloat(expenses.rental) || 0,
        expensePublicTransport: parseFloat(expenses.public_transport) || 0,
        expenseTravel: parseFloat(expenses.travel) || 0,
        expenseMiscellaneous: parseFloat(expenses.miscellaneous) || 0
      };

      const { data, error } = await supabaseClient
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      setSubmitMessage('Review submitted successfully! Redirecting...');
      
      // Redirect to home page or review page
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitMessage('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return (
      parseFloat(expenses.food || 0) +
      parseFloat(expenses.shopping || 0) +
      parseFloat(expenses.rental || 0) +
      parseFloat(expenses.public_transport || 0) +
      parseFloat(expenses.travel || 0) +
      parseFloat(expenses.miscellaneous || 0)
    ).toFixed(2);
  }, [expenses]);

  // Loading state
  if (loading) {
    return (
      <div className="write-review-container">
        <div className="write-review-content">
          <div className="write-review-card">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render UI
  return (
    <div className="write-review-container">
      <div className="write-review-content">
        <div className="write-review-card">
          <div className="write-review-header">
            <div className="write-review-logo">
              <span>SMU</span>
            </div>
            <h1 className="write-review-title">
              {currentStep === 1 ? 'Write a Review' : 'Add Expenses'}
            </h1>
            <div className="write-review-step">
              Step {currentStep} of 2
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="write-review-form">
              {/* Country */}
              <div className="write-review-section">
                <label className="write-review-label">
                  Country of Exchange *
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="write-review-select"
                  required
                >
                  <option value="">Select a Country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* University */}
              {selectedCountry && (
                <div className="write-review-section">
                  <label className="write-review-label">
                    University *
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="write-review-select"
                    required
                  >
                    <option value="">Select a University</option>
                    {filteredUniversities.map(university => (
                      <option key={university.id} value={university.name}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Course & GPA */}
              <div className="write-review-section">
                <label className="write-review-label">Course Studied *</label>
                <input
                  type="text"
                  value={courseStudied}
                  onChange={(e) => setCourseStudied(e.target.value)}
                  placeholder="e.g., Business Administration"
                  className="write-review-input"
                  required
                />
              </div>

              <div className="write-review-section">
                <label className="write-review-label">GPA *</label>
                <input
                  type="number"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="e.g., 3.5"
                  min="0"
                  max="4"
                  step="0.01"
                  className="write-review-input"
                  required
                />
              </div>

              <div className="write-review-divider" />

              {/* Ratings */}
              <StarRating 
                rating={computedOverallRating} 
                setRating={() => {}} 
                label="Overall Rating" 
                readOnly={true}
              />

              <StarRating 
                rating={academicRating} 
                setRating={setAcademicRating} 
                label="Academic Experience"
                comment={academicComment} 
                setComment={setAcademicComment}
                placeholder="Courses, professors, workload..." 
              />

              <StarRating 
                rating={cultureRating} 
                setRating={setCultureRating} 
                label="Cultural Experience"
                comment={cultureComment} 
                setComment={setCultureComment}
                placeholder="Local customs, social interactions..." 
              />

              <StarRating 
                rating={foodRating} 
                setRating={setFoodRating} 
                label="Food"
                comment={foodComment} 
                setComment={setFoodComment}
                placeholder="Local cuisine, quality..." 
              />

              <StarRating 
                rating={accommodationRating} 
                setRating={setAccommodationRating} 
                label="Accommodation"
                comment={accommodationComment} 
                setComment={setAccommodationComment}
                placeholder="Housing quality, facilities..." 
              />

              <StarRating 
                rating={safetyRating} 
                setRating={setSafetyRating} 
                label="Safety"
                comment={safetyComment} 
                setComment={setSafetyComment}
                placeholder="Personal, campus, neighborhood safety..." 
              />

              {/* Tags */}
              <div className="write-review-section">
                <label className="write-review-label">
                  What did you love about your exchange? *
                </label>
                <div className="write-review-tags">
                  {experienceTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={`write-review-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review & Tips */}
              <div className="write-review-section">
                <label className="write-review-label">
                  Overall exchange experience *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your key highlights and experiences..."
                  className="write-review-textarea"
                  rows="6"
                  minLength="50"
                  required
                />
                <div className="write-review-char-count">
                  {reviewText ? reviewText.trim().length : 0}/50 characters minimum
                </div>
              </div>

              <div className="write-review-section">
                <label className="write-review-label">
                  Tips for future exchange students
                </label>
                <textarea
                  value={tipsText}
                  onChange={(e) => setTipsText(e.target.value)}
                  placeholder="Share your advice and recommendations..."
                  className="write-review-textarea"
                  rows="4"
                />
              </div>

              {/* Image Upload */}
              <div className="write-review-divider" />
              <ImageUpload images={images} setImages={setImages} />

              {/* Next button */}
              <div className="write-review-actions">
                {submitMessage && (
                  <div className={`write-review-message ${
                    submitMessage.includes('Error') || submitMessage.includes('Please fill')
                      ? 'error'
                      : 'success'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="write-review-next-btn"
                >
                  Next: Add Expenses
                </button>
              </div>
            </div>
          ) : (
            <div className="write-review-form">
              {/* Currency */}
              <div className="write-review-section">
                <label className="write-review-label">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="write-review-select"
                  required
                >
                  <option value="">Select Currency</option>
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>

              {/* Expenses */}
              <div className="write-review-expense-grid">
                {[
                  { key: 'food', label: 'Food' },
                  { key: 'shopping', label: 'Shopping' },
                  { key: 'rental', label: 'Rental' },
                  { key: 'public_transport', label: 'Public Transport' },
                  { key: 'travel', label: 'Travel' },
                  { key: 'miscellaneous', label: 'Miscellaneous' }
                ].map(({ key, label }) => (
                  <div key={key} className="write-review-section">
                    <label className="write-review-label">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={expenses[key]}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="write-review-input"
                    />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="write-review-total">
                <div className="write-review-total-content">
                  <span className="write-review-total-label">Total Expenses:</span>
                  <span className="write-review-total-amount">
                    {currency ? currency.split(' - ')[0] : ''} {totalExpenses}
                  </span>
                </div>
              </div>

              {/* Back & Submit */}
              <div className="write-review-final-actions">
                <button
                  type="button"
                  onClick={handleBack}
                  className="write-review-back-btn"
                >
                  Back
                </button>
                <div className="write-review-submit-section">
                  {submitMessage && (
                    <div className={`write-review-message ${
                      submitMessage.includes('Error') || submitMessage.includes('Please select')
                        ? 'error'
                        : 'success'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`write-review-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review & Expenses'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WriteReview;