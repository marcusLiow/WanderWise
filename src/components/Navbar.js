import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Add this to detect navigation changes
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Check if user is logged in when component mounts OR when location changes
  useEffect(() => {
    const savedUser = localStorage.getItem('wanderwise_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, [location]); // Add location as dependency so it re-runs on navigation

  // Listen for profile updates
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const savedUser = localStorage.getItem('wanderwise_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('Navbar updated with new user data:', parsedUser);
      }
    };

    // Listen for custom event when profile is updated
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderwise_user');
    setUser(null);
    setAnchorEl(null);
    navigate('/');
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user?.firstName && !user?.name && !user?.email) return 'U';
    const name = user.firstName || user.name || user.email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#FF3F00" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: logo/title */}
        <Button color='inherit' onClick={handleHomeClick}>
          <Typography variant="h6" sx={{ flexShrink: 0 }}>
            WanderWise
          </Typography>
        </Button>

        {/* Right side: nav buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit">Countries</Button>
          <Button color="inherit">Universities</Button>
          
          {/* Simple check: if user exists, show profile, otherwise show login */}
          {user ? (
            <>
              <Button 
                color="inherit" 
                onClick={handleProfileClick}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Avatar 
                  src={user?.profileImage || null}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    width: 32, 
                    height: 32,
                    fontSize: '14px'
                  }}
                >
                  {!user?.profileImage && getUserInitials()}
                </Avatar>
                <Typography variant="body2">
                  {user?.firstName || user?.name || user?.email?.split('@')[0] || 'Profile'}
                </Typography>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfileNavigation}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;