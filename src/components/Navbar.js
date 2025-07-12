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
    <AppBar position="static" sx={{backgroundColor: "#FF3F00"}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          WanderWise
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={handleHomeClick}>Home</Button>
          <Button color="inherit">Reviews</Button>
          <Button color="inherit">Universities</Button>
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;