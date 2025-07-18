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

const SUPABASE_URL = 'https://aojighzqmzouwhxyndbs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamlnaHpxbXpvdXdoeHluZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgyNTMsImV4cCI6MjA2Nzk4NDI1M30.1f2HHXbYxP8KaABhv4uw151Xj1mRDWxd63pHYgKIXnQ';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    
    const countries = data.map(item => item.name.trim().toLowerCase());
    return countries;
  } catch (error) {
    console.error('Error getting countries list:', error);
    return [];
  }
};


const findUniversityByName = async (searchTerm) => {
  try {
    console.log('🔍 Searching for university:', searchTerm);

    const countriesList = await getCountriesList();
    const searchLower = searchTerm.toLowerCase().trim();
    
    const isLikelyCountry = countriesList.some(country => 
      country === searchLower || 
      country.includes(searchLower) || 
      searchLower.includes(country)
    );
    
    if (isLikelyCountry) {
      console.log('🏳️ Search term appears to be a country name, skipping university search');
      return null;
    }
    
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
    
    const exactMatch = data.find(uni => 
      uni.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) {
      console.log('✅ Exact match found:', exactMatch.name);
      return exactMatch;
    }
    
    const universityKeywords = ['university', 'college', 'institute', 'school', 'academy'];
    const containsUniversityKeyword = universityKeywords.some(keyword => 
      searchLower.includes(keyword)
    );
    
    if (containsUniversityKeyword && data.length > 0) {

      const bestMatch = data.find(uni => {
        const uniNameLower = uni.name.toLowerCase();

        const searchWords = searchLower.split(' ').filter(word => word.length > 2);
        const matchedWords = searchWords.filter(word => uniNameLower.includes(word));
        return matchedWords.length >= Math.max(1, searchWords.length - 1);
      });
      
      if (bestMatch) {
        console.log('✅ Best university match found:', bestMatch.name);
        return bestMatch;
      }
    }
    
    if (data.length === 1 && searchTerm.length > 3) {
      const singleResult = data[0];
      const uniNameLower = singleResult.name.toLowerCase();
      
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


const findCountryAndUniversities = async (countryName) => {
  try {

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

const getUniversityRating = async (universityId) => {
  try {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('overallRating')
      .eq('university_id', universityId);

    if (reviewsError) {
      console.error('Error fetching reviews for rating:', reviewsError);
      return null;
    }

    if (!reviewsData || reviewsData.length === 0) {
      return null; // No reviews found
    }

    const ratingsWithValues = reviewsData.filter(review => 
      review.overallRating && review.overallRating > 0
    );
    
    if (ratingsWithValues.length === 0) {
      return null; // No valid ratings found
    }
    
    const total = ratingsWithValues.reduce((sum, review) => sum + review.overallRating, 0);
    return total / ratingsWithValues.length;
  } catch (error) {
    console.error('Error getting university rating:', error);
    return null;
  }
};


const getUniversitiesWithRatings = async (universities) => {
  try {
    const universityIds = universities.map(uni => uni.id);
    
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('university_id, overallRating')
      .in('university_id', universityIds);

    if (reviewsError) {
      console.error('Error fetching reviews for ratings:', reviewsError);
      return universities.map(uni => ({
        ...uni,
        calculatedRating: null
      }));
    }

    const ratingsByUniversity = {};
    
    if (reviewsData && reviewsData.length > 0) {
      reviewsData.forEach(review => {
        if (review.overallRating && review.overallRating > 0) {
          if (!ratingsByUniversity[review.university_id]) {
            ratingsByUniversity[review.university_id] = [];
          }
          ratingsByUniversity[review.university_id].push(review.overallRating);
        }
      });
    }

    const universitiesWithRatings = universities.map(university => {
      const ratings = ratingsByUniversity[university.id];
      let calculatedRating = null;
      
      if (ratings && ratings.length > 0) {
        const total = ratings.reduce((sum, rating) => sum + rating, 0);
        calculatedRating = total / ratings.length;
      }
      
      return {
        ...university,
        calculatedRating
      };
    });

    return universitiesWithRatings;
  } catch (error) {
    console.error('Error getting universities with ratings:', error);
    return universities.map(uni => ({
      ...uni,
      calculatedRating: null
    }));
  }
};

function SearchResults() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('');
  const [displayCountryName, setDisplayCountryName] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const getSearchQueryFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('q') || '';
  };

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

      if (updateUrl) {
        const searchSlug = createSlug(trimmedSearch);
        navigate(`/search?q=${encodeURIComponent(searchSlug)}`, { replace: true });
      }

      console.log('Step 1: Checking for university match...');
      const universityMatch = await findUniversityByName(trimmedSearch);
      
      if (universityMatch) {
        console.log('✅ University found, redirecting to:', universityMatch.name);
        const universitySlug = createSlug(universityMatch.name);
        navigate(`/university/${universitySlug}`, { 
          state: { universityId: universityMatch.id } 
        });
        return;
      }

      console.log('Step 2: Checking for country match...');
      const countryResult = await findCountryAndUniversities(trimmedSearch);
      
      if (countryResult.exists) {
        console.log('✅ Country found, showing universities for:', countryResult.countryName);
        
        const universitiesWithRatings = await getUniversitiesWithRatings(countryResult.universities);
        
        setUniversities(universitiesWithRatings);
        setDisplayCountryName(countryResult.countryName);
        setSearchType('country');
      } else {
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

      const searchQuery = getSearchQueryFromUrl();
      
      if (searchQuery) {
        const decodedSearch = decodeURIComponent(searchQuery).replace(/-/g, ' ');
        console.log('Decoded search term from URL query:', decodedSearch);
        
        await performSearch(decodedSearch, false);
      } else if (countryName) {
        const decodedSearch = decodeURIComponent(countryName).replace(/-/g, ' ');
        console.log('Decoded search term from URL path:', decodedSearch);
        
        await performSearch(decodedSearch, true);
      } else {
        setLoading(true);
        try {
          const allUniversitiesData = await getAllUniversities();
          
          const universitiesWithRatings = await getUniversitiesWithRatings(allUniversitiesData);
          
          setUniversities(universitiesWithRatings);
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

  const handleClearSearch = async () => {
    setSearchTerm('');
    setError(null);
    
    navigate('/search', { replace: true });
    
    setLoading(true);
    const allUniversitiesData = await getAllUniversities();
    
    const universitiesWithRatings = await getUniversitiesWithRatings(allUniversitiesData);
    
    setUniversities(universitiesWithRatings);
    setSearchType('browse');
    setDisplayCountryName('');
    setLoading(false);
  };

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
            • Try searching for a specific university name (e.g., "ESSEC Business School", "IE University")
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
                      {university.calculatedRating !== null ? (
                        <Chip 
                          label={`⭐ ${university.calculatedRating.toFixed(1)}/5`}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="No Rating"
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