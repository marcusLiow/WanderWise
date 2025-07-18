import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Avatar, Divider, Chip, 
  Button, TextField, Alert, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    const savedUser = localStorage.getItem('wanderwise_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      console.log('ProfilePage: User data from localStorage:', userData); 
      console.log('ProfilePage: dateOfBirth value:', userData.dateOfBirth);
      setUser(userData);
      setEditData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        nationality: userData.nationality || '',
        dateOfBirth: userData.dateOfBirth || ''
      });
      setProfileImage(userData.profileImage || null);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getUserInitials = () => {
    if (!user?.firstName && !user?.name && !user?.email) return 'U';
    const name = user.firstName || user.name || user.email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        nationality: user.nationality || '',
        dateOfBirth: user.dateOfBirth || ''
      });
      setError('');
      setSuccess('');
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
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
    
    setEditData(prev => ({
      ...prev,
      dateOfBirth: value
    }));
  };

  const resizeImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      try {
        const compressedImage = await resizeImage(file);
        
        if (compressedImage.length > 2 * 1024 * 1024) { 
          setError('Image is too large even after compression. Please use a smaller image.');
          return;
        }
        
        setProfileImage(compressedImage);
        setError('');
      } catch (error) {
        setError('Failed to process image. Please try another image.');
        console.error('Image processing error:', error);
      }
    }
  };

  const handleSave = async () => {
    if (!editData.firstName.trim() || !editData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (editData.dateOfBirth && !checkDateOfBirth(editData.dateOfBirth)) {
      setError('Please enter a valid date of birth in DD/MM/YYYY format');
      return;
    }

    try {
      setError('');
      setSuccess('');

      const profileData = {
        userId: user.id,
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        nationality: editData.nationality || '',
        dateOfBirth: editData.dateOfBirth || '',
        profileImage: profileImage
      };

      console.log('Sending profile update to backend:', profileData);

      const response = await fetch('http://124.243.144.171:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok) {
        const updatedUser = {
          ...user,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          nationality: data.user.nationality,
          dateOfBirth: data.user.dateOfBirth,
          profileImage: data.user.profileImage,
          name: data.user.firstName + ' ' + data.user.lastName
        };

        localStorage.setItem('wanderwise_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        
        window.dispatchEvent(new Event('userDataUpdated'));
        
        console.log('Profile update successful');
      } else {
        setError(data.error || 'Failed to update profile');
        console.error('Backend error:', data.error);
      }

    } catch (error) {
      setError('Unable to connect to server. Please try again.');
      console.error('Network error:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ padding: 4 }}>
          {/* Header with Avatar and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar 
                src={profileImage}
                sx={{ 
                  bgcolor: '#FF3F00', 
                  width: 80, 
                  height: 80,
                  fontSize: '32px'
                }}
              >
                {!profileImage && getUserInitials()}
              </Avatar>
              {editMode && (
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    backgroundColor: '#FF3F00',
                    color: 'white',
                    '&:hover': { backgroundColor: '#E63600' },
                    minWidth: 'auto',
                    fontSize: '10px',
                    padding: '4px 8px'
                  }}
                >
                  📷
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {editData.firstName || user.firstName} {editData.lastName || user.lastName}
              </Typography>
            </Box>
            <Box>
              {!editMode && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          {/* Status Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Profile Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    First Name
                  </Typography>
                  {editMode ? (
                    <TextField
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      size="small"
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {user.firstName || 'N/A'}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Name
                  </Typography>
                  {editMode ? (
                    <TextField
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      size="small"
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {user.lastName || 'N/A'}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nationality
                </Typography>
                {editMode ? (
                  <TextField
                    select
                    value={editData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="">
                      <em>Select nationality</em>
                    </MenuItem>
                    {nationalities.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography variant="body1">
                    {user.nationality || 'Not specified'}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date of Birth
                </Typography>
                {editMode ? (
                  <TextField
                    value={editData.dateOfBirth || ''}
                    onChange={handleDateOfBirthChange}
                    size="small"
                    fullWidth
                    variant="outlined"
                    placeholder="DD/MM/YYYY"
                    helperText="Format: DD/MM/YYYY (e.g., 15/06/1995)"
                    inputProps={{
                      maxLength: 10
                    }}
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">
                    {user.dateOfBirth || 'Not specified'}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                University Information
              </Typography>
              
              {user.university && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    University
                  </Typography>
                  <Chip 
                    label={user.university} 
                    color="primary" 
                    sx={{ 
                      backgroundColor: '#FF3F00',
                      color: 'white',
                      mt: 1
                    }}
                  />
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Student Email
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Save and Cancel buttons below the card */}
      {editMode && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, width: '100%', maxWidth: 600, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            sx={{ 
              minWidth: 120,
              backgroundColor: '#FF3F00',
              '&:hover': { backgroundColor: '#E63600' }
            }}
          >
            Save Changes
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleEditToggle}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ProfilePage;