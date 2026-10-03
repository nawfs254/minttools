'use client';
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import {
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  RefreshCw,
  Sliders
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function ImagePDFConverter({ showToast, onBackToDashboard }) {
  const [tab, setTab] = useState('img2pdf'); // 'img2pdf' | 'pdf2img'

  // Image to PDF state
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('a4'); // 'a4' | 'fit'
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const imageInputRef = useRef(null);

  // PDF to Image state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [outImgFormat, setOutImgFormat] = useState('image/png');
  const [isExtracting, setIsExtracting] = useState(false);
  const pdfInputRef = useRef(null);

  // Handle adding images
  const handleAddImages = (files) => {
    const newItems = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(f);
      newItems.push({
        id: 'img_' + Date.now() + Math.random(),
        file: f,
        previewUrl: url,
        name: f.name
      });
    }
    setImages((prev) => [...prev, ...newItems]);
  };

  // Reorder images
  const moveImage = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setImages(copy);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Create PDF from images
  const handleCreatePdf = async () => {
    if (images.length === 0) return;
    setIsCreatingPdf(true);

    try {
      const doc = await PDFDocument.create();

      for (const item of images) {
        const buffer = await item.file.arrayBuffer();
        let embedded;

        if (item.file.type === 'image/png') {
          embedded = await doc.embedPng(buffer);
        } else {
          // If jpeg or other, load onto canvas and get clean JPG bytes
          const imgElem = new Image();
          await new Promise((resolve) => {
            imgElem.onload = resolve;
            imgElem.src = item.previewUrl;
          });
          const canvas = document.createElement('canvas');
          canvas.width = imgElem.width;
          canvas.height = imgElem.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgElem, 0, 0);
          const jpgData = canvas.toDataURL('image/jpeg', 0.9);
          const b64 = jpgData.split(',')[1];
          const bin = atob(b64);
          const u8 = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
          embedded = await doc.embedJpg(u8);
        }

        // Standard A4 is 595.28 x 841.89 points
        let pageWidth = 595.28;
        let pageHeight = 841.89;

        if (pageSize === 'fit') {
          pageWidth = embedded.width;
          pageHeight = embedded.height;
        }

        const page = doc.addPage([pageWidth, pageHeight]);

        if (pageSize === 'fit') {
          page.drawImage(embedded, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        } else {
          // Scale to fit inside A4 margins
          const margin = 36;
          const availW = pageWidth - margin * 2;
          const availH = pageHeight - margin * 2;
          const scale = Math.min(availW / embedded.width, availH / embedded.height);
          const drawW = embedded.width * scale;
          const drawH = embedded.height * scale;
          const x = (pageWidth - drawW) / 2;
          const y = (pageHeight - drawH) / 2;

          page.drawImage(embedded, { x, y, width: drawW, height: drawH });
        }
      }

      const pdfBytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `images_document_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (showToast) showToast('Created PDF from images successfully!', 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to create PDF: ' + err.message, 'error');
    } finally {
      setIsCreatingPdf(false);
    }
  };

  // Handle PDF select for extracting images
  const handleSelectPdfToImages = async (file) => {
    if (!file || (file.type !== 'application/pdf' && !file.name.endsWith('.pdf'))) return;
    setPdfFile(file);
    setIsExtracting(true);
    setPdfPages([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pages = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL(outImgFormat, 0.9);
        pages.push({ pageNum: p, dataUrl });
      }

      setPdfPages(pages);
      if (showToast) showToast(`Extracted ${pages.length} pages ready to download`, 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to extract PDF pages', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  // Download single extracted image
  const downloadSinglePage = (dataUrl, pageNum) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    const ext = outImgFormat === 'image/png' ? 'png' : 'jpg';
    a.download = `page_${pageNum}.${ext}`;
    a.click();
  };

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`tool-btn ${tab === 'img2pdf' ? 'active' : ''}`}
            onClick={() => setTab('img2pdf')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <ImageIcon size={14} />
            <span>Images to PDF</span>
          </button>
          <button
            className={`tool-btn ${tab === 'pdf2img' ? 'active' : ''}`}
            onClick={() => setTab('pdf2img')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <FileText size={14} />
            <span>PDF to Images</span>
          </button>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      {tab === 'img2pdf' ? (
        /* Images to PDF */
        <div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files) handleAddImages(Array.from(e.target.files));
              e.target.value = '';
            }}
          />

          {images.length === 0 ? (
            <div
              className="empty-dropzone"
              style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) handleAddImages(Array.from(e.dataTransfer.files));
              }}
            >
              <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
                <ImageIcon size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
                Select Images to Convert to PDF
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
                Drag and drop JPG, PNG, or WebP photos here
              </p>
              <button
                className="tool-btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  imageInputRef.current?.click();
                }}
              >
                <Plus size={16} />
                <span>Choose Photos</span>
              </button>
            </div>
          ) : (
            <div className="two-col-grid">
              {/* Left: Reorderable Images */}
              <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Photos ({images.length})
                  </span>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.785rem' }}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Plus size={13} />
                    <span>Add More</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {images.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-surface-raised)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={item.previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {idx + 1}. {item.name}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <button
                          className="btn-icon"
                          style={{ width: '22px', height: '22px' }}
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, -1)}
                          title="Move Left"
                        >
                          <ArrowUp size={11} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '22px', height: '22px' }}
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, 1)}
                          title="Move Right"
                        >
                          <ArrowDown size={11} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '22px', height: '22px' }}
                          onClick={() => removeImage(item.id)}
                          title="Delete"
                        >
                          <Trash2 size={11} color="var(--accent-rose)" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: PDF Settings & Create */}
              <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center', textAlign: 'center', minHeight: '300px' }}>
                <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                  <label className="form-label">Page Sizing</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <button
                      className={`tool-btn ${pageSize === 'a4' ? 'active' : ''}`}
                      onClick={() => setPageSize('a4')}
                      style={{ justifyContent: 'center', padding: '0.65rem' }}
                    >
                      A4 Standard
                    </button>
                    <button
                      className={`tool-btn ${pageSize === 'fit' ? 'active' : ''}`}
                      onClick={() => setPageSize('fit')}
                      style={{ justifyContent: 'center', padding: '0.65rem' }}
                    >
                      Fit Image Size
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                    Ready to Generate PDF
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                    {images.length} photos will become {images.length} pages
                  </p>
                </div>

                <button
                  className="tool-btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
                  onClick={handleCreatePdf}
                  disabled={isCreatingPdf}
                >
                  {isCreatingPdf ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      <span>Creating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PDF to Images */
        <div>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleSelectPdfToImages(f);
              e.target.value = '';
            }}
          />

          {!pdfFile ? (
            <div
              className="empty-dropzone"
              style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
              onClick={() => pdfInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleSelectPdfToImages(f);
              }}
            >
              <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
                Select a PDF to Extract Images
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
                Convert every page into high-resolution PNG or JPG photos
              </p>
              <button
                className="tool-btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  pdfInputRef.current?.click();
                }}
              >
                <span>Choose PDF File</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {pdfFile.name} ({pdfPages.length} pages extracted)
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.785rem' }}
                    onClick={() => {
                      setPdfFile(null);
                      setPdfPages([]);
                    }}
                  >
                    Change PDF
                  </button>
                </div>
              </div>

              {/* Grid of Extracted Pages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {pdfPages.map((p) => (
                  <div
                    key={p.pageNum}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}
                  >
                    <img src={p.dataUrl} alt={`page ${p.pageNum}`} style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 600 }}>Page {p.pageNum}</span>
                    <button
                      className="tool-btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.4rem', fontSize: '0.75rem' }}
                      onClick={() => downloadSinglePage(p.dataUrl, p.pageNum)}
                    >
                      <Download size={12} />
                      <span>Download Image</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
