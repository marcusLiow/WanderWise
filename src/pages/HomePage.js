import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCountryClick = (countryName) => {
    const searchSlug = countryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/search?q=${encodeURIComponent(searchSlug)}`);
  };

  const universitySlides = [
    {
      name: 'ESSEC Business School',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'World-class business education in the heart of Paris'
    },
    {
      name: 'University of Melbourne',
      location: 'Melbourne, Australia', 
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'Leading research university with vibrant campus life'
    },
    {
      name: 'Copenhagen Business School',
      location: 'Copenhagen, Denmark',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'Innovative business programs in beautiful Scandinavia'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % universitySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [universitySlides.length]);

  const features = [
    {
      icon: '🌐',
      title: 'Global Network',
      description: 'Connect with universities across 40+ countries and discover your perfect exchange destination.'
    },
    {
      icon: '✓',
      title: 'Verified Reviews',
      description: 'Real experiences from students who studied abroad. Make informed decisions with authentic insights.'
    },
    {
      icon: '💰',
      title: 'Cost Transparency',
      description: 'Get detailed expense breakdowns from real students to budget accurately for your exchange experience.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      university: 'SMU → ESSEC Business School, France',
      avatar: 'SC',
      rating: 5,
      text: 'The professors were incredibly knowledgeable and the international student community was so welcoming. Paris offered endless opportunities for cultural immersion!'
    },
    {
      name: 'Marcus Williams',
      university: 'SMU → University of Melbourne, Australia',
      avatar: 'MW',
      rating: 5,
      text: 'Melbourne\'s startup ecosystem is amazing! I got to intern at a tech company while studying. The business courses were top-notch and very practical.'
    },
    {
      name: 'Emma Johnson',
      university: 'SMU → Copenhagen Business School, Denmark',
      avatar: 'EJ',
      rating: 5,
      text: 'Copenhagen is such a bike-friendly city and the school\'s focus on sustainability aligned perfectly with my values. Made lifelong friends from around the world!'
    }
  ];

  const popularDestinations = [
    { name: 'France', count: '120+ universities', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'  },
    { name: 'Germany', count: '85+ universities', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Australia', count: '95+ universities', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Canada', count: '75+ universities', image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }  ,
    { name: 'South Korea', count: '60+ universities', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Italy', count: '90+ universities', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
  ];

  const styles = {
    container: {
      fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      lineHeight: 1.6,
      color: '#333'
    },
    hero: {
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '0 20px'
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'all 1s ease-in-out',
      zIndex: 0
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
      zIndex: 1
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      zIndex: 2
    },
    heroLeft: {
      zIndex: 2
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      lineHeight: 1.2
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '32px',
      fontWeight: 300,
      lineHeight: 1.5
    },
    searchContainer: {
      display: 'flex',
      maxWidth: '500px',
      marginBottom: '32px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      borderRadius: '50px',
      overflow: 'hidden'
    },
    searchInput: {
      flex: 1,
      padding: '16px 24px',
      fontSize: '1rem',
      border: 'none',
      outline: 'none',
      backgroundColor: 'white'
    },
    searchButton: {
      padding: '16px 32px',
      backgroundColor: '#FF3F00',
      color: 'white',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      padding: '16px 32px',
      backgroundColor: '#FF3F00',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 63, 0, 0.3)'
    },
    secondaryButton: {
      padding: '16px 32px',
      backgroundColor: 'transparent',
      color: 'white',
      border: '2px solid white',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    floatingCard: {
      position: 'absolute',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      animation: 'float 6s ease-in-out infinite',
      maxWidth: '280px',
      zIndex: 2
    },
    section: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px'
    },
    graySection: {
      backgroundColor: '#f8f9fa',
      padding: '60px 0'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#333'
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      textAlign: 'center',
      color: '#666',
      marginBottom: '3rem',
      maxWidth: '600px',
      margin: '0 auto 3rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      marginTop: '30px'
    },
    card: {
      backgroundColor: 'white',
      padding: '40px 30px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    cardIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
      display: 'block'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333'
    },
    cardDescription: {
      color: '#666',
      lineHeight: 1.6
    },

    graySection: {
      backgroundColor: '#fef7ed', 
      padding: '2px 20px'
    },

    destinationSectionTitle: {
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '16px',
      color: '#1a365d' 
    },
    destinationSectionSubtitle: {
      fontSize: '1.25rem',
      textAlign: 'center',
      color: '#1a365d', 
      marginBottom: '48px',
      maxWidth: '600px',
      margin: '0 auto 48px'
    },
    destinationCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      aspectRatio: '1.6/1'
    },
    destinationImage: {
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    },
    destinationContent: {
      padding: '20px'
    },
    testimonialGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '30px'
    },
    testimonialCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    testimonialText: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
      color: '#666',
      marginBottom: '20px',
      fontStyle: 'italic'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    testimonialAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#FF3F00',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    testimonialInfo: {
      flex: 1
    },
    testimonialName: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '4px'
    },
    testimonialUniversity: {
      color: '#666',
      fontSize: '0.9rem'
    },
    stars: {
      color: '#FFD700',
      fontSize: '1.2rem',
      marginTop: '4px'
    },
    ctaSection: {
      backgroundColor: '#FF3F00',
      padding: '80px 20px',
      textAlign: 'center',
      color: 'white'
    },
    ctaButton: {
      padding: '16px 32px',
      backgroundColor: 'white',
      color: '#FF3F00',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    footer: {
      backgroundColor: '#fef7ed',
      color: '#1a365d',
      textAlign: 'center',
      padding: '0.5px 20px',
      fontSize: '0.8rem',
      width: '100%'
    }
  };

  const animationCSS = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .hover-lift:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .search-button:hover {
      background-color: #E63900;
    }
    
    .primary-button:hover {
      background-color: #E63900;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 63, 0, 0.4);
    }
    
    .secondary-button:hover {
      background-color: white;
      color: #333;
    }
    
    .cta-button:hover {
      background-color: #f8f9fa;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
      }
      
      .floating-cards {
        display: none;
      }
      
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{animationCSS}</style>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div 
          style={{
            ...styles.heroBackground,
            backgroundImage: `url(${universitySlides[currentSlide].image})`
          }}
        />
        <div style={styles.heroOverlay} />
        
        <div style={styles.heroContent} className="hero-content">
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              Find Your Perfect
              <br />Exchange University
            </h1>
            <p style={styles.heroSubtitle}>
              Discover amazing universities worldwide through authentic student reviews and detailed expense insights. Your global education journey starts here.
            </p>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search universities or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.searchInput}
              />
              <button 
                style={styles.searchButton}
                className="search-button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className="floating-cards" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Average monthly cost - Top Right */}
            <div style={{
              ...styles.floatingCard,
              top: '8%',
              right: '15%',
              animationDelay: '0s',
              maxWidth: '200px',
              zIndex: 3
            }}>
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                💰 Average monthly cost
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#FF3F00', textAlign: 'center' }}>
                $2,400
              </div>
            </div>
            
            {/* Review card - Middle overlapping */}
            <div style={{
              ...styles.floatingCard,
              top: '30%',
              right: '48%',
              animationDelay: '2s',
              maxWidth: '250px',
              zIndex: 2
            }}>
              <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                <span style={{ color: '#FFD700' }}>★★★★★</span>
                <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>4.8/5</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                "Amazing experience in Copenhagen!"
              </div>
            </div>
            
            {/* ESSEC Business School - Bottom overlapping */}
            <div style={{
              ...styles.floatingCard,
              top: '55%',
              right: '6%',
              animationDelay: '4s',
              maxWidth: '260px',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FF3F00',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>
                  FR
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    ESSEC Business School
                  </div>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>
                    Paris, France
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose WanderWise?</h2>
        <p style={styles.sectionSubtitle}>
          We make finding your perfect exchange university simple, transparent, and exciting.
        </p>

        <div style={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className="hover-lift" style={styles.card}>
              <span style={styles.cardIcon}>{feature.icon}</span>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section style={styles.graySection}>
        <div style={styles.section}>
          <h2 style={styles.destinationSectionTitle}>Popular Destinations</h2>
          <p style={styles.destinationSectionSubtitle}>
            Explore top-rated universities in these amazing countries
          </p>

          <div style={styles.grid}>
            {popularDestinations.map((destination, index) => (
              <div 
                key={index} 
                className="hover-lift" 
                style={styles.destinationCard}
                onClick={() => handleCountryClick(destination.name)}
              >
                <div style={{
                  ...styles.destinationImage,
                  backgroundImage: `url(${destination.image})`
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '1.8rem', 
                      fontWeight: 'bold',
                      margin: 0,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {destination.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Student Success Stories</h2>
        <p style={styles.sectionSubtitle}>
          Hear from students who found their perfect exchange experience through WanderWise
        </p>

        <div style={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="hover-lift" style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "{testimonial.text}"
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>
                  {testimonial.avatar}
                </div>
                <div style={styles.testimonialInfo}>
                  <div style={styles.testimonialName}>{testimonial.name}</div>
                  <div style={styles.testimonialUniversity}>{testimonial.university}</div>
                  <div style={styles.stars}>
                    {'★'.repeat(testimonial.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Willing to Share Your Experience */}
      <section style={styles.ctaSection}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: 'white'
        }}>
          Willing to Share Your Experience?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '32px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 32px',
          color: 'white'
        }}>
          Help future exchange students by sharing your honest review and experiences.
        </p>
        <button 
          style={styles.ctaButton}
          onClick={() => navigate('/login')}
        >
          Login to Share Review →
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Copyright © 2025 WanderWise</p>
      </footer>
    </div>
  );
};

export default HomePage;