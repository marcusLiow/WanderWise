import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup - using the same credentials as SearchResults.js
const SUPABASE_URL = 'https://pevsocbbbuksmuxabogz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldnNvY2JiYnVrc211eGFib2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjMyMDksImV4cCI6MjA2ODEzOTIwOX0.2o3w-XAPhFdv5cISUWWTClMN04fMybqjkNQ1NMkjEDU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const UniversityProfile = () => {
  const { universitySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for sections that will be populated from other tables later
  const mockReviews = [
    {
      id: 1,
      name: "Janelle",
      age: 21,
      homeUniversity: "Columbia University, USA",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      review: "I really learned more independence and trust in myself that I knew what I want and what I am doing in my life. Also learned a lot more British slang than I expected to!",
      rating: 4
    },
    {
      id: 2,
      name: "Julia",
      age: 24,
      homeUniversity: "Washington State University, USA",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      review: "Amazing experience! The academic environment was challenging but rewarding. Would definitely recommend to anyone considering studying abroad.",
      rating: 5
    }
  ];

  const mockExpenses = {
    rent: 85,
    food: 65,
    transport: 50
  };

  const mockPhotos = [
    "https://source.unsplash.com/200x200/?campus,university",
    "https://source.unsplash.com/200x200/?library,study",
    "https://source.unsplash.com/200x200/?students,graduation",
    "https://source.unsplash.com/200x200/?architecture,building"
  ];

  const mockTopCountries = ["France", "Netherlands", "Italy"];

  // Helper function to convert slug back to university name for search
  const slugToUniversityName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch university data
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('=== UNIVERSITY PROFILE FETCH ===');
        console.log('University slug from URL:', universitySlug);
        console.log('Location state:', location.state);

        let universityData = null;

        // Method 1: Try to get university ID from navigation state (most reliable)
        if (location.state?.universityId) {
          console.log('Fetching by ID from state:', location.state.universityId);
          
          const { data, error } = await supabase
            .from('universities')
            .select('*')
            .eq('id', location.state.universityId)
            .single();

          if (error) {
            console.error('Error fetching by ID:', error);
          } else if (data) {
            console.log('✅ University found by ID:', data.name);
            universityData = data;
          }
        }

        // Method 2: If no ID in state or ID fetch failed, try name-based search
        if (!universityData && universitySlug) {
          const searchName = slugToUniversityName(universitySlug);
          console.log('Fetching by name:', searchName);

          // Try exact match first
          let { data, error } = await supabase
            .from('universities')
            .select('*')
            .ilike('name', searchName)
            .single();

          if (error || !data) {
            console.log('Exact match failed, trying partial match...');
            
            // Try partial match
            const partialResult = await supabase
              .from('universities')
              .select('*')
              .ilike('name', `%${searchName}%`)
              .order('name');

            if (partialResult.data && partialResult.data.length > 0) {
              // Look for best match
              const exactMatch = partialResult.data.find(uni => 
                uni.name.toLowerCase() === searchName.toLowerCase()
              );
              
              universityData = exactMatch || partialResult.data[0];
              console.log('✅ University found by partial match:', universityData.name);
            }
          } else {
            console.log('✅ University found by exact name match:', data.name);
            universityData = data;
          }
        }

        if (universityData) {
          setUniversity(universityData);
        } else {
          setError(`University not found. Please check the URL or search again.`);
          console.log('❌ No university found');
        }

      } catch (err) {
        console.error('Error fetching university:', err);
        setError(`Error loading university: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (universitySlug) {
      fetchUniversity();
    } else {
      setError('No university specified in URL');
      setLoading(false);
    }
  }, [universitySlug, location.state]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half">⭐</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }

    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading university information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">University Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/search')} 
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔍 Search Universities
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="bg-gray-50 text-black font-sans min-h-screen">
      {/* HEADER */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">
          Wander<span className="text-black">Wise</span>
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/search')} 
            className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
          >
            🔍 Search Universities
          </button>
          <div className="text-sm text-gray-500">Welcome, Jinhong!</div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SECTION */}
        <div className="flex-[2] space-y-6">

          {/* UNIVERSITY INFO CARD */}
          <div className="bg-white p-8 rounded-xl shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{university.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  {university.flag ? (
                    <img 
                      src={university.flag} 
                      alt={`${university.country} Flag`} 
                      className="w-6 h-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">🏴</span>
                  )}
                  <span className="text-lg text-gray-600">{university.country || 'Unknown Country'}</span>
                </div>
              </div>
              <div className="text-yellow-400 text-xl mt-4 sm:mt-0">
                {university.rating ? (
                  <>
                    {renderStars(university.rating)} {university.rating}/5
                  </>
                ) : (
                  <span className="text-gray-400">No rating yet</span>
                )}
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
              {university.description || `${university.name} is a prestigious educational institution offering world-class academic programs and research opportunities.`}
            </p>

            {/* University Logo */}
            {university.logo && (
              <div className="mt-4">
                <img 
                  src={university.logo} 
                  alt={`${university.name} Logo`}
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* REVIEWS SECTION */}
          <section>
            <h3 className="text-2xl font-semibold mb-4">Student Reviews</h3>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex gap-4 items-center">
                    <img 
                      src={review.avatar} 
                      alt="Student Avatar" 
                      className="w-12 h-12 rounded-full" 
                    />
                    <div>
                      <p className="font-semibold">{review.name}, {review.age}</p>
                      <p className="text-sm text-gray-500">{review.homeUniversity}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{review.review}</p>
                  <div className="text-yellow-400 mt-2 text-lg">
                    {renderStars(review.rating)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Note:</strong> Review system coming soon! These are sample reviews to demonstrate the interface.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          
          {/* Card: Average Expenses */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-3 text-lg">Average Expenses</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Rent</span>
                  <span className="text-gray-500">{mockExpenses.rent}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-500 rounded transition-all duration-500" 
                    style={{ width: `${mockExpenses.rent}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Food & Groceries</span>
                  <span className="text-gray-500">{mockExpenses.food}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-500 rounded transition-all duration-500" 
                    style={{ width: `${mockExpenses.food}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Transport</span>
                  <span className="text-gray-500">{mockExpenses.transport}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-500 rounded transition-all duration-500" 
                    style={{ width: `${mockExpenses.transport}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              💡 Expense data coming soon!
            </div>
          </div>

          {/* Card: Photo Highlights */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-3 text-lg">Photo Highlights</h4>
            <div className="grid grid-cols-2 gap-2">
              {mockPhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt={`Campus highlight ${index + 1}`}
                  className="rounded-md w-full h-20 object-cover hover:opacity-80 transition-opacity cursor-pointer" 
                />
              ))}
            </div>
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              💡 Real campus photos coming soon!
            </div>
          </div>

          {/* Card: Top Countries */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-3 text-lg">Top 3 Countries Travelled To</h4>
            <ul className="space-y-2">
              {mockTopCountries.map((country, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <span className="w-6 h-4 bg-gray-200 rounded mr-3 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  {country}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              💡 Travel data coming soon!
            </div>
          </div>

        </aside>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-sm">
          <strong>Debug:</strong><br />
          Slug: {universitySlug}<br />
          ID: {location.state?.universityId || 'N/A'}<br />
          Name: {university?.name || 'N/A'}
        </div>
      )}
    </div>
  );
};

export default UniversityProfile;