import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Plus, Trash2, Check, X } from 'lucide-react';

export default function Dashboard() {
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mentor Form State
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorDomain, setMentorDomain] = useState('Software Engineering');
  const [mentorExp, setMentorExp] = useState('');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorSkills, setMentorSkills] = useState('');
  const [mentorAvail, setMentorAvail] = useState('');
  const [mentorAvatar, setMentorAvatar] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [mentorsRes, bookingsRes, postsRes] = await Promise.all([
        fetch(`${API_BASE}/api/mentors`),
        fetch(`${API_BASE}/api/bookings`),
        fetch(`${API_BASE}/api/forum/posts`)
      ]);
      setMentors(await mentorsRes.json());
      setBookings(await bookingsRes.json());
      setPosts(await postsRes.json());
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBookingStatus = async (bookingId, newStatus) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map(b => b._id === bookingId ? updated : b));
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    if (!window.confirm("Are you sure you want to delete this mentor profile?")) return;
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/mentors/${mentorId}`, { method: 'DELETE' });
      if (res.ok) setMentors(mentors.filter(m => m._id !== mentorId));
    } catch (err) {
      console.error("Error deleting mentor:", err);
    }
  };

  const handleAddMentorSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); setFormSuccess(false);
    if (!mentorName || !mentorEmail || !mentorDomain || !mentorExp || !mentorBio) {
      setFormError('All fields marked as required are mandatory.');
      return;
    }
    const parsedSkills = mentorSkills ? mentorSkills.split(',').map(s => s.trim()) : [];
    const parsedAvail = mentorAvail ? mentorAvail.split(',').map(a => a.trim()) : ["Mon-Fri: 6:00 PM - 8:00 PM"];
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/mentors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mentorName, email: mentorEmail, domain: mentorDomain,
          experience: Number(mentorExp), bio: mentorBio,
          avatar: mentorAvatar || undefined,
          skills: parsedSkills, availability: parsedAvail
        })
      });
      if (res.ok) {
        const newMentor = await res.json();
        setMentors([newMentor, ...mentors]);
        setFormSuccess(true);
        setMentorName(''); setMentorEmail(''); setMentorExp('');
        setMentorBio(''); setMentorSkills(''); setMentorAvail(''); setMentorAvatar('');
        setTimeout(() => { setIsAddMentorOpen(false); setFormSuccess(false); }, 1500);
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to add mentor profile.');
      }
    } catch (err) {
      setFormError('Server connection error. Please try again.');
    }
  };

  const totalMentors = mentors.length;
  const totalBookings = bookings.length;
  const totalPosts = posts.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

  const domainCounts = mentors.reduce((acc, m) => {
    acc[m.domain] = (acc[m.domain] || 0) + 1;
    return acc;
  }, {});
  const domainData = Object.keys(domainCounts).map(domain => ({ name: domain, value: domainCounts[domain] }));

  const statusBadge = (status) => {
    if (status === 'Approved') return 'badge-green';
    if (status === 'Pending') return 'badge-orange';
    return 'badge-red';
  };

  const chartColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', '#8b5cf6'];

  return (
    <div className="fade-section">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="section-title">Platform Dashboard</h2>
          <p className="section-subtitle">Manage bookings, monitor analytics, and manage alumni directory profiles.</p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'var(--color-bg-muted)',
          border: '2.5px solid #05060f',
          padding: '4px',
          borderRadius: '0.8rem',
          boxShadow: '0.2rem 0.2rem #05060f',
        }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'bookings', label: 'Bookings', badge: pendingBookings },
            { key: 'mentors', label: 'Mentors' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '0.5rem', border: 'none', boxShadow: 'none' }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span style={{
                  background: 'var(--color-danger)', color: '#fff',
                  fontSize: '0.65rem', padding: '1px 6px',
                  borderRadius: '0.25rem', marginLeft: '6px',
                  border: '1px solid #05060f', fontWeight: 'bold'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid var(--color-border)',
            borderTop: '3px solid var(--color-primary)',
            borderRadius: '50%', animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto',
          }} />
          Loading metrics...
        </div>
      ) : (
        <div>
          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === 'overview' && (
            <div>
              {/* Stat Cards */}
              <div className="grid-3" style={{ marginBottom: '36px' }}>
                {[
                  { icon: <Users size={22} />, val: totalMentors, label: 'Active Mentors', color: 'var(--color-primary)', glow: 'var(--color-primary-glow)' },
                  { icon: <Calendar size={22} />, val: totalBookings, label: `Total Sessions (${pendingBookings} pending)`, color: 'var(--color-secondary)', glow: 'var(--color-secondary-glow)' },
                  { icon: <MessageSquare size={22} />, val: totalPosts, label: 'Discussion Posts', color: 'var(--color-accent)', glow: 'var(--color-accent-glow)' },
                ].map((s, i) => (
                  <div className="card" key={i} style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '24px' }}>
                    <div style={{
                      padding: '12px', background: s.glow,
                      border: '2px solid #05060f',
                      borderRadius: '0.6rem', color: s.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: "'Inter Tight', sans-serif", color: '#05060f' }}>{s.val}</div>
                      <div style={{ color: 'var(--color-text-body)', fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid-2" style={{ gap: '28px' }}>
                {/* Domain Representation */}
                <div className="card-flat" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '24px', color: 'var(--color-text)' }}>Domain Representation</h3>
                  {domainData.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '30px 0', fontSize: '0.9rem' }}>No profiles recorded.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {domainData.map((d, idx) => {
                        const pct = totalMentors > 0 ? (d.value / totalMentors) * 100 : 0;
                        const col = chartColors[idx % chartColors.length];
                        return (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 500, color: 'var(--color-text-body)' }}>{d.name}</span>
                              <span style={{ fontWeight: 700, color: col }}>{d.value} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: '#ffffff', border: '2px solid #05060f', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${pct}%`, height: '100%',
                                background: col,
                                transition: 'width 0.6s var(--ease-out)',
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Bookings Feed */}
                <div className="card-flat" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#05060f' }}>Recent Bookings</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('bookings')}>Manage All</button>
                  </div>
                  {bookings.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '30px 0', fontSize: '0.9rem' }}>No requests submitted.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '240px' }}>
                      {bookings.slice(0, 5).map((b) => (
                        <div key={b._id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'var(--color-bg-subtle)',
                          border: '2px solid #05060f',
                          padding: '12px 16px', borderRadius: '0.6rem',
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>{b.studentName} → {b.mentorName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>📅 {b.date} • {b.timeSlot}</div>
                          </div>
                          <span className={`badge ${statusBadge(b.status)}`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ BOOKINGS TAB ═══ */}
          {activeTab === 'bookings' && (
            <div className="card-flat" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', color: 'var(--color-text)' }}>Mentorship Session Requests</h3>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                  <Calendar size={40} style={{ opacity: 0.3, marginBottom: '14px' }} />
                  <p style={{ fontSize: '0.92rem' }}>No booking requests recorded.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Mentor</th>
                        <th>Schedule</th>
                        <th>Topic & Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{booking.studentName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{booking.studentEmail}</div>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--color-text-body)' }}>{booking.mentorName}</td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{booking.date}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{booking.timeSlot}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text)' }}>{booking.topic}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={booking.description}>
                              {booking.description}
                            </div>
                          </td>
                          <td><span className={`badge ${statusBadge(booking.status)}`}>{booking.status}</span></td>
                          <td>
                            {booking.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-sm" onClick={() => handleBookingStatus(booking._id, 'Approved')}
                                  style={{ padding: '6px 10px', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)' }}>
                                  <Check size={14} />
                                </button>
                                <button className="btn btn-sm" onClick={() => handleBookingStatus(booking._id, 'Rejected')}
                                  style={{ padding: '6px 10px', background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)' }}>
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Actioned</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══ MENTORS TAB ═══ */}
          {activeTab === 'mentors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>Active Mentor Profiles</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddMentorOpen(true)}>
                  <Plus size={16} /> Add Mentor Profile
                </button>
              </div>

              <div className="card-flat" style={{ padding: '24px' }}>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Mentor Name</th>
                        <th>Domain</th>
                        <th>Experience</th>
                        <th>Email</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentors.map((mentor) => (
                        <tr key={mentor._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={mentor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt={mentor.name}
                                style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                              />
                              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{mentor.name}</div>
                            </div>
                          </td>
                          <td><span className="badge badge-green">{mentor.domain}</span></td>
                          <td style={{ fontWeight: 500 }}>{mentor.experience} Years</td>
                          <td style={{ color: 'var(--color-text-body)' }}>{mentor.email}</td>
                          <td>
                            <div style={{ fontSize: '0.8rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-muted)' }}>
                              {mentor.availability.join(', ')}
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMentor(mentor._id)} style={{ padding: '8px' }}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Add Mentor Modal ─── */}
      {isAddMentorOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsAddMentorOpen(false)}>
              <X size={16} />
            </button>

            {formSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ color: 'var(--color-success)', marginBottom: '20px' }}>
                  <Check size={64} style={{ margin: '0 auto', border: '2px solid', borderRadius: '50%', padding: '12px' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', color: 'var(--color-text)' }}>Profile Created!</h3>
                <p style={{ color: 'var(--color-text-body)', fontSize: '0.92rem' }}>Alumni mentor has been successfully added.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text)' }}>Add Mentor Profile</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.5 }}>
                  Register a new alumni profile to make them available for booking.
                </p>

                {formError && (
                  <div style={{ background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid #FECACA', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleAddMentorSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" value={mentorName} onChange={(e) => setMentorName(e.target.value)} placeholder="e.g. Alex Rivera" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Domain Category *</label>
                      <select className="form-select" value={mentorDomain} onChange={(e) => setMentorDomain(e.target.value)}>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Product Management">Product Management</option>
                        <option value="UX Design">UX Design</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years) *</label>
                      <input type="number" className="form-input" value={mentorExp} onChange={(e) => setMentorExp(e.target.value)} placeholder="e.g. 5" min="1" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} placeholder="e.g. alex.rivera@alumni.edu" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Biography *</label>
                    <textarea className="form-textarea" value={mentorBio} onChange={(e) => setMentorBio(e.target.value)} placeholder="Graduation class, current work, consultation goals..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills (Comma separated)</label>
                    <input type="text" className="form-input" value={mentorSkills} onChange={(e) => setMentorSkills(e.target.value)} placeholder="e.g. System Design, React, Node.js" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Available Time Slots (Comma separated)</label>
                    <input type="text" className="form-input" value={mentorAvail} onChange={(e) => setMentorAvail(e.target.value)} placeholder="e.g. Sat: 10am - 12pm, Wed: 6pm - 8pm" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Avatar Image URL</label>
                    <input type="text" className="form-input" value={mentorAvatar} onChange={(e) => setMentorAvatar(e.target.value)} placeholder="e.g. https://images.unsplash.com/photo-..." />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Profile</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsAddMentorOpen(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
