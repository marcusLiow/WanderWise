import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// 🔑 SUPABASE CONNECTION (using same credentials as SearchResults.js)
const SUPABASE_URL = 'https://aojighzqmzouwhxyndbs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const UniListPage = () => {
    const navigate = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to create URL-friendly slugs (same as SearchResults.js)
    const createSlug = (str) => {
        return str.toLowerCase().replace(/\s+/g, '-');
    };

    // Region mapping for countries
    const getRegionForCountry = (countryName) => {
        const regionMapping = {
            // Asia
            'China': 'Asia',
            'Hong Kong': 'Asia',
            'Japan': 'Asia',
            'Philippines': 'Asia',
            'South Korea': 'Asia',
            'Taiwan': 'Asia',
            'Thailand': 'Asia',
            'Singapore': 'Asia',
            'Malaysia': 'Asia',
            'Indonesia': 'Asia',
            'Vietnam': 'Asia',
            'India': 'Asia',
            
            // Europe
            'Austria': 'Europe',
            'Belgium': 'Europe',
            'Denmark': 'Europe',
            'France': 'Europe',
            'Germany': 'Europe',
            'Hungary': 'Europe',
            'Iceland': 'Europe',
            'Italy': 'Europe',
            'Lithuania': 'Europe',
            'Netherlands': 'Europe',
            'Spain': 'Europe',
            'Sweden': 'Europe',
            'Switzerland': 'Europe',
            'United Kingdom': 'Europe',
            'UK': 'Europe',
            'Finland': 'Europe',
            'Norway': 'Europe',
            'Ireland': 'Europe',
            'Poland': 'Europe',
            'Portugal': 'Europe',
            'Czech Republic': 'Europe',
            
            // North America
            'United States': 'North America',
            'USA': 'North America',
            'US': 'North America',
            'Canada': 'North America',
            'Mexico': 'North America',
            
            // Middle East
            'Turkey': 'Middle East',
            'Israel': 'Middle East',
            'UAE': 'Middle East',
            'Saudi Arabia': 'Middle East',
            'Jordan': 'Middle East',
            'Lebanon': 'Middle East',
            
            // Central Asia
            'Kazakhstan': 'Central Asia',
            'Uzbekistan': 'Central Asia',
            'Kyrgyzstan': 'Central Asia',
            
            // Oceania
            'Australia': 'Oceania',
            'New Zealand': 'Oceania',
            
            // South America
            'Brazil': 'South America',
            'Argentina': 'South America',
            'Chile': 'South America',
            'Colombia': 'South America',
            'Peru': 'South America',
            
            // Africa
            'South Africa': 'Africa',
            'Egypt': 'Africa',
            'Morocco': 'Africa',
            'Kenya': 'Africa',
            'Nigeria': 'Africa'
        };
        
        return regionMapping[countryName] || 'Other';
    };

    // Convert country code to flag emoji
    const getFlagEmoji = (countryCode) => {
        if (!countryCode || countryCode.length !== 2) return '';
        
        try {
            // Convert country code to flag emoji
            const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch (error) {
            console.warn('Error converting country code to flag:', countryCode, error);
            return '';
        }
    };

    // Get flag display (emoji or fallback)
    const getCountryFlag = (flagData, countryCode, countryName) => {
        // If flag is already an emoji or image URL, use it
        if (flagData) {
            if (flagData.startsWith('http')) {
                return <img src={flagData} alt={`${countryName} flag`} style={{width: '20px', height: '15px', objectFit: 'cover'}} />;
            }
            if (flagData.length <= 4) { // Likely an emoji
                return flagData;
            }
        }
        
        // Try to generate flag emoji from country code
        if (countryCode) {
            const flagEmoji = getFlagEmoji(countryCode);
            if (flagEmoji) return flagEmoji;
        }
        
        // Fallback to 🌍 globe emoji
        return '🌍';
    };

    // UPDATED: Get placeholder image based on country/region with FIXED France and Belgium URLs
    const getUniversityImage = (countryName, universityName) => {
        const countryImages = {
            'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop',
            'Hong Kong': 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=400&h=300&fit=crop',
            'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
            'South Korea': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
            'Taiwan': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop',
            'Thailand': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            'Philippines': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
            'United States': 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400&h=300&fit=crop',
            'USA': 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400&h=300&fit=crop',
            'US': 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400&h=300&fit=crop',
            'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop',
            'France': 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
            'Belgium': 'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=400&h=300&fit=crop',
            'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
            'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
            'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
            'Spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
            'Italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
            'Netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop',
            'Switzerland': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
            'Sweden': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=300&fit=crop',
            'Australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            'Turkey': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop',
            'Kazakhstan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400&h=300&fit=crop',
            'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop',
            'Austria': 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=300&fit=crop',
            'Denmark': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop'
        };
        
        // First try to get country-specific image
        if (countryImages[countryName]) {
            return countryImages[countryName];
        }
        
        // If no country match, use a reliable fallback based on university name hash
        const nameHash = Math.abs(universityName.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
        const fallbackImages = [
            'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400&h=300&fit=crop'
        ];
        
        return fallbackImages[nameHash % fallbackImages.length];
    };

    // NEW: University Card Component with enhanced error handling
    const UniversityCard = ({ university, index }) => {
        const [imageSrc, setImageSrc] = useState(university.image);
        const [imageError, setImageError] = useState(false);
        const [retryCount, setRetryCount] = useState(0);

        const handleImageError = () => {
            if (retryCount < 2) {
                setRetryCount(prev => prev + 1);
                // Try different fallback images
                const fallbackImages = [
                    getUniversityImage(university.country, university.name),
                    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop'
                ];
                setImageSrc(fallbackImages[retryCount] || fallbackImages[0]);
            } else {
                setImageError(true);
            }
        };

        return (
            <div 
                key={university.id || index} 
                style={styles.destinationCard}
                onClick={() => handleDestinationClick(university)}
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
                    backgroundImage: imageError ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : `url(${imageSrc})`
                }}>
                    {/* Hidden img tag to trigger error handling */}
                    {!imageError && (
                        <img 
                            src={imageSrc} 
                            alt={university.name}
                            style={{ display: 'none' }}
                            onError={handleImageError}
                        />
                    )}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: imageError ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <h3 style={{ 
                            color: 'white', 
                            fontSize: '1.3rem', 
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            textAlign: 'center',
                            padding: '0 10px'
                        }}>
                            {university.name}
                        </h3>
                    </div>
                </div>
                <div style={styles.destinationContent}>
                    <p style={{ color: '#666', margin: 0, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{university.country}</span>
                        <span>{getCountryFlag(university.countryFlag, university.countryCode, university.country)}</span>
                    </p>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                        {university.region}
                    </p>
                    {university.rating && university.rating > 0 && (
                        <p style={{ color: '#ff3f00', fontSize: '0.9rem', margin: '10px 0 0 0', fontWeight: 'bold' }}>
                            ⭐ {university.rating}/5.0
                        </p>
                    )}
                    {university.description && (
                        <p style={{ 
                            color: '#777', 
                            fontSize: '0.85rem', 
                            margin: '10px 0 0 0',
                            lineHeight: '1.4'
                        }}>
                            {university.description.length > 100 
                                ? `${university.description.substring(0, 100)}...` 
                                : university.description
                            }
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // Fetch universities from Supabase
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from('universities')
                    .select(`
                        id,
                        name,
                        description,
                        logo,
                        rating,
                        country_code,
                        countries!universities_country_fkey (
                            name,
                            flag
                        )
                    `)
                    .order('name');

                if (error) {
                    console.error('Error fetching universities:', error);
                    setError('Failed to load universities');
                    return;
                }

                if (data) {
                    // Transform data and add region information
                    const transformedData = data.map(university => ({
                        id: university.id,
                        name: university.name,
                        description: university.description,
                        logo: university.logo,
                        rating: university.rating,
                        country: university.countries?.name || 'Unknown',
                        countryCode: university.country_code,
                        countryFlag: university.countries?.flag,
                        region: getRegionForCountry(university.countries?.name || ''),
                        image: university.logo || getUniversityImage(university.countries?.name || '', university.name)
                    }));

                    setUniversities(transformedData);
                    console.log(`Loaded ${transformedData.length} universities from database`);
                }
            } catch (error) {
                console.error('Error in fetchUniversities:', error);
                setError('Failed to load universities');
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    // Get unique regions from the loaded data
    const regions = useMemo(() => {
        const uniqueRegions = [...new Set(universities.map(uni => uni.region))].sort();
        return ['All', ...uniqueRegions];
    }, [universities]);

    // Filter universities by selected region
    const filteredData = useMemo(() => {
        if (selectedRegion === 'All') {
            return universities.sort((a, b) => a.name.localeCompare(b.name));
        }
        return universities
            .filter(item => item.region === selectedRegion)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedRegion, universities]);

    // UPDATED: Navigation function - redirects directly to university page like SearchResults.js
    const handleDestinationClick = (university) => {
        const universitySlug = createSlug(university.name);
        navigate(`/university/${universitySlug}`, { state: { universityId: university.id } });
    };

    // Get statistics
    const totalUniversities = universities.length;
    const totalCountries = [...new Set(universities.map(item => item.country))].length;
    const totalRegions = regions.length - 1; // Exclude "All"

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
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '1.2rem',
            color: '#666'
        },
        errorContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '1.2rem',
            color: '#ff3f00',
            textAlign: 'center'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Partner Universities</h1>
                    <p style={styles.subtitle}>Loading universities from our database...</p>
                </header>
                <div style={styles.loadingContainer}>
                    Loading universities...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Partner Universities</h1>
                    <p style={styles.subtitle}>Something went wrong</p>
                </header>
                <div style={styles.errorContainer}>
                    <div>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={styles.filterButton}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>Partner Universities</h1>
                <p style={styles.subtitle}>
                    Discover amazing opportunities at top universities worldwide through SMU's International Student Exchange Programme
                </p>
                
                {/* Stats */}
                <div style={styles.stats}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalUniversities}</div>
                        <div style={styles.statLabel}>Universities</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalCountries}</div>
                        <div style={styles.statLabel}>Countries</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalRegions}</div>
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

            {/* Universities Grid */}
            <section style={styles.graySection}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        {selectedRegion === 'All' ? 'All Universities' : `${selectedRegion} Universities`}
                    </h2>
                    <p style={styles.sectionSubtitle}>
                        {filteredData.length > 0 
                            ? `Showing ${filteredData.length} universities${selectedRegion !== 'All' ? ` in ${selectedRegion}` : ''}`
                            : 'No universities found in this region'
                        }
                    </p>

                    {/* UPDATED: Using enhanced UniversityCard component */}
                    <div style={styles.grid}>
                        {filteredData.map((university, index) => (
                            <UniversityCard 
                                key={university.id || index}
                                university={university}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniListPage;