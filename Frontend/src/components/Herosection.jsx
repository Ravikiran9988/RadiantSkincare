import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      localStorage.setItem("redirectAfterLogin", "/dashboard");
      navigate("/login");
    }
  };

  return (
    <header className="hero">
      <h1 className="hero-title">Glow with AI ✨</h1>
      <p className="hero-subtitle">Personalized skincare insights at your fingertips</p>
      <button className="hero-btn" onClick={handleClick}>
        Start Your Consultation
      </button>
    </header>
  );
};

export default HeroSection;
