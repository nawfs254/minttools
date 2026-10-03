import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Sun, Moon } from 'lucide-react';
import HomeDashboard from './components/HomeDashboard';
import PDFEditor from './components/PDFEditor';
import PDFCompressor from './components/PDFCompressor';
import PDFMergeSplit from './components/PDFMergeSplit';
import ImagePDFConverter from './components/ImagePDFConverter';
import MarkdownEditor from './components/MarkdownEditor';
import PasswordGenerator from './components/PasswordGenerator';
import ImageStudio from './components/ImageStudio';
import ExifCleaner from './components/ExifCleaner';
import BarcodeStudio from './components/BarcodeStudio';
import QRStudio from './components/QRStudio';
import QRReader from './components/QRReader';
import DevConverter from './components/DevConverter';
import DevTools from './components/DevTools';

// URL Routing Configuration
const ROUTE_MAP = {
  '': 'home',
  '/': 'home',
  'pdf': 'pdf',
  'pdf-editor': 'pdf',
  'pdf-compress': 'pdf-compress',
  'compress-pdf': 'pdf-compress',
  'pdf-merge': 'pdf-merge',
  'merge-pdf': 'pdf-merge',
  'pdf-split': 'pdf-merge',
  'split-pdf': 'pdf-merge',
  'image-pdf': 'image-pdf',
  'images-to-pdf': 'image-pdf',
  'pdf-to-images': 'image-pdf',
  'image': 'image',
  'image-studio': 'image',
  'exif-cleaner': 'exif-cleaner',
  'exif': 'exif-cleaner',
  'metadata-cleaner': 'exif-cleaner',
  'barcode': 'barcode',
  'barcode-studio': 'barcode',
  'barcode-generator': 'barcode',
  'qr': 'qr',
  'qr-studio': 'qr',
  'qr-reader': 'qr-reader',
  'qr-scanner': 'qr-reader',
  'markdown': 'markdown',
  'markdown-editor': 'markdown',
  'password': 'password',
  'password-generator': 'password',
  'converter': 'converter',
  'unit-converter': 'converter',
  'dev-converter': 'converter',
  'dev': 'dev',
  'dev-tools': 'dev'
};

const TAB_TO_PATH = {
  'home': '/',
  'pdf': '/pdf',
  'pdf-compress': '/pdf-compress',
  'pdf-merge': '/pdf-merge',
  'image-pdf': '/image-pdf',
  'image': '/image',
  'exif-cleaner': '/exif-cleaner',
  'barcode': '/barcode',
  'qr': '/qr',
  'qr-reader': '/qr-reader',
  'markdown': '/markdown',
  'password': '/password',
  'converter': '/converter',
  'dev': '/dev'
};

const TAB_TITLES = {
  'home': 'MintTools — Privacy-First Web Tools',
  'pdf': 'PDF Editor — MintTools',
  'pdf-compress': 'PDF Compressor — MintTools',
  'pdf-merge': 'PDF Merge & Split — MintTools',
  'image-pdf': 'Image & PDF Converter — MintTools',
  'image': 'Image Studio — MintTools',
  'exif-cleaner': 'EXIF Metadata Cleaner — MintTools',
  'barcode': 'Barcode Studio — MintTools',
  'qr': 'QR Studio — MintTools',
  'qr-reader': 'QR Reader — MintTools',
  'markdown': 'Markdown Editor — MintTools',
  'password': 'Password Generator — MintTools',
  'converter': 'Dev Converter — MintTools',
  'dev': 'Dev Tools — MintTools'
};

// Helper to resolve active tab from current window location
function getTabFromLocation() {
  // Check hash first (e.g. #/pdf or #pdf)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (hash && ROUTE_MAP[hash]) return ROUTE_MAP[hash];

  // Check pathname (e.g. /pdf or /markdown)
  const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase().trim();
  if (pathname && ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];

  return 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getTabFromLocation);
  const [theme, setTheme] = useState('dark');
  const [toasts, setToasts] = useState([]);
  const [sharedQrText, setSharedQrText] = useState(null);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Navigate to a tool and update browser URL history
  const navigateTo = useCallback((tabId, replace = false) => {
    setActiveTab(tabId);
    const path = TAB_TO_PATH[tabId] || '/';
    const title = TAB_TITLES[tabId] || 'MintTools';
    document.title = title;

    if (replace) {
      window.history.replaceState({ tab: tabId }, '', path);
    } else {
      // Only push new history entry if path changed
      if (window.location.pathname !== path) {
        window.history.pushState({ tab: tabId }, '', path);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Listen to browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = (e) => {
      const tabFromState = e.state?.tab;
      const targetTab = tabFromState || getTabFromLocation();
      setActiveTab(targetTab);
      document.title = TAB_TITLES[targetTab] || 'MintTools';
    };

    // Ensure initial entry has state
    const currentTab = getTabFromLocation();
    const currentPath = TAB_TO_PATH[currentTab] || '/';
    window.history.replaceState({ tab: currentTab }, '', currentPath);
    document.title = TAB_TITLES[currentTab] || 'MintTools';

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleOpenInStudio = (text) => {
    setSharedQrText(text);
    navigateTo('qr');
  };

  return (
    <>
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-section" style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>
          <div className="logo-badge" title="MintTools Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <h1 className="brand-title">MintTools</h1>
        </div>

        {/* Right Actions */}
        <div className="header-actions">
          {activeTab !== 'home' && (
            <button
              className="tool-btn"
              onClick={() => navigateTo('home')}
              title="Return to Tools"
              style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)' }}
            >
              <LayoutGrid size={15} />
              <span>All Tools</span>
            </button>
          )}

          <button
            className="btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Views */}
      <main className="app-main">
        {activeTab === 'home' && <HomeDashboard onSelectTool={(toolId) => navigateTo(toolId)} />}
        {activeTab === 'pdf' && <PDFEditor showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'pdf-compress' && <PDFCompressor showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'pdf-merge' && <PDFMergeSplit showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'image-pdf' && <ImagePDFConverter showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'image' && <ImageStudio showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'exif-cleaner' && <ExifCleaner showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'barcode' && <BarcodeStudio showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'qr' && (
          <QRStudio
            showToast={showToast}
            onBackToDashboard={() => navigateTo('home')}
            initialText={sharedQrText}
            onOpenReader={() => navigateTo('qr-reader')}
          />
        )}
        {activeTab === 'qr-reader' && (
          <QRReader
            showToast={showToast}
            onBackToDashboard={() => navigateTo('home')}
            onOpenInStudio={handleOpenInStudio}
          />
        )}
        {activeTab === 'markdown' && <MarkdownEditor showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'password' && <PasswordGenerator showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'converter' && <DevConverter showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
        {activeTab === 'dev' && <DevTools showToast={showToast} onBackToDashboard={() => navigateTo('home')} />}
      </main>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
