import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const checkSMUEmail = (email) => {
    const smuPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.smu\.edu\.sg$/;
    return smuPattern.test(email);
  };

  const checkPasswordStrength = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPassword.test(password);
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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword === '') {
      setPasswordError('');
      setIsValidPassword(false);
    } else if (!checkPasswordStrength(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and number');
      setIsValidPassword(false);
    } else {
      setPasswordError('');
      setIsValidPassword(true);
    }

    // Recheck confirm password if it exists
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setIsValidConfirmPassword(false);
    } else if (confirmPassword && newPassword === confirmPassword) {
      setConfirmPasswordError('');
      setIsValidConfirmPassword(true);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword === '') {
      setConfirmPasswordError('');
      setIsValidConfirmPassword(false);
    } else if (newConfirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      setIsValidConfirmPassword(false);
    } else {
      setConfirmPasswordError('');
      setIsValidConfirmPassword(true);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted!');
  
  if (!isValidEmail || !isValidPassword || !isValidConfirmPassword) {
    alert('Please fill in all fields correctly');
    return;
  }

  try {
    console.log('About to send request...'); // This should show in browser console
    
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      navigate('/login');
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Error creating account');
    console.error('Error:', error);
  }
};

  const isFormValid = isValidEmail && isValidPassword && isValidConfirmPassword;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create your WanderWise account with your SMU email
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

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError || 'At least 8 characters with uppercase, lowercase, and number'}
            />

            {isValidPassword && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Strong password! ✓
              </Alert>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="normal"
              required
              error={!!confirmPasswordError}
              helperText={confirmPasswordError || 'Re-enter your password'}
            />

            {isValidConfirmPassword && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Passwords match! ✓
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
              disabled={!isFormValid}
            >
              Create Account
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button 
                  variant="text" 
                  onClick={() => navigate('/login')}
                  sx={{ color: '#FF3F00' }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SignUpPage;