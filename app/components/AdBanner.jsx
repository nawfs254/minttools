'use client';
import React, { useEffect, useRef } from 'react';

export default function AdBanner({
  slotId = '',
  format = 'horizontal', // 'horizontal' (728x90/responsive) or 'rectangle' (300x250)
  className = ''
}) {
  const adRef = useRef(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  useEffect(() => {
    if (clientId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense notice:', e);
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

        {clientId && slotId ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={isRectangle ? 'rectangle' : 'auto'}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="ad-placeholder-frame">
            <span className="ad-placeholder-text">
              Display Ad Space {isRectangle ? '(300×250)' : '(728×90)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
