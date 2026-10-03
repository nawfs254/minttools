'use client';
import React, { useState, useRef } from 'react';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';

export default function ImageStudio({ showToast }) {
  const [originalFile, setOriginalFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [format, setFormat] = useState('image/webp');
  const [quality, setQuality] = useState(85);
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [aspectRatio, setAspectRatio] = useState(1);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        setCurrentImage(img);
        const ar = img.width / img.height;
        setAspectRatio(ar);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        generateOutput(img, img.width, img.height, format, quality);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const generateOutput = (img, w, h, fmt, q) => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setProcessedBlob(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    }, fmt, q / 100);
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setTargetWidth(val);
    if (w > 0 && aspectRatio) {
      const h = Math.round(w / aspectRatio);
      setTargetHeight(h);
      generateOutput(currentImage, w, h, format, quality);
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setTargetHeight(val);
    if (h > 0 && aspectRatio) {
      const w = Math.round(h * aspectRatio);
      setTargetWidth(w);
      generateOutput(currentImage, w, h, format, quality);
    }
  };

  const handleQualityChange = (q) => {
    setQuality(q);
    generateOutput(currentImage, targetWidth, targetHeight, format, q);
  };

  const handleFormatChange = (fmt) => {
    setFormat(fmt);
    generateOutput(currentImage, targetWidth, targetHeight, fmt, quality);
  };

  const handleDownload = () => {
    if (!processedBlob || !originalFile) return;
    const ext = format.split('/')[1];
    const name = originalFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${name}_optimized.${ext}`;

    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded ${filename}`, 'success');
  };

  const origSizeKB = originalFile ? (originalFile.size / 1024).toFixed(1) : 0;
  const newSizeKB = processedBlob ? (processedBlob.size / 1024).toFixed(1) : 0;
  const pctChange = originalFile && processedBlob
    ? (((processedBlob.size - originalFile.size) / originalFile.size) * 100).toFixed(0)
    : 0;

  return (
    <div className="tool-view-wrapper">
      <div className="tool-header-block">
        <h2 className="tool-headline">Image Studio</h2>
        <p className="tool-subhead">Compress, resize & convert formats</p>
      </div>

      <div className="two-col-grid">
        <div className="tool-card">
          <div className="form-group">
            <label className="form-label">Select Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Format</label>
            <select
              value={format}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="form-input"
            >
              <option value="image/webp">WebP (Modern & Smallest)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG (Lossless)</option>
            </select>
          </div>

          {format !== 'image/png' && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Quality Level</label>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={quality}
                onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Width (px)</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Height (px)</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button
            className="tool-btn btn-primary"
            onClick={handleDownload}
            disabled={!processedBlob}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            <Download size={16} />
            <span>Download Processed Image</span>
          </button>
        </div>

        <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
              />
              <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <strong>Original:</strong> {origSizeKB} KB &nbsp;•&nbsp;
                <strong>Output:</strong> {newSizeKB} KB &nbsp;•&nbsp;
                <span style={{ color: pctChange < 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  <strong>{pctChange < 0 ? `${pctChange}%` : `+${pctChange}%`}</strong>
                </span>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center' }}>
              <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>Upload an image to see live compression comparison</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
