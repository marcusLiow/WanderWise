import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import all components
import Navbar from './components/Navbar';
import SearchResults from './components/SearchResults';

// Import all pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ReviewDisplay from './pages/ReviewDisplay';
import WriteReview from './pages/WriteReview';

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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/review/:id" element={<ReviewDisplay />} />
            <Route path="/write-review" element={<WriteReview />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;