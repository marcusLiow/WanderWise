import React, { useState, useEffect } from 'react';

// Simple SVG icons to replace lucide-react
const Star = ({ className = "", filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronLeft = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Supabase client configuration
const supabaseUrl = 'https://pevsocbbbuksmuxabogz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldnNvY2JiYnVrc211eGFib2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjMyMDksImV4cCI6MjA2ODEzOTIwOX0.2o3w-XAPhFdv5cISUWWTClMN04fMybqjkNQ1NMkjEDU';

// Simple Supabase client implementation
const createSupabaseClient = (url, key) => {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  return {
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: async () => {
            try {
              const response = await fetch(`${url}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}&select=${columns}`, {
                method: 'GET',
                headers
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              return {
                data: data.length > 0 ? data[0] : null,
                error: data.length === 0 ? { message: 'No data found' } : null
              };
            } catch (error) {
              return {
                data: null,
                error: { message: error.message }
              };
            }
          }
        })
      })
    })
  };
};

const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Function to get university name from URL
const getUniversityNameFromUrl = () => {
  if (typeof window === 'undefined') {
    return 'ESSEC Business School';
  }

  const urlPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  
  const universityParam = urlParams.get('university') || urlParams.get('name');
  if (universityParam) {
    return decodeURIComponent(universityParam);
  }
  
  const pathSegments = urlPath.split('/').filter(segment => segment);
  if (pathSegments.length >= 2 && pathSegments[0] === 'university') {
    return pathSegments[1].split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  return 'ESSEC Business School';
};

// Updated mock data to match the design
const mockExpensesData = [
  { category: "Rent", amount: 1200, percentage: 75 },
  { category: "Food & Groceries", amount: 600, percentage: 50 },
  { category: "Transport", amount: 300, percentage: 25 },
  { category: "Entertainment", amount: 200, percentage: 15 },
  { category: "Other", amount: 100, percentage: 10 }
];

const mockReviews = [
  {
    id: 1,
    name: "Janelle",
    age: 21,
    university: "Columbia University, USA",
    flag: "🇺🇸",
    review: "I really learned more independence and trust in myself that I knew what I want and what I am doing in my life. I also learned a lot more French than I expected to!",
    rating: 5,
    avatar: "https://via.placeholder.com/60x60/FF8C42/FFFFFF?text=J"
  },
  {
    id: 2,
    name: "Julia",
    age: 24,
    university: "Washington State University, USA",
    flag: "🇺🇸",
    review: "I love this country to death, but man are the people so rude! Merci beaucoup for the experience, au revoir to the entitled French!",
    rating: 2,
    avatar: "https://via.placeholder.com/60x60/8B4513/FFFFFF?text=J"
  }
];

const mockPhotos = [
  "https://via.placeholder.com/150x100/E8F4FD/4A90E2?text=Paris+Street",
  "https://via.placeholder.com/150x100/FFE4E1/FF6B6B?text=City+View",
  "https://via.placeholder.com/150x100/E8F8F5/26D0CE?text=Eiffel+Tower",
  "https://via.placeholder.com/150x100/F0E8FF/9B59B6?text=Students"
];

const mockCountries = ["Turkey", "Germany", "Spain"];

const UniversityProfilePage = () => {
  const [university, setUniversity] = useState({
    name: "ESSEC Business School",
    country: "France",
    flag: "🇫🇷",
    rating: 4.7,
    description: "ESSEC Business School, founded in 1907, is one of France's most prestigious and internationally recognized business schools. With campuses in Cergy (near Paris), Singapore, and Rabat, ESSEC offers a diverse and global learning environment. Known for its academic excellence, strong industry connections, and focus on innovation and leadership, ESSEC attracts students from around the world."
  });
  const [currentReview, setCurrentReview] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const universityName = getUniversityNameFromUrl();
        
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .eq('name', universityName)
          .single();
        
        if (error) {
          console.error('Error fetching university:', error);
          // Keep using default data instead of showing error
        } else if (data) {
          setUniversity(data);
        }
      } catch (err) {
        console.error('Network error:', err);
        // Keep using default data instead of showing error
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniversity();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" filled={true} />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400 opacity-50" filled={true} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" filled={false} />);
    }
    
    return stars;
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % mockReviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + mockReviews.length) % mockReviews.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading university data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Wander<span className="text-blue-400">Wise</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Jinhong!</div>
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-amber-800">J</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* University Header */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{university.name}</h1>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-3xl">{university.flag}</span>
                  <span className="text-xl font-medium text-gray-700">{university.country}</span>
                </div>
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(university.rating || 0)}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{university.rating || 0}/5</span>
                </div>
                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {university.description}
                </p>
              </div>
            </div>

            {/* Featured Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Reviews</h2>
              
              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <div key={review.id} className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{review.flag}</span>
                            <span className="font-semibold text-gray-900">
                              {review.name}, {review.age}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{review.university}</p>
                        <p className="text-gray-800 leading-relaxed">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Average Expenses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Expenses</h3>
              <div className="space-y-4">
                {mockExpensesData.map((expense, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                      <span className="text-sm text-gray-600">€{expense.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Highlights</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square">
                    <img 
                      src={photo}
                      alt={`University photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Countries Travelled To</h3>
              <div className="space-y-3">
                {mockCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{country}</span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage;