import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#FF3F00" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: logo/title */}
        <Button color='White'><Typography variant="h6" sx={{ flexShrink: 0 }} onClick={handleHomeClick}>
          WanderWise
        </Typography></Button>

        {/* Right side: nav buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit">Countries</Button>
          <Button color="inherit">Universities</Button>
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
