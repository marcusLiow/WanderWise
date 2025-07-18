import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidFirstName, setIsValidFirstName] = useState(false);
  const [isValidLastName, setIsValidLastName] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [isValidDateOfBirth, setIsValidDateOfBirth] = useState(false);
  const navigate = useNavigate();

  // List of common nationalities
  const nationalities = [
    'Singaporean',
    ...['Malaysian',
    'Chinese',
    'Indian',
    'Indonesian',
    'Thai',
    'Vietnamese',
    'Philippine',
    'Korean',
    'Japanese',
    'Australian',
    'British',
    'American',
    'Canadian',
    'French',
    'German',
    'Italian',
    'Spanish',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Russian',
    'Ukrainian',
    'Polish',
    'Czech',
    'Hungarian',
    'Romanian',
    'Bulgarian',
    'Croatian',
    'Serbian',
    'Greek',
    'Turkish',
    'Iranian',
    'Iraqi',
    'Lebanese',
    'Syrian',
    'Jordanian',
    'Saudi Arabian',
    'Emirati',
    'Qatari',
    'Kuwaiti',
    'Bahraini',
    'Omani',
    'Yemeni',
    'Egyptian',
    'Libyan',
    'Tunisian',
    'Algerian',
    'Moroccan',
    'South African',
    'Nigerian',
    'Kenyan',
    'Ethiopian',
    'Ghanaian',
    'Ugandan',
    'Tanzanian',
    'Zimbabwean',
    'Zambian',
    'Botswana',
    'Brazilian',
    'Argentinian',
    'Chilean',
    'Colombian',
    'Peruvian',
    'Venezuelan',
    'Ecuadorian',
    'Uruguayan',
    'Paraguayan',
    'Bolivian',
    'Mexican',
    'Guatemalan',
    'Costa Rican',
    'Panamanian',
    'Cuban',
    'Jamaican',
    'Barbadian',
    'Trinidadian',
    'Other'].sort()
  ];

  const checkSMUEmail = (email) => {
    const smuPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.smu\.edu\.sg$/;
    return smuPattern.test(email);
  };

  const checkPasswordStrength = (password) => {
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPassword.test(password);
  };

  const checkName = (name) => {
    const namePattern = /^[a-zA-Z\s\-']{2,}$/;
    return namePattern.test(name.trim());
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

  const handleFirstNameChange = (e) => {
    const newFirstName = e.target.value;
    setFirstName(newFirstName);

    if (newFirstName === '') {
      setFirstNameError('');
      setIsValidFirstName(false);
    } else if (!checkName(newFirstName)) {
      setFirstNameError('Please enter a valid first name (at least 2 characters)');
      setIsValidFirstName(false);
    } else {
      setFirstNameError('');
      setIsValidFirstName(true);
    }
  };

  const handleLastNameChange = (e) => {
    const newLastName = e.target.value;
    setLastName(newLastName);

    if (newLastName === '') {
      setLastNameError('');
      setIsValidLastName(false);
    } else if (!checkName(newLastName)) {
      setLastNameError('Please enter a valid last name (at least 2 characters)');
      setIsValidLastName(false);
    } else {
      setLastNameError('');
      setIsValidLastName(true);
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

  const checkDateOfBirth = (date) => {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(datePattern);
    
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    const testDate = new Date(year, month - 1, day);
    return testDate.getDate() === day && 
          testDate.getMonth() === month - 1 && 
          testDate.getFullYear() === year;
  };

  const handleDateOfBirthChange = (e) => {
    let value = e.target.value;
    
    value = value.replace(/\D/g, '');
    if (value.length >= 2 && value.length < 4) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length >= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    
    setDateOfBirth(value);

    if (value === '') {
      setDateOfBirthError('');
      setIsValidDateOfBirth(false);
    } else if (value.length < 10) {
      setDateOfBirthError('Please enter complete date (DD/MM/YYYY)');
      setIsValidDateOfBirth(false);
    } else if (!checkDateOfBirth(value)) {
      setDateOfBirthError('Please enter a valid date in DD/MM/YYYY format');
      setIsValidDateOfBirth(false);
    } else {
      setDateOfBirthError('');
      setIsValidDateOfBirth(true);
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
    console.log('About to send request...');
    
    const response = await fetch('http://124.243.144.171:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        lastName: lastName,
        nationality: nationality,
        dateOfBirth: dateOfBirth,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      const userData = {
        email: email,
        id: data.userId,
        firstName: data.user.firstName,   
        lastName: data.user.lastName,  
        name: data.user.firstName + ' ' + data.user.lastName,
        nationality: data.user.nationality,
        dateOfBirth: data.user.dateOfBirth, 
        university: data.user.university
      };
      localStorage.setItem('wanderwise_user', JSON.stringify(userData));
      
      navigate('/');
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Error creating account');
    console.error('Error:', error);
  }
};

  const isFormValid = isValidEmail && isValidFirstName && isValidLastName && isValidDateOfBirth && isValidPassword && isValidConfirmPassword && nationality !== '';


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
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
            


            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                  error={!!firstNameError}
                  helperText={firstNameError || 'Enter your first name'}
                />

              </Box>
              
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                  error={!!lastNameError}
                  helperText={lastNameError || 'Enter your last name'}
                />

              </Box>
            </Box>

            <TextField
              fullWidth
              select
              label="Nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              margin="normal"
              required
              helperText="Select your nationality"
            >
              {nationalities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Date of Birth"
              value={dateOfBirth}
              onChange={handleDateOfBirthChange}
              margin="normal"
              required
              error={!!dateOfBirthError}
              helperText={dateOfBirthError || 'Format: DD/MM/YYYY (e.g., 15/06/1995)'}
              placeholder="DD/MM/YYYY"
              inputProps={{
                maxLength: 10
              }}
            />

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