import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://127.0.0.1:5000/api/auth/forgot-password', { email });
      setSuccess('If an account with that email exists, a reset link has been sent. (For testing, click the link below to reset it now).');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in flex-center">
      <div className="auth-card glass">
        <div className="auth-header flex-center flex-col">
          <ShieldCheck size={48} className="auth-icon" color="var(--primary)" />
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success" style={{textAlign: 'center'}}>
            {success}
            <br/><br/>
            <Link to="/reset-password" style={{textDecoration: 'underline', fontWeight: 'bold'}}>
              Click Here to Reset Password
            </Link>
          </div>
        )}

        {!success && (
          <form onSubmit={handleForgot} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper" style={{position: 'relative'}}>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="Enter your registered email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div className="auth-footer" style={{marginTop: '1.5rem'}}>
          <p>Remembered your password? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
