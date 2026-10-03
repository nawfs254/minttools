'use client';
import React, { useState } from 'react';
import { Loader2,
  FileText,
  FileDown,
  Layers,
  FileImage,
  BookOpen,
  Key,
  QrCode,
  ScanLine,
  Barcode,
  Image as ImageIcon,
  ShieldCheck,
  Sliders,
  Terminal,
  ArrowRight
} from 'lucide-react';

export default function HomeDashboard({ onSelectTool }) {
  const [navigatingId, setNavigatingId] = useState(null);

  const handleToolClick = (toolId) => {
    setNavigatingId(toolId);
    onSelectTool(toolId);
  };
  const tools = [
    {
      id: 'pdf',
      title: 'PDF Editor',
      desc: 'Edit text, whiteout & annotations',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      glow: 'rgba(99, 102, 241, 0.35)',
    },
    {
      id: 'pdf-compress',
      title: 'PDF Compressor',
      desc: 'Reduce file size with high clarity',
      icon: FileDown,
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      glow: 'rgba(236, 72, 153, 0.35)',
    },
    {
      id: 'pdf-merge',
      title: 'PDF Merge & Split',
      desc: 'Merge multiple PDFs & extract page ranges',
      icon: Layers,
      gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
      glow: 'rgba(139, 92, 246, 0.35)',
    },
    {
      id: 'image-pdf',
      title: 'Image & PDF',
      desc: 'Convert images to PDF or PDF to images',
      icon: FileImage,
      gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
      glow: 'rgba(14, 165, 233, 0.35)',
    },
    {
      id: 'image',
      title: 'Image Studio',
      desc: 'Compress, resize & convert format',
      icon: ImageIcon,
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
      glow: 'rgba(168, 85, 247, 0.35)',
    },
    {
      id: 'exif-cleaner',
      title: 'EXIF Cleaner',
      desc: 'Scrub GPS & camera metadata from photos',
      icon: ShieldCheck,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      glow: 'rgba(16, 185, 129, 0.35)',
    },
    {
      id: 'barcode',
      title: 'Barcode Studio',
      desc: 'Create Code 128, EAN-13 & UPC barcodes',
      icon: Barcode,
      gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
      glow: 'rgba(100, 116, 139, 0.35)',
    },
    {
      id: 'qr',
      title: 'QR Studio',
      desc: 'Create, customize & save QR codes',
      icon: QrCode,
      gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
      glow: 'rgba(6, 182, 212, 0.35)',
    },
    {
      id: 'qr-reader',
      title: 'QR Reader',
      desc: 'Scan QR from image, camera or clipboard',
      icon: ScanLine,
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      glow: 'rgba(2, 132, 199, 0.35)',
    },
    {
      id: 'markdown',
      title: 'Markdown Editor',
      desc: 'Live preview & 1-click vector PDF export',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    {
      id: 'password',
      title: 'Password Generator',
      desc: 'Strong passwords & readable passphrases',
      icon: Key,
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
      glow: 'rgba(5, 150, 105, 0.35)',
    },
    {
      id: 'converter',
      title: 'Dev Converter',
      desc: 'Data sizes, CSS units, colors & Unix time',
      icon: Sliders,
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      glow: 'rgba(249, 115, 22, 0.35)',
    },
    {
      id: 'dev',
      title: 'Dev Tools',
      desc: 'JSON format, Base64 & hash tools',
      icon: Terminal,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      glow: 'rgba(245, 158, 11, 0.35)',
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Simple Clean Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Tools
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
          Select a tool to get started
        </p>
      </div>

      {/* Simple Tool Cards Grid */}
      <section className="tools-compact-section">
        <div className="tools-compact-grid">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`tool-small-box ${navigatingId === tool.id ? 'is-navigating' : ''}`}
                onClick={() => handleToolClick(tool.id)}
                style={{ '--box-glow': tool.glow }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectTool(tool.id);
                }}
              >
                <div className="small-box-icon" style={{ background: tool.gradient }}>
                  <Icon size={20} color="#ffffff" />
                </div>
                <div className="small-box-content">
                  <h3 className="small-box-title">{tool.title}</h3>
                  <p className="small-box-tagline">{tool.desc}</p>
                </div>
                <div className="small-box-arrow">
                  {navigatingId === tool.id ? (
                    <Loader2 size={16} className="tool-spin-icon" />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
