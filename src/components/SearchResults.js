import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.universities || []);
    } catch (err) {
      setError('Failed to search universities. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityClick = (university) => {
    // Navigate to university profile page
    navigate(`/university/${university.id}`, { 
      state: { universityId: university.id } 
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#FFD700' }}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: '#FFD700' }}>★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#ddd' }}>★</span>);
    }
    return stars;
  };

  const styles = {
    container: {
      fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '80vh'
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333'
    },
    searchInfo: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '8px'
    },
    resultCount: {
      fontSize: '1rem',
      color: '#999'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
      marginTop: '32px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #f0f0f0'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px'
    },
    universityLogo: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#FF3F00',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    universityInfo: {
      flex: 1
    },
    universityName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '4px',
      color: '#333'
    },
    location: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '8px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    ratingText: {
      fontSize: '0.9rem',
      color: '#666'
    },
    description: {
      color: '#555',
      lineHeight: 1.6,
      fontSize: '0.95rem'
    },
    loading: {
      textAlign: 'center',
      padding: '60px 20px',
      fontSize: '1.2rem',
      color: '#666'
    },
    error: {
      textAlign: 'center',
      padding: '60px 20px',
      fontSize: '1.2rem',
      color: '#e74c3c',
      backgroundColor: '#fdf2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    },
    noResults: {
      textAlign: 'center',
      padding: '60px 20px'
    },
    noResultsTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333'
    },
    noResultsText: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '24px'
    },
    backButton: {
      backgroundColor: '#FF3F00',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          Searching universities...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Search Results</h1>
        {query && (
          <div style={styles.searchInfo}>
            Showing results for: <strong>"{query}"</strong>
          </div>
        )}
        <div style={styles.resultCount}>
          {results.length} {results.length === 1 ? 'university' : 'universities'} found
        </div>
      </div>

      {results.length === 0 ? (
        <div style={styles.noResults}>
          <h2 style={styles.noResultsTitle}>No universities found</h2>
          <p style={styles.noResultsText}>
            Try searching with different keywords like university names, countries, or cities.
          </p>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {results.map((university) => (
            <div
              key={university.id}
              style={styles.card}
              onClick={() => handleUniversityClick(university)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.universityLogo}>
                  {university.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </div>
                <div style={styles.universityInfo}>
                  <h3 style={styles.universityName}>{university.name}</h3>
                  <div style={styles.location}>{university.country}</div>
                  <div style={styles.rating}>
                    {renderStars(university.rating || 0)}
                    <span style={styles.ratingText}>
                      {university.rating ? `${university.rating}/5` : 'No rating'}
                    </span>
                  </div>
                </div>
              </div>
              {university.description && (
                <p style={styles.description}>
                  {university.description.length > 150 
                    ? `${university.description.substring(0, 150)}...` 
                    : university.description
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;