import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile({
            username: data.username || '',
            email: data.email || '',
          });
        } else {
          toast.error(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Fetch error:', err.message);
        toast.error('Error fetching profile');
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Profile updated successfully');
        window.dispatchEvent(new Event('profileUpdated')); // Refresh navbar
      } else {
        toast.error(data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Update error:', err.message);
      toast.error('Error updating profile');
    }
  };

  const changePassword = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '' });
      } else {
        toast.error(data.message || 'Password change failed');
      }
    } catch (err) {
      console.error('Password error:', err.message);
      toast.error('Error changing password');
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-section">
        <h3>Update Information</h3>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
          />
        </label>
        <button onClick={updateProfile}>Update Profile</button>
      </div>

      <div className="password-section">
        <h3>Change Password</h3>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <button onClick={changePassword}>Change Password</button>
      </div>

      <div className="back-button">
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    </div>
  );
}

export default Profile;
