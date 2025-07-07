import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import MainCard from './components/MainCard';
<<<<<<< Updated upstream
=======
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage';

import SignUpPage from './pages/SignupPage';
import UniPage from './pages/UniPage';
>>>>>>> Stashed changes

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
<<<<<<< Updated upstream
      <CssBaseline />
      <Navbar />
      <MainCard />
=======
      <Router>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path='/' element={<MainCard />} />
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/success' element={<SuccessPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/unipage' element={<UniPage />} />

        </Routes>
      </Router>
>>>>>>> Stashed changes
    </ThemeProvider>
  );
}

export default App;