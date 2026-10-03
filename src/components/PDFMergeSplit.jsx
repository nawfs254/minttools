'use client';
import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import {
  FileText,
  UploadCloud,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Layers,
  Split,
  Plus,
  RefreshCw,
  Check
} from 'lucide-react';

export default function PDFMergeSplit({ showToast, onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('merge'); // 'merge' | 'split'

  // Merge State
  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const mergeInputRef = useRef(null);

  // Split State
  const [splitFile, setSplitFile] = useState(null);
  const [splitDoc, setSplitDoc] = useState(null);
  const [splitPageCount, setSplitPageCount] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const splitInputRef = useRef(null);

  // Format size helper
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle adding files to merge
  const handleAddMergeFiles = async (files) => {
    const newItems = [];
    for (const f of files) {
      if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) continue;
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        newItems.push({
          id: 'file_' + Date.now() + Math.random(),
          file: f,
          bytes: buffer,
          name: f.name,
          size: f.size,
          pages: doc.getPageCount()
        });
      } catch (err) {
        console.error(err);
        if (showToast) showToast(`Failed to parse ${f.name}`, 'error');
      }
    }
    setMergeFiles((prev) => [...prev, ...newItems]);
  };

  // Move file up / down in merge list
  const moveFile = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= mergeFiles.length) return;
    const updated = [...mergeFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMergeFiles(updated);
  };

  // Remove file from merge list
  const removeMergeFile = (id) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  // Execute Merge
  const handleMerge = async () => {
    if (mergeFiles.length < 2) {
      if (showToast) showToast('Please add at least 2 PDF files to merge', 'error');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of mergeFiles) {
        const srcPdf = await PDFDocument.load(item.bytes);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (showToast) showToast('Merged PDFs successfully!', 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Merge failed: ' + err.message, 'error');
    } finally {
      setIsMerging(false);
    }
  };

  // Handle Split file select
  const handleSelectSplitFile = async (f) => {
    if (!f || (f.type !== 'application/pdf' && !f.name.endsWith('.pdf'))) return;
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setSplitFile(f);
      setSplitDoc(doc);
      const count = doc.getPageCount();
      setSplitPageCount(count);
      setPageRange(`1-${Math.min(count, 3)}`);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load PDF for splitting', 'error');
    }
  };

  // Parse page range string (e.g. "1-3, 5, 7-9") into 0-indexed page numbers
  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(maxPages, Math.max(start, end));
          for (let p = s; p <= e; p++) {
            pages.add(p - 1);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  // Execute Split / Extract
  const handleSplit = async () => {
    if (!splitDoc || !splitFile) return;

    const indices = parsePageRange(pageRange, splitPageCount);
    if (indices.length === 0) {
      if (showToast) showToast('Please enter a valid page range (e.g. 1-3, 5)', 'error');
      return;
    }

    setIsSplitting(true);
    try {
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(splitDoc, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save({ useObjectStreams: true });
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = splitFile.name.replace(/\.[^/.]+$/, '');
      a.download = `${baseName}_extracted.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (showToast) showToast(`Extracted ${indices.length} pages successfully!`, 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Extraction failed: ' + err.message, 'error');
    } finally {
      setIsSplitting(false);
    }
  };

  const totalMergePages = mergeFiles.reduce((sum, item) => sum + item.pages, 0);

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`tool-btn ${activeTab === 'merge' ? 'active' : ''}`}
            onClick={() => setActiveTab('merge')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <Layers size={14} />
            <span>Merge PDFs</span>
          </button>
          <button
            className={`tool-btn ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => setActiveTab('split')}
            style={{ padding: '0.45rem 1rem' }}
          >
            <Split size={14} />
            <span>Split & Extract</span>
          </button>
        </div>

        {onBackToDashboard && (
          <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span>← All Tools</span>
          </button>
        )}
      </div>

      {activeTab === 'merge' ? (
        /* Merge Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            ref={mergeInputRef}
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files) handleAddMergeFiles(Array.from(e.target.files));
              e.target.value = '';
            }}
          />

          {mergeFiles.length === 0 ? (
            <div
              className="empty-dropzone"
              style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
              onClick={() => mergeInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) handleAddMergeFiles(Array.from(e.dataTransfer.files));
              }}
            >
              <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
                <Layers size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
                Select PDFs to Merge
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
                Drag and drop multiple PDF files here, or click to browse
              </p>
              <button
                className="tool-btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  mergeInputRef.current?.click();
                }}
              >
                <Plus size={16} />
                <span>Add PDF Files</span>
              </button>
            </div>
          ) : (
            <div className="two-col-grid">
              {/* Left: Reorderable Files List */}
              <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Files to Merge ({mergeFiles.length})
                  </span>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.785rem' }}
                    onClick={() => mergeInputRef.current?.click()}
                  >
                    <Plus size={13} />
                    <span>Add More</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {mergeFiles.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-surface-raised)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '18px' }}>
                          {idx + 1}.
                        </span>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {item.pages} pages • {formatSize(item.size)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                        <button
                          className="btn-icon"
                          style={{ width: '26px', height: '26px' }}
                          disabled={idx === 0}
                          onClick={() => moveFile(idx, -1)}
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '26px', height: '26px' }}
                          disabled={idx === mergeFiles.length - 1}
                          onClick={() => moveFile(idx, 1)}
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '26px', height: '26px' }}
                          onClick={() => removeMergeFile(item.id)}
                          title="Remove"
                        >
                          <Trash2 size={13} color="var(--accent-rose)" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Merge Action Card */}
              <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px', gap: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Layers size={28} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                    Ready to Combine
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {mergeFiles.length} documents • {totalMergePages} total pages
                  </p>
                </div>

                <button
                  className="tool-btn btn-primary"
                  style={{ width: '100%', maxWidth: '280px', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
                  onClick={handleMerge}
                  disabled={isMerging}
                >
                  {isMerging ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      <span>Merging...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Merge & Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Split & Extract Mode */
        <div>
          <input
            ref={splitInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleSelectSplitFile(f);
              e.target.value = '';
            }}
          />

          {!splitFile ? (
            <div
              className="empty-dropzone"
              style={{ minHeight: '260px', padding: '3rem 1.5rem', cursor: 'pointer' }}
              onClick={() => splitInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleSelectSplitFile(f);
              }}
            >
              <div className="dropzone-icon" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
                <Split size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
                Select a PDF to Split
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
                Drag and drop your PDF file here, or click to browse
              </p>
              <button
                className="tool-btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  splitInputRef.current?.click();
                }}
              >
                <span>Choose PDF File</span>
              </button>
            </div>
          ) : (
            <div className="two-col-grid">
              {/* Left: Range Input */}
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
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{splitFile.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {splitPageCount} pages total • {formatSize(splitFile.size)}
                    </div>
                  </div>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setSplitFile(null);
                      setSplitDoc(null);
                    }}
                  >
                    Change
                  </button>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Pages to Extract</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Enter page numbers or ranges (e.g., <strong>1-3, 5</strong> to extract pages 1, 2, 3, and 5).
                  </div>
                </div>

                {/* Quick Selection Shortcuts */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.785rem' }}
                    onClick={() => setPageRange('1')}
                  >
                    First Page Only
                  </button>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.785rem' }}
                    onClick={() => setPageRange(String(splitPageCount))}
                  >
                    Last Page Only
                  </button>
                  <button
                    className="tool-btn"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.785rem' }}
                    onClick={() => setPageRange(`1-${splitPageCount}`)}
                  >
                    All Pages
                  </button>
                </div>

                <button
                  className="tool-btn btn-primary"
                  style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
                  onClick={handleSplit}
                  disabled={isSplitting}
                >
                  {isSplitting ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Extract & Download</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right: Summary */}
              <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '280px' }}>
                <Split size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Selected Pages</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {parsePageRange(pageRange, splitPageCount).length} of {splitPageCount} pages will be extracted.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
