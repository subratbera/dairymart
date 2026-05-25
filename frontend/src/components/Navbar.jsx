import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Milk, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const checkUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container flex-between nav-content">
        <Link to="/" className="nav-logo flex-center">
          <Milk className="logo-icon" size={32} />
          <span className="logo-text">DairyMart</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link admin-link">Dashboard</Link>
          )}
        </div>

        <div className="nav-actions flex-center">
          {user ? (
            <div className="user-profile flex-center">
              <span className="welcome-text">Hi, <b>{user.username}</b></span>
              <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" title="Login">
              <User size={24} />
            </Link>
          )}

          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="icon-btn mobile-menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
