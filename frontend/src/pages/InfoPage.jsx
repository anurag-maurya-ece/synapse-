import React from 'react';
import { ArrowLeft, Shield, FileText, CheckSquare, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InfoPage({ type }) {
  const navigate = useNavigate();

  const getPageContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <Shield size={32} style={{ color: 'var(--color-primary)' }} />,
          description: 'Last updated: July 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              body: 'We collect personal information that you voluntarily provide to us when you register on the platform, such as name, email address, password, role (student or admin), and profile details like skills, bios, and availability.'
            },
            {
              heading: '2. How We Use Your Information',
              body: 'We use your information to facilitate mentorship connections, handle booking requests, run discussion forums, verify identity credentials, and send system updates.'
            },
            {
              heading: '3. Data Security',
              body: 'All passwords are salted and hashed using cryptographically secure algorithms before storage. However, please remember that no method of transmission over the internet is 100% secure.'
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText size={32} style={{ color: 'var(--color-secondary)' }} />,
          description: 'Last updated: July 2026',
          sections: [
            {
              heading: '1. Acceptance of Terms',
              body: 'By accessing or using Synapse, you agree to comply with and be bound by these Terms of Service. If you do not agree, you may not use the services.'
            },
            {
              heading: '2. User Accounts',
              body: 'You are responsible for maintaining the confidentiality of your account credentials, including passwords, and are fully responsible for all activities that occur under your account.'
            },
            {
              heading: '3. Booking and Bookings Policy',
              body: 'Consultations are scheduled between students and mentors. Admins reserve the right to review, approve, or reject booking requests to maintain platform decorum.'
            }
          ]
        };
      case 'conduct':
        return {
          title: 'Alumni Code of Conduct',
          icon: <CheckSquare size={32} style={{ color: 'var(--color-accent-dark)' }} />,
          description: 'Last updated: July 2026',
          sections: [
            {
              heading: '1. Respect and Inclusivity',
              body: 'All members of the Synapse network must treat others with respect, kindness, and professional courtesy. Harassment, discrimination, or hate speech of any kind is strictly prohibited.'
            },
            {
              heading: '2. Mentorship Integrity',
              body: 'Alumni mentors commit to providing constructive, honest, and ethical career advice. They should not solicit services, charge external fees, or share private student details.'
            },
            {
              heading: '3. Reporting Misconduct',
              body: 'If you encounter behavior that violates this Code of Conduct, please report it immediately to the admin team through the Support page.'
            }
          ]
        };
      case 'support':
      default:
        return {
          title: 'Help & Support',
          icon: <HelpCircle size={32} style={{ color: 'var(--color-primary-dark)' }} />,
          description: 'Get in touch with the Synapse support team.',
          sections: [
            {
              heading: 'Frequently Asked Questions',
              body: 'How do I book a session? Go to the Mentors tab, select a mentor, and click "Request 1-on-1 Consultation". Once submitted, wait for an admin to approve the status.'
            },
            {
              heading: 'Contact Administration',
              body: 'For account issues, database errors, or misconduct reports, please email us directly at support@synapse.com. Our support team is online Monday to Friday, 9 AM - 6 PM.'
            }
          ]
        };
    }
  };

  const content = getPageContent();

  return (
    <div className="fade-section" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px var(--space-4)' }}>
      <button 
        className="btn btn-secondary btn-sm" 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="card" style={{ padding: '40px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '2.5px solid #05060f', 
            borderRadius: '0.6rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0.2rem 0.2rem #05060f',
            background: '#ffffff'
          }}>
            {content.icon}
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#05060f', margin: 0, letterSpacing: '-0.5px' }}>
              {content.title}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              {content.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '36px' }}>
          {content.sections.map((section, idx) => (
            <div key={idx} style={{ borderBottom: idx < content.sections.length - 1 ? '1.5px dashed #e0e0e6' : 'none', paddingBottom: idx < content.sections.length - 1 ? '24px' : '0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#05060f', marginBottom: '10px' }}>
                {section.heading}
              </h3>
              <p style={{ color: 'var(--color-text-body)', fontSize: '0.94rem', lineHeight: 1.7 }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
