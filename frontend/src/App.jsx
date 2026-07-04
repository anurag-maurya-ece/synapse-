import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Menu, X, LogOut, LogIn, User } from 'lucide-react';
import Home from './pages/Home';
import MentorList from './pages/MentorList';
import Forum from './pages/Forum';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import synapseLogo from './assets/synapse_logo.png';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('synapse_user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('synapse_token') || '');

  const location = useLocation();
  const navigateHook = useNavigate();

  // Determine current active page based on pathname
  let page = 'home';
  if (location.pathname === '/mentors') page = 'mentors';
  else if (location.pathname === '/forum') page = 'forum';
  else if (location.pathname === '/dashboard') page = 'dashboard';
  else if (location.pathname === '/login') page = 'login';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (p) => {
    // If trying to access protected page and not logged in, redirect to login
    if (p !== 'home' && p !== 'login' && !user) {
      navigateHook('/login');
    } else {
      navigateHook(p === 'home' ? '/' : `/${p}`);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (u, t) => {
    setUser(u);
    setToken(t);
    // If admin, go to dashboard, else go to mentors directory
    if (u.role === 'admin') {
      navigateHook('/dashboard');
    } else {
      navigateHook('/mentors');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('synapse_token');
    localStorage.removeItem('synapse_user');
    setUser(null);
    setToken('');
    navigateHook('/');
  };

  // Build nav links based on login state and role
  const navLinks = [];

  if (user) {
    navLinks.push({ key: 'mentors', label: 'Mentors', icon: null });
    navLinks.push({ key: 'forum', label: 'Forum', icon: null });
    if (user.role === 'admin') {
      navLinks.push({ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> });
    }
  }

  return (
    <div className="app-container">
      {/* ─── Sticky Glassmorphic Navbar ─── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-container">
          <a className="navbar-logo" onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={synapseLogo} alt="Synapse Logo" style={{ width: '28px', height: '28px', border: '1.5px solid #05060f', borderRadius: '50%', boxShadow: '0.1rem 0.1rem #05060f' }} />
            <span style={{ fontWeight: 900, fontSize: '1.35rem', fontFamily: "'Inter Tight', sans-serif", letterSpacing: '-0.02em' }}>
              <span style={{
                background: 'linear-gradient(135deg, #10B981 0%, #2563EB 50%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Synapse</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.key}>
                <a
                  className={`navbar-link${page === link.key ? ' active' : ''}`}
                  onClick={() => navigate(link.key)}
                >
                  {link.icon && link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
          <div className="navbar-auth-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              className={`navbar-link${page === 'home' ? ' active' : ''}`}
              onClick={() => navigate('home')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: 650 }}
            >
              Home
            </a>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
                  <span style={{ fontWeight: 800, color: '#05060f', fontSize: '0.85rem' }}>{user.name}</span>
                  <span style={{ color: 'var(--color-primary-dark)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.5px' }}>{user.role}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '0.4rem' }}>
                  Logout <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('login')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '0.4rem' }}>
                Sign In <LogIn size={13} />
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="btn btn-ghost mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '8px' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            zIndex: 99,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <a
              className={`navbar-link${page === 'home' ? ' active' : ''}`}
              onClick={() => navigate('home')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
            >
              Home
            </a>
            {navLinks.map((link) => (
              <a
                key={link.key}
                className={`navbar-link${page === link.key ? ' active' : ''}`}
                onClick={() => navigate(link.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
              >
                {link.icon && link.icon}
                {link.label}
              </a>
            ))}
            <div style={{ borderTop: '2px solid #05060f', marginTop: '8px', paddingTop: '12px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '0 8px' }}>
                    <span style={{ fontWeight: 800, color: '#05060f' }}>{user.name}</span>
                    <span style={{ color: 'var(--color-primary-dark)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>{user.role}</span>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={handleLogout} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '100%' }}
                  >
                    Logout <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => navigate('login')} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '100%' }}
                >
                  Sign In <LogIn size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Main Content ─── */}
      <main className={page === 'home' ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home setPage={navigate} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/mentors" element={user ? <MentorList user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/forum" element={user ? <Forum user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={user && user.role === 'admin' ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer" style={{ textAlign: 'left', padding: 'var(--space-7) var(--space-5)' }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
          borderBottom: '2px solid #e0e0e6',
          marginBottom: 'var(--space-5)',
        }}>
          {/* Column 1: Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <img src={synapseLogo} alt="Synapse Logo" style={{ width: '24px', height: '24px', border: '1.5px solid #05060f', borderRadius: '50%', boxShadow: '0.1rem 0.1rem #05060f' }} />
              <span style={{ fontWeight: 900, fontSize: '1.2rem', fontFamily: "'Inter Tight', sans-serif", letterSpacing: '-0.02em' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #2563EB 50%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Synapse</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4a4a57', lineHeight: '1.6', marginBottom: 'var(--space-4)' }}>
              Empowering students through verified alumni guidance, 1-on-1 mentorship sessions, and open collaborative discussion networks.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: '0.95rem', fontWeight: 800, color: '#05060f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a onClick={() => navigate('home')} style={{ color: '#4a4a57', cursor: 'pointer', fontWeight: 600 }}>Home Page</a></li>
              <li><a onClick={() => navigate('mentors')} style={{ color: '#4a4a57', cursor: 'pointer', fontWeight: 600 }}>Mentor Directory</a></li>
              <li><a onClick={() => navigate('forum')} style={{ color: '#4a4a57', cursor: 'pointer', fontWeight: 600 }}>Open Forum</a></li>
              <li><a onClick={() => navigate('dashboard')} style={{ color: '#4a4a57', cursor: 'pointer', fontWeight: 600 }}>Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Resources */}
          <div>
            <h4 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: '0.95rem', fontWeight: 800, color: '#05060f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="#" style={{ color: '#4a4a57', fontWeight: 600 }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: '#4a4a57', fontWeight: 600 }}>Terms of Service</a></li>
              <li><a href="#" style={{ color: '#4a4a57', fontWeight: 600 }}>Alumni Code of Conduct</a></li>
              <li><a href="#" style={{ color: '#4a4a57', fontWeight: 600 }}>Help & Support</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h4 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: '0.95rem', fontWeight: 800, color: '#05060f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
              Stay Updated
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#4a4a57', marginBottom: '12px' }}>
              Subscribe to get notified about new mentors and career insights.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="you@university.edu"
                className="form-input"
                style={{
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  borderRadius: '0.4rem',
                  borderWidth: '2px',
                }}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 12px', borderRadius: '0.4rem', boxShadow: '0.15rem 0.15rem #05060f' }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#8b8b99',
        }}>
          <span>&copy; {new Date().getFullYear()} Synapse. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#8b8b99' }}>Facebook</a>
            <a href="#" style={{ color: '#8b8b99' }}>LinkedIn</a>
            <a href="#" style={{ color: '#8b8b99' }}>GitHub</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
