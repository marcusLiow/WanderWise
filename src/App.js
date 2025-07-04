import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import MainCard from './components/MainCard';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path='/' element={<MainCard />} />
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/success' element={<SuccessPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;