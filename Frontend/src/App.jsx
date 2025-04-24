import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HeroSection from "./components/Herosection.jsx";
import Login from "./pages/Login.jsx";
import RegisterWithOTP from "./pages/RegisterWithOTP.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Products from "./pages/Products.jsx";
import AIConsultation from "./components/AIConsultation.jsx";
import Profile from "./pages/Profile.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import DoctorPrivateRoute from "./Routes/DoctorPrivateRoute.jsx";
import Footer from "./components/Footer.jsx";
import Consultation from "./pages/Consultation.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import DoctorLogin from "./pages/DoctorLogin.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterWithOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/ai-consultation" element={<AIConsultation />} />

        {/* Doctor Public Route */}
        <Route path="/doctor-login" element={<DoctorLogin />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/consultation"
          element={
            <PrivateRoute>
              <Consultation />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:consultationId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Doctor Protected Route */}
        <Route
          path="/doctor/dashboard"
          element={
            <DoctorPrivateRoute>
              <DoctorDashboard />
            </DoctorPrivateRoute>
          }
        />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
