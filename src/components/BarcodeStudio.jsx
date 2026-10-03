'use client';
import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import {
  Download,
  Copy,
  Check,
  Barcode,
  Save,
  Trash2,
  FolderHeart,
  Plus
} from 'lucide-react';

export default function BarcodeStudio({ showToast, onBackToDashboard }) {
  const [tab, setTab] = useState('generate'); // 'generate' | 'saved'

  // Barcode state
  const [format, setFormat] = useState('CODE128'); // 'CODE128' | 'EAN13' | 'UPC' | 'CODE39'
  const [value, setValue] = useState('MINT-123456');
  const [displayValue, setDisplayValue] = useState(true);
  const [height, setHeight] = useState(80);
  const [width, setWidth] = useState(2);
  const [lineColor, setLineColor] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');

  // Local storage library
  const [savedBarcodes, setSavedBarcodes] = useState(() => {
    try {
      const saved = localStorage.getItem('minttools_saved_barcodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const canvasRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('minttools_saved_barcodes', JSON.stringify(savedBarcodes));
    } catch (e) {
      console.warn(e);
    }
  }, [savedBarcodes]);

  // Adjust default sample value when format changes
  const handleFormatChange = (fmt) => {
    setFormat(fmt);
    if (fmt === 'EAN13') setValue('978020137962');
    else if (fmt === 'UPC') setValue('123456789012');
    else if (fmt === 'CODE39') setValue('PRODUCT-99');
    else setValue('MINT-123456');
  };

  // Render Barcode
  useEffect(() => {
    if (!canvasRef.current || !value.trim()) return;

    try {
      JsBarcode(canvasRef.current, value.trim(), {
        format,
        width,
        height,
        displayValue,
        lineColor,
        background,
        fontSize: 14,
        margin: 12
      });
    } catch (err) {
      // Common if format length requirements aren't met yet
      console.warn('Barcode render note:', err.message);
    }
  }, [format, value, displayValue, height, width, lineColor, background, tab]);

  // Download PNG
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `barcode_${format}_${Date.now()}.png`;
    a.click();
    if (showToast) showToast('Downloaded Barcode PNG!', 'success');
  };

  // Copy Image to Clipboard
  const copyImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (showToast) showToast('Copied barcode image to clipboard!', 'success');
      });
    } catch {
      if (showToast) showToast('Copy not supported on this browser', 'info');
    }
  };

  // Save to Library
  const handleSave = () => {
    const title = saveTitle.trim() || `${format} Barcode`;
    const newItem = {
      id: 'bc_' + Date.now(),
      title,
      value,
      format,
      lineColor,
      background
    };
    setSavedBarcodes((prev) => [newItem, ...prev]);
    setSaveTitle('');
    if (showToast) showToast(`Saved "${title}"!`, 'success');
  };

  const handleLoad = (item) => {
    setFormat(item.format);
    setValue(item.value);
    if (item.lineColor) setLineColor(item.lineColor);
    if (item.background) setBackground(item.background);
    setTab('generate');
    if (showToast) showToast(`Loaded "${item.title}"`, 'info');
  };

  const handleDelete = (id) => {
    setSavedBarcodes((prev) => prev.filter((item) => item.id !== id));
    if (showToast) showToast('Deleted barcode from library', 'info');
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`tool-btn ${tab === 'generate' ? 'active' : ''}`}
            onClick={() => setTab('generate')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <Barcode size={14} />
            <span>Generate Barcode</span>
          </button>
          <button
            className={`tool-btn ${tab === 'saved' ? 'active' : ''}`}
            onClick={() => setTab('saved')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <FolderHeart size={14} />
            <span>Saved ({savedBarcodes.length})</span>
          </button>
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
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>My Saved Barcodes</h3>
          </div>

          {savedBarcodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Barcode size={36} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No saved barcodes yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {savedBarcodes.map((item) => (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: 'var(--primary-bright)' }}>
                        {item.format}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {item.value}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="tool-btn btn-primary"
                      style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      onClick={() => handleLoad(item)}
                    >
                      <span>Load / Edit</span>
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
        /* Generate Barcode */
        <div className="two-col-grid">
          {/* Left: Settings */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Format Pills */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Barcode Standard</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'CODE128', name: 'Code 128 (Universal)' },
                  { id: 'EAN13', name: 'EAN-13 (Retail)' },
                  { id: 'UPC', name: 'UPC-A (US Product)' },
                  { id: 'CODE39', name: 'Code 39 (Logistics)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`tool-btn ${format === f.id ? 'active' : ''}`}
                    onClick={() => handleFormatChange(f.id)}
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.775rem', justifyContent: 'center' }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Value */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Barcode Value / Data</label>
              <input
                type="text"
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value..."
              />
            </div>

            {/* Dimensions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Height ({height}px)</label>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="5"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Bar Width ({width}px)</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Bar Color</label>
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  style={{ width: '100%', height: '34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Background</label>
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  style={{ width: '100%', height: '34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Save to library */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1, padding: '0.4rem 0.65rem', fontSize: '0.8125rem' }}
                placeholder="Label (e.g. SKU 491)..."
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
              />
              <button className="tool-btn" onClick={handleSave} style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.75rem' }}>
                <Save size={14} />
                <span>Save</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
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
                onClick={copyImage}
                style={{ padding: '0.6rem 0.8rem' }}
                title="Copy"
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div style={{
              background,
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <canvas ref={canvasRef} style={{ maxWidth: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
