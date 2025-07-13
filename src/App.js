import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import all components
import Navbar from './components/Navbar';
import MainCard from './components/MainCard';
import SearchResults from './components/SearchResults';
import UniversityProfile from './pages/UniversityProfile';

// Import all pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import SuccessPage from './pages/SuccessPage';
import ProfilePage from './pages/ProfilePage';

// Create MUI theme
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<MainCard />} />

            {/* Authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/uni" element={<UniversityProfile />} />

            {/* Search and university routes */}
            <Route path="/search" element={<SearchResults />} />
            <Route path="/university/:universitySlug" element={<UniversityProfile />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;