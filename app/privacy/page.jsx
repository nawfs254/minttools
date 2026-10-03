import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | MintTools',
  description: 'MintTools Privacy Policy. Learn how our client-side architecture guarantees 100% file privacy with zero server uploads.',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
      <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        ← Back to MintTools
      </Link>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Last updated: October 2026
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          1. 100% Client-Side Privacy Guarantee
        </h2>
        <p>
          At <strong>MintTools</strong>, privacy is not just a policy—it is our core architectural foundation.
          All file transformations, including <strong>PDF editing, PDF compression, PDF merging, image optimization, QR code scanning, and EXIF metadata scrubbing</strong>, execute <strong>100% locally within your web browser</strong> using client-side WebAssembly, JavaScript, and HTML5 APIs.
        </p>
        <p>
          <strong>Your documents, photos, text, and files are NEVER uploaded, stored, or processed on our servers.</strong> If you disconnect your internet connection after loading a tool, the tools continue to function entirely on your device.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          2. Local Browser Storage
        </h2>
        <p>
          MintTools uses your browser's local storage (<code>localStorage</code>) solely for convenience features:
        </p>
        <ul>
          <li>Saving your visual theme preference (Dark or Light mode).</li>
          <li>Locally storing your recent QR code and barcode history if you choose to save them.</li>
        </ul>
        <p>
          This data remains strictly on your device and is never synchronized or sent to external servers. You can clear this data at any time via your browser settings.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          3. Advertising & Cookies
        </h2>
        <p>
          To maintain MintTools as a 100% free service without subscription fees, we may display non-intrusive in-page advertisements provided by third-party advertising partners, such as <strong>Google AdSense</strong>.
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
            Google Ads Settings
          </a>{' '}
          or by visiting{' '}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
            aboutads.info
          </a>.
        </p>
      </section>

            <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.8rem', color: 'var(--text-main)' }}>
          4. Contact Us
        </h2>
        <p>
          If you have any questions or feedback regarding this Privacy Policy, security, or feature requests, feel free to reach out to us:
        </p>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', lineHeight: '2' }}>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:hello@minttools.net" style={{ color: 'var(--accent-emerald)', textDecoration: 'none' }}>
              hello@minttools.net
            </a>
          </li>
          <li>
            <strong>Facebook:</strong>{' '}
            <a href="https://web.facebook.com/mint.tools.26/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-emerald)', textDecoration: 'none' }}>
              web.facebook.com/mint.tools.26
            </a>
          </li>
          <li>
            <strong>Instagram:</strong>{' '}
            <a href="https://www.instagram.com/mint.tools.26/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-emerald)', textDecoration: 'none' }}>
              @mint.tools.26
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
