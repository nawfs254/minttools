'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Sun, Moon } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minttools-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('minttools-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isHome = pathname === '/';

  return (
    <header className="app-header">
      <Link href="/" className="brand-section" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo-badge" title="MintTools Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <h1 className="brand-title">MintTools</h1>
      </Link>

      <div className="header-actions">
        {!isHome && (
          <Link
            href="/"
            className="tool-btn"
            title="Return to Tools"
            style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)' }}
          >
            <LayoutGrid size={15} />
            <span className="all-tools-label">All Tools</span>
          </Link>
        )}

        <button
          className="btn-icon"
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          aria-label="Toggle Theme"
        >
          {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
