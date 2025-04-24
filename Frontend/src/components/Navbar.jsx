import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const doctorToken = localStorage.getItem('doctorToken');

    try {
      if (token) {
        const res = await fetch('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.username) {
          setUser(data);
          setDoctor(null);
          return;
        }
      }

      if (doctorToken) {
        const res = await fetch('http://localhost:5000/api/doctor/me', {
          headers: { Authorization: `Bearer ${doctorToken}` },
        });
        const data = await res.json();
        if (data.name) {
          setDoctor(data);
          setUser(null);
          return;
        }
      }

      setUser(null);
      setDoctor(null);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setUser(null);
      setDoctor(null);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleStorageChange = () => fetchProfile();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDoctor(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const renderUserGreeting = () => {
    if (user) {
      return (
        <span
          className="welcome-text cursor-pointer font-medium hover:underline"
          onClick={() => navigate('/dashboard')}
        >
          Welcome, {user.username}
        </span>
      );
    } else if (doctor) {
      return (
        <span
          className="welcome-text cursor-pointer font-medium hover:underline"
          onClick={() => navigate('/doctor/dashboard')}
        >
          Dr. {doctor.name}
        </span>
      );
    }
    return null;
  };

  // Add this function to force an update when the user logs in
  const handleLoginSuccess = () => {
    fetchProfile(); // Ensure this is called after login
  };

  return (
    <nav className="navbar shadow-md">
      <div className="navbar-container">
        <Link to="/" className="logo brand-name">
          Radiant<span>Skincare</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isOpen ? 'bar rotate' : 'bar'} />
          <div className={isOpen ? 'bar hide' : 'bar'} />
          <div className={isOpen ? 'bar rotate-reverse' : 'bar'} />
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/Consultation">Chat With Doctor</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>

          <div className="nav-buttons">
            {(user || doctor) ? (
              <>
                {renderUserGreeting()}
                <button className="btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">
                  Login
                </Link>
                <Link to="/register" className="btn register-btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
