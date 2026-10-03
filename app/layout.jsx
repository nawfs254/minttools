import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Header from './components/Header';
import AdBanner from './components/AdBanner';
import { ToastProvider } from './components/ToastProvider';

export const metadata = {
  metadataBase: new URL('https://minttools.net'),
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

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
          <Header />
          <main className="app-main">
            {children}

            {/* In-page Static Ad Slot (MintTools Bottom) */}
            <AdBanner slotId="3065498609" format="horizontal" />
          </main>

          {/* Clean Minimal Footer */}
          <footer className="app-footer">
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Service</Link>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
              © {new Date().getFullYear()} MintTools. 100% Client-Side & Privacy-First. No files stored.
            </p>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
