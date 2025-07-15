import React, { useState, useEffect } from 'react';

// Simple SVG icons to replace lucide-react
const Star = ({ className, filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }) => (
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

// Function to get university name from URL or use default
const getUniversityNameFromUrl = () => {
  // For demo purposes, we'll use a default name
  // In a real app, you'd parse the URL pathname
  return 'KOC University';
};

// Placeholder data for features that will be populated from other tables
const mockExpensesData = [
  { category: "Rent", amount: 1200, percentage: 60 },
  { category: "Food & Groceries", amount: 400, percentage: 20 },
  { category: "Transport", amount: 150, percentage: 8 },
  { category: "Entertainment", amount: 200, percentage: 10 },
  { category: "Other", amount: 50, percentage: 2 }
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
    avatar: "https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=J"
  },
  {
    id: 2,
    name: "Julia",
    age: 24,
    university: "Washington State University, USA",
    flag: "🇺🇸",
    review: "I love this country to death, but man are the people so rude! Merci beaucoup for the experience, au revoir to the entitled French!",
    rating: 2,
    avatar: "https://via.placeholder.com/200x150/4ECDC4/FFFFFF?text=J"
  }
];

const mockPhotos = [
  "https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=Campus+View",
  "https://via.placeholder.com/200x150/4ECDC4/FFFFFF?text=City+Life",
  "https://via.placeholder.com/200x150/45B7D1/FFFFFF?text=Student+Life",
  "https://via.placeholder.com/200x150/96CEB4/FFFFFF?text=Activities"
];

const mockCountries = ["Turkey", "Germany", "Spain"];

const UniversityProfilePage = () => {
  const [university, setUniversity] = useState(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get university name from URL
        const universityName = getUniversityNameFromUrl();
        
        // Query Supabase for university data
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .eq('name', universityName)
          .single();
        
        if (error) {
          console.error('Error fetching university:', error);
          setError(`Failed to fetch university data: ${error.message}`);
          
          // Fallback to default university data for demo
          const fallbackData = {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "KOC University",
            description: "University data not found in database. This is fallback data for demonstration purposes.",
            logo: "https://via.placeholder.com/100x100/8B4513/FFFFFF?text=KOC",
            country: "Turkey",
            flag: "🇹🇷",
            rating: 4.5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUniversity(fallbackData);
        } else {
          setUniversity(data);
        }
      } catch (err) {
        console.error('Network error:', err);
        setError(`Network error: ${err.message}`);
        setUniversity(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniversity();
  }, []);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-6 h-6 text-yellow-400" filled={true} />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-6 h-6 text-yellow-400 opacity-50" filled={true} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-6 h-6 text-gray-300" filled={false} />);
    }
    
    return stars;
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % mockReviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + mockReviews.length) % mockReviews.length);
  };

  const maxExpenseAmount = Math.max(...mockExpensesData.map(item => item.amount));

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

  if (error && !university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading University</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
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
                Wander<span className="text-blue-500">Wise</span>
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
        {/* Error Banner */}
        {error && university && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-yellow-400 mr-3">⚠️</div>
              <div className="text-yellow-700 text-sm">
                <strong>Note:</strong> {error}. Showing fallback data for demonstration.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* University Header */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-6">
                <img 
                  src={university.logo} 
                  alt={`${university.name} logo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{university.name}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{university.flag}</span>
                    <span className="text-lg font-medium text-gray-700">{university.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(university.rating)}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{university.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-gray-600 leading-relaxed">
                {university.description}
              </p>
            </div>

            {/* Featured Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Reviews</h2>
              
              <div className="relative">
                <div className="bg-blue-100 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={mockReviews[currentReview].avatar}
                      alt={mockReviews[currentReview].name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{mockReviews[currentReview].flag}</span>
                          <span className="font-medium text-gray-900">
                            {mockReviews[currentReview].name}, {mockReviews[currentReview].age}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {renderStars(mockReviews[currentReview].rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mockReviews[currentReview].university}</p>
                      <p className="text-gray-800 leading-relaxed">{mockReviews[currentReview].review}</p>
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={prevReview}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {mockReviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentReview(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentReview ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextReview}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Average Expenses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Expenses</h3>
              <div className="space-y-4">
                {mockExpensesData.map((expense, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                      <span className="text-sm text-gray-600">€{expense.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(expense.amount / maxExpenseAmount) * 100}%` }}
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
