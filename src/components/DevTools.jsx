'use client';
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DevTools({ showToast }) {
  const [activeSubtab, setActiveSubtab] = useState('json');

  // JSON state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonStatus, setJsonStatus] = useState(null);

  // Base64 state
  const [b64Plain, setB64Plain] = useState('');
  const [b64Encoded, setB64Encoded] = useState('');

  // Hash state
  const [hashInput, setHashInput] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');

  // Counter state
  const [counterText, setCounterText] = useState('');

  // JSON Operations
  const formatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, spaces));
      setJsonStatus({ ok: true, msg: 'Valid JSON' });
    } catch (err) {
      setJsonStatus({ ok: false, msg: err.message });
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonStatus({ ok: true, msg: 'Valid JSON (Minified)' });
    } catch (err) {
      setJsonStatus({ ok: false, msg: err.message });
    }
  };

  // Base64
  const encodeB64 = () => {
    try {
      setB64Encoded(btoa(unescape(encodeURIComponent(b64Plain))));
      showToast('Encoded to Base64', 'success');
    } catch (e) {
      showToast('Encoding error: ' + e.message, 'error');
    }
  };

  const decodeB64 = () => {
    try {
      setB64Plain(decodeURIComponent(escape(atob(b64Encoded))));
      showToast('Decoded from Base64', 'success');
    } catch (e) {
      showToast('Invalid Base64 string', 'error');
    }
  };

  // Hashes via Web Crypto API
  const computeHashes = async (text) => {
    setHashInput(text);
    if (!text) {
      setSha256('');
      setSha512('');
      setSha1('');
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const calc = async (algo) => {
      const buf = await crypto.subtle.digest(algo, data);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    };

    setSha256(await calc('SHA-256'));
    setSha512(await calc('SHA-512'));
    setSha1(await calc('SHA-1'));
  };

  // Counter stats
  const words = counterText.trim() ? counterText.trim().split(/\s+/).length : 0;
  const chars = counterText.length;
  const sentences = counterText.trim() ? (counterText.match(/[.!?]+(\s|$)/g) || []).length : 0;
  const readTimeSeconds = Math.round((words / 200) * 60);

  const copyToClipboard = (val) => {
    navigator.clipboard.writeText(val);
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="tool-view-wrapper">
      <div className="tool-header-block">
        <h2 className="tool-headline">Dev & Text Utilities</h2>
        <p className="tool-subhead">JSON formatting, Base64 & hash utilities</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`tool-btn ${activeSubtab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('json')}
        >
          JSON Formatter
        </button>
        <button
          className={`tool-btn ${activeSubtab === 'base64' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('base64')}
        >
          Base64 Converter
        </button>
        <button
          className={`tool-btn ${activeSubtab === 'hash' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('hash')}
        >
          Hash Calculator
        </button>
        <button
          className={`tool-btn ${activeSubtab === 'counter' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('counter')}
        >
          Word Counter
        </button>
      </div>

      {/* JSON Sub-tab */}
      {activeSubtab === 'json' && (
        <div className="two-col-grid">
          <div className="tool-card">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Input JSON</label>
                <button
                  className="tool-btn"
                  onClick={() => setJsonInput('{"name":"Sadman Reaz","pnr":"0AFMTJ","fare":8881,"confirmed":true}')}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Sample
                </button>
              </div>
              <textarea
                className="form-textarea"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste unformatted JSON here..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="tool-btn btn-primary" onClick={() => formatJson(2)}>Format (2 Spaces)</button>
              <button className="tool-btn" onClick={minifyJson}>Minify</button>
              <button className="tool-btn" onClick={() => { setJsonInput(''); setJsonOutput(''); setJsonStatus(null); }}>Clear</button>
            </div>
          </div>

          <div className="tool-card">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Formatted Output</label>
                <button
                  className="tool-btn"
                  onClick={() => copyToClipboard(jsonOutput)}
                  disabled={!jsonOutput}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              </div>
              <textarea className="form-textarea" value={jsonOutput} readOnly />
            </div>
            {jsonStatus && (
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: jsonStatus.ok ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {jsonStatus.msg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Base64 Sub-tab */}
      {activeSubtab === 'base64' && (
        <div className="two-col-grid">
          <div className="tool-card">
            <div className="form-group">
              <label className="form-label">Plain Text</label>
              <textarea
                className="form-textarea"
                value={b64Plain}
                onChange={(e) => setB64Plain(e.target.value)}
                placeholder="Type text to encode..."
              />
            </div>
            <button className="tool-btn btn-primary" onClick={encodeB64}>Encode to Base64 →</button>
          </div>

          <div className="tool-card">
            <div className="form-group">
              <label className="form-label">Base64 Encoded Text</label>
              <textarea
                className="form-textarea"
                value={b64Encoded}
                onChange={(e) => setB64Encoded(e.target.value)}
                placeholder="Paste Base64 to decode..."
              />
            </div>
            <button className="tool-btn btn-primary" onClick={decodeB64}>← Decode to Plain Text</button>
          </div>
        </div>
      )}

      {/* Hash Sub-tab */}
      {activeSubtab === 'hash' && (
        <div className="tool-card">
          <div className="form-group">
            <label className="form-label">Input Text</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '100px' }}
              value={hashInput}
              onChange={(e) => computeHashes(e.target.value)}
              placeholder="Type or paste text..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">SHA-256 (Hex)</label>
              <input type="text" className="form-input" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} value={sha256} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">SHA-512 (Hex)</label>
              <input type="text" className="form-input" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} value={sha512} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">SHA-1 (Hex)</label>
              <input type="text" className="form-input" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} value={sha1} readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Word Counter Sub-tab */}
      {activeSubtab === 'counter' && (
        <div className="tool-card">
          <div className="form-group">
            <label className="form-label">Document Text</label>
            <textarea
              className="form-textarea"
              value={counterText}
              onChange={(e) => setCounterText(e.target.value)}
              placeholder="Type or paste document text..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div className="tool-card" style={{ textAlign: 'center', background: 'var(--bg-surface-raised)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{words}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Words</div>
            </div>
            <div className="tool-card" style={{ textAlign: 'center', background: 'var(--bg-surface-raised)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{chars}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Characters</div>
            </div>
            <div className="tool-card" style={{ textAlign: 'center', background: 'var(--bg-surface-raised)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{sentences}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Sentences</div>
            </div>
            <div className="tool-card" style={{ textAlign: 'center', background: 'var(--bg-surface-raised)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{readTimeSeconds}s</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Reading Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
