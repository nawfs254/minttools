'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  FileText,
  FileDown,
  Layers,
  FileImage,
  BookOpen,
  Key,
  QrCode,
  ScanLine,
  Barcode,
  Image as ImageIcon,
  ShieldCheck,
  Sliders,
  Terminal,
  ArrowRight,
  Zap,
  Lock,
  ChevronDown,
  Check,
  X,
  Cpu
} from 'lucide-react';

export default function HomeDashboard({ onSelectTool }) {
  const [navigatingId, setNavigatingId] = useState(null);

  const handleToolClick = (toolId) => {
    setNavigatingId(toolId);
    onSelectTool(toolId);
  };

  const tools = [
    {
      id: 'pdf',
      title: 'PDF Editor',
      desc: 'Edit text, whiteout & annotations',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      glow: 'rgba(99, 102, 241, 0.35)',
    },
    {
      id: 'pdf-compress',
      title: 'PDF Compressor',
      desc: 'Reduce file size with high clarity',
      icon: FileDown,
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      glow: 'rgba(236, 72, 153, 0.35)',
    },
    {
      id: 'pdf-merge',
      title: 'PDF Merge & Split',
      desc: 'Merge multiple PDFs & extract page ranges',
      icon: Layers,
      gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
      glow: 'rgba(139, 92, 246, 0.35)',
    },
    {
      id: 'image-pdf',
      title: 'Image & PDF',
      desc: 'Convert images to PDF or PDF to images',
      icon: FileImage,
      gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
      glow: 'rgba(14, 165, 233, 0.35)',
    },
    {
      id: 'image',
      title: 'Image Studio',
      desc: 'Compress, resize & convert format',
      icon: ImageIcon,
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
      glow: 'rgba(168, 85, 247, 0.35)',
    },
    {
      id: 'exif-cleaner',
      title: 'EXIF Cleaner',
      desc: 'Scrub GPS & camera metadata from photos',
      icon: ShieldCheck,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      glow: 'rgba(16, 185, 129, 0.35)',
    },
    {
      id: 'barcode',
      title: 'Barcode Studio',
      desc: 'Create Code 128, EAN-13 & UPC barcodes',
      icon: Barcode,
      gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
      glow: 'rgba(100, 116, 139, 0.35)',
    },
    {
      id: 'qr',
      title: 'QR Studio',
      desc: 'Create, customize & save QR codes',
      icon: QrCode,
      gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
      glow: 'rgba(6, 182, 212, 0.35)',
    },
    {
      id: 'qr-reader',
      title: 'QR Reader',
      desc: 'Scan QR from image, camera or clipboard',
      icon: ScanLine,
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      glow: 'rgba(2, 132, 199, 0.35)',
    },
    {
      id: 'markdown',
      title: 'Markdown Editor',
      desc: 'Live preview & 1-click vector PDF export',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    {
      id: 'password',
      title: 'Password Generator',
      desc: 'Strong passwords & readable passphrases',
      icon: Key,
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
      glow: 'rgba(5, 150, 105, 0.35)',
    },
    {
      id: 'converter',
      title: 'Dev Converter',
      desc: 'Data sizes, CSS units, colors & Unix time',
      icon: Sliders,
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      glow: 'rgba(249, 115, 22, 0.35)',
    },
    {
      id: 'dev',
      title: 'Dev Tools',
      desc: 'JSON format, Base64 & hash tools',
      icon: Terminal,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      glow: 'rgba(245, 158, 11, 0.35)',
    }
  ];

  const homeFaqs = [
    {
      q: 'How does MintTools protect my document and file privacy?',
      a: 'MintTools operates on a strict 100% client-side architecture. When you edit a PDF, compress an image, or generate barcodes, the processing algorithms execute entirely within your browser’s local memory (RAM) using WebAssembly and HTML5 Canvas. Your files, documents, and data are never uploaded to, transmitted across, or stored on remote servers.'
    },
    {
      q: 'Are there any usage limits, watermarks, or hidden subscription fees?',
      a: 'No. All tools on MintTools are 100% free with unlimited usage. We never add watermarks, logos, or forced branding to your exported files, and we do not require account registration or credit cards.'
    },
    {
      q: 'Can I use MintTools when I am offline?',
      a: 'Yes. Once a tool page is loaded in your web browser, all necessary scripts and processing libraries reside in your browser cache. You can disconnect your internet connection and continue editing PDFs, compressing images, or generating codes completely offline.'
    },
    {
      q: 'Can I safely process confidential business or legal documents?',
      a: 'Yes. Because your files never leave your computer or phone, MintTools is safe for confidential contracts, financial statements, and sensitive photos. Since there is no server-side ingestion or storage, there is zero risk of server-side data leaks.'
    },
    {
      q: 'What formats and file sizes are supported?',
      a: 'MintTools supports standard PDF documents of all page counts, common image formats (JPEG, PNG, WebP), standard 1D industrial barcodes (Code 128, EAN-13, UPC-A), and 2D QR codes with customizable error correction levels.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="dashboard-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: '0.75rem'
          }}
        >
          <ShieldCheck size={14} />
          <span>100% Client-Side Privacy & Zero Server Uploads</span>
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.6rem', letterSpacing: '-0.03em' }}>
          Free & Privacy-First Web Utilities
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', margin: 0, lineHeight: '1.6' }}>
          Edit PDFs, compress images, generate barcodes & QR codes, and convert developer formats directly inside your browser memory. Fast, secure, and private.
        </p>
      </div>

      {/* Tool Cards Grid */}
      <section className="tools-compact-section" aria-label="Available Utilities">
        <div className="tools-compact-grid">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`tool-small-box ${navigatingId === tool.id ? 'is-navigating' : ''}`}
                onClick={() => handleToolClick(tool.id)}
                style={{ '--box-glow': tool.glow }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectTool(tool.id);
                }}
              >
                <div className="small-box-icon" style={{ background: tool.gradient }}>
                  <Icon size={20} color="#ffffff" />
                </div>
                <div className="small-box-content">
                  <h2 className="small-box-title" style={{ fontSize: '0.95rem', margin: '0 0 0.15rem' }}>
                    {tool.title}
                  </h2>
                  <p className="small-box-tagline">{tool.desc}</p>
                </div>
                <div className="small-box-arrow">
                  {navigatingId === tool.id ? (
                    <Loader2 size={16} className="tool-spin-icon" />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architectural Guarantee Section (Substantial Publisher Content) */}
      <section style={{ maxWidth: '1000px', margin: '3.5rem auto 2.5rem', padding: '0 1rem' }} aria-label="Why Choose MintTools">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Why Choose MintTools?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Modern client-side computing eliminates the risks, delays, and costs of traditional cloud tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#10b981', marginBottom: '0.75rem' }}><ShieldCheck size={26} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>True In-Browser Privacy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              Unlike traditional cloud convert services that upload your PDFs and photos to unknown third-party servers, MintTools runs 100% inside your local device memory using WebAssembly.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#6366f1', marginBottom: '0.75rem' }}><Zap size={26} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Instant Native Speed</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              Eliminate upload and download wait times. Large PDFs and multi-megabyte photo batches compress and convert at the full hardware speed of your own computer or mobile phone.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}><Lock size={26} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Zero Account Friction</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              No accounts, no email spam, no passwords, and no credit cards. Simply open the tool you need and complete your task in seconds without registering.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 3rem', padding: '0 1rem' }} aria-label="Comparison Table">
        <div className="seo-comparison-container" style={{ margin: 0 }}>
          <div className="seo-comparison-header">
            <h2 className="seo-comparison-title" style={{ fontSize: '1.4rem' }}>
              MintTools vs Traditional Cloud Tools
            </h2>
            <p className="seo-comparison-subtitle">
              Compare our browser-first approach against conventional online converters.
            </p>
          </div>
          <div className="seo-comparison-table-wrapper">
            <table className="seo-comparison-table">
              <thead>
                <tr>
                  <th className="th-feature">Key Criteria</th>
                  <th className="th-mint">MintTools</th>
                  <th className="th-others">Traditional Cloud Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Data Privacy</strong>
                    <span className="td-desc">Where files are processed</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>100% In-Browser (Zero Server Uploads)</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Uploaded to 3rd-party remote servers</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Access & Accounts</strong>
                    <span className="td-desc">User friction</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>Instant Access — No Signups Required</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Forced email signups & marketing</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Limits & Watermarks</strong>
                    <span className="td-desc">Export restrictions</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>Unlimited & Zero Watermarks</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Watermarks added or daily file quotas</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Cost</strong>
                    <span className="td-desc">Pricing model</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>100% Free Forever</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>$10 – $25/month recurring subscriptions</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comprehensive Homepage FAQs */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 3.5rem', padding: '0 1rem' }} aria-label="Frequently Asked Questions">
        <div className="seo-faqs-container" style={{ margin: 0 }}>
          <h2 className="seo-faqs-title" style={{ fontSize: '1.4rem' }}>
            Frequently Asked Questions
          </h2>
          <div className="seo-faqs-list">
            {homeFaqs.map((faq, idx) => (
              <details key={idx} className="seo-faq-item">
                <summary className="seo-faq-summary">
                  <span>{faq.q}</span>
                  <ChevronDown size={17} className="seo-faq-icon" />
                </summary>
                <div className="seo-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
