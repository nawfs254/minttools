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
          <img src="/logo.png" alt="MintTools Logo" className="brand-logo-img" />
        </div>
        <h1 className="brand-title">MintTools</h1>
      </Link>

      <div className="header-actions">
        <Link
          href="/about"
          className="tool-btn"
          title="About MintTools"
          style={{
            textDecoration: 'none',
            background: pathname === '/about' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: pathname === '/about' ? 'var(--accent, #6366f1)' : 'inherit',
            fontSize: '0.85rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <span>About</span>
        </Link>

        <Link
          href="/contact"
          className="tool-btn"
          title="Contact MintTools Support"
          style={{
            textDecoration: 'none',
            background: pathname === '/contact' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: pathname === '/contact' ? '#10b981' : 'inherit',
            fontSize: '0.85rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <span>Contact</span>
        </Link>

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
