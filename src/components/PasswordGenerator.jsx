'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Lock,
  List
} from 'lucide-react';

const WORD_LIST = [
  'apple', 'anchor', 'arrow', 'badge', 'banner', 'beacon', 'breeze', 'bridge', 'cabin', 'canyon',
  'castle', 'cedar', 'cliff', 'cloud', 'clover', 'comet', 'copper', 'coral', 'crater', 'crystal',
  'delta', 'desert', 'diamond', 'dolphin', 'dragon', 'dune', 'eagle', 'echo', 'ember', 'falcon',
  'fern', 'flame', 'forest', 'fossil', 'frost', 'galaxy', 'garden', 'geyser', 'glacier', 'glade',
  'granite', 'grove', 'harbor', 'haven', 'hawk', 'horizon', 'island', 'jasper', 'jungle', 'lagoon',
  'laser', 'leaf', 'legend', 'light', 'lion', 'lunar', 'maple', 'meadow', 'meteor', 'mineral',
  'monarch', 'mountain', 'nebula', 'oasis', 'ocean', 'olive', 'orbit', 'orchid', 'owl', 'panda',
  'panther', 'peak', 'pebble', 'phoenix', 'pillar', 'pine', 'planet', 'polar', 'prism', 'quartz',
  'quiver', 'radar', 'radiant', 'raptor', 'raven', 'reef', 'ridge', 'ripple', 'river', 'rocket',
  'ruby', 'saddle', 'safari', 'sailor', 'samurai', 'sapphire', 'shadow', 'shield', 'sierra', 'silver',
  'solar', 'spark', 'sparrow', 'sphere', 'spiral', 'spring', 'spruce', 'star', 'stellar', 'stream',
  'summit', 'sunset', 'surge', 'timber', 'topaz', 'torch', 'trail', 'treasure', 'tundra', 'valley',
  'vector', 'velvet', 'vessel', 'vortex', 'voyage', 'walnut', 'wave', 'willow', 'wind', 'winter',
  'wizard', 'wolf', 'zenith', 'zephyr'
];

export default function PasswordGenerator({ showToast, onBackToDashboard }) {
  const [mode, setMode] = useState('password'); // 'password' | 'passphrase'

  // Password options
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);

  // Passphrase options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState('title'); // 'title' | 'lower' | 'upper'
  const [includeNumber, setIncludeNumber] = useState(true);

  // Current generated password
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [bulkList, setBulkList] = useState([]);
  const [showBulk, setShowBulk] = useState(false);

  // Cryptographically secure random integer in range [0, max - 1]
  const secureRandomInt = (max) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  // Generate single password
  const generatePassword = useCallback(() => {
    if (mode === 'password') {
      let chars = '';
      if (useLower) chars += noAmbiguous ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
      if (useUpper) chars += noAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useNumbers) chars += noAmbiguous ? '23456789' : '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars[secureRandomInt(chars.length)];
      }
      return result;
    } else {
      // Passphrase
      const words = [];
      for (let i = 0; i < wordCount; i++) {
        let w = WORD_LIST[secureRandomInt(WORD_LIST.length)];
        if (capitalize === 'title') {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        } else if (capitalize === 'upper') {
          w = w.toUpperCase();
        } else {
          w = w.toLowerCase();
        }
        words.push(w);
      }

      if (includeNumber) {
        const randNum = secureRandomInt(90) + 10;
        const insertIdx = secureRandomInt(words.length);
        words[insertIdx] = words[insertIdx] + randNum;
      }

      return words.join(separator);
    }
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, noAmbiguous, wordCount, separator, capitalize, includeNumber]);

  // Regenerate on settings change
  const refresh = useCallback(() => {
    const main = generatePassword();
    setPassword(main);

    // Also prepare bulk list of 5 alternatives
    const bulk = [];
    for (let i = 0; i < 5; i++) {
      bulk.push(generatePassword());
    }
    setBulkList(bulk);
  }, [generatePassword]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Copy helper
  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showToast) showToast('Password copied to clipboard!', 'success');
  };

  // Calculate Entropy & Strength
  const getStrength = () => {
    let poolSize = 0;
    if (mode === 'password') {
      if (useLower) poolSize += 26;
      if (useUpper) poolSize += 26;
      if (useNumbers) poolSize += 10;
      if (useSymbols) poolSize += 30;
      if (poolSize === 0) poolSize = 26;
      const entropy = Math.round(length * Math.log2(poolSize));

      if (entropy < 40) return { label: 'Weak', color: 'var(--accent-rose)', width: '25%' };
      if (entropy < 60) return { label: 'Moderate', color: 'var(--accent-amber)', width: '50%' };
      if (entropy < 85) return { label: 'Strong', color: 'var(--accent-emerald)', width: '75%' };
      return { label: 'Very Strong', color: '#10b981', width: '100%' };
    } else {
      const entropy = Math.round(wordCount * Math.log2(WORD_LIST.length) + (includeNumber ? 6 : 0));
      if (entropy < 45) return { label: 'Moderate', color: 'var(--accent-amber)', width: '50%' };
      if (entropy < 70) return { label: 'Strong', color: 'var(--accent-emerald)', width: '75%' };
      return { label: 'Very Strong', color: '#10b981', width: '100%' };
    }
  };

  const strength = getStrength();

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Password Generator
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Generate cryptographically secure passwords and readable passphrases locally.
          </p>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', width: 'fit-content', border: '1px solid var(--border-subtle)' }}>
        <button
          className={`tool-btn ${mode === 'password' ? 'active' : ''}`}
          onClick={() => setMode('password')}
          style={{ padding: '0.45rem 1rem' }}
        >
          <Key size={14} />
          <span>Random Password</span>
        </button>
        <button
          className={`tool-btn ${mode === 'passphrase' ? 'active' : ''}`}
          onClick={() => setMode('passphrase')}
          style={{ padding: '0.45rem 1rem' }}
        >
          <Sparkles size={14} />
          <span>Memorable Passphrase</span>
        </button>
      </div>

      {/* Main Password Output Display */}
      <div className="tool-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-raised)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.15rem',
          gap: '0.75rem'
        }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: password.length > 28 ? '1.1rem' : '1.35rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--text-main)',
            wordBreak: 'break-all',
            overflow: 'hidden'
          }}>
            {password}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <button
              className="tool-btn btn-primary"
              onClick={() => copyToClipboard(password)}
              style={{ padding: '0.55rem 0.9rem' }}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              className="tool-btn"
              onClick={refresh}
              style={{ padding: '0.55rem 0.75rem' }}
              title="Regenerate"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div style={{ marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Security Strength</span>
            <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: strength.width,
              height: '100%',
              background: strength.color,
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Left: Configuration Controls */}
        <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'password' ? (
            <>
              {/* Length Slider */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password Length</label>
                  <strong style={{ color: 'var(--primary-bright)', fontSize: '0.95rem' }}>{length}</strong>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Character Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                  />
                  <span>Uppercase (A-Z)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                  />
                  <span>Lowercase (a-z)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={noAmbiguous}
                  onChange={(e) => setNoAmbiguous(e.target.checked)}
                />
                <span>Avoid ambiguous characters (1, l, I, 0, O)</span>
              </label>
            </>
          ) : (
            /* Passphrase Controls */
            <>
              {/* Word Count */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Number of Words</label>
                  <strong style={{ color: 'var(--primary-bright)', fontSize: '0.95rem' }}>{wordCount}</strong>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Separator Selection */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Separator</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Hyphen (-)', val: '-' },
                    { label: 'Underscore (_)', val: '_' },
                    { label: 'Period (.)', val: '.' },
                    { label: 'Space', val: ' ' }
                  ].map((s) => (
                    <button
                      key={s.val}
                      className={`tool-btn ${separator === s.val ? 'active' : ''}`}
                      onClick={() => setSeparator(s.val)}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.785rem' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capitalization & Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Capitalization</label>
                  <select
                    className="form-select"
                    value={capitalize}
                    onChange={(e) => setCapitalize(e.target.value)}
                  >
                    <option value="title">Title Case (Word)</option>
                    <option value="lower">lowercase (word)</option>
                    <option value="upper">UPPERCASE (WORD)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1.25rem' }}>
                    <input
                      type="checkbox"
                      checked={includeNumber}
                      onChange={(e) => setIncludeNumber(e.target.checked)}
                    />
                    <span>Include a number</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Bulk Generator / Alternatives */}
        <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Quick Alternatives
            </span>
            <button
              className="tool-btn"
              onClick={refresh}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} />
              <span>Reroll All</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {bulkList.map((alt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                  {alt}
                </span>
                <button
                  className="tool-btn"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => copyToClipboard(alt)}
                  title="Copy this password"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
