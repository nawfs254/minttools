import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | MintTools',
  description: 'The page you requested could not be found. Explore our 100% free, private web tools.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function NotFound() {
  return (
    <div style={{
      maxWidth: '680px',
      margin: '4rem auto 6rem',
      padding: '2.5rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        fontSize: '1.75rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        404
      </div>

      <h1 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: 'var(--text-main)'
      }}>
        Page Not Found
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1rem',
        lineHeight: '1.6',
        marginBottom: '2rem'
      }}>
        The requested URL could not be found or has moved. Explore our suite of free, private, client-side tools below.
      </p>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link
          href="/"
          className="tool-btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            textDecoration: 'none'
          }}
        >
          <Home size={16} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
