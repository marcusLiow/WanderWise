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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
const getUniversitiesByCountry = async (countryName) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('country', countryName)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    return [];
  }
};

const searchUniversities = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error searching universities:', error);
    return [];
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

const getUniqueCountries = async () => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('country')
      .order('country');
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    // Get unique countries and filter out null/empty values
    const uniqueCountries = [...new Set(data.map(item => item.country))];
    return uniqueCountries.filter(country => country);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Check if a country exists (simplified since we're getting data directly from universities table)
const getCountryByName = async (countryName) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('country')
      .ilike('country', countryName)
      .limit(1);
    
    if (error || !data || data.length === 0) {
      return null;
    }
    
    return { name: data[0].country };
  } catch (error) {
    console.error('Error checking country:', error);
    return null;
  }
};

function SearchResults() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [error, setError] = useState(null);
  
  // Search controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load countries for dropdown
        const countriesData = await getUniqueCountries();
        setCountries(countriesData);

        if (countryName) {
          // URL-based country search (from your existing logic)
          const countryFormatted = countryName.replace(/-/g, ' ');
          console.log('Searching for country:', countryFormatted);
          
          const countryData = await getCountryByName(countryFormatted);
          console.log('Country data:', countryData);
          
          if (countryData) {
            setCountry(countryData);
            setSelectedCountry(countryData.name);
            const universitiesData = await getUniversitiesByCountry(countryData.name);
            console.log('Universities data:', universitiesData);
            setUniversities(universitiesData);
            setSearchType('country');
          } else {
            setUniversities([]);
            setSearchType('country');
            setError(`Country "${countryFormatted}" not found`);
          }
        } else {
          // Load all universities initially
          const allUniversitiesData = await getAllUniversities();
          setAllUniversities(allUniversitiesData);
          setUniversities(allUniversitiesData);
          setSearchType('general');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load universities');
      }
      
      setLoading(false);
    };

    initializeData();
  }, [countryName]);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    try {
      let results = [];

      if (searchTerm && selectedCountry) {
        // Search by both name and country
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .ilike('country', selectedCountry)
          .order('name');
        
        if (error) throw error;
        results = data || [];
      } else if (searchTerm) {
        // Search by name only
        results = await searchUniversities(searchTerm);
      } else if (selectedCountry) {
        // Search by country only
        results = await getUniversitiesByCountry(selectedCountry);
      } else {
        // No filters, show all
        results = allUniversities;
      }

      setUniversities(results);
      setSearchType(searchTerm || selectedCountry ? 'search' : 'general');
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    }

    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setUniversities(allUniversities);
    setSearchType('general');
    setError(null);
  };

  const handleUniversityClick = (university) => {
    const universitySlug = createSlug(university.name);
    navigate(`/university/${universitySlug}`, { state: { universityId: university.id } });
  };

  const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const getDisplayCountryName = () => {
    if (country) {
      return country.name;
    }
    if (countryName) {
      return countryName.replace(/-/g, ' ');
    }
    return '';
  };

  const getResultsTitle = () => {
    if (searchType === 'country') {
      return `Universities in ${getDisplayCountryName()}`;
    }
    if (searchType === 'search') {
      const parts = [];
      if (searchTerm) parts.push(`"${searchTerm}"`);
      if (selectedCountry) parts.push(`in ${selectedCountry}`);
      return `Search Results for ${parts.join(' ')}`;
    }
    return 'All Universities';
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#ffebee', 
          borderRadius: 2, 
          border: '1px solid #e57373',
          mb: 3 
        }}>
          <Typography color="error" variant="h6" gutterBottom>
            Error
          </Typography>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search Controls */}
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        backgroundColor: 'white', 
        borderRadius: 2, 
        boxShadow: 1 
      }}>
        <Typography variant="h5" gutterBottom>
          Search Universities
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Filter by Country</InputLabel>
            <Select
              value={selectedCountry}
              label="Filter by Country"
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <MenuItem value="">All Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isSearching}
            sx={{ minWidth: 120 }}
          >
            {isSearching ? <CircularProgress size={20} /> : 'Search'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            disabled={isSearching}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Results Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getResultsTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found {universities.length} universities
        </Typography>
      </Box>

      {/* Results Grid */}
      {universities.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h6" gutterBottom>
            No universities found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search criteria or browse all universities.
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
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleUniversityClick(university)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
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
                        {university.description.length > 150 
                          ? `${university.description.substring(0, 150)}...` 
                          : university.description
                        }
                      </Typography>
                    )}

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {university.rating > 0 ? (
                        <Chip 
                          label={`Rating: ${university.rating}/5`}
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
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
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
    </Container>
  );
}

export default SearchResults;