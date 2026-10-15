import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Lock, HeartHandshake, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About MintTools — Privacy-First Client-Side Web Utilities',
  description: 'Learn about MintTools, our mission, and our 100% client-side architecture that processes your PDFs, images, and data directly in your browser without server uploads.',
  openGraph: {
    title: 'About MintTools — Privacy-First Client-Side Web Utilities',
    description: 'Learn about MintTools and how our zero-server-upload architecture guarantees total privacy.',
    type: 'website',
  }
};

export default function AboutPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About MintTools',
    description: 'MintTools is a free, privacy-first web utilities suite built on client-side WebAssembly and modern browser APIs.',
    publisher: {
      '@type': 'Organization',
      name: 'MintTools',
      url: 'https://www.minttools.net',
      logo: 'https://www.minttools.net/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@minttools.net',
        contactType: 'customer support'
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto 4rem', padding: '0 1.5rem', lineHeight: '1.75', color: 'var(--text-main)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

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

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--accent, #6366f1)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}
        >
          Our Story & Mission
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
          About MintTools
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', margin: 0, maxWidth: '720px' }}>
          We build fast, elegant, and completely private web utilities designed to work directly on your device with zero server uploads and zero paywalls.
        </p>
      </header>

      {/* Core Mission Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          Why We Built MintTools
        </h2>
        <p>
          Every day, millions of people need to edit a PDF, compress an image, generate a barcode, or convert data. Unfortunately, the vast majority of online tools force users into uncomfortable compromises: uploading sensitive personal or legal documents to unknown cloud servers, hitting arbitrary daily task limits, registering mandatory accounts, or paying expensive monthly subscriptions for basic file operations.
        </p>
        <p>
          <strong>MintTools was created to fundamentally change that experience.</strong> We believe essential digital utilities should be universally accessible, lightning-fast, and unconditionally private. By taking full advantage of modern web capabilities—such as WebAssembly, HTML5 Canvas, and client-side cryptography—MintTools runs sophisticated processing algorithms entirely in your web browser.
        </p>
      </section>

      {/* Key Guarantees Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1.25rem', letterSpacing: '-0.02em' }}>
          Our Core Architectural Guarantees
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#10b981', marginBottom: '0.75rem' }}><ShieldCheck size={28} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>100% Client-Side Privacy</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0 }}>
              Your files and photos are never transmitted over the internet to remote servers. All computation happens locally in your device's memory.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#6366f1', marginBottom: '0.75rem' }}><Zap size={28} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Zero Upload Latency</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0 }}>
              Because there is no file upload or download from cloud servers, actions happen instantaneously at native hardware speed.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}><Sparkles size={28} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>No Limits & No Watermarks</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0 }}>
              Use our tools as often as you want. We never stamp watermarks onto your documents or lock high resolutions behind paywalls.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ color: '#ec4899', marginBottom: '0.75rem' }}><Lock size={28} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>No Account Required</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0 }}>
              You do not need to register, provide an email address, or create a password to use any tool on MintTools.
            </p>
          </div>
        </div>
      </section>

      {/* How the Technology Works */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          How the Technology Works
        </h2>
        <p>
          When you load any tool on MintTools—such as the PDF Editor, Image Compressor, or QR Code Studio—the required logic is downloaded to your browser once. From that moment on, all processing is performed locally:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '1rem 0' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>PDF Processing:</strong> Built using high-performance JavaScript and WebAssembly libraries (`pdf-lib`, `pdfjs-dist`) that inspect and rewrite binary streams in memory without transmitting byte-level data outside your browser.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Image Studio & EXIF Cleaner:</strong> Uses native HTML5 Canvas and binary ArrayBuffer manipulation to compress images, convert file formats (PNG, JPEG, WebP), and scrub GPS/camera metadata before saving.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Barcode & QR Systems:</strong> Built using client-side rendering engines (`jsbarcode`, `qrcode`, `jsqr`) allowing offline-ready generation, camera scanning, and clipboard decoding.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Developer Utilities:</strong> Cryptographic hashes, JSON formatting, Base64 conversion, and CSS/unit calculations run using your browser’s native `window.crypto` and ECMAScript engines.
          </li>
        </ul>
      </section>

      {/* Commitment to Independence & Sustainability */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          Independence & Sustainability
        </h2>
        <p>
          MintTools is an independent web project maintained with care. To keep all tools completely free for users worldwide without charging subscription fees or selling user data, we display a minimal amount of non-intrusive advertising provided by Google AdSense on our informational tool pages.
        </p>
        <p>
          We do not sell advertising space that interrupts your workflow, and we never allow ads to interfere with the integrity of your document editing.
        </p>
      </section>

      {/* Contact CTA */}
      <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', padding: '1.75rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Have Feedback or Questions?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1.25rem' }}>
          We actively maintain and improve MintTools. If you have feature requests, tool ideas, or suggestions, we would love to hear from you.
        </p>
        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            padding: '0.65rem 1.5rem',
            background: 'var(--accent, #6366f1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.925rem'
          }}
        >
          Contact Our Team →
        </Link>
      </div>
    </div>
  );
}
