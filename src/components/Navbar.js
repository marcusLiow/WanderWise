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
<AppBar position="sticky" sx={{ backgroundColor: "#FF3F00" }}>
  <Toolbar sx={{ position: "relative", minHeight: 72 }}>
    {/* Left */}
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button color="inherit" onClick={handleCountriesClick}>Countries</Button>
      <Button color="inherit" onClick={handleUniversitiesClick}>Universities</Button>
    </Box>

    {/* Center (absolute) */}
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button color="inherit" onClick={handleHomeClick} sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ letterSpacing: 1, fontWeight: 700}}>
          WanderWise
        </Typography>
      </Button>
    </Box>

    {/* Right */}
    <Box sx={{ marginLeft: "auto", display: "flex", gap: 1, alignItems: "center" }}>
      {user && (
        <Chip
          label="Write Review"
          icon={<EditIcon sx={{ fontSize: '18px !important', color: '#FF3F00 !important' }} />}
          onClick={handleWriteReviewClick}
          clickable
          sx={{ backgroundColor: "white", color: "#FF3F00", fontWeight: "bold" }}
        />
      )}

      {user ? (
        <Button color="inherit" onClick={handleProfileClick}>
          <Avatar
            src={user?.profileImage || null}
            sx={{ bgcolor: "white", color: "#FF3F00", width: 32, height: 32 }}
          >
            {!user?.profileImage && getUserInitials()}
          </Avatar>
        </Button>
      ) : (
        <Button color="inherit" onClick={handleLoginClick}>Login</Button>
      )}
    </Box>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem onClick={handleProfileNavigation}>
        <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>

  </Toolbar>
</AppBar>

  );
}

export default Navbar;