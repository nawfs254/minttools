'use client';
import React, { useState, useEffect } from 'react';
import {
  Scale,
  Copy,
  Check,
  Palette,
  Clock,
  Code2,
  HardDrive
} from 'lucide-react';

export default function DevConverter({ showToast, onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'css' | 'color' | 'time'
  const [copiedKey, setCopiedKey] = useState(null);

  // 1. Data Size State
  const [dataValue, setDataValue] = useState(1024);
  const [dataUnit, setDataUnit] = useState('MB');

  // 2. CSS Units State
  const [basePx, setBasePx] = useState(16);
  const [cssValue, setCssValue] = useState(16);
  const [cssUnit, setCssUnit] = useState('px');

  // 3. Color State
  const [hexColor, setHexColor] = useState('#6366f1');

  // 4. Timestamp State
  const [nowTs, setNowTs] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(Math.floor(Date.now() / 1000));

  // Live timer for current timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyVal = (val, key) => {
    navigator.clipboard.writeText(String(val));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (showToast) showToast('Copied to clipboard!', 'success');
  };

  // Compute Data conversions
  const getDataConversions = () => {
    const multiplier = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 ** 2,
      'GB': 1024 ** 3,
      'TB': 1024 ** 4,
      'PB': 1024 ** 5
    };
    const bytes = (parseFloat(dataValue) || 0) * (multiplier[dataUnit] || 1);
    return [
      { unit: 'Bytes (B)', val: bytes.toLocaleString() },
      { unit: 'Kilobytes (KB)', val: (bytes / (1024)).toFixed(2) },
      { unit: 'Megabytes (MB)', val: (bytes / (1024 ** 2)).toFixed(3) },
      { unit: 'Gigabytes (GB)', val: (bytes / (1024 ** 3)).toFixed(4) },
      { unit: 'Terabytes (TB)', val: (bytes / (1024 ** 4)).toFixed(6) }
    ];
  };

  // Compute CSS conversions
  const getCssConversions = () => {
    let inPx = parseFloat(cssValue) || 0;
    const base = parseFloat(basePx) || 16;
    if (cssUnit === 'rem' || cssUnit === 'em') inPx = inPx * base;
    else if (cssUnit === 'pt') inPx = inPx * (96 / 72);

    return [
      { unit: 'Pixels (px)', val: `${inPx.toFixed(2)}px` },
      { unit: 'REM (rem)', val: `${(inPx / base).toFixed(3)}rem` },
      { unit: 'EM (em)', val: `${(inPx / base).toFixed(3)}em` },
      { unit: 'Points (pt)', val: `${(inPx * (72 / 96)).toFixed(2)}pt` }
    ];
  };

  // Compute Color conversions
  const getColorConversions = () => {
    let cleanHex = hexColor.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

    // HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    return [
      { label: 'HEX', val: `#${cleanHex.toUpperCase()}` },
      { label: 'RGB', val: `rgb(${r}, ${g}, ${b})` },
      { label: 'RGBA', val: `rgba(${r}, ${g}, ${b}, 1)` },
      { label: 'HSL', val: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` }
    ];
  };

  // Compute Date conversions
  const getDateFromEpoch = () => {
    const epochSec = parseInt(inputEpoch) || 0;
    const date = new Date(epochSec > 10000000000 ? epochSec : epochSec * 1000);
    return [
      { label: 'Local Time', val: date.toLocaleString() },
      { label: 'UTC Time', val: date.toUTCString() },
      { label: 'ISO 8601', val: date.toISOString() },
      { label: 'Relative', val: `${Math.round((nowTs - epochSec) / 60)} minutes ago` }
    ];
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="tool-subtabs-nav" style={{ background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 0 }}>
          <button
            className={`tool-btn ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <HardDrive size={13} />
            <span>Data Size</span>
          </button>
          <button
            className={`tool-btn ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Code2 size={13} />
            <span>CSS Units</span>
          </button>
          <button
            className={`tool-btn ${activeTab === 'color' ? 'active' : ''}`}
            onClick={() => setActiveTab('color')}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Palette size={13} />
            <span>Color Formats</span>
          </button>
          <button
            className={`tool-btn ${activeTab === 'time' ? 'active' : ''}`}
            onClick={() => setActiveTab('time')}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Clock size={13} />
            <span>Unix Timestamp</span>
          </button>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      {activeTab === 'data' && (
        <div className="two-col-grid">
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Enter Data Size</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
              <input
                type="number"
                className="form-input"
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
              />
              <select
                className="form-select"
                value={dataUnit}
                onChange={(e) => setDataUnit(e.target.value)}
              >
                <option value="B">Bytes</option>
                <option value="KB">KB</option>
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>

          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Conversions</h3>
            {getDataConversions().map((item, idx) => (
              <div
                key={idx}
                className="conversion-row"
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.unit}</span>
                <div className="conversion-val-wrap">
                  <strong>{item.val}</strong>
                  <button className="btn-icon" style={{ width: '22px', height: '22px' }} onClick={() => copyVal(item.val, `data_${idx}`)}>
                    {copiedKey === `data_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'css' && (
        <div className="two-col-grid">
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>CSS Dimensions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
              <input
                type="number"
                className="form-input"
                value={cssValue}
                onChange={(e) => setCssValue(e.target.value)}
              />
              <select
                className="form-select"
                value={cssUnit}
                onChange={(e) => setCssUnit(e.target.value)}
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
                <option value="pt">pt</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Base Font Size (Default 16px)</label>
              <input
                type="number"
                className="form-input"
                value={basePx}
                onChange={(e) => setBasePx(e.target.value)}
              />
            </div>
          </div>

          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Equivalents</h3>
            {getCssConversions().map((item, idx) => (
              <div
                key={idx}
                className="conversion-row"
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.unit}</span>
                <div className="conversion-val-wrap">
                  <strong>{item.val}</strong>
                  <button className="btn-icon" style={{ width: '22px', height: '22px' }} onClick={() => copyVal(item.val, `css_${idx}`)}>
                    {copiedKey === `css_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'color' && (
        <div className="two-col-grid">
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: 'var(--radius-md)',
              background: hexColor,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)'
            }} />
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              style={{ width: '100%', height: '40px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent' }}
            />
          </div>

          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Color Codes</h3>
            {getColorConversions().map((item, idx) => (
              <div
                key={idx}
                className="conversion-row"
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <div className="conversion-val-wrap">
                  <strong style={{ fontFamily: 'monospace' }}>{item.val}</strong>
                  <button className="btn-icon" style={{ width: '22px', height: '22px' }} onClick={() => copyVal(item.val, `color_${idx}`)}>
                    {copiedKey === `color_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="two-col-grid">
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-raised)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Current Unix Timestamp</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-emerald)' }}>
                {nowTs}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Timestamp to Convert</label>
              <input
                type="number"
                className="form-input"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value)}
              />
            </div>
            <button className="tool-btn" onClick={() => setInputEpoch(nowTs)} style={{ justifyContent: 'center' }}>
              <span>Use Current Timestamp</span>
            </button>
          </div>

          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Human Date Format</h3>
            {getDateFromEpoch().map((item, idx) => (
              <div
                key={idx}
                className="conversion-row"
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <div className="conversion-val-wrap">
                  <strong>{item.val}</strong>
                  <button className="btn-icon" style={{ width: '22px', height: '22px' }} onClick={() => copyVal(item.val, `time_${idx}`)}>
                    {copiedKey === `time_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
