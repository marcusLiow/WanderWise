import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const navigate = useNavigate();

  const checkSMUEmail = (email) => {
    const smuPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.smu\.edu\.sg$/;
    return smuPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail === '') {
      setEmailError('');
      setIsValidEmail(false);
    } else if (!checkSMUEmail(newEmail)) {
      setEmailError('Please use your SMU faculty email (@faculty.smu.edu.sg)');
      setIsValidEmail(false);
    } else {
      setEmailError('');
      setIsValidEmail(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidEmail) {
      alert('Please enter a valid SMU faculty email');
      return;
    }

    navigate('/success')
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            SMU Faculty Login
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Use your SMU faculty email to access WanderWise
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="SMU Faculty Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              required
              error={!!emailError}
              helperText={emailError || 'Example: john.doe@business.smu.edu.sg'}
            />
            
            {isValidEmail && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Valid SMU email! ✓
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                backgroundColor: '#FF3F00',
                '&:disabled': { backgroundColor: '#ccc' }
              }}
              disabled={!isValidEmail}
            >
              Continue with SMU Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;