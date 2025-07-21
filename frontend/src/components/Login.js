import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { User, Lock, LogIn, UserPlus, Sparkles, Link2, BarChart3 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        email, password
      });
      
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="auth-icon">
          <Sparkles size={32} />
        </div>
        <h1 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </h1>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Sign in to access your dashboard and manage your URLs' 
            : 'Create an account to start shortening and tracking your URLs'
          }
        </p>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                minLength={6}
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="auth-submit-btn">
            <div className="btn-content">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </div>
          </button>
        </form>
        
        <div className="auth-switch">
          <p className="auth-switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="auth-switch-btn"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>

      <div className="auth-features">
        <div className="feature-item">
          <div className="feature-item-icon">
            <Link2 size={20} />
          </div>
          <span>Unlimited URL shortening</span>
        </div>
        <div className="feature-item">
          <div className="feature-item-icon">
            <BarChart3 size={20} />
          </div>
          <span>Detailed analytics</span>
        </div>
        <div className="feature-item">
          <div className="feature-item-icon">
            <Sparkles size={20} />
          </div>
          <span>Custom QR codes</span>
        </div>
      </div>
    </div>
  );
};

export default Login;