import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Milk, ArrowRight } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Register
      await axios.post('http://127.0.0.1:5000/api/auth/register', { username, email, password });
      
      // Auto-Login
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      window.dispatchEvent(new Event('storage'));

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.message === "Network Error" || !err.response) {
        console.warn("Backend server offline. Performing demo auto-registration.");
        
        // Success fallback for Demo Mode!
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('role', 'customer');
        localStorage.setItem('username', username || 'DemoUser');
        window.dispatchEvent(new Event('storage'));
        
        setSuccess('Demo registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Try a different username.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-container animate-fade-in flex-center">
      <div className="auth-card glass">
        <div className="auth-header flex-center flex-col">
          <Milk size={48} className="auth-icon" />
          <h2>Join Dairy Mart</h2>
          <p>Create a new account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Choose a username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Register <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
