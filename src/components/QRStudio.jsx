'use client';
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Copy,
  Check,
  Wifi,
  Globe,
  AlignLeft,
  User,
  Trash2,
  Edit2,
  Save,
  FolderHeart,
  ExternalLink,
  QrCode,
  ScanLine
} from 'lucide-react';

export default function QRStudio({ showToast, onBackToDashboard, initialText, onOpenReader }) {
  const [tab, setTab] = useState('create'); // 'create' | 'saved'
  const [type, setType] = useState('url'); // 'url' | 'text' | 'wifi' | 'vcard'

  // Inputs
  const [url, setUrl] = useState('https://google.com');
  const [text, setText] = useState('Hello!');
  const [wifiSsid, setWifiSsid] = useState('MyWiFi');
  const [wifiPass, setWifiPass] = useState('Password123');
  const [wifiType, setWifiType] = useState('WPA');
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1 555 123 4567');
  const [email, setEmail] = useState('john@example.com');

  // Styles
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(320);
  const [copied, setCopied] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Local Storage Library
  const [savedList, setSavedList] = useState(() => {
    try {
      const saved = localStorage.getItem('minttools_saved_qrs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const canvasRef = useRef(null);

  // Handle pre-filled initial text (e.g. from QR Reader)
  useEffect(() => {
    if (initialText) {
      if (initialText.startsWith('http://') || initialText.startsWith('https://')) {
        setType('url');
        setUrl(initialText);
      } else {
        setType('text');
        setText(initialText);
      }
      setTab('create');
      if (showToast) showToast('Loaded scanned content into QR Studio!', 'info');
    }
  }, [initialText]);

  useEffect(() => {
    try {
      localStorage.setItem('minttools_saved_qrs', JSON.stringify(savedList));
    } catch (e) {
      console.warn(e);
    }
  }, [savedList]);

  // Compute Payload
  const getPayload = () => {
    switch (type) {
      case 'url':
        return url.trim() || 'https://';
      case 'text':
        return text.trim() || ' ';
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      default:
        return url.trim() || 'https://';
    }
  };

  const payload = getPayload();
  const isWebUrl = payload.startsWith('http://') || payload.startsWith('https://');

  // Render QR Code onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!payload.trim()) return;

    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: 'M'
    }).catch(console.error);
  }, [type, url, text, wifiSsid, wifiPass, wifiType, name, phone, email, fgColor, bgColor, size]);

  // Download PNG
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr_${type}_${Date.now()}.png`;
    link.click();
    if (showToast) showToast('Downloaded QR Code PNG', 'success');
  };

  // Download SVG
  const downloadSVG = async () => {
    try {
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor }
      });
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `qr_${type}_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (showToast) showToast('Downloaded Vector SVG', 'success');
    } catch {
      if (showToast) showToast('Failed to export SVG', 'error');
    }
  };

  // Copy to Clipboard
  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (showToast) showToast('Copied QR code to clipboard!', 'success');
      });
    } catch {
      if (showToast) showToast('Copy not supported on this browser', 'info');
    }
  };

  // Save to Library
  const handleSave = () => {
    const title = saveName.trim() || `${type.toUpperCase()} Code`;
    if (editingId) {
      setSavedList((prev) => prev.map((item) => item.id === editingId ? { ...item, title, payload, type, fgColor, bgColor } : item));
      setEditingId(null);
      setSaveName('');
      if (showToast) showToast(`Updated "${title}"`, 'success');
    } else {
      const newItem = {
        id: 'qr_' + Date.now(),
        title,
        payload,
        type,
        fgColor,
        bgColor
      };
      setSavedList((prev) => [newItem, ...prev]);
      setSaveName('');
      if (showToast) showToast(`Saved "${title}"`, 'success');
    }
  };

  // Load from Library
  const handleLoad = (item) => {
    setEditingId(item.id);
    setSaveName(item.title);
    if (item.fgColor) setFgColor(item.fgColor);
    if (item.bgColor) setBgColor(item.bgColor);

    if (['url', 'text', 'wifi', 'vcard'].includes(item.type)) {
      setType(item.type);
    } else {
      setType('url');
    }
    if (item.type === 'url') setUrl(item.payload);
    else if (item.type === 'text') setText(item.payload);

    setTab('create');
    if (showToast) showToast(`Loaded "${item.title}"`, 'info');
  };

  // Delete
  const handleDelete = (id) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setSaveName('');
    }
    if (showToast) showToast('Deleted QR code', 'info');
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <button
            className={`tool-btn ${tab === 'create' ? 'active' : ''}`}
            onClick={() => setTab('create')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <QrCode size={15} />
            <span>Create QR</span>
          </button>
          <button
            className={`tool-btn ${tab === 'saved' ? 'active' : ''}`}
            onClick={() => setTab('saved')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <FolderHeart size={15} />
            <span>Saved ({savedList.length})</span>
          </button>
          {onOpenReader && (
            <button
              className="tool-btn"
              onClick={onOpenReader}
              style={{ padding: '0.45rem 1rem' }}
              title="Open QR Code Reader"
            >
              <ScanLine size={15} color="var(--accent-cyan)" />
              <span>Scan QR</span>
            </button>
          )}
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      {tab === 'saved' ? (
        <div className="tool-card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>My Saved QR Codes</h3>
          </div>

          {savedList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <QrCode size={36} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No saved QR codes yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {savedList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all', maxHeight: '40px', overflow: 'hidden' }}>
                      {item.payload}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="tool-btn btn-primary"
                      style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      onClick={() => handleLoad(item)}
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="tool-btn"
                      style={{ padding: '0.35rem 0.5rem' }}
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={12} color="var(--accent-rose)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Create Mode */
        <>
          {/* Quick Type Selection */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`tool-btn ${type === 'url' ? 'active' : ''}`}
              onClick={() => setType('url')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <Globe size={13} />
              <span>Website</span>
            </button>
            <button
              className={`tool-btn ${type === 'text' ? 'active' : ''}`}
              onClick={() => setType('text')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <AlignLeft size={13} />
              <span>Text</span>
            </button>
            <button
              className={`tool-btn ${type === 'wifi' ? 'active' : ''}`}
              onClick={() => setType('wifi')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <Wifi size={13} />
              <span>Wi-Fi</span>
            </button>
            <button
              className={`tool-btn ${type === 'vcard' ? 'active' : ''}`}
              onClick={() => setType('vcard')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <User size={13} />
              <span>Contact</span>
            </button>
          </div>

          <div className="two-col-grid">
            {/* Left Inputs */}
            <div className="tool-card">
              {type === 'url' && (
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              {type === 'text' && (
                <div className="form-group">
                  <label className="form-label">Message / Text</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '85px' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type text..."
                  />
                </div>
              )}

              {type === 'wifi' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Network Name (SSID)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="Wi-Fi Name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        type="text"
                        className="form-input"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Security</label>
                      <select className="form-select" value={wifiType} onChange={(e) => setWifiType(e.target.value)}>
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Open</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {type === 'vcard' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Color Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Background</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Save locally input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, padding: '0.4rem 0.65rem', fontSize: '0.8125rem' }}
                  placeholder="Name (e.g. My Website)..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
                <button className="tool-btn" onClick={handleSave} style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.75rem' }}>
                  <Save size={14} />
                  <span>{editingId ? 'Update' : 'Save'}</span>
                </button>
              </div>

              {/* Download Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  className="tool-btn btn-primary"
                  onClick={downloadPNG}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.6rem' }}
                >
                  <Download size={14} />
                  <span>Download PNG</span>
                </button>
                <button
                  className="tool-btn"
                  onClick={downloadSVG}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.6rem' }}
                >
                  <Download size={14} />
                  <span>SVG</span>
                </button>
                <button
                  className="tool-btn"
                  onClick={copyImage}
                  style={{ padding: '0.6rem 0.8rem' }}
                  title="Copy"
                >
                  {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Right: Live QR Preview */}
            <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
              <div style={{
                background: bgColor,
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '260px',
                    maxHeight: '260px',
                    display: 'block'
                  }}
                />
              </div>

              {isWebUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={payload}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.785rem',
                      color: 'var(--primary-bright)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Test Destination Link</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
