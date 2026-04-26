import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/auth/register', form);
      localStorage.setItem('pulsefit_token', response.data.token);
      localStorage.setItem('pulsefit_user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('pulsefit_auth'));
      navigate('/book');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Start training</p>
        <h1>Create account</h1>
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={6} required />
        </label>
        {message && <p className="form-message">{message}</p>}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <span>
          Already registered? <Link to="/login">Login</Link>
        </span>
      </form>
    </main>
  );
}
