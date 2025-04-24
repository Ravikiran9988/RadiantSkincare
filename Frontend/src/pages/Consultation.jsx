import React, { useState } from 'react';
import { scheduleConsultation } from '../services/api'; // 👈 use helper from api.js
import { useNavigate } from 'react-router-dom';

const Consultation = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dateTime = `${date}T${time}`;
      const res = await scheduleConsultation({ dateTime }); // call helper
      const doctor = res.data.doctor;
      alert(`Consultation booked with Dr. ${doctor.name}`);
      navigate(`/chat/${doctor.name}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-page">
      <h2>Schedule a Doctor Consultation</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Consultation;
