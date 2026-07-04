import React, { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, MessageSquare, ArrowRight, ShieldCheck, Sparkles, Award, Zap } from 'lucide-react';
import heroIllustration from '../assets/hero_illustration.png';

/* ─── Reusable 3D Tilt Card ─── */
function TiltCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateX(${-(y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      className={`card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transform, transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s' }}
    >
      {children}
    </div>
  );
}

export default function Home({ setPage }) {
  const [stats, setStats] = useState({ mentors: 0, bookings: 0, posts: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const [mentorsRes, bookingsRes, postsRes] = await Promise.all([
          fetch(`${API_BASE}/api/mentors`),
          fetch(`${API_BASE}/api/bookings`),
          fetch(`${API_BASE}/api/forum/posts`)
        ]);
        const mentors = await mentorsRes.json();
        const bookings = await bookingsRes.json();
        const posts = await postsRes.json();
        setStats({ mentors: mentors.length, bookings: bookings.length, posts: posts.length });
      } catch (err) {
        console.error("Error fetching homepage statistics:", err);
        setStats({ mentors: 4, bookings: 2, posts: 2 });
      }
    };
    fetchStats();
  }, []);

  const isWide = windowWidth > 992;

  return (
    <div style={{ position: 'relative' }}>
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section style={{
        position: 'relative',
        background: '#ffffff',
        borderBottom: '2.5px solid #05060f',
        padding: isWide ? '80px 0 100px 0' : '48px 0',
        overflow: 'hidden',
      }}>
        {/* Background subtle dot grid */}
        <div className="grid-bg" style={{ opacity: 0.6 }}></div>

        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 var(--space-5)',
          display: 'grid',
          gridTemplateColumns: isWide ? '1.15fr 1fr' : '1fr',
          gap: '48px',
          alignItems: 'center',
        }}>
          {/* Left Column: Heading and Info */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'var(--color-primary-light)',
              border: '1.5px solid #05060f',
              borderRadius: 'var(--radius-full)',
              marginBottom: '24px',
              boxShadow: '0.15rem 0.15rem #05060f',
            }}>
              <Sparkles size={14} style={{ color: 'var(--color-primary-dark)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Alumni Mentorship Platform
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#05060f',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}>
              From Campus to Career, <br />
              We Connect <span style={{ color: 'var(--color-primary)' }}>Generations</span>
            </h1>

            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--color-secondary)',
              marginBottom: '18px',
              fontFamily: "'Inter Tight', sans-serif"
            }}>
              One Network. Infinite Possibilities.
            </h2>

            <p style={{
              fontSize: '1.02rem',
              color: 'var(--color-text-body)',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '540px',
            }}>
              Skip the guesswork. Connect 1-on-1 with senior alumni who navigated your major and secured roles at top-tier global companies.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setPage('mentors')}
                style={{ padding: '12px 26px', fontSize: '0.92rem' }}
              >
                Find a Mentor <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setPage('forum')}
                style={{ padding: '12px 26px', fontSize: '0.92rem' }}
              >
                Discuss in Forums
              </button>
            </div>
          </div>

          {/* Right Column: 3D Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              border: '2.5px solid #05060f',
              borderRadius: '1rem',
              boxShadow: '0.6rem 0.6rem #05060f',
              overflow: 'hidden',
              background: '#ffffff',
              width: '100%',
              maxWidth: '560px',
            }}>
              <img
                src={heroIllustration}
                alt="Synapse Handshake Illustration"
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '40px auto 0 auto',
        padding: '0 var(--space-5)',
        position: 'relative',
        zIndex: 15,
      }}>
        <div className="grid-3">
          {[
            { icon: <Users size={24} />, value: stats.mentors, label: 'Vetted Alumni Mentors', color: 'var(--color-primary)', bg: 'var(--color-primary-glow)', border: 'rgba(16,185,129,0.2)' },
            { icon: <BookOpen size={24} />, value: stats.bookings, label: 'Sessions Conducted', color: 'var(--color-secondary)', bg: 'var(--color-secondary-glow)', border: 'rgba(37,99,235,0.2)' },
            { icon: <MessageSquare size={24} />, value: stats.posts, label: 'Discussion Threads', color: 'var(--color-accent)', bg: 'var(--color-accent-glow)', border: 'rgba(249,115,22,0.2)' },
          ].map((stat, i) => (
            <TiltCard key={i} style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              padding: '28px',
            }}>
              <div style={{
                padding: '14px',
                background: stat.bg,
                border: `2px solid #05060f`,
                borderRadius: '0.6rem',
                color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '2rem', fontWeight: 800,
                  fontFamily: "'Inter Tight', sans-serif",
                  color: 'var(--color-text)',
                }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════ PILLARS SECTION ═══════════════ */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '100px var(--space-5) 80px var(--space-5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 className="section-title">Engage & Elevate</h2>
          <p className="section-subtitle" style={{ margin: '10px auto 0 auto', textAlign: 'center' }}>
            Everything you need to advance from sophomore classrooms to industry boardrooms.
          </p>
        </div>

        <div className="grid-3">
          {[
            {
              icon: <Award size={24} />,
              title: 'Premium Vetting',
              desc: 'We authenticate every alumni profile against university database cohorts. Learn only from credible, real-world leaders.',
              color: 'var(--color-primary)',
              bg: 'var(--color-primary-glow)',
              border: 'rgba(16,185,129,0.15)',
            },
            {
              icon: <BookOpen size={24} />,
              title: '1-on-1 Availability',
              desc: 'Request sessions directly based on the mentor\'s schedule. Set custom agenda notes to target your exact needs.',
              color: 'var(--color-secondary)',
              bg: 'var(--color-secondary-glow)',
              border: 'rgba(37,99,235,0.15)',
            },
            {
              icon: <ShieldCheck size={24} />,
              title: 'Open Dialogue',
              desc: 'Pose questions in our category-tagged forums. Get multiple answers and career reflections from the alumni network.',
              color: 'var(--color-accent)',
              bg: 'var(--color-accent-glow)',
              border: 'rgba(249,115,22,0.15)',
            },
          ].map((item, i) => (
            <div className="card" key={i} style={{ padding: '32px' }}>
              <div style={{
                width: '48px', height: '48px',
                background: item.bg,
                border: '2px solid #05060f',
                borderRadius: '0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                marginBottom: '24px',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text)' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--color-text-body)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto 80px auto',
        padding: '0 var(--space-5)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669, #0d9488, #0891b2)',
          border: '2.5px solid #05060f',
          borderRadius: '1rem',
          padding: '56px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0.5rem 0.5rem #05060f',
        }}>
          <div style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Zap size={18} style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ready to accelerate?
              </span>
            </div>
            <h2 style={{
              fontSize: '1.8rem', fontWeight: 800, color: '#ffffff',
              lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '12px',
            }}>
              Start your mentorship journey today
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Browse verified alumni mentors, book 1-on-1 sessions, and join our growing community forum.
            </p>
          </div>
          <button
            className="btn"
            onClick={() => setPage('mentors')}
            style={{
              background: '#ffffff', color: '#05060f',
              padding: '14px 32px', fontSize: '0.95rem', fontWeight: 700,
              boxShadow: '0.25rem 0.25rem #05060f',
            }}
          >
            Browse Mentors <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
