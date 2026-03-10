import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconCart, IconUser } from '../icons';
import SearchBar from '../UI/SearchBar';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar({ onCartOpen }) {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // On non-home pages, navbar is always in "scrolled" (solid) mode
  const isSolid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${isSolid ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/nexora-logo-new.png" alt="Nexora Peptides" className="navbar-logo-img" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <a href={isHome ? '#products' : '/#products'} className="navbar-link">Products</a>
          <a href={isHome ? '#services' : '/#services'} className="navbar-link">Services</a>
          <a href="#" className="navbar-link">About</a>
          <a href="#" className="navbar-link">Contact</a>
        </div>

        <div className="navbar-right">
          <SearchBar />
          <button className="navbar-cart-btn" onClick={onCartOpen} aria-label="Open cart">
            <IconCart />
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
          </button>
          <Link to="#" className="navbar-login">
            <IconUser />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
