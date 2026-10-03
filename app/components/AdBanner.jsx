'use client';
import React, { useEffect, useRef } from 'react';

export default function AdBanner({
  slotId = '3065498609',
  format = 'horizontal',
  className = ''
}) {
  const adRef = useRef(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-9295840636296759';

  useEffect(() => {
    if (clientId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ads will render when Google completes domain approval
      }
    }
  }, [clientId, slotId]);

  const isRectangle = format === 'rectangle';

  return (
    <div
      className={`ad-container-wrapper ${isRectangle ? 'ad-rectangle' : 'ad-horizontal'} ${className}`}
      style={{
        margin: '1.5rem auto',
        maxWidth: isRectangle ? '336px' : '768px',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div className="ad-inner-box">
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
