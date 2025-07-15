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
  Grid
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000';

// API functions to interact with your database
const getUniversitiesByCountry = async (countryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/universities/by-country?country=${encodeURIComponent(countryName)}`);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    return [];
  }
};

const getCountryByName = async (countryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries/search?name=${encodeURIComponent(countryName)}`);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
};

function SearchResults() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true);
      setError(null);
      
      if (countryName) {
        try {
          // Get country details
          const countryFormatted = countryName.replace(/-/g, ' ');
          console.log('Searching for country:', countryFormatted);
          
          const countryData = await getCountryByName(countryFormatted);
          console.log('Country data:', countryData);
          
          if (countryData) {
            setCountry(countryData);
            // Get universities for this country
            const universitiesData = await getUniversitiesByCountry(countryData.name);
            console.log('Universities data:', universitiesData);
            setUniversities(universitiesData);
            setSearchType('country');
          } else {
            setUniversities([]);
            setSearchType('country');
            setError(`Country "${countryFormatted}" not found`);
          }
        } catch (error) {
          console.error('Error loading universities:', error);
          setUniversities([]);
          setError('Failed to load universities');
        }
      } else {
        // General search results (if you have other search logic)
        setUniversities([]);
        setSearchType('general');
      }
      
      setLoading(false);
    };

    loadUniversities();
  }, [countryName]);

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if (universities.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">
          No universities found for "{getDisplayCountryName()}"
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchType === 'country' 
            ? `Universities in ${getDisplayCountryName()}`
            : 'Search Results'
          }
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found {universities.length} universities
        </Typography>
      </Box>

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
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                      {university.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {university.country}
                    </Typography>
                  </Box>

                  {university.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {university.description.length > 100 
                        ? `${university.description.substring(0, 100)}...` 
                        : university.description
                      }
                    </Typography>
                  )}

                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {university.rating > 0 && (
                      <Chip 
                        label={`Rating: ${university.rating}/5`}
                        color="primary"
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
    </Container>
  );
}

export default SearchResults;