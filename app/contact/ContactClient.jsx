'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Send, CheckCircle2, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

export default function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast?.showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Compose mailto link to ensure 100% reliable dispatch without a complex backend
    const mailtoSubject = encodeURIComponent(`[MintTools ${subject}] from ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCategory: ${subject}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:hello@minttools.net?subject=${mailtoSubject}&body=${mailtoBody}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
    toast?.showToast('Your email client is opening. Thank you for your message!', 'success');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto 4rem', padding: '0 1.5rem', lineHeight: '1.75', color: 'var(--text-main)' }}>
      <Link
        href="/"
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '1.5rem'
        }}
      >
        ← Back to Tools
      </Link>

      <header style={{ marginBottom: '2.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}
        >
          Support & Inquiries
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
          Contact MintTools
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', margin: 0, maxWidth: '720px' }}>
          Have a question, encountered a bug, or have a suggestion for a new web tool? We're here to help. Reach out directly and we will respond as soon as possible.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Contact Form */}
        <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '14px', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--accent)" />
            <span>Send Us a Message</span>
          </h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Thank You for Reaching Out!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: '0 0 1.5rem' }}>
                Your message has been initiated via your mail client. If it did not open automatically, you can always write to us directly at <strong>hello@minttools.net</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="tool-btn btn-primary"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tool-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tool-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  Topic / Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="tool-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="General Feedback">General Feedback & Comments</option>
                  <option value="Bug Report">Bug or Issue Report</option>
                  <option value="Feature Request">New Tool or Feature Request</option>
                  <option value="Privacy Question">Privacy or Security Inquiry</option>
                  <option value="Business Inquiry">Business or Collaboration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your question, request, or issue with as much detail as possible..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="tool-input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="tool-btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  marginTop: '0.5rem'
                }}
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Direct Channels & Operational Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '14px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#10b981" />
              <span>Direct Email</span>
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
              For support inquiries, security notifications, or technical questions:
            </p>
            <a
              href="mailto:hello@minttools.net"
              style={{
                display: 'inline-block',
                fontWeight: 600,
                color: 'var(--accent, #6366f1)',
                textDecoration: 'none',
                fontSize: '1.05rem',
                wordBreak: 'break-all'
              }}
            >
              hello@minttools.net
            </a>
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Expected response time: within 24 to 48 business hours.
            </div>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '14px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem' }}>
              Social & Community
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Follow our project updates and feature announcements:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a
                  href="https://web.facebook.com/mint.tools.26/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem' }}
                >
                  <ArrowRight size={14} color="var(--accent)" />
                  <span>Facebook: <strong>mint.tools.26</strong></span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mint.tools.26/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem' }}
                >
                  <ArrowRight size={14} color="var(--accent)" />
                  <span>Instagram: <strong>@mint.tools.26</strong></span>
                </a>
              </li>
            </ul>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
              <Shield size={18} />
              <span>Privacy Reminder</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Please do NOT include sensitive passwords, confidential files, or unredacted personal identification documents in your support emails. All tool operations should be conducted directly in your local browser sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Support FAQ */}
      <section style={{ borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))', paddingTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--accent)" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.02))', border: '1px solid var(--border-color, rgba(255,255,255,0.06))', borderRadius: '10px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>Is MintTools completely free to use?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Yes. All our tools—including PDF editing, compression, image converting, and barcode creation—are 100% free with no subscription tiers or paywalls.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.02))', border: '1px solid var(--border-color, rgba(255,255,255,0.06))', borderRadius: '10px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>Can I request a new tool?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Absolutely! We welcome feature requests and new tool ideas from our community. Select "Feature Request" in the form above.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.02))', border: '1px solid var(--border-color, rgba(255,255,255,0.06))', borderRadius: '10px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>How do I report a security vulnerability?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Please email hello@minttools.net directly with the subject "[Security Vulnerability]" so our engineering team can review and address it immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
