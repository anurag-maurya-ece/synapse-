import React, { useState } from 'react';
import { User, Mail, Lock, LogIn, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import synapseLogo from '../assets/synapse_logo.png';

export default function Login({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&#).');
        setLoading(false);
        return;
      }
    }

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, role }
      : { email, password };

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save to localStorage and notify parent component
      localStorage.setItem('synapse_token', data.token);
      localStorage.setItem('synapse_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px var(--space-5)',
      background: '#ffffff',
      position: 'relative'
    }}>
      <div className="grid-bg" style={{ opacity: 0.5 }}></div>

      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px 32px',
        zIndex: 10,
        background: '#ffffff',
        textAlign: 'left'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src={synapseLogo} 
            alt="Synapse Logo" 
            style={{ 
              width: '56px', 
              height: '56px', 
              border: '2.5px solid #05060f', 
              borderRadius: '50%', 
              boxShadow: '0.2rem 0.2rem #05060f',
              marginBottom: '16px'
            }} 
          />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#05060f', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {isRegister ? 'Create Synapse Account' : 'Welcome to Synapse'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
            {isRegister ? 'Join our campus-to-career mentorship network' : 'Login to connect with vetted alumni mentors'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: 'var(--color-danger)',
            border: '2.5px solid #05060f',
            borderRadius: '0.6rem',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0.15rem 0.15rem #05060f'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                  <User size={16} />
                </span>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="e.g. student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                  <Lock size={16} />
                </span>
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Register As *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '0.5rem', padding: '10px' }}
                  onClick={() => setRole('student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '0.5rem', padding: '10px' }}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              marginTop: '10px', 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            {loading ? (
              <div style={{
                width: '16px', height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : isRegister ? (
              <>Create Account <UserPlus size={16} /></>
            ) : (
              <>Sign In <LogIn size={16} /></>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '28px', 
          textAlign: 'center', 
          borderTop: '2px solid #05060f', 
          paddingTop: '20px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => { setIsRegister(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New to Synapse?{' '}
              <button 
                onClick={() => { setIsRegister(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Demo Credentials Hint */}
        {!isRegister && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'var(--color-bg-subtle)',
            border: '2px solid #05060f',
            borderRadius: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--color-text-body)',
            lineHeight: 1.5
          }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#05060f', marginBottom: '4px' }}>
              <Sparkles size={12} /> Test Accounts (Seeded)
            </strong>
            <div>Student: <code>student@synapse.com</code> / <code>student123</code></div>
            <div>Admin: <code>admin@synapse.com</code> / <code>admin123</code></div>
          </div>
        )}
      </div>
    </div>
  );
}
