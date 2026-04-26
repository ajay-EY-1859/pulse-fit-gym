import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pulsefit_token')) {
      navigate('/book');
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('pulsefit_token', response.data.token);
      localStorage.setItem('pulsefit_user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('pulsefit_auth'));
      navigate('/book');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
        </label>
        {message && <p className="form-message">{message}</p>}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <span>
          Need an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </main>
  );
}
