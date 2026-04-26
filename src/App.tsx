import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('pulsefit_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
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
      <footer className="site-footer">© 2024 Fairline Tech - AI-Powered Websites in 24 Hours</footer>
    </>
  );
}
