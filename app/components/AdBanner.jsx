'use client';
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AdBanner({
  slotId = '3065498609',
  format = 'horizontal',
  className = ''
}) {
  const adRef = useRef(null);
  const pathname = usePathname();
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-9295840636296759';

  // Never serve ads on 404/not-found error screens (strict AdSense compliance)
  const is404 = pathname === '/404' || pathname === '/_not-found';

  useEffect(() => {
    if (!is404 && clientId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ads will render when Google completes domain approval
      }
    }
  }, [clientId, slotId, is404]);

  if (is404) {
    return null;
  }

  const isRectangle = format === 'rectangle';

  return (
    <div
      className={`ad-container-wrapper ${isRectangle ? 'ad-rectangle' : 'ad-horizontal'} ${className}`}
      style={{
        margin: '1.5rem auto',
        maxWidth: isRectangle ? 'min(336px, 100%)' : 'min(768px, 100%)',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div className="ad-inner-box" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <span className="ad-badge-label">Advertisement</span>

        {/* Google AdSense Display Unit: MintTools Bottom */}
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
