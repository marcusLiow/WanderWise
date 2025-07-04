import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static" sx={{backgroundColor: "#FF3F00"}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          WanderWise
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Reviews</Button>
          <Button color="inherit">Universities</Button>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;