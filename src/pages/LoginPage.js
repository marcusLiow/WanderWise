import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Add this line to test if the component is loading
  console.log('LoginPage component loaded!');

  const handleEmailChange = (e) => {
    console.log('Email changed:', e.target.value); // Test if this runs
    setEmail(e.target.value);
    setError(''); // Clear any previous errors when user types
  };

  const handlePasswordChange = (e) => {
    console.log('Password changed'); // Test if this runs
    setPassword(e.target.value);
    setError(''); // Clear any previous errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('FORM SUBMITTED - THIS SHOULD SHOW!'); // This is key
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, password }); // Debug log
      
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        // Only login if backend confirms credentials are correct
        console.log('Login successful, backend response:', data); // Debug log
        
        // Save ALL data returned from backend
        const userData = {
          email: data.email,
          id: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          name: data.name,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,          // ← ADD THIS LINE
          university: data.university,
          profileImage: data.profileImage
        };
        
        console.log('Saving user data to localStorage:', {
          ...userData,
          profileImage: userData.profileImage ? 'INCLUDED' : 'NULL'
        });
        
        localStorage.setItem('wanderwise_user', JSON.stringify(userData));
        
        // Navigate to home page
        navigate('/');
      } else {
        // Show error from backend
        console.log('Login failed:', data.error); // Debug log
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Network/API error:', error);
      setError('Unable to connect to server. Please check if your backend is running.');
    } finally {
      setIsLoading(false);
    }
  }; // ← This was missing!

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Use your SMU email to access WanderWise
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                backgroundColor: '#FF3F00',
                '&:disabled': { backgroundColor: '#ccc' }
              }}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button 
                  variant="text" 
                  onClick={handleSignupClick}
                  sx={{ color: '#FF3F00' }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;