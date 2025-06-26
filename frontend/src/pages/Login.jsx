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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-secondary)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        {/* Back to Landing Page */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Demo Account Section */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          border: '1px solid var(--primary)', 
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            🚀 Demo Account
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <strong>Email:</strong> demo@example.com
              <button
                onClick={() => copyToClipboard('demo@example.com')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
              >
                <Copy size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong>Password:</strong> password
              <button
                onClick={() => copyToClipboard('password')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <button
            onClick={fillDemoAccount}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}
          >
            Use Demo Account
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
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

          <div>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: 'var(--primary)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 