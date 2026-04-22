import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/auth/register', form);
      localStorage.setItem('pulsefit_token', response.data.token);
      localStorage.setItem('pulsefit_user', response.data.user.name);
      navigate('/book');
    } catch {
      setMessage('Registration failed. The email may already be in use.');
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
        <button className="primary-button" type="submit">
          Register
        </button>
        <span>
          Already registered? <Link to="/login">Login</Link>
        </span>
      </form>
    </main>
  );
}
