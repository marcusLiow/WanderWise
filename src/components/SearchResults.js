import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Box,
  Chip,
  Grid,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import { createClient } from '@supabase/supabase-js';

// 🔑 SUPABASE CONNECTION
const SUPABASE_URL = 'https://aojighzqmzouwhxyndbs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get list of countries from the countries table
const getCountriesList = async () => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
    
    // Get country names and normalize them
    const countries = data.map(item => item.name.trim().toLowerCase());
    return countries;
  } catch (error) {
    console.error('Error getting countries list:', error);
    return [];
  }
};

// UPDATED: More restrictive university search that avoids country matches
const findUniversityByName = async (searchTerm) => {
  try {
    console.log('🔍 Searching for university:', searchTerm);
    
    // First check if the search term is likely a country name
    const countriesList = await getCountriesList();
    const searchLower = searchTerm.toLowerCase().trim();
    
    // If search term matches a country name, don't treat it as university search
    const isLikelyCountry = countriesList.some(country => 
      country === searchLower || 
      country.includes(searchLower) || 
      searchLower.includes(country)
    );
    
    if (isLikelyCountry) {
      console.log('🏳️ Search term appears to be a country name, skipping university search');
      return null;
    }
    
    // Search for universities with more restrictive matching
    const { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries!universities_country_fkey (
          name,
          flag
        )
      `)
      .ilike('name', `%${searchTerm}%`)
      .order('name');
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return null;
    }
    
    console.log('📊 Query results:', data ? data.length : 0, 'universities found');
    if (data && data.length > 0) {
      console.log('📋 Found universities:', data.map(u => u.name));
    }
    
    if (!data || data.length === 0) {
      console.log('❌ No universities found');
      return null;
    }
    
    // Check for exact match first (case insensitive)
    const exactMatch = data.find(uni => 
      uni.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) {
      console.log('✅ Exact match found:', exactMatch.name);
      return exactMatch;
    }
    
    // For partial matches, be more restrictive
    const universityKeywords = ['university', 'college', 'institute', 'school', 'academy'];
    const containsUniversityKeyword = universityKeywords.some(keyword => 
      searchLower.includes(keyword)
    );
    
    // If search contains university keywords and we have matches
    if (containsUniversityKeyword && data.length > 0) {
      // Look for the best match
      const bestMatch = data.find(uni => {
        const uniNameLower = uni.name.toLowerCase();
        // Check if most words from search term appear in university name
        const searchWords = searchLower.split(' ').filter(word => word.length > 2);
        const matchedWords = searchWords.filter(word => uniNameLower.includes(word));
        return matchedWords.length >= Math.max(1, searchWords.length - 1);
      });
      
      if (bestMatch) {
        console.log('✅ Best university match found:', bestMatch.name);
        return bestMatch;
      }
    }
    
    // If only one result and search term is substantial
    if (data.length === 1 && searchTerm.length > 3) {
      const singleResult = data[0];
      const uniNameLower = singleResult.name.toLowerCase();
      
      // Make sure the search term significantly matches the university name
      const searchWords = searchLower.split(' ').filter(word => word.length > 2);
      const significantMatch = searchWords.some(word => 
        uniNameLower.includes(word) && word.length > 3
      );
      
      if (significantMatch) {
        console.log('✅ Single significant match found:', singleResult.name);
        return singleResult;
      }
    }
    
    console.log('❓ No clear university match found, treating as potential country search');
    return null;
    
  } catch (error) {
    console.error('❌ Error finding university:', error);
    return null;
  }
};

// UPDATED: Find universities by country using the new schema
const findCountryAndUniversities = async (countryName) => {
  try {
    // First, find the country by name
    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .select('code, name')
      .ilike('name', `%${countryName}%`)
      .limit(1);
    
    if (countryError) {
      console.error('Country lookup error:', countryError);
      return { exists: false, universities: [] };
    }
    
    if (!countryData || countryData.length === 0) {
      return { exists: false, universities: [] };
    }
    
    const country = countryData[0];
    
    // Now find universities in that country
    const { data: universitiesData, error: universitiesError } = await supabase
      .from('universities')
      .select(`
        *,
        countries!universities_country_fkey (
          name,
          flag
        )
      `)
      .eq('country_code', country.code)
      .order('name');
    
    if (universitiesError) {
      console.error('Universities lookup error:', universitiesError);
      return { exists: false, universities: [] };
    }
    
    return {
      exists: true,
      universities: universitiesData || [],
      countryName: country.name
    };
  } catch (error) {
    console.error('Error finding country:', error);
    return { exists: false, universities: [] };
  }
};

// UPDATED: Get all universities with country information
const getAllUniversities = async () => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries!universities_country_fkey (
          name,
          flag
        )
      `)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all universities:', error);
    return [];
  }
};

function SearchResults() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState(''); // 'country', 'not-found', or 'browse'
  const [displayCountryName, setDisplayCountryName] = useState('');
  
  // Search controls
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Helper function to create URL-friendly slugs
  const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  // Helper function to get search query from URL
  const getSearchQueryFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('q') || '';
  };

  // UPDATED: Main search logic that handles both URL and manual searches
  const performSearch = async (searchQuery, updateUrl = false) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trimmedSearch = searchQuery.trim();
      console.log('=== PERFORMING SEARCH ===');
      console.log('Search query:', trimmedSearch);

      // UPDATE URL if this is a manual search
      if (updateUrl) {
        const searchSlug = createSlug(trimmedSearch);
        navigate(`/search?q=${encodeURIComponent(searchSlug)}`, { replace: true });
      }

      // Step 1: Check if it's a university name
      console.log('Step 1: Checking for university match...');
      const universityMatch = await findUniversityByName(trimmedSearch);
      
      if (universityMatch) {
        // Step 2a: University found → redirect to specific uni page
        console.log('✅ University found, redirecting to:', universityMatch.name);
        const universitySlug = createSlug(universityMatch.name);
        navigate(`/university/${universitySlug}`, { 
          state: { universityId: universityMatch.id } 
        });
        return;
      }

      // Step 2b: Check if it's a country name
      console.log('Step 2: Checking for country match...');
      const countryResult = await findCountryAndUniversities(trimmedSearch);
      
      if (countryResult.exists) {
        // Step 2b: Country found → show list of universities in that country
        console.log('✅ Country found, showing universities for:', countryResult.countryName);
        setUniversities(countryResult.universities);
        setDisplayCountryName(countryResult.countryName);
        setSearchType('country');
      } else {
        // Step 2c: Neither university nor country found → no results
        console.log('❌ No university or country found for:', trimmedSearch);
        setUniversities([]);
        setSearchType('not-found');
        setError(`No universities or countries found for "${trimmedSearch}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
      setSearchType('not-found');
      setUniversities([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      console.log('=== COMPONENT INITIALIZATION ===');
      console.log('countryName from URL:', countryName);
      console.log('Current location:', location.pathname);
      console.log('Search params:', location.search);

      // Check for search query in URL params first
      const searchQuery = getSearchQueryFromUrl();
      
      if (searchQuery) {
        // URL-based search from query parameter
        const decodedSearch = decodeURIComponent(searchQuery).replace(/-/g, ' ');
        console.log('Decoded search term from URL query:', decodedSearch);
        
        // Perform the search logic without updating URL (already in URL)
        await performSearch(decodedSearch, false);
      } else if (countryName) {
        // Legacy URL-based search from path parameter
        const decodedSearch = decodeURIComponent(countryName).replace(/-/g, ' ');
        console.log('Decoded search term from URL path:', decodedSearch);
        
        // Perform the search logic and update URL to new format
        await performSearch(decodedSearch, true);
      } else {
        // No URL parameter - load all universities for browsing
        setLoading(true);
        try {
          const allUniversitiesData = await getAllUniversities();
          setUniversities(allUniversitiesData);
          setSearchType('browse');
        } catch (error) {
          console.error('Error loading all universities:', error);
          setError('Failed to load universities');
        }
        setLoading(false);
      }
    };

    initializeData();
  }, [countryName, location.search]);

  // Manual search function
  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setIsSearching(true);
    await performSearch(searchTerm, true);
    setIsSearching(false);
    setSearchTerm('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search function
  const handleClearSearch = async () => {
    setSearchTerm('');
    setError(null);
    
    // Update URL to remove search parameters
    navigate('/search', { replace: true });
    
    // Reset to browse all universities
    setLoading(true);
    const allUniversitiesData = await getAllUniversities();
    setUniversities(allUniversitiesData);
    setSearchType('browse');
    setDisplayCountryName('');
    setLoading(false);
  };

  // Handle university click
  const handleUniversityClick = (university) => {
    const universitySlug = createSlug(university.name);
    navigate(`/university/${universitySlug}`, { state: { universityId: university.id } });
  };

  const getResultsTitle = () => {
    if (searchType === 'country') {
      return `Universities in ${displayCountryName}`;
    }
    if (searchType === 'not-found') {
      return 'No Results Found';
    }
    return 'All Universities';
  };

  const getSubtitle = () => {
    if (searchType === 'not-found') {
      return 'Try searching for a different university or country name';
    }
    return `Found ${universities.length} universities`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography>Loading universities...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search Section */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'white', 
        borderRadius: 2, 
        boxShadow: 1 
      }}>
        <Typography variant="h5" gutterBottom>
          Search Universities or Countries
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <TextField
            label="Enter university or country name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., ESSEC Business School, Chuo Univeristy, ESADE ..."
            helperText="University names redirect directly. Country names show all universities in that country."
          />
          
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            sx={{ minWidth: 120, height: 56 }}
          >
            {isSearching ? <CircularProgress size={20} /> : 'Search'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            disabled={isSearching}
            sx={{ height: 56 }}
          >
            Show All
          </Button>
        </Box>

        {error && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: '#ffebee', 
            borderRadius: 1,
            border: '1px solid #e57373'
          }}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Results Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getResultsTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getSubtitle()}
        </Typography>
      </Box>

      {/* Results Grid */}
      {searchType === 'not-found' ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h6" gutterBottom>
            😔 No Results Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find any universities or countries matching your search.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Tips:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • Try searching for a specific university name (e.g., "Harvard", "Stanford")
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • Try searching for a country name (e.g., "United States", "France")
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Check your spelling or try a shorter search term
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {universities.map((university) => (
            <Grid item xs={12} md={6} lg={4} key={university.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleUniversityClick(university)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
                      <Typography variant="h6" component="h2" sx={{ flexGrow: 1, lineHeight: 1.3 }}>
                        {university.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {university.countries?.name || 'Unknown'}
                      </Typography>
                      {university.countries?.flag && (
                        <Box 
                          component="img" 
                          src={university.countries.flag} 
                          alt={`${university.countries.name} flag`}
                          sx={{ 
                            width: 16, 
                            height: 12, 
                            ml: 1,
                            borderRadius: 0.5,
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                    </Box>

                    {university.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1, lineHeight: 1.5 }}
                      >
                        {university.description.length > 120 
                          ? `${university.description.substring(0, 120)}...` 
                          : university.description
                        }
                      </Typography>
                    )}

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {university.rating && university.rating > 0 ? (
                        <Chip 
                          label={`⭐ ${university.rating}/5`}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Rating: N/A"
                          variant="outlined"
                          size="small"
                        />
                      )}
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        View Details →
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Show All Button for country results */}
      {searchType === 'country' && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={handleClearSearch}
            size="large"
          >
            Browse All Universities
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default SearchResults;