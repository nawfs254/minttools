import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | MintTools',
  description: 'MintTools Terms of Service. Understand the terms, fair use, and disclaimers governing the use of our free web utilities.',
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
      <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        ← Back to MintTools
      </Link>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Last updated: October 2026
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using <strong>MintTools</strong> (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          2. Permitted Use
        </h2>
        <p>
          MintTools provides free, client-side digital utilities for document editing, image compression, QR generation, barcode creation, and developer productivity.
        </p>
        <p>
          You are granted a non-exclusive, revocable, personal, and commercial right to use our tools for lawful purposes. You agree not to attempt to disrupt, exploit, or overwhelm the website infrastructure via automated scrapers, flooding, or security probing.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          3. Ownership of Content
        </h2>
        <p>
          You retain 100% full ownership, rights, and copyright to all files, images, documents, and data that you process using MintTools. Because processing is executed strictly on your client device, MintTools claims zero rights, licenses, or access to your content.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          4. Disclaimer of Warranties
        </h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. MintTools makes no warranty that the tools will be uninterrupted, error-free, or meet every specific business requirement. We strongly advise keeping backup copies of your original files before processing.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          5. Modifications to Terms
        </h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. Continued use of the Service following any changes constitutes acceptance of the new Terms.
        </p>
      </section>
    </div>
  );
}
