import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    if (!token) {
      navigate('/doctor-login');
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctor/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        navigate('/doctor-login');
      }
    };

    const fetchConsultations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctor/consultations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConsultations(data);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
    fetchConsultations();
  }, [navigate]);

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="doctor-dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard, Dr. {doctor?.name}</h1>
      </header>

      {doctor && (
        <div className="doctor-profile">
          <div className="doctor-avatar-container">
            <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar" />
          </div>
          <div className="doctor-details">
            <h2>{doctor.name}</h2>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Languages:</strong> {doctor.languages.join(', ')}</p>
          </div>
        </div>
      )}

      <section className="consultations-section">
        <h3>Upcoming Consultations</h3>
        {consultations.length === 0 ? (
          <p>No consultations scheduled at the moment.</p>
        ) : (
          <ul className="consultation-list">
            {consultations.map((c) => (
              <li key={c._id} className="consultation-item">
                <div className="consultation-info">
                  <p><strong>Patient:</strong> {c.userName}</p>
                  <p><strong>Concern:</strong> {c.concern}</p>
                  <p><strong>Date:</strong> {new Date(c.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => navigate(`/chat/${c._id}`)}
                  className="chat-btn"
                >
                  Start Chat
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;
