import React from "react";
import { useLocation } from "react-router-dom";
import OTPVerification from "../components/OTPVerification";

const VerifyOTP = () => {
  const location = useLocation();
  const { email } = location.state || {};

  if (!email) {
    return (
      <div className="verify-container">
        <div className="verify-box">
          <h2>Session Expired</h2>
          <p>Please register again to receive a new OTP.</p>
        </div>
      </div>
    );
  }

  return <OTPVerification email={email} />;
};

export default VerifyOTP;
