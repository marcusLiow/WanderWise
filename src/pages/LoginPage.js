import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
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
          dateOfBirth: data.dateOfBirth,
          university: data.university,
          profileImage: data.profileImage
        };
        
        console.log('Saving user data to localStorage:', {
          ...userData,
          profileImage: userData.profileImage ? '[IMAGE DATA]' : 'null'
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
  };

  const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !newPassword || !confirmNewPassword) {
      setForgotPasswordMessage('Please fill in all fields');
      return;
    }

    // Validate SMU email format
    const smuEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*smu\.edu\.sg$/;
    if (!smuEmailPattern.test(forgotPasswordEmail)) {
      setForgotPasswordMessage('Please enter a valid SMU email address');
      return;
    }

    // Validate password strength
    if (!checkPasswordStrength(newPassword)) {
      setForgotPasswordMessage('Password must be at least 8 characters with uppercase, lowercase, and number');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      setForgotPasswordMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage('Password has been reset successfully! You can now login with your new password.');
        // Clear form fields
        setForgotPasswordEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setForgotPasswordMessage(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setForgotPasswordMessage('Unable to reset password. Please try again later.');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordMessage('');
    setForgotPasswordEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  if (showForgotPassword) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter your SMU email address and we'll send you instructions to reset your password.
            </Typography>
            
            <form onSubmit={handleForgotPassword}>
              {forgotPasswordMessage && (
                <Alert 
                  severity={forgotPasswordMessage.includes('successfully') ? 'success' : 'error'} 
                  sx={{ mb: 2 }}
                >
                  {forgotPasswordMessage}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="SMU Email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                margin="normal"
                required
                placeholder="your.email@smu.edu.sg"
              />

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
                helperText="At least 8 characters with uppercase, lowercase, and number"
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                margin="normal"
                required
                helperText="Re-enter your new password"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  backgroundColor: '#FF3F00',
                  '&:hover': { backgroundColor: '#E63900' }
                }}
              >
                Reset Password
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  onClick={handleBackToLogin}
                  sx={{ color: '#FF3F00' }}
                >
                  Back to Login
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
            
            {/* Forgot Password Link */}
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Button 
                variant="text" 
                onClick={() => setShowForgotPassword(true)}
                sx={{ color: '#FF3F00', fontSize: '0.875rem' }}
              >
                Forgot Password?
              </Button>
            </Box>
            
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