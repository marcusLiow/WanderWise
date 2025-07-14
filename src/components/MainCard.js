import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function MainCard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    
    const images = [
        'https://www.ntnu.edu/documents/1289651401/1339396683/Hovedbygget.jpg/08dad362-e352-e195-0283-d40706d5bf3b?t=1723102578793',
        'https://www.smu.edu.sg/sites/default/files/inline-images/oss-banner.jpg',
        'https://ifsa-butler.org/wp-content/uploads/2023/09/HERO-Oxford_1231106194.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kodaki_fuji_frm_shojinko.jpg/960px-Kodaki_fuji_frm_shojinko.jpg' 
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    // Function to handle search
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        // Navigate to the UniversityProfile component with search query
        // This will trigger the search logic in UniversityProfile
        navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    };

    // Handle Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <Card sx={{ 
            maxWidth: 1000,
            height: 500, 
            margin: "25px auto",
            backgroundImage: `url(${images[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <CardContent sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black', 
                borderRadius: 2,
                padding: 4,
                textAlign: 'center',
                minWidth: '400px',
                maxWidth: '600px'
            }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: '#333'
                }}>
                    Where would you like to go?
                </Typography>
                
                {/* Search form */}
                <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        size="large"
                        placeholder="Search universities or countries..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: '12px 16px',
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch} edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: '#FF3F00',
                            '&:hover': {
                                backgroundColor: '#E63600',
                            },
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Search
                    </Button>
                </Box>

                <Typography variant="body1" sx={{
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Find your perfect university destination
                </Typography>
                
                <Typography
                    variant="caption"
                    align="center"
                    sx={{ marginTop: 2, display: 'block', color: 'text.secondary' }}
                >
                    Try searching for "Harvard University" or "USA"
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MainCard;