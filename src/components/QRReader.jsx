'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  ScanLine,
  Upload,
  Camera,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  User,
  Globe,
  FileText,
  Trash2,
  RefreshCw,
  QrCode,
  ArrowRight
} from 'lucide-react';

export default function QRReader({ showToast, onBackToDashboard, onOpenInStudio }) {
  const [scanResult, setScanResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Recent Scans history (saved in localStorage)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('minttools_qr_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('minttools_qr_scan_history', JSON.stringify(history));
    } catch (e) {
      console.warn(e);
    }
  }, [history]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle Clipboard Paste (Ctrl+V anywhere in reader)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) decodeImageFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Parse result type (URL, Wi-Fi, vCard, text)
  const parsePayload = (data) => {
    const trimmed = (data || '').trim();

    // Check Wi-Fi
    if (trimmed.startsWith('WIFI:')) {
      const ssidMatch = trimmed.match(/S:([^;]+)/);
      const passMatch = trimmed.match(/P:([^;]+)/);
      const typeMatch = trimmed.match(/T:([^;]+)/);
      return {
        category: 'wifi',
        raw: trimmed,
        ssid: ssidMatch ? ssidMatch[1] : 'Unknown Network',
        pass: passMatch ? passMatch[1] : '',
        sec: typeMatch ? typeMatch[1] : 'WPA'
      };
    }

    // Check vCard
    if (trimmed.includes('BEGIN:VCARD')) {
      const fnMatch = trimmed.match(/FN:([^\r\n]+)/) || trimmed.match(/N:([^\r\n]+)/);
      const telMatch = trimmed.match(/TEL[^\:]*:([^\r\n]+)/);
      const emailMatch = trimmed.match(/EMAIL[^\:]*:([^\r\n]+)/);
      return {
        category: 'vcard',
        raw: trimmed,
        name: fnMatch ? fnMatch[1].trim() : 'Contact',
        phone: telMatch ? telMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : ''
      };
    }

    // Check Web URL
    if (/^https?:\/\//i.test(trimmed) || /^(www\.)/i.test(trimmed)) {
      const fullUrl = trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;
      return {
        category: 'url',
        raw: fullUrl,
        url: fullUrl
      };
    }

    // Plain text
    return {
      category: 'text',
      raw: trimmed
    };
  };

  // Add scan to history
  const addToHistory = (parsed) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.raw !== parsed.raw);
      return [
        {
          id: 'scan_' + Date.now(),
          ...parsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...filtered
      ].slice(0, 20); // Keep last 20
    });
  };

  // Draw detected QR polygon on preview canvas
  const drawHighlight = (img, location) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    if (location) {
      ctx.lineWidth = Math.max(4, Math.round(img.width / 100));
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
      ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
      ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
      ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fill();
    }
  };

  // Decode Image File
  const decodeImageFile = (file) => {
    if (!file) return;
    stopCamera();

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          const parsed = parsePayload(code.data);
          setScanResult(parsed);
          addToHistory(parsed);
          setTimeout(() => drawHighlight(img, code.location), 50);
          if (showToast) showToast('QR Code scanned successfully!', 'success');
        } else {
          setScanResult(null);
          setTimeout(() => drawHighlight(img, null), 50);
          if (showToast) showToast('No QR code found in this image', 'error');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Camera Live Scanning Loop
  const scanCameraFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(scanCameraFrame);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imgData.data, imgData.width, imgData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      const parsed = parsePayload(code.data);
      setScanResult(parsed);
      addToHistory(parsed);
      stopCamera();
      if (showToast) showToast('QR Code detected via Camera!', 'success');
    } else {
      animFrameRef.current = requestAnimationFrame(scanCameraFrame);
    }
  }, [showToast]);

  // Start Camera
  const startCamera = async () => {
    stopCamera();
    setImagePreview(null);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsScanningCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        animFrameRef.current = requestAnimationFrame(scanCameraFrame);
      }
    } catch (err) {
      console.error(err);
      setIsScanningCamera(false);
      setCameraError('Camera access denied or unavailable');
      if (showToast) showToast('Camera access denied or unavailable', 'error');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanningCamera(false);
  };

  // Copy text to clipboard
  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showToast) showToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            QR Code Reader
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Scan QR codes from image files, clipboard, or live camera.
          </p>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      <div className="two-col-grid">
        {/* Left Column: Upload / Camera Scanner */}
        <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Action Selector Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`tool-btn ${!isScanningCamera ? 'active' : ''}`}
              onClick={() => {
                stopCamera();
                fileInputRef.current?.click();
              }}
              style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
            >
              <Upload size={15} />
              <span>Choose Image</span>
            </button>
            <button
              className={`tool-btn ${isScanningCamera ? 'active' : ''}`}
              onClick={isScanningCamera ? stopCamera : startCamera}
              style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
            >
              <Camera size={15} />
              <span>{isScanningCamera ? 'Stop Camera' : 'Use Camera'}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) decodeImageFile(file);
              e.target.value = '';
            }}
          />

          {/* Camera Viewfinder */}
          {isScanningCamera ? (
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000000',
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={videoRef}
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Scan Reticle */}
              <div style={{
                position: 'absolute',
                width: '60%',
                height: '60%',
                border: '2px solid rgba(16, 185, 129, 0.8)',
                borderRadius: '12px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Point camera at QR code
              </div>
            </div>
          ) : (
            /* Drag & Drop Zone */
            <div
              className="empty-dropzone"
              style={{ minHeight: '220px', padding: '2rem 1.5rem', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) decodeImageFile(file);
              }}
            >
              <div className="dropzone-icon" style={{ width: '52px', height: '52px', margin: '0 auto 0.75rem' }}>
                <ScanLine size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
                Drop QR Image here or Click to Browse
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
                You can also press <strong>Ctrl+V</strong> to paste from clipboard
              </p>
            </div>
          )}

          {cameraError && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', textAlign: 'center' }}>
              {cameraError}
            </div>
          )}

          {/* Image Preview with Highlight */}
          {imagePreview && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Scanned Image
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                maxHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scan Result & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Result Card */}
          <div className="tool-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem' }}>
              Scanned Content
            </h3>

            {scanResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Type Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-emerald)'
                  }}>
                    {scanResult.category === 'url' && <Globe size={13} />}
                    {scanResult.category === 'wifi' && <Wifi size={13} />}
                    {scanResult.category === 'vcard' && <User size={13} />}
                    {scanResult.category === 'text' && <FileText size={13} />}
                    <span>{scanResult.category}</span>
                  </span>
                </div>

                {/* Parsed Details */}
                {scanResult.category === 'wifi' ? (
                  <div style={{ background: 'var(--bg-surface-raised)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Network Name:</span>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{scanResult.ssid}</div>
                    </div>
                    {scanResult.pass && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem' }}>
                        <div>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Password:</span>
                          <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{scanResult.pass}</div>
                        </div>
                        <button className="tool-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => copyText(scanResult.pass)}>
                          <Copy size={12} />
                          <span>Copy Password</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : scanResult.category === 'vcard' ? (
                  <div style={{ background: 'var(--bg-surface-raised)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem' }}>{scanResult.name}</div>
                    {scanResult.phone && <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>📞 {scanResult.phone}</div>}
                    {scanResult.email && <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>✉️ {scanResult.email}</div>}
                  </div>
                ) : (
                  <div style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                    wordBreak: 'break-all',
                    fontFamily: scanResult.category === 'url' ? 'inherit' : 'monospace',
                    color: scanResult.category === 'url' ? 'var(--primary-bright)' : 'var(--text-main)',
                    lineHeight: '1.5'
                  }}>
                    {scanResult.raw}
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {scanResult.category === 'url' && (
                    <a
                      href={scanResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tool-btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.6rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Website</span>
                    </a>
                  )}
                  <button
                    className="tool-btn"
                    onClick={() => copyText(scanResult.raw)}
                    style={{ flex: scanResult.category === 'url' ? 'initial' : 1, justifyContent: 'center', padding: '0.6rem' }}
                  >
                    {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy Content'}</span>
                  </button>
                  {onOpenInStudio && (
                    <button
                      className="tool-btn"
                      onClick={() => onOpenInStudio(scanResult.raw)}
                      title="Open in QR Studio to recreate or customize"
                      style={{ padding: '0.6rem' }}
                    >
                      <QrCode size={14} />
                      <span>Open in QR Studio</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <QrCode size={36} style={{ opacity: 0.25, margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>No QR code scanned yet.</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Upload an image or turn on camera on the left.
                </p>
              </div>
            )}
          </div>

          {/* Recent Scans History */}
          {history.length > 0 && (
            <div className="tool-card" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recent Scans ({history.length})
                </span>
                <button
                  className="btn-icon"
                  style={{ width: '22px', height: '22px' }}
                  onClick={() => setHistory([])}
                  title="Clear history"
                >
                  <Trash2 size={12} color="var(--accent-rose)" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    onClick={() => setScanResult(item)}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '0.35rem' }}>[{item.category}]</span>
                      <strong>{item.raw}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{item.timestamp}</span>
                      <ArrowRight size={12} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
