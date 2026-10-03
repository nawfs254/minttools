import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function WorkspaceLoader({ title = 'Workspace' }) {
  return (
    <div className="workspace-loader-container">
      <div className="workspace-loader-card">
        {/* Glowing badge with rotating laser ring */}
        <div className="loader-logo-ring">
          <div className="loader-ring-spinner" />
          <div className="loader-inner-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
        </div>

        <h3 className="workspace-loader-title">Opening {title}...</h3>
        <p className="workspace-loader-desc">
          Mounting secure local workspace in browser memory.
        </p>

        {/* Security badge */}
        <div className="workspace-loader-pill">
          <ShieldCheck size={14} className="loader-pill-icon" />
          <span>100% Client-Side • Zero Server Upload</span>
        </div>

        {/* Skeleton shimmer bar */}
        <div className="workspace-skeleton-shimmer" />
      </div>
    </div>
  );
}
