import React from "react";
import "../styles.css"; // Make sure to include your styles

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <h3>Radiant Skincare</h3>
        <p>Stay beautiful with smart skincare powered by AI ✨</p>
        <div className="footer-socials">
          <a href="#">🔗 Facebook</a>
          <a href="#">🔗 Instagram</a>
          <a href="#">🔗 Twitter</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 Radiant Skincare | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
