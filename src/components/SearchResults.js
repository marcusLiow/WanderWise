import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search/universities?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityClick = (universityId, universityName) => {
    // Create a URL-friendly slug from the university name
    const slug = universityName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    navigate(`/university/${slug}`, { state: { universityId } });
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
      stars.push(<span key={`empty-${i}`} style={{ color: '#E0E0E0' }}>☆</span>);
    }
    return stars;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>
      
      {searchResults.length === 0 ? (
        <Alert severity="info">No universities found matching your search.</Alert>
      ) : (
        <Card>
          <CardContent>
            <List>
              {searchResults.map((university) => (
                <ListItem 
                  key={university.id}
                  button
                  onClick={() => handleUniversityClick(university.id, university.name)}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer'
                    },
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={university.logo} 
                      alt={university.name}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" component="span">
                          {university.name}
                        </Typography>
                        <Chip 
                          label={university.country} 
                          size="small" 
                          color="primary"
                          avatar={<Avatar src={university.flag} />}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {university.description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box>{renderStars(university.rating)}</Box>
                          <Typography variant="body2" color="text.secondary">
                            {university.rating}/5
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default SearchResults;