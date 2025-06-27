import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff, Copy, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔐 Attempting login with:', formData.email);
      const result = await login(formData.email, formData.password);
      console.log('📋 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to:', from);
        navigate(from, { replace: true });
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.log('💥 Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const fillDemoAccount = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password'
    });
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        {/* Back to Landing Page */}
        <div className="auth-back-link">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Demo Account Section */}
        <div className="demo-account-section">
          <h3 className="demo-title">🚀 Demo Account</h3>
          <div className="demo-credentials">
            <div className="credential-row">
              <strong>Email:</strong> demo@example.com
              <button
                onClick={() => copyToClipboard('demo@example.com')}
                className="copy-btn"
                aria-label="Copy email"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="credential-row">
              <strong>Password:</strong> password
              <button
                onClick={() => copyToClipboard('password')}
                className="copy-btn"
                aria-label="Copy password"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <button
            onClick={fillDemoAccount}
            className="btn btn-primary demo-btn"
          >
            Use Demo Account
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 