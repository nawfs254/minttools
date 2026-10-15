'use client';
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Whitelist only content-rich tool pages that contain comprehensive SEO sections,
// guides, and FAQs. Strictly exclude homepage, legal pages, about, contact, and 404s.
const ALLOWED_AD_PATHS = new Set([
  '/pdf',
  '/pdf-compress',
  '/pdf-merge',
  '/image-pdf',
  '/image',
  '/exif-cleaner',
  '/barcode',
  '/qr',
  '/qr-reader',
  '/markdown',
  '/password',
  '/converter',
  '/dev'
]);

export default function AdBanner({
  slotId = '3065498609',
  format = 'horizontal',
  className = ''
}) {
  const adRef = useRef(null);
  const pathname = usePathname();
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-9295840636296759';

  // Strict compliance: only render on verified content-rich tool pages
  const isAllowedPath = pathname && ALLOWED_AD_PATHS.has(pathname);

  useEffect(() => {
    if (isAllowedPath && clientId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ads will render when Google completes domain approval
      }
    }
  }, [clientId, slotId, isAllowedPath]);

  if (!isAllowedPath) {
    return null;
  }

  const isRectangle = format === 'rectangle';

  return (
    <div
      className={`ad-container-wrapper ${isRectangle ? 'ad-rectangle' : 'ad-horizontal'} ${className}`}
      style={{
        margin: '2rem auto',
        maxWidth: isRectangle ? 'min(336px, 100%)' : 'min(768px, 100%)',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div className="ad-inner-box" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <span className="ad-badge-label">Advertisement</span>

        {/* Google AdSense Display Unit: MintTools Tool In-Content */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={isRectangle ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
