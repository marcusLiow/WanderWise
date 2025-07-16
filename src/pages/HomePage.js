import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

const HomePage = () => {
  const navigate = useNavigate(); // Add this hook
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log('Searching for:', searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Add this function to handle country clicks
  const handleCountryClick = (countryName) => {
    const searchSlug = countryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/search?q=${encodeURIComponent(searchSlug)}`);
  };

  // University carousel data
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

  // Auto-rotate carousel
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
      name: 'Barry Kim',
      university: 'SMU → University of Melbourne, Australia',
      avatar: 'MK',
      rating: 5,
      text: 'Amazing campus facilities and the Australian laid-back culture really helped me grow personally. The business courses were top-notch and very practical.'
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
      lineHeight: 1.4
    },
    searchContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '8px',
      display: 'flex',
      marginBottom: '32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
      padding: '16px 20px',
      background: 'transparent',
      color: '#333'
    },
    searchButton: {
      backgroundColor: '#FF3F00',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      backgroundColor: '#FF3F00',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: 'white',
      border: '2px solid white',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    floatingCard: {
      position: 'absolute',
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      animation: 'float 4s ease-in-out infinite',
      backdropFilter: 'blur(10px)'
    },
    section: {
      padding: '80px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '16px',
      color: '#333'
    },
    sectionSubtitle: {
      fontSize: '1.25rem',
      textAlign: 'center',
      color: '#666',
      marginBottom: '48px',
      maxWidth: '600px',
      margin: '0 auto 48px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      height: '100%'
    },
    cardIcon: {
      fontSize: '3rem',
      marginBottom: '16px',
      display: 'block'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333'
    },
    cardDescription: {
      color: '#666',
      lineHeight: 1.6
    },
    // Popular Destinations section styles
    graySection: {
      backgroundColor: '#fef7ed', 
      padding: '2px 20px'
    },
    // Section title and subtitle colors for Popular Destinations
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
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      height: '100%'
    },
    destinationImage: {
      height: '160px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      position: 'relative'
    },
    destinationContent: {
      padding: '20px'
    },
    testimonialCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      height: '100%'
    },
    stars: {
      color: '#FFD700',
      fontSize: '1.2rem',
      marginBottom: '16px'
    },
    testimonialText: {
      fontStyle: 'italic',
      marginBottom: '24px',
      lineHeight: 1.6,
      fontSize: '1rem'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#FF3F00',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #FF3F00 0%, #FF6B35 100%)',
      padding: '80px 20px',
      color: 'white',
      textAlign: 'center'
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#FF3F00',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
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

  return (
    <div style={styles.container}>
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        
        .hover-scale:hover {
          transform: scale(1.02);
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .floating-cards {
            display: none;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.hero}>
        {/* University Carousel Background */}
        <div 
          style={{
            ...styles.heroBackground,
            backgroundImage: `url(${universitySlides[currentSlide].image})`
          }}
        />
        <div style={styles.heroOverlay} />
        
        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 3
        }}>
          {universitySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentSlide === index ? '#FF3F00' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        
        <div className="hero-content" style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              Your Global Exchange
              <span style={{ color: '#FFD700' }}> Adventure </span>
              Starts Here
            </h1>
            
            <p style={styles.heroSubtitle}>
              Discover authentic student experiences, compare universities worldwide, 
              and find your perfect study abroad destination with WanderWise.
            </p>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search universities, countries, or programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.searchInput}
              />
              <button 
                style={styles.searchButton}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            <div className="hero-buttons" style={styles.heroButtons}>
              <button style={styles.primaryButton}>
                Explore Universities →
              </button>
              <button style={styles.secondaryButton}>
                Read Reviews
              </button>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className="floating-cards" style={{ position: 'relative' }}>
            <div style={{
              ...styles.floatingCard,
              top: '10%',
              right: '10%',
              animationDelay: '0s'
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
            
            <div style={{
              ...styles.floatingCard,
              bottom: '20%',
              left: '5%',
              animationDelay: '2s'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#FFD700' }}>★★★★★</span>
                <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>4.8/5</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                "Amazing experience in Copenhagen!"
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
                onClick={() => handleCountryClick(destination.name)} // Add click handler
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
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      margin: 0,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {destination.name}
                    </h3>
                  </div>
                </div>
                <div style={styles.destinationContent}>
                  <p style={{ color: '#666', margin: 0, fontWeight: '500' }}>
                    {destination.count}
                  </p>
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
          Real reviews from SMU students about their exchange experiences abroad
        </p>

        <div style={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={styles.stars}>
                {'★'.repeat(testimonial.rating)}
              </div>
              <p style={styles.testimonialText}>
                "{testimonial.text}"
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.avatar}>{testimonial.avatar}</div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{testimonial.name}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {testimonial.university}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          Willing to Share Your Experience?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '32px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          Help future exchange students by sharing your honest review and experiences.
        </p>
        <button 
          style={styles.ctaButton}
          onClick={() => console.log('Login clicked')}
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