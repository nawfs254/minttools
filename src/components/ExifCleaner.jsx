'use client';
import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  UploadCloud,
  Download,
  Trash2,
  Check,
  MapPin,
  Camera,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export default function ExifCleaner({ showToast, onBackToDashboard }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [exifInfo, setExifInfo] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [cleanedUrl, setCleanedUrl] = useState('');
  const [cleanSize, setCleanSize] = useState(0);

  const fileInputRef = useRef(null);

  // Format bytes
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Basic client-side EXIF inspection using DataView
  const inspectExif = (buffer) => {
    const view = new DataView(buffer);
    const info = { hasExif: false, hasGps: false, camera: '', date: '' };

    try {
      if (view.getUint16(0, false) === 0xFFD8) {
        let offset = 2;
        while (offset < view.byteLength) {
          const marker = view.getUint16(offset, false);
          offset += 2;

          if (marker === 0xFFE1) {
            // APP1 marker (EXIF)
            info.hasExif = true;
            const length = view.getUint16(offset, false);
            const exifHeader = view.getUint32(offset + 2, false);
            if (exifHeader === 0x45786966) { // "Exif"
              // Check for GPS block signature in the segment
              const chunk = new Uint8Array(buffer, offset, length);
              const text = new TextDecoder('latin1').decode(chunk);
              if (text.includes('GPS') || text.includes('GPSVersionID')) {
                info.hasGps = true;
              }
              const makeMatch = text.match(/(Apple|Canon|Nikon|Sony|Samsung|Google|Xiaomi)/i);
              if (makeMatch) info.camera = makeMatch[0];
            }
            break;
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }
      }
    } catch (e) {
      console.warn('EXIF scan error:', e);
    }
    return info;
  };

  const handleSelectFile = async (f) => {
    if (!f || !f.type.startsWith('image/')) {
      if (showToast) showToast('Please select a valid image file', 'error');
      return;
    }

    setFile(f);
    setCleanedUrl('');
    setCleanSize(0);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    const buffer = await f.arrayBuffer();
    const info = inspectExif(buffer);
    setExifInfo(info);
  };

  // Strip all metadata by decoding onto canvas and re-exporting raw bitmap
  const handleScrub = () => {
    if (!file || !previewUrl) return;
    setIsScrubbing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCleanedUrl(url);
        setCleanSize(blob.size);
        setIsScrubbing(false);

        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        if (showToast) showToast('Metadata & GPS successfully stripped!', 'success');
      }, mimeType, 0.95);
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!cleanedUrl || !file) return;
    const a = document.createElement('a');
    a.href = cleanedUrl;
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}_scrubbed.${ext}`;
    a.click();
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            EXIF Metadata Scrubber
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Strip GPS coordinates, device info, and private tracking tags from your photos.
          </p>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleSelectFile(f);
          e.target.value = '';
        }}
      />

      {!file ? (
        <div
          className="empty-dropzone"
          style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleSelectFile(f);
          }}
        >
          <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
            <ShieldCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
            Select a Photo to Clean
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
            Drag and drop any JPG or PNG photo here to remove metadata
          </p>
          <button
            className="tool-btn btn-primary"
            style={{ padding: '0.65rem 1.4rem' }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <span>Choose Image</span>
          </button>
        </div>
      ) : (
        <div className="two-col-grid">
          {/* Left: Image Info & Scrub Action */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Original Size: {formatSize(file.size)}
                </div>
              </div>
              <button
                className="tool-btn"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => {
                  setFile(null);
                  setPreviewUrl('');
                  setCleanedUrl('');
                }}
              >
                Change
              </button>
            </div>

            {/* Metadata Status Card */}
            <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Detected Metadata Status
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <MapPin size={15} color={exifInfo?.hasGps ? 'var(--accent-rose)' : 'var(--text-muted)'} />
                <span>GPS Location: <strong>{exifInfo?.hasGps ? 'Found in photo (will be deleted)' : 'None detected'}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Camera size={15} color={exifInfo?.camera ? 'var(--accent-amber)' : 'var(--text-muted)'} />
                <span>Device Signature: <strong>{exifInfo?.camera ? exifInfo.camera : 'Standard image'}</strong></span>
              </div>
            </div>

            <button
              className="tool-btn btn-primary"
              style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
              onClick={handleScrub}
              disabled={isScrubbing}
            >
              <ShieldCheck size={16} />
              <span>{isScrubbing ? 'Scrubbing Metadata...' : 'Scrub & Remove Metadata'}</span>
            </button>
          </div>

          {/* Right: Preview & Clean Download */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center', gap: '1rem' }}>
            <div style={{ maxWidth: '240px', maxHeight: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
            </div>

            {cleanedUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '260px' }}>
                <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={16} />
                  <span>100% Cleaned Photo</span>
                </div>
                <button
                  className="tool-btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                  onClick={handleDownload}
                >
                  <Download size={15} />
                  <span>Download Clean Photo</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Click "Scrub & Remove Metadata" to generate your clean copy.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
