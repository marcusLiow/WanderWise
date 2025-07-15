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
const SUPABASE_URL = 'https://pevsocbbbuksmuxabogz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldnNvY2JiYnVrc211eGFib2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjMyMDksImV4cCI6MjA2ODEzOTIwOX0.2o3w-XAPhFdv5cISUWWTClMN04fMybqjkNQ1NMkjEDU';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// API functions using Supabase
const findUniversityByName = async (universityName) => {
  try {
    console.log('🔍 Searching for university:', universityName);
    
    // First try: Exact and partial matches
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('name', `%${universityName}%`)
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
      uni.name.toLowerCase() === universityName.toLowerCase()
    );
    
    if (exactMatch) {
      console.log('✅ Exact match found:', exactMatch.name);
      return exactMatch;
    }
    
    // If only one result, return it
    if (data.length === 1) {
      console.log('✅ Single result found:', data[0].name);
      return data[0];
    }
    
    // Check for very close matches
    const searchLower = universityName.toLowerCase();
    const closeMatches = data.filter(uni => {
      const uniNameLower = uni.name.toLowerCase();
      
      // Check if search term matches significant part of university name
      const words = uniNameLower.split(' ');
      const searchWords = searchLower.split(' ');
      
      // If search term matches any major word in university name
      for (const searchWord of searchWords) {
        if (searchWord.length >= 3) {
          for (const uniWord of words) {
            if (uniWord.includes(searchWord) || searchWord.includes(uniWord)) {
              // Additional check: make sure it's a significant match
              if (searchWord.length >= 4 || uniWord.length <= 5) {
                return true;
              }
            }
          }
        }
      }
      
      return false;
    });
    
    if (closeMatches.length === 1) {
      console.log('✅ Close match found:', closeMatches[0].name);
      return closeMatches[0];
    }
    
    console.log('❓ Multiple potential matches found:', closeMatches.length);
    return null; // Multiple matches, let user choose from results
    
  } catch (error) {
    console.error('❌ Error finding university:', error);
    return null;
  }
};

const findCountryAndUniversities = async (countryName) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('country', countryName)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return { exists: false, universities: [] };
    }
    
    return {
      exists: data && data.length > 0,
      universities: data || []
    };
  } catch (error) {
    console.error('Error finding country:', error);
    return { exists: false, universities: [] };
  }
};

const getAllUniversities = async () => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
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

  // UPDATED: Main search logic that handles both URL and manual searches
  const performSearch = async (searchQuery) => {
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
        console.log('✅ Country found, showing universities for:', trimmedSearch);
        setUniversities(countryResult.universities);
        setDisplayCountryName(trimmedSearch);
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

      if (countryName) {
        // URL-based search - could be country OR university
        const decodedSearch = decodeURIComponent(countryName).replace(/-/g, ' ');
        console.log('Decoded search term from URL:', decodedSearch);
        
        // Perform the same search logic as manual search
        await performSearch(decodedSearch);
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
  }, [countryName, location.pathname]);

  // UPDATED: Manual search function (for search button/enter key)
  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setIsSearching(true);
    await performSearch(searchTerm);
    setIsSearching(false);
    setSearchTerm(''); // Clear search after performing search
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    setError(null);
    
    // Reset to browse all universities
    setLoading(true);
    const allUniversitiesData = await getAllUniversities();
    setUniversities(allUniversitiesData);
    setSearchType('browse');
    setDisplayCountryName('');
    setLoading(false);
  };

  // Step 3: Handle university click (redirect to specific uni page)
  const handleUniversityClick = (university) => {
    const universitySlug = createSlug(university.name);
    navigate(`/university/${universitySlug}`, { state: { universityId: university.id } });
  };

  const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
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
            placeholder="e.g., Harvard, Stanford, France, Japan..."
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
                        {university.country || 'Unknown'}
                      </Typography>
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
                      {university.rating > 0 ? (
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