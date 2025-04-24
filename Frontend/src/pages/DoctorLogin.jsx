import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/doctor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      // Store doctor token and basic info
      localStorage.setItem('doctorToken', data.token);
      localStorage.setItem('doctorName', data.doctor.name);
      localStorage.setItem('isDoctorLoggedIn', 'true');

      // Dispatch event to notify the Navbar about profile update
      window.dispatchEvent(new Event('profileUpdated'));

      // ✅ Navigate to dashboard after login
      navigate('/doctor/dashboard');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="form-container">
      <h2>Doctor Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default DoctorLogin;
