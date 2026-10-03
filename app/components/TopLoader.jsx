'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function LoaderBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      const target = e.target.closest('a, .tool-small-box, .tool-cell-card');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && (href.startsWith('/') || href.includes(window.location.host))) {
        if (href !== pathname) {
          triggerStart();
        }
      } else if (target.classList.contains('tool-small-box') || target.classList.contains('tool-cell-card')) {
        triggerStart();
      }
    };

    const triggerStart = () => {
      setLoading(true);
      setProgress(30);
      setTimeout(() => setProgress(70), 120);
      setTimeout(() => setProgress(90), 300);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="top-progress-bar-container" aria-hidden="true">
      <div
        className="top-progress-bar"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'width 0.15s ease, opacity 0.25s ease 0.1s' : 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </div>
  );
}

export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderBar />
    </Suspense>
  );
}
