import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      if (result.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const fillDemoUser = () => {
    setEmail('user@myshop.com');
    setPassword('User@123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@myshop.com');
    setPassword('Admin@123');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 440,
          width: '100%',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Sign in to access your wishlist, cart, and orders.
          </p>
        </div>

        {/* Quick Demo Credentials Autofill */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            marginBottom: 24,
            fontSize: '0.8rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚡ Quick Demo Credentials</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={fillDemoUser}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', backgroundColor: 'white', color: '#1d4ed8' }}
            >
              <User size={12} /> Demo User
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', backgroundColor: 'white', color: '#1d4ed8' }}
            >
              <ShieldCheck size={12} /> Admin User
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 38 }}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 38, paddingRight: 40 }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 24px', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              Remember me
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For demo, use User@123 or Admin@123'); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
