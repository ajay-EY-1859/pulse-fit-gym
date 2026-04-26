import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('pulsefit_token'));

  const syncAuth = useCallback(() => {
    setLoggedIn(!!localStorage.getItem('pulsefit_token'));
  }, []);

  useEffect(() => {
    window.addEventListener('pulsefit_auth', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('pulsefit_auth', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, [syncAuth]);

  function handleLogout() {
    localStorage.removeItem('pulsefit_token');
    localStorage.removeItem('pulsefit_user');
    setLoggedIn(false);
    window.dispatchEvent(new Event('pulsefit_auth'));
    navigate('/login');
  }

  const userName = (() => {
    try {
      const raw = localStorage.getItem('pulsefit_user');
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return parsed.name || raw;
    } catch {
      return '';
    }
  })();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span>Pulse</span>Fit
      </NavLink>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/book">Book</NavLink>
        {loggedIn ? (
          <>
            {userName && <span className="nav-user">Hi, {userName}</span>}
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
