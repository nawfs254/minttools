'use client';
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

// Anti-XSS Sanitizer for Markdown HTML output
function sanitizeHtml(html) {
  if (typeof document === 'undefined') return html;
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove executable script and object tags
  const blockedTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style'];
  blockedTags.forEach(tag => {
    const elements = temp.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // Strip inline JavaScript handlers and dangerous URI schemes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    for (let i = el.attributes.length - 1; i >= 0; i--) {
      const attr = el.attributes[i];
      const name = attr.name.toLowerCase();
      const val = attr.value.toLowerCase().trim();
      if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('vbscript:')) {
        el.removeAttribute(attr.name);
      }
    }
  });

  return temp.innerHTML;
}

import {
  FileText,
  Download,
  Copy,
  Check,
  Eye,
  Columns,
  Code,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  CheckSquare,
  Quote,
  Table,
  Link,
  Sparkles,
  Printer
} from 'lucide-react';

const SAMPLE_MARKDOWN = `# Project Proposal & Notes

## Overview
This document is written in **Markdown** and can be exported as a vector-clean **PDF** with one click.

### Key Highlights
- **100% Client-Side**: No data leaves your machine.
- **Fast & Responsive**: Live real-time preview as you type.
- **Clean Vector Export**: Preserves typography, tables, and formatting.

---

### Task Checklist
- [x] Set up local development environment
- [x] Install Markdown engine & styling
- [ ] Review document formatting with team

| Milestone | Target Date | Status |
| :--- | :--- | :--- |
| Alpha Release | Oct 15 | Complete |
| Beta Review | Nov 01 | In Progress |
| Public Launch | Nov 20 | Pending |

> *"Simplicity is the prerequisite for reliability."*
> — Edsger W. Dijkstra

\`\`\`javascript
// Quick code example
function greet(name) {
  return \`Hello, \${name}! Welcome to MintTools.\`;
}
console.log(greet('Developer'));
\`\`\`
`;

export default function MarkdownEditor({ showToast, onBackToDashboard }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('minttools_saved_markdown');
      return saved !== null ? saved : SAMPLE_MARKDOWN;
    } catch {
      return SAMPLE_MARKDOWN;
    }
  });

  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('minttools_saved_markdown', content);
    } catch (e) {
      console.warn(e);
    }
  }, [content]);

  // Insert markdown tag helper
  const insertSyntax = (prefix, suffix = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 20);
  };

  // Export to Vector PDF via Browser Print
  const handleExportPDF = () => {
    const htmlBody = sanitizeHtml(marked.parse(content));

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      if (showToast) showToast('Please allow popups to export PDF', 'error');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 18mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
      font-size: 11pt;
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      page-break-after: avoid;
    }
    h1 { font-size: 20pt; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-top: 0; }
    h2 { font-size: 15pt; margin-top: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    h3 { font-size: 12.5pt; margin-top: 16px; }
    p, ul, ol { margin-top: 0; margin-bottom: 12px; }
    ul, ol { padding-left: 24px; }
    li { margin-bottom: 4px; }
    blockquote {
      border-left: 3.5px solid #6366f1;
      padding-left: 14px;
      color: #475569;
      margin: 14px 0;
      font-style: italic;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 9.5pt;
      overflow-x: auto;
      font-family: "Courier New", Courier, monospace;
      page-break-inside: avoid;
    }
    code {
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 9.5pt;
      font-family: "Courier New", Courier, monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 18px 0;
    }
  </style>
</head>
<body>
  ${htmlBody}
  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 500);
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
    if (showToast) showToast('Opening print dialog to save as PDF...', 'success');
  };

  // Download raw markdown .md
  const handleDownloadMD = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `document_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (showToast) showToast('Downloaded Markdown file (.md)', 'success');
  };

  // Download standalone HTML
  const handleDownloadHTML = () => {
    const htmlBody = sanitizeHtml(marked.parse(content));
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #334155; }
    h1, h2, h3 { color: #0f172a; }
    pre { background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
    blockquote { border-left: 4px solid #6366f1; padding-left: 12px; margin: 0; color: #64748b; }
  </style>
</head>
<body>${htmlBody}</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `document_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (showToast) showToast('Downloaded HTML file (.html)', 'success');
  };

  // Copy Markdown text
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showToast) showToast('Copied Markdown to clipboard!', 'success');
  };

  // Word count metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="tool-view-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Markdown Editor
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Live Markdown editor with real-time preview and 1-click vector PDF export.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* View Toggles */}
          <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              className={`tool-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => setViewMode('edit')}
              style={{ padding: '0.35rem 0.65rem' }}
              title="Editor Only"
            >
              <Code size={13} />
              <span>Edit</span>
            </button>
            <button
              className={`tool-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
              style={{ padding: '0.35rem 0.65rem' }}
              title="Split View"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              className={`tool-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
              style={{ padding: '0.35rem 0.65rem' }}
              title="Preview Only"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {/* Export Actions */}
          <button className="tool-btn btn-primary" onClick={handleExportPDF} style={{ padding: '0.45rem 0.85rem' }}>
            <Printer size={14} />
            <span>Export PDF</span>
          </button>

          <button className="tool-btn" onClick={handleDownloadMD} style={{ padding: '0.45rem 0.75rem' }} title="Download .md">
            <Download size={14} />
            <span>.MD</span>
          </button>

          <button className="tool-btn" onClick={handleCopy} style={{ padding: '0.45rem 0.75rem' }} title="Copy Markdown">
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
          </button>

          {onBackToDashboard && (
            <button className="tool-btn" onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.06)' }}>
              <span>← All Tools</span>
            </button>
          )}
        </div>
      </div>

      {/* Formatting Quick Toolbar (only in edit or split mode) */}
      {viewMode !== 'preview' && (
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          padding: '0.45rem 0.65rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '0.85rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('**', '**', 'bold text')} title="Bold">
            <Bold size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('*', '*', 'italic text')} title="Italic">
            <Italic size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('# ', '', 'Heading 1')} title="Heading 1">
            <Heading1 size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('## ', '', 'Heading 2')} title="Heading 2">
            <Heading2 size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('- ', '', 'List item')} title="Bullet List">
            <List size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('- [ ] ', '', 'Task')} title="Task Item">
            <CheckSquare size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('> ', '', 'Quote')} title="Blockquote">
            <Quote size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('`', '`', 'code')} title="Inline Code">
            <Code size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n')} title="Table">
            <Table size={13} />
          </button>
          <button className="tool-btn" style={{ padding: '0.3rem 0.5rem' }} onClick={() => insertSyntax('[', '](https://example.com)', 'Link Text')} title="Link">
            <Link size={13} />
          </button>

          <div style={{ marginLeft: 'auto', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            {wordCount} words • {charCount} chars
          </div>
        </div>
      )}

      {/* Editor & Preview Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '1rem',
        minHeight: '520px'
      }}>
        {/* Editor Pane */}
        {viewMode !== 'preview' && (
          <div className="tool-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your markdown here..."
              style={{
                width: '100%',
                flex: 1,
                minHeight: '480px',
                padding: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {viewMode !== 'edit' && (
          <div
            className="tool-card"
            style={{
              padding: '1.5rem',
              overflowY: 'auto',
              maxHeight: '600px',
              background: 'var(--bg-surface-raised)'
            }}
          >
            <div
              ref={previewRef}
              className="markdown-rendered-body"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked.parse(content || '*No content yet.*')) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
