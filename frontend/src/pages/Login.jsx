import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Milk, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { API_BASE_URL } from '../config';
import './Auth.css';

const Login = () => {
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const role = localStorage.getItem('role');
      if (role === 'admin' && loginMode === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, loginMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      
      // If admin mode is selected, enforce admin role
      if (loginMode === 'admin' && res.data.role !== 'admin') {
        setError('Unauthorized: Admin credentials required.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      window.dispatchEvent(new Event('storage'));
      
      if (loginMode === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.message === "Network Error" || !err.response) {
        console.warn("Backend server offline. Logging in with Demo Credentials.");
        
        // Success fallback for Demo Mode!
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('role', loginMode === 'admin' ? 'admin' : 'customer');
        localStorage.setItem('username', username || (loginMode === 'admin' ? 'admin' : 'DemoUser'));
        window.dispatchEvent(new Event('storage'));
        
        if (loginMode === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in flex-center">
      <div className="auth-card glass">
        
        {/* Toggle Buttons */}
        <div className="login-mode-toggle flex-center" style={{marginBottom: '1.5rem', gap: '1rem'}}>
          <button 
            type="button"
            className={`btn ${loginMode === 'user' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setLoginMode('user'); setError(''); }}
            style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <User size={18} /> User Login
          </button>
          <button 
            type="button"
            className={`btn ${loginMode === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setLoginMode('admin'); setError(''); }}
            style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <ShieldCheck size={18} /> Admin Login
          </button>
        </div>

        <div className="auth-header flex-center flex-col">
          {loginMode === 'admin' ? (
            <ShieldCheck size={48} className="auth-icon" style={{color: 'var(--secondary)'}} />
          ) : (
            <Milk size={48} className="auth-icon" />
          )}
          <h2>{loginMode === 'admin' ? 'Admin Secure Portal' : 'Welcome Back'}</h2>
          <p>{loginMode === 'admin' ? 'DairyMart Enterprise Management' : 'Login to your Dairy Mart account'}</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>{loginMode === 'admin' ? 'Admin Username' : 'Username'}</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder={loginMode === 'admin' ? 'Enter admin username' : 'Enter username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="flex-between">
              <label>{loginMode === 'admin' ? 'Master Password' : 'Password'}</label>
              {loginMode === 'user' && (
                <Link to="/forgot-password" style={{fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none'}}>
                  Forgot Password?
                </Link>
              )}
            </div>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={loginMode === 'admin' ? {background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'} : {}}>
            {isLoading ? 'Authenticating...' : (loginMode === 'admin' ? 'Secure Login' : 'Login')} <ArrowRight size={18} />
          </button>
        </form>

        {loginMode === 'user' && (
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
