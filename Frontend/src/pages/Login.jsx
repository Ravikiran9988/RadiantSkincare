import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = '/api/login';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', data.user?.name || data.user?.email || form.email);

        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-gray-800">Login to Radiant Skincare</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="input-field"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="input-field"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-gray-600">
        New user?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>

      {/* Doctor login link */}
      <p className="text-sm mt-2 text-gray-600">
        Are you a doctor?{' '}
        <Link to="/doctor-Login" className="text-purple-600 hover:underline font-medium">
          Login as Doctor
        </Link>
      </p>
    </div>
  );
};

export default Login;
