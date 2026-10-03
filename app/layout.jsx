export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0d14',
};

import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Header from './components/Header';
import TopLoader from './components/TopLoader';
import AdBanner from './components/AdBanner';
import { ToastProvider } from './components/ToastProvider';

export const metadata = {
  metadataBase: new URL('https://www.minttools.net'),
  title: {
    default: 'MintTools — 100% Free & Privacy-First Web Tools Suite',
    template: '%s | MintTools'
  },
  description: 'Fast, secure, and private browser-based utilities: PDF Editor, Compressor, Merge & Split, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
  keywords: ['pdf editor', 'pdf compressor', 'merge pdf', 'qr code generator', 'barcode generator', 'exif cleaner', 'privacy tools', 'browser tools'],
  openGraph: {
    title: 'MintTools — 100% Free & Privacy-First Web Tools Suite',
    description: 'Fast, secure, and private browser-based utilities. Zero server uploads.',
    url: 'https://minttools.net',
    siteName: 'MintTools',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-9295840636296759';

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

                {/* Schema.org Structured Data for Google Brand Indexing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.minttools.net/#website',
                  'url': 'https://www.minttools.net',
                  'name': 'MintTools',
                  'alternateName': ['Mint Tools', 'MintTools Suite'],
                  'description': '100% Free & Privacy-First Web Tools Suite: PDF Editor, Compressor, Merge & Split, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
                  'inLanguage': 'en-US'
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://www.minttools.net/#organization',
                  'name': 'MintTools',
                  'url': 'https://www.minttools.net',
                  'logo': 'https://www.minttools.net/logo.png'
                }
              ]
            })
          }}
        />

{/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W6ENT3WEDE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6ENT3WEDE', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ToastProvider>
        <TopLoader />
          <Header />
          <main className="app-main">
            {children}

            {/* In-page Static Ad Slot (MintTools Bottom) */}
            <AdBanner slotId="3065498609" format="horizontal" />
          </main>

                    {/* Clean Minimal Footer */}
          <footer className="app-footer">
            <div className="footer-contacts">
              <a
                href="mailto:hello@minttools.net"
                className="footer-contact-link"
                title="Email: hello@minttools.net"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>hello@minttools.net</span>
              </a>
              <a
                href="https://web.facebook.com/mint.tools.26/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
                title="Follow MintTools on Facebook"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/mint.tools.26/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
                title="Follow MintTools on Instagram"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>

            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Service</Link>
              <a href="mailto:hello@minttools.net" className="footer-link">Contact</a>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
              &copy; {new Date().getFullYear()} MintTools. 100% Client-Side & Privacy-First. No files stored.
            </p>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
