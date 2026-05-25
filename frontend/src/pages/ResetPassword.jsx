import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ArrowRight } from 'lucide-react';
import './Auth.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/reset-password', { email, new_password: newPassword });
      setSuccess('Password has been securely reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in flex-center">
      <div className="auth-card glass">
        <div className="auth-header flex-center flex-col">
          <KeyRound size={48} className="auth-icon" color="var(--secondary)" />
          <h2>Reset Password</h2>
          <p>Create a new secure password</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleReset} className="auth-form">
          <div className="form-group">
            <label>Verify Your Email</label>
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
            <label>New Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Enter new password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{marginTop: '1rem'}}>
            {isLoading ? 'Resetting...' : 'Update Password'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer" style={{marginTop: '1.5rem'}}>
          <p><Link to="/login" className="auth-link">Cancel and Return to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
