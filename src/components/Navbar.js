import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wanderwise_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleUserDataUpdate = () => {
      const savedUser = localStorage.getItem('wanderwise_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('Navbar updated with new user data:', parsedUser);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
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

  const handleWriteReviewClick = () => {
    navigate('/write-review');
  };

  const handleUniversitiesClick = () => {
    navigate('/universities');
  };

  const handleCountriesClick = () => {
    navigate('/countries');
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
          <Button color="inherit" onClick={handleCountriesClick}>Countries</Button>
          <Button color="inherit" onClick={handleUniversitiesClick}>Universities</Button>
          
          {/* Enhanced Write Review button - only show when logged in */}
          {user && (
            <Chip
              label="Write Review"
              icon={<EditIcon sx={{ fontSize: '18px !important', color: '#FF3F00 !important' }} />}
              onClick={handleWriteReviewClick}
              clickable
              sx={{
                backgroundColor: 'white',
                color: '#FF3F00',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                height: '36px',
                borderRadius: '18px',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#fff5f3',
                  border: '2px solid white',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                '& .MuiChip-label': {
                  paddingLeft: '8px',
                  paddingRight: '12px',
                  fontWeight: 'bold',
                },
                ml: 1,
              }}
            />
          )}
          
          {/* Enhanced User profile or login button */}
          {user ? (
            <>
              <Button 
                color="inherit" 
                onClick={handleProfileClick}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  ml: 1,
                }}
              >
                <Avatar 
                  src={user?.profileImage || null}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#FF3F00',
                    width: 32, 
                    height: 32,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {!user?.profileImage && getUserInitials()}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {user?.firstName || user?.name || user?.email?.split('@')[0] || 'Profile'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: 1 }}>
                    View Profile
                  </Typography>
                </Box>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 140,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <MenuItem 
                  onClick={handleProfileNavigation}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#fff5f3',
                    }
                  }}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 18, color: '#FF3F00' }} />
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#fff5f3',
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              onClick={handleLoginClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;