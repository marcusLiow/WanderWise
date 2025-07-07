<<<<<<< Updated upstream
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
=======
import { AppBar, Toolbar, Typography, Button, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Optional routing
    }
  };

>>>>>>> Stashed changes
  return (
    <AppBar position="static" sx={{ backgroundColor: "#FF3F00" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: logo/title */}
        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          WanderWise
        </Typography>
<<<<<<< Updated upstream
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">Home</Button>
=======

        {/* Middle: Search bar */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ flexGrow: 1, mx: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search universities..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              input: { padding: '6px 8px' }
            }}
          />
        </Box>

        {/* Right side: nav buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={handleHomeClick}>Home</Button>
>>>>>>> Stashed changes
          <Button color="inherit">Reviews</Button>
          <Button color="inherit">Universities</Button>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
