'use client';
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import {
  FileText,
  UploadCloud,
  Download,
  ArrowRight,
  Check,
  RefreshCw,
  Zap,
  Sliders,
  Sparkles,
  FileCheck2
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PDFCompressor({ showToast, onBackToDashboard }) {
  const [file, setFile] = useState(null);
  const [fileBytes, setFileBytes] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);

  // Compression Settings
  const [preset, setPreset] = useState('balanced'); // 'extreme' | 'balanced' | 'light'
  const [customQuality, setCustomQuality] = useState(70);
  const [showCustom, setShowCustom] = useState(false);

  // Processing state
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  // Result state
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');

  const fileInputRef = useRef(null);

  // Format bytes helper
  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle PDF file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB safety limit
    if (selectedFile.size > MAX_FILE_SIZE) {
      if (showToast) showToast('File too large (max 100MB allowed for browser memory safety)', 'error');
      return;
    }
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      if (showToast) showToast('Please select a valid PDF file', 'error');
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedBlob(null);
    setCompressedSize(0);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;
      setFileBytes(buffer);

      try {
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const doc = await loadingTask.promise;
        setPageCount(doc.numPages);
      } catch (err) {
        console.error(err);
        if (showToast) showToast('Failed to load PDF structure', 'error');
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Run Compression
  const handleCompress = async () => {
    if (!fileBytes || isCompressing) return;

    setIsCompressing(true);
    setProgress(5);
    setCurrentStep('Analyzing PDF structure...');

    try {
      // Determine quality and scale based on preset
      let scale = 1.25;
      let quality = 0.70;

      if (showCustom) {
        quality = customQuality / 100;
        scale = quality > 0.75 ? 1.5 : quality > 0.5 ? 1.2 : 0.9;
      } else if (preset === 'extreme') {
        scale = 0.85;
        quality = 0.50;
      } else if (preset === 'light') {
        scale = 1.6;
        quality = 0.85;
      } else {
        // Balanced (default)
        scale = 1.25;
        quality = 0.70;
      }

      const srcPdf = await pdfjsLib.getDocument({ data: fileBytes.slice(0) }).promise;
      const totalPages = srcPdf.numPages;

      const newDoc = await PDFDocument.create();

      for (let p = 1; p <= totalPages; p++) {
        setCurrentStep(`Compressing page ${p} of ${totalPages}...`);
        setProgress(Math.round(10 + (p / totalPages) * 75));

        const page = await srcPdf.getPage(p);
        const viewport = page.getViewport({ scale });

        // Render to offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert to compressed JPEG data
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = jpegDataUrl.split(',')[1];
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const embeddedJpg = await newDoc.embedJpg(bytes);

        // Standard PDF points (72 DPI)
        const pdfWidth = viewport.width / scale;
        const pdfHeight = viewport.height / scale;

        const newPage = newDoc.addPage([pdfWidth, pdfHeight]);
        newPage.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: pdfWidth,
          height: pdfHeight
        });
      }

      setCurrentStep('Finalizing compressed PDF...');
      setProgress(95);

      const compressedBytes = await newDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedBlob(blob);
      setCompressedSize(blob.size);
      setDownloadUrl(url);
      setProgress(100);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (showToast) showToast('Compression complete!', 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Compression failed: ' + err.message, 'error');
    } finally {
      setIsCompressing(false);
      setCurrentStep('');
    }
  };

  // Download Compressed File
  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    const originalName = file?.name?.replace(/\.[^/.]+$/, '') || 'document';
    a.download = `${originalName}_compressed.pdf`;
    a.click();
  };

  // Reset tool
  const handleReset = () => {
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setOriginalSize(0);
    setCompressedBlob(null);
    setCompressedSize(0);
    setProgress(0);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  };

  const savingsPct = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            PDF Compressor
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Reduce PDF file size while maintaining clean visual quality.
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
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileSelect(f);
          e.target.value = '';
        }}
      />

      {!file ? (
        /* Empty Upload Dropzone */
        <div
          className="empty-dropzone"
          style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFileSelect(f);
          }}
        >
          <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
            <UploadCloud size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
            Select a PDF to Compress
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
            Drag and drop your file here, or click to browse
          </p>
          <button
            className="tool-btn btn-primary"
            style={{ padding: '0.65rem 1.4rem' }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <span>Choose PDF File</span>
          </button>
        </div>
      ) : (
        /* Active File & Compression View */
        <div className="two-col-grid">
          {/* Left: Settings Card */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* File Info Pill */}
            <div style={{
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {formatSize(originalSize)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </div>
                </div>
              </div>

              <button
                className="tool-btn"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={handleReset}
              >
                Change
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Compression Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
                <div
                  className={`tool-small-box ${preset === 'extreme' && !showCustom ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 0.65rem',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    borderColor: preset === 'extreme' && !showCustom ? 'var(--accent-emerald)' : undefined,
                    background: preset === 'extreme' && !showCustom ? 'rgba(16, 185, 129, 0.08)' : undefined
                  }}
                  onClick={() => {
                    setPreset('extreme');
                    setShowCustom(false);
                  }}
                >
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    High
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Smallest size
                  </div>
                </div>

                <div
                  className={`tool-small-box ${preset === 'balanced' && !showCustom ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 0.65rem',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    borderColor: preset === 'balanced' && !showCustom ? 'var(--primary)' : undefined,
                    background: preset === 'balanced' && !showCustom ? 'rgba(99, 102, 241, 0.08)' : undefined
                  }}
                  onClick={() => {
                    setPreset('balanced');
                    setShowCustom(false);
                  }}
                >
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-bright)' }}>
                    Standard
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Recommended
                  </div>
                </div>

                <div
                  className={`tool-small-box ${preset === 'light' && !showCustom ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 0.65rem',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    borderColor: preset === 'light' && !showCustom ? 'var(--accent-cyan)' : undefined,
                    background: preset === 'light' && !showCustom ? 'rgba(6, 182, 212, 0.08)' : undefined
                  }}
                  onClick={() => {
                    setPreset('light');
                    setShowCustom(false);
                  }}
                >
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Light
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Higher quality
                  </div>
                </div>
              </div>
            </div>

            {/* Custom slider toggle */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-bright)',
                    fontSize: '0.775rem',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => setShowCustom(!showCustom)}
                >
                  <Sliders size={12} />
                  <span>{showCustom ? 'Use Presets' : 'Custom Quality Slider'}</span>
                </button>
                {showCustom && (
                  <span style={{ fontSize: '0.775rem', fontWeight: 600 }}>{customQuality}%</span>
                )}
              </div>

              {showCustom && (
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={customQuality}
                  onChange={(e) => setCustomQuality(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '0.35rem' }}
                />
              )}
            </div>

            {/* Compress Action Button */}
            <button
              className="tool-btn btn-primary"
              style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              onClick={handleCompress}
              disabled={isCompressing}
            >
              {isCompressing ? (
                <>
                  <RefreshCw size={16} className="spinning" />
                  <span>{currentStep || 'Compressing...'}</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Compress PDF</span>
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isCompressing && (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <span>{currentStep}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
                    transition: 'width 0.2s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Result & Download Card */}
          <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', textAlign: 'center' }}>
            {compressedSize > 0 ? (
              <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(16, 185, 129, 0.25)'
                }}>
                  <FileCheck2 size={32} />
                </div>

                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                    Compression Ready!
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px'
                  }}>
                    <span>{savingsPct}% Smaller</span>
                  </div>
                </div>

                {/* Size Comparison Card */}
                <div style={{
                  width: '100%',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Original</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      {formatSize(originalSize)}
                    </div>
                  </div>
                  <ArrowRight size={15} color="var(--text-dim)" />
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--accent-emerald)' }}>Compressed</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-emerald)' }}>
                      {formatSize(compressedSize)}
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  className="tool-btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  <span>Download Compressed PDF</span>
                </button>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                <FileText size={44} style={{ opacity: 0.25, margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                  Ready to Compress
                </p>
                <p style={{ fontSize: '0.775rem', marginTop: '0.25rem', color: 'var(--text-dim)' }}>
                  Choose a compression level and click Compress PDF.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
