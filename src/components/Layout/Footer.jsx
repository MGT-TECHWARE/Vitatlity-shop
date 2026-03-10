import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">
              <img src="/nexora-logo-new.png" alt="Nexora Peptides" className="footer-brand-logo-img" />
            </div>
            <p className="footer-brand-desc">
              Your trusted source for research-grade peptides and wellness compounds. Third-party tested, GMP-compliant, with fast US-based shipping.
            </p>
            <div className="footer-contact">
              <a href="mailto:support@nexorapeptides.com">support@nexorapeptides.com</a>
              <span>United States</span>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Shop</div>
            <a href="#">Peptides</a>
            <a href="#">Supplements</a>
            <a href="#">Medical Supplies</a>
            <a href="#">Equipment</a>
            <a href="#">Wound Care</a>
            <a href="#">Nutrition</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <a href="#">Research Library</a>
            <a href="#">Product Guides</a>
            <a href="#">Lab Testing Results</a>
            <a href="#">FAQs</a>
            <a href="#">Shipping Info</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <a href="#">About Nexora</a>
            <a href="#">Quality Assurance</a>
            <a href="#">Partnerships</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Nexora Peptides. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
