import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Supabase clients
const universitiesClient = createClient(
  'https://pevsocbbbuksmuxabogz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldnNvY2JiYnVrc211eGFib2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjMyMDksImV4cCI6MjA2ODEzOTIwOX0.2o3w-XAPhFdv5cISUWWTClMN04fMybqjkNQ1NMkjEDU'
);

const reviewsClient = createClient(
  'https://aojighzqmzouwhxyndbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ'
);

const UniversityProfile = () => {
  const { universitySlug } = useParams(); // Get slug from URL
  const location = useLocation();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get university ID from navigation state if available
  const universityId = location.state?.universityId;

  // Helper function to convert slug back to name
  const slugToName = (slug) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Mock data for demonstration
  const mockUniversity = {
    id: '1',
    name: "King's College London",
    description: "King's College London, established in 1829, is one of the top-ranked universities in the UK. Located in the heart of London, it offers a wide range of disciplines and fosters an intellectually vibrant and diverse student community from around the globe.",
    country: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
    rating: 4.2
  };

  const mockReviews = [
    {
      id: 1,
      review_text: "I really learned more independence and trust in myself that I knew what I want and what I am doing in my life. Also learned a lot more British slang than I expected to!",
      overall_rating: 4,
      user_email: "janelle@columbia.edu",
      course_studied: "International Relations",
      expense_rental: 1200,
      expense_food: 400,
      expense_public_transport: 150,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      review_text: "London is amazing, but wow it's expensive. Still, the academic experience at King's made every penny worth it.",
      overall_rating: 3,
      user_email: "julia@wsu.edu",
      course_studied: "Business Studies",
      expense_rental: 1400,
      expense_food: 450,
      expense_public_transport: 160,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchUniversityData();
  }, [universitySlug, universityId]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch university data
      let universityData;
      
      // Try to fetch by ID first (from navigation state)
      if (universityId) {
        const { data: uniData, error: uniError } = await universitiesClient
          .from('universities')
          .select('*')
          .eq('id', universityId)
          .single();
        
        if (uniError) {
          console.warn('University not found by ID, trying by name');
          universityData = null;
        } else {
          universityData = uniData;
        }
      }
      
      // If no ID or ID didn't work, try by name from slug
      if (!universityData && universitySlug) {
        const searchName = slugToName(universitySlug);
        const { data: uniData, error: uniError } = await universitiesClient
          .from('universities')
          .select('*')
          .ilike('name', `%${searchName}%`)
          .single();
        
        if (uniError) {
          console.warn('University not found by name, using mock data');
          universityData = { ...mockUniversity, name: searchName };
        } else {
          universityData = uniData;
        }
      }
      
      // Final fallback to mock data
      if (!universityData) {
        universityData = mockUniversity;
      }

      // Fetch reviews data
      const { data: reviewsData, error: reviewsError } = await reviewsClient
        .from('reviews')
        .select('*')
        .eq('university', universityData.name)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) {
        console.warn('Reviews not found, using mock data');
        setReviews(mockReviews);
      } else {
        setReviews(reviewsData || mockReviews);
      }

      setUniversity(universityData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      // Use mock data as fallback
      setUniversity(mockUniversity);
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const getAverageExpenses = () => {
    if (reviews.length === 0) return { rental: 0, food: 0, transport: 0 };
    
    const totals = reviews.reduce((acc, review) => {
      acc.rental += review.expense_rental || 0;
      acc.food += review.expense_food || 0;
      acc.transport += review.expense_public_transport || 0;
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
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getProfileImage = (email) => {
    const seed = email ? email.split('@')[0] : Math.random().toString();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const getUniversityName = (email) => {
    if (!email) return 'Unknown University';
    const domain = email.split('@')[1];
    if (domain === 'columbia.edu') return 'Columbia University, USA';
    if (domain === 'wsu.edu') return 'Washington State University, USA';
    return domain;
  };

  const getUserName = (email) => {
    if (!email) return 'Anonymous';
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading university data...</p>
        </div>
      </div>
    );
  }

  if (error && !university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading university data: {error}</p>
          <button 
            onClick={fetchUniversityData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const averageExpenses = getAverageExpenses();
  const maxExpense = Math.max(averageExpenses.rental, averageExpenses.food, averageExpenses.transport);

  return (
    <div className="bg-gray-50 text-black font-sans min-h-screen">
      {/* HEADER */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Wander<span className="text-black">Wise</span>
        </h1>
        <div className="text-sm text-gray-500"></div>
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
                  <img src={university.flag} alt={`${university.country} Flag`} className="w-6 h-4" />
                  <span className="text-lg text-gray-600">{university.country}</span>
                </div>
              </div>
              <div className="text-yellow-400 text-xl mt-4 sm:mt-0">
                {renderStars(Math.round(university.rating))} {university.rating}/5
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
              {university.description}
            </p>
          </div>

          {/* REVIEWS SECTION */}
          <section>
            <h3 className="text-2xl font-semibold mb-4">Featured Reviews</h3>
            
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                No reviews available yet. Be the first to share your experience!
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={getProfileImage(review.user_email)} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">
                          {getUserName(review.user_email)}, {review.course_studied}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getUniversityName(review.user_email)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.review_text}</p>
                    <div className="text-yellow-400 mt-2 text-lg">
                      {renderStars(review.overall_rating || 0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          
          {/* Average Expenses Card */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-4 text-lg">Average Expenses</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Rent</span>
                  <span>${averageExpenses.rental.toFixed(0)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-400 rounded" 
                    style={{ width: `${(averageExpenses.rental / maxExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Food & Groceries</span>
                  <span>${averageExpenses.food.toFixed(0)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-400 rounded" 
                    style={{ width: `${(averageExpenses.food / maxExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Transport</span>
                  <span>${averageExpenses.transport.toFixed(0)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded">
                  <div 
                    className="h-3 bg-blue-400 rounded" 
                    style={{ width: `${(averageExpenses.transport / maxExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Highlights Card */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-4 text-lg">Photo Highlights</h4>
            <div className="grid grid-cols-2 gap-2">
              <img 
                src={`https://source.unsplash.com/200x200/?${university.name.toLowerCase().replace(/\s+/g, '-')}`} 
                className="rounded-md w-full h-20 object-cover" 
                alt="University highlight"
              />
              <img 
                src={`https://source.unsplash.com/200x200/?${university.country.toLowerCase().replace(/\s+/g, '-')}-university`} 
                className="rounded-md w-full h-20 object-cover" 
                alt="Country highlight"
              />
              <img 
                src={`https://source.unsplash.com/200x200/?${university.country.toLowerCase().replace(/\s+/g, '-')}-city`} 
                className="rounded-md w-full h-20 object-cover" 
                alt="City highlight"
              />
              <img 
                src={`https://source.unsplash.com/200x200/?study-abroad`} 
                className="rounded-md w-full h-20 object-cover" 
                alt="Study abroad"
              />
            </div>
          </div>

          {/* Top Countries Card */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-semibold mb-4 text-lg">Top 3 Countries Travelled To</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>France</li>
              <li>Netherlands</li>
              <li>Italy</li>
            </ul>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default UniversityProfile;