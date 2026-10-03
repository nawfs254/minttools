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
            <img src="/logo.png" alt="MintTools" className="loader-logo-img" />
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
