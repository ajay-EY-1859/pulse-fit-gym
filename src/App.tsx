import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import api from './services/api';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem('pulsefit_token');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Verify token with backend
    api.get('/auth/verify')
      .then(() => setIsValid(true))
      .catch(() => {
        localStorage.removeItem('pulsefit_token');
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    // Still validating - could show loading state
    return null;
  }

  return isValid ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      </Routes>
      <footer className="site-footer">© 2024 PulseFit Gym. All rights reserved.</footer>
    </>
  );
}
