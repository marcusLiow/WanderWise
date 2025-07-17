import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CountryListPage = () => {
    const navigate = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState('All');

    // Data based on SMU International Student Exchange Programme Spring 2025 document
    const exchangeData = [
        // Asia
        { country: 'China', region: 'Asia', count: 16, image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=300&fit=crop' },
        { country: 'Hong Kong', region: 'Asia', count: 7, image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=300&fit=crop' },
        { country: 'Japan', region: 'Asia', count: 14, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop' },
        { country: 'South Korea', region: 'Asia', count: 12, image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=300&fit=crop' },
        { country: 'Taiwan', region: 'Asia', count: 7, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&h=300&fit=crop' }, // Taiwan landmark
        { country: 'Thailand', region: 'Asia', count: 3, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop' },
        { country: 'Philippines', region: 'Asia', count: 1, image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop' },
        
        // Central Asia
        { country: 'Kazakhstan', region: 'Central Asia', count: 1, image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop' },
        
        // Europe
        { country: 'Austria', region: 'Europe', count: 2, image: 'https://images.unsplash.com/photo-1538991383142-36c4edeaffde?w=400&h=300&fit=crop' },
        { country: 'Belgium', region: 'Europe', count: 5, image: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?w=400&h=300&fit=crop' },
        { country: 'Czech Republic', region: 'Europe', count: 1, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop' },
        { country: 'Denmark', region: 'Europe', count: 3, image: 'https://images.unsplash.com/photo-1508189860359-777d945909ef?w=400&h=300&fit=crop' },
        { country: 'Finland', region: 'Europe', count: 2, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' }, // Finland landmark
        { country: 'France', region: 'Europe', count: 9, image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop' },
        { country: 'Germany', region: 'Europe', count: 8, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
        { country: 'Hungary', region: 'Europe', count: 1, image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop' },
        { country: 'Iceland', region: 'Europe', count: 1, image: 'https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=400&h=300&fit=crop' },
        { country: 'Ireland', region: 'Europe', count: 2, image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400&h=300&fit=crop' }, // Cliffs of Moher
        { country: 'Italy', region: 'Europe', count: 4, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop' },
        { country: 'Lithuania', region: 'Europe', count: 1, image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop' },
        { country: 'Norway', region: 'Europe', count: 2, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop' },
        { country: 'Poland', region: 'Europe', count: 3, image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop' },
        { country: 'Portugal', region: 'Europe', count: 3, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop' },
        { country: 'Spain', region: 'Europe', count: 7, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop' },
        { country: 'Sweden', region: 'Europe', count: 8, image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=300&fit=crop' },
        { country: 'Switzerland', region: 'Europe', count: 5, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
        { country: 'Netherlands', region: 'Europe', count: 9, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop' },
        { country: 'United Kingdom', region: 'Europe', count: 15, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
        
        // Middle East
        { country: 'Turkey', region: 'Middle East', count: 2, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop' },
        
        // North America
        { country: 'Canada', region: 'North America', count: 9, image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop' },
        { country: 'United States', region: 'North America', count: 12, image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop' }, // Statue of Liberty
        
        // Oceania
        { country: 'Australia', region: 'Oceania', count: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }, // Sydney Opera House
        
        // South America
        { country: 'Brazil', region: 'South America', count: 1, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop' }
];


    const regions = ['All', 'Asia', 'Europe', 'North America', 'Middle East', 'Central Asia', 'Oceania', 'South America'];

    const filteredData = useMemo(() => {
        if (selectedRegion === 'All') {
            return exchangeData.sort((a, b) => b.count - a.count);
        }
        return exchangeData.filter(item => item.region === selectedRegion).sort((a, b) => b.count - a.count);
    }, [selectedRegion]);

    // Navigation function
    const handleDestinationClick = (destinationName) => {
        // Navigate to search results page with the destination name as query parameter
        navigate(`/search?q=${encodeURIComponent(destinationName)}`);
    };

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            color: '#333',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        },
        header: {
            background: 'linear-gradient(135deg, #ff3f00 0%, #764ba2 100%)',
            color: 'white',
            padding: '60px 20px',
            textAlign: 'center'
        },
        title: {
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        },
        subtitle: {
            fontSize: '1.2rem',
            opacity: '0.9', 
            maxWidth: '600px',
            margin: '0 auto'
        },
        filterSection: {
            backgroundColor: 'white',
            padding: '30px 20px',
            borderBottom: '1px solid #e0e0e0'
        },
        filterContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
        },
        filterTitle: {
            fontSize: '1.2rem',
            marginBottom: '20px',
            color: '#333'
        },
        filterButtons: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
        },
        filterButton: {
            padding: '10px 20px',
            border: '2px solid #ff3f00',
            borderRadius: '25px',
            backgroundColor: 'white',
            color: '#ff3f00',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
        },
        filterButtonActive: {
            padding: '10px 20px',
            border: '2px solid #ff3f00',
            borderRadius: '25px',
            backgroundColor: '#ff3f00',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
        },
        graySection: {
            backgroundColor: '#f8f9fa',
            padding: '60px 0'
        },
        section: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '30px'
        },
        destinationCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        destinationImage: {
            width: '100%',
            height: '200px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        },
        destinationContent: {
            padding: '20px'
        },
        stats: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginTop: '40px',
            padding: '0 20px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        },
        statNumber: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ff3f00',
            marginBottom: '10px'
        },
        statLabel: {
            fontSize: '0.9rem',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }
    };

    const totalUniversities = exchangeData.reduce((sum, item) => sum + item.count, 0);
    const totalCountries = exchangeData.length;

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>Study Abroad Destinations</h1>
                <p style={styles.subtitle}>
                    Discover amazing opportunities at top universities worldwide through SMU's International Student Exchange Programme
                </p>
                
                {/* Stats */}
                <div style={styles.stats}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalCountries}</div>
                        <div style={styles.statLabel}>Countries</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalUniversities}</div>
                        <div style={styles.statLabel}>Universities</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{regions.length - 1}</div>
                        <div style={styles.statLabel}>Regions</div>
                    </div>
                </div>
            </header>

            {/* Filter Section */}
            <div style={styles.filterSection}>
                <div style={styles.filterContainer}>
                    <h3 style={styles.filterTitle}>Filter by Region</h3>
                    <div style={styles.filterButtons}>
                        {regions.map(region => (
                            <button
                                key={region}
                                style={selectedRegion === region ? styles.filterButtonActive : styles.filterButton}
                                onClick={() => setSelectedRegion(region)}
                                onMouseOver={(e) => {
                                    if (selectedRegion !== region) {
                                        e.target.style.backgroundColor = '#f0f0f0';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedRegion !== region) {
                                        e.target.style.backgroundColor = 'white';
                                    }
                                }}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Destinations Grid */}
            <section style={styles.graySection}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        {selectedRegion === 'All' ? 'All Destinations' : `${selectedRegion} Destinations`}
                    </h2>
                    <p style={styles.sectionSubtitle}>
                        Explore top-rated universities in these amazing countries
                    </p>

                    <div style={styles.grid}>
                        {filteredData.map((destination, index) => (
                            <div 
                                key={index} 
                                style={styles.destinationCard}
                                onClick={() => handleDestinationClick(destination.country)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                }}
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
                                            {destination.country}
                                        </h3>
                                    </div>
                                </div>
                                <div style={styles.destinationContent}>
                                    <p style={{ color: '#666', margin: 0, fontWeight: '500' }}>
                                        {destination.count} Partner {destination.count === 1 ? 'University' : 'Universities'}
                                    </p>
                                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                        {destination.region}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CountryListPage;
