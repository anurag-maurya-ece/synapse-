import React, { useState, useEffect } from 'react';
import { Search, Calendar, Star, CheckCircle, X, Briefcase } from 'lucide-react';

export default function MentorList({ user }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  // Booking Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDesc, setBookingDesc] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const domains = ['All', 'Software Engineering', 'Data Science', 'Product Management', 'UX Design'];

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let url = `${API_BASE}/api/mentors`;
      const params = new URLSearchParams();
      if (selectedDomain !== 'All') params.append('domain', selectedDomain);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMentors(); }, [selectedDomain, search]);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookingSuccess(false);
    setBookingError('');
    setStudentName(user ? user.name : '');
    setStudentEmail(user ? user.email : '');
    setBookingDate('');
    setBookingTime('');
    setBookingTopic('');
    setBookingDesc('');
  };

  const handleCloseBooking = () => setSelectedMentor(null);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !bookingDate || !bookingTime || !bookingTopic || !bookingDesc) {
      setBookingError('All fields are required.');
      return;
    }
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          mentorName: selectedMentor.name,
          studentName,
          studentEmail,
          date: bookingDate,
          timeSlot: bookingTime,
          topic: bookingTopic,
          description: bookingDesc
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => setSelectedMentor(null), 2000);
      } else {
        const errData = await res.json();
        setBookingError(errData.error || 'Failed to submit booking request.');
      }
    } catch (err) {
      setBookingError('Server connection error. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="fade-section">
      <div style={{ marginBottom: '40px' }}>
        <h2 className="section-title">Alumni Mentor Directory</h2>
        <p className="section-subtitle">Accelerate your career track with verified 1-on-1 alumni consultations.</p>

        {/* Filter Bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '20px',
          alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '40px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`btn btn-sm ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {dom}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid var(--color-border)',
            borderTop: '3px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto'
          }} />
          Indexing directory...
        </div>
      ) : mentors.length === 0 ? (
        <div style={{
          textAlign: 'center',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '80px 24px',
        }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '8px' }}>No matching profiles</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>Try resetting your search filters to see all mentors.</p>
        </div>
      ) : (
        <div className="grid-2">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-card-body">
                {/* Header */}
                <div className="mentor-card-header">
                  <img
                    src={mentor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={mentor.name}
                    className="mentor-card-avatar"
                  />
                  <div>
                    <h3 className="mentor-card-name">{mentor.name}</h3>
                    <span className="mentor-card-domain">{mentor.domain}</span>
                    <div className="mentor-card-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={14} style={{ color: 'var(--color-secondary)' }} />
                        <strong>{mentor.experience} Yrs</strong> Exp
                      </span>
                      <span className="mentor-card-rating">
                        <Star size={14} fill="#f59e0b" stroke="none" /> <strong>{mentor.rating.toFixed(1)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="mentor-card-bio">
                  {mentor.bio}
                </p>

                {/* Skills tags */}
                <ul className="mentor-card-skills" role="list">
                  {mentor.skills && mentor.skills.map((skill, i) => (
                    <li key={i} className="mentor-card-skill-item">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability */}
              <div className="mentor-card-avail-section">
                <div className="mentor-card-avail-label">Availability</div>
                <ul className="mentor-card-avail-list">
                  {mentor.availability && mentor.availability.map((av, index) => (
                    <li key={index} className="mentor-card-avail-item">
                      <Calendar size={14} style={{ color: 'var(--color-primary)' }} /> {av}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA footer */}
              <div className="mentor-card-footer">
                <button className="mentor-card-cta" onClick={() => handleOpenBooking(mentor)}>
                  Request 1-on-1 Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Booking Modal ─── */}
      {selectedMentor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseBooking}>
              <X size={16} />
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ color: 'var(--color-success)', marginBottom: '20px' }}>
                  <CheckCircle size={64} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text)' }}>Session Requested!</h3>
                <p style={{ color: 'var(--color-text-body)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Your session request for <strong>{selectedMentor.name}</strong> has been logged. Check the dashboard for approval status.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text)' }}>
                  Consult with {selectedMentor.name}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.5 }}>
                  Propose a date and describe your agenda. The mentor will review and confirm.
                </p>

                {bookingError && (
                  <div style={{
                    background: '#FEF2F2', color: 'var(--color-danger)',
                    border: '1px solid #FECACA', padding: '14px',
                    borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem',
                  }}>
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleSubmitBooking}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. John Doe" disabled={!!user} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="e.g. john.doe@student.edu" disabled={!!user} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Consultation Date</label>
                      <input type="date" className="form-input" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Time Slot</label>
                      <select className="form-select" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required>
                        <option value="">Select Time Slot</option>
                        {selectedMentor.availability.map((av, idx) => (
                          <option key={idx} value={av}>{av}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Subject</label>
                    <input type="text" className="form-input" value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} placeholder="e.g. Resume Deep-dive / Mock Interview" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Session Goals / Description</label>
                    <textarea className="form-textarea" value={bookingDesc} onChange={(e) => setBookingDesc(e.target.value)} placeholder="List 2-3 specific questions or topics you hope to cover..." required />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Request</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseBooking}>Cancel</button>
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
