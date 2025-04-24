import React from 'react';
import { Navigate } from 'react-router-dom';

const DoctorPrivateRoute = ({ children }) => {
  const doctorToken = localStorage.getItem('doctorToken');

  return doctorToken ? children : <Navigate to="/doctor-login" />;
};

export default DoctorPrivateRoute;
