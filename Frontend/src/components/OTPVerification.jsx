import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message || "Email verified!");
      navigate("/login");
    } catch (err) {
      console.error("OTP verification error:", err);
      alert(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>Verify Your Email</h2>
        <p className="subtitle">Enter the OTP sent to <strong>{email}</strong></p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
          <button className="verify-button" type="submit">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
