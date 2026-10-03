'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import confetti from 'canvas-confetti';
import {
  MousePointer,
  Square,
  Type,
  Edit3,
  PenTool,
  Highlighter,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Trash2,
  RotateCw,
  Download,
  UploadCloud,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  Bold,
  Italic,
  Sparkles
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Helper to determine exact canvas font CSS
function getCanvasFontCSS(fontKey = 'Helvetica', size = 12, isBold = false, isItalic = false) {
  const b = isBold || (fontKey && fontKey.includes('Bold'));
  const it = isItalic || (fontKey && (fontKey.includes('Italic') || fontKey.includes('Oblique')));
  const weight = b ? 'bold ' : 'normal ';
  const style = it ? 'italic ' : 'normal ';
  
  let family = 'Arial, Helvetica, -apple-system, sans-serif';
  if (fontKey && (fontKey.startsWith('Times') || fontKey === 'serif')) {
    family = '"Times New Roman", Times, Georgia, serif';
  } else if (fontKey && (fontKey.startsWith('Courier') || fontKey === 'monospace')) {
    family = '"Courier New", Courier, monospace';
  }
  return `${style}${weight}${size}px ${family}`;
}

// Detect font style category, weight, and size from PDF.js item and styles map
function detectFontDetails(item, stylesMap) {
  const style = (stylesMap && item.fontName && stylesMap[item.fontName]) || {};
  const fontNameStr = (item.fontName || '').toLowerCase();
  const fontFamilyStr = (style.fontFamily || '').toLowerCase();
  const combined = `${fontNameStr} ${fontFamilyStr}`.trim();

  // Check for bold and italic
  const isBold = /bold|black|heavy|w[6-9]|700|800|900/i.test(combined);
  const isItalic = /italic|oblique|slanted/i.test(combined);

  let fontCategory = 'sans-serif';
  let fontKey = isBold ? (isItalic ? 'Helvetica-BoldOblique' : 'Helvetica-Bold') : (isItalic ? 'Helvetica-Oblique' : 'Helvetica');
  let cssFamily = 'Arial, Helvetica, -apple-system, sans-serif';
  let displayName = 'Arial / Helvetica (Sans-Serif)';

  if (/courier|mono|consolas|menlo|monaco|code|fixed/i.test(combined)) {
    fontCategory = 'monospace';
    fontKey = isBold ? (isItalic ? 'Courier-BoldOblique' : 'Courier-Bold') : (isItalic ? 'Courier-Oblique' : 'Courier');
    cssFamily = '"Courier New", Courier, monospace';
    displayName = 'Courier New (Monospace)';
  } else if (/sans|helvetica|arial|calibri|trebuchet|verdana|roboto|segoe|noto/i.test(combined)) {
    // Specifically sans-serif (matches 'sans-serif', 'ArialMT', etc.)
    fontCategory = 'sans-serif';
    fontKey = isBold ? (isItalic ? 'Helvetica-BoldOblique' : 'Helvetica-Bold') : (isItalic ? 'Helvetica-Oblique' : 'Helvetica');
    cssFamily = 'Arial, Helvetica, -apple-system, sans-serif';
    displayName = 'Arial / Helvetica (Sans-Serif)';
  } else if (/times|roman|garamond|georgia|cambria|minion|baskerville|palatino|century|bookman/i.test(combined) || (/\bserif\b/i.test(combined) && !/sans/i.test(combined))) {
    // Specifically serif (Times New Roman, Georgia, Serif etc. without sans)
    fontCategory = 'serif';
    fontKey = isBold ? (isItalic ? 'Times-BoldItalic' : 'Times-Bold') : (isItalic ? 'Times-Italic' : 'Times-Roman');
    cssFamily = '"Times New Roman", Times, Georgia, serif';
    displayName = 'Times New Roman (Serif)';
  }

  const tx = item.transform || [12, 0, 0, 12, 0, 0];
  const ptSize = Math.hypot(tx[0], tx[1]) || Math.abs(tx[3]) || 12;

  return {
    fontCategory,
    fontKey,
    cssFamily,
    displayName,
    isBold,
    isItalic,
    ptSize: Math.round(ptSize * 10) / 10,
    rawName: style.fontFamily || item.fontName || 'Auto-Detected'
  };
}

export default function PDFEditor({ showToast, onBackToDashboard }) {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [filename, setFilename] = useState('document.pdf');
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [zoomScale, setZoomScale] = useState(1.25);
  const [currentTool, setCurrentTool] = useState('editText'); // default to direct text editing!
  const [isExporting, setIsExporting] = useState(false);

  // Global styling defaults
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(12);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(2);

  // Extracted text items from the underlying PDF page
  const [pdfTextItems, setPdfTextItems] = useState([]);
  const [hoveredPdfText, setHoveredPdfText] = useState(null);

  // Active Text Editing Popover / Modal state
  const [textEditModal, setTextEditModal] = useState(null);

  // Annotations & Page metadata
  const [annotations, setAnnotations] = useState(new Map());
  const [pageRotations, setPageRotations] = useState(new Map());
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  // Canvas Refs
  const bgCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const stageWrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const thumbListRef = useRef(null);
  const editInputRef = useRef(null);

  // Interaction State Ref
  const stateRef = useRef({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentPath: [],
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
  });

  const getPageAnnotations = useCallback((pageNum) => {
    return annotations.get(pageNum) || [];
  }, [annotations]);

  // Load PDF file from File or ArrayBuffer
  const loadPDFBuffer = async (buffer, name) => {
    try {
      setPdfBytes(buffer);
      setFilename(name || 'document.pdf');
      setAnnotations(new Map());
      setPageRotations(new Map());
      setHistory([]);
      setHistoryIdx(-1);
      setSelectedAnnotation(null);
      setTextEditModal(null);

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const loadedDoc = await loadingTask.promise;
      setPdfDoc(loadedDoc);
      setTotalPageCount(loadedDoc.numPages);
      setCurrentPageNum(1);

      showToast(`Loaded ${name} (${loadedDoc.numPages} pages)`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error loading PDF: ' + err.message, 'error');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      loadPDFBuffer(evt.target.result, file.name);
    };
    reader.readAsArrayBuffer(file);
  };



  // Render Thumbnails
  useEffect(() => {
    if (!pdfDoc || !thumbListRef.current) return;
    const renderThumbs = async () => {
      thumbListRef.current.innerHTML = '';
      for (let p = 1; p <= totalPageCount; p++) {
        const page = await pdfDoc.getPage(p);
        const viewport = page.getViewport({ scale: 0.18 });

        const card = document.createElement('div');
        card.className = `page-thumb-card ${p === currentPageNum ? 'active' : ''}`;
        card.dataset.pageNum = p;

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = viewport.width;
        thumbCanvas.height = viewport.height;
        const ctx = thumbCanvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const num = document.createElement('div');
        num.className = 'thumb-number';
        num.textContent = `Page ${p}`;

        card.appendChild(thumbCanvas);
        card.appendChild(num);

        card.onclick = () => {
          setCurrentPageNum(p);
          setTextEditModal(null);
        };
        thumbListRef.current.appendChild(card);
      }
    };
    renderThumbs();
  }, [pdfDoc, totalPageCount, currentPageNum]);

  // Render main viewport page
  useEffect(() => {
    if (!pdfDoc || !bgCanvasRef.current || !overlayCanvasRef.current) return;

    let isCancelled = false;
    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPageNum);
      const rot = (page.rotate + (pageRotations.get(currentPageNum) || 0)) % 360;
      const viewport = page.getViewport({ scale: zoomScale, rotation: rot });

      if (isCancelled) return;

      const bgCanvas = bgCanvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const dpr = window.devicePixelRatio || 1;

      bgCanvas.width = Math.floor(viewport.width * dpr);
      bgCanvas.height = Math.floor(viewport.height * dpr);
      bgCanvas.style.width = `${viewport.width}px`;
      bgCanvas.style.height = `${viewport.height}px`;

      overlayCanvas.width = Math.floor(viewport.width * dpr);
      overlayCanvas.height = Math.floor(viewport.height * dpr);
      overlayCanvas.style.width = `${viewport.width}px`;
      overlayCanvas.style.height = `${viewport.height}px`;

      const ctx = bgCanvas.getContext('2d');
      ctx.save();
      ctx.scale(dpr, dpr);
      await page.render({ canvasContext: ctx, viewport }).promise;
      ctx.restore();

      // Extract text content items for in-place text editing!
      try {
        const textContent = await page.getTextContent();
        const items = [];
        for (const it of textContent.items) {
          if (it.str && it.str.trim()) {
            const tx = it.transform;
            const pt = viewport.convertToViewportPoint(tx[4], tx[5]);
            const fontInfo = detectFontDetails(it, textContent.styles);
            const fontHeight = Math.abs(tx[0] || tx[3] || 12) * zoomScale;
            const w = it.width * zoomScale;
            items.push({
              str: it.str,
              x: pt[0],
              y: pt[1] - (fontHeight * 0.9),
              width: Math.max(w, 8),
              height: Math.max(fontHeight * 1.15, 12),
              baselineY: pt[1],
              fontHeight: Math.round(fontHeight),
              fontPtSize: fontInfo.ptSize,
              fontName: it.fontName,
              fontInfo
            });
          }
        }
        setPdfTextItems(items);
      } catch (err) {
        console.warn('Could not extract text items:', err);
      }

      drawAnnotations();
    };

    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPageNum, zoomScale, pageRotations]);

  // Draw overlay annotations
  const drawAnnotations = useCallback(() => {
    if (!overlayCanvasRef.current) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const list = getPageAnnotations(currentPageNum);

    for (const ann of list) {
      ctx.save();

      if (ann.type === 'whiteout' || ann.type === 'rect') {
        if (ann.fill) {
          ctx.fillStyle = ann.fill;
          ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
        }
        if (ann.stroke && ann.strokeWidth) {
          ctx.strokeStyle = ann.stroke;
          ctx.lineWidth = ann.strokeWidth;
          ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
        }
      } else if (ann.type === 'text') {
        if (ann.fill) {
          ctx.fillStyle = ann.fill;
          ctx.fillRect(ann.x - 2, ann.y - ann.size, ann.width + 4, ann.size * 1.3);
        }
        ctx.font = getCanvasFontCSS(ann.font, ann.size, ann.bold, ann.italic);
        ctx.fillStyle = ann.color || '#000000';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(ann.text, ann.x, ann.y);
      } else if (ann.type === 'draw' || ann.type === 'highlight') {
        if (ann.points && ann.points.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = ann.stroke || (ann.type === 'highlight' ? 'rgba(253, 224, 71, 0.45)' : '#000000');
          ctx.lineWidth = ann.strokeWidth || (ann.type === 'highlight' ? 14 : 2);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(ann.points[0].x, ann.points[0].y);
          for (let i = 1; i < ann.points.length; i++) {
            ctx.lineTo(ann.points[i].x, ann.points[i].y);
          }
          ctx.stroke();
        }
      } else if (ann.type === 'image' && ann.imgElement) {
        ctx.drawImage(ann.imgElement, ann.x, ann.y, ann.width, ann.height);
      }

      // Draw dashed selection ring if selected
      if (selectedAnnotation === ann) {
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        const b = getAnnotationBounds(ann);
        ctx.strokeRect(b.x - 3, b.y - 3, b.width + 6, b.height + 6);
      }

      ctx.restore();
    }

    // Active target highlight when editing text in modal
    if (textEditModal) {
      const targetX = textEditModal.x ?? 0;
      const targetY = textEditModal.y ?? 0;
      const targetW = textEditModal.width || 40;
      const targetH = textEditModal.height || 20;

      ctx.save();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(targetX - 2, targetY - 2, targetW + 4, targetH + 4);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.fillRect(targetX - 2, targetY - 2, targetW + 4, targetH + 4);
      ctx.restore();
    }

    // Hover outline for PDF text item when in 'editText' mode
    if (currentTool === 'editText' && hoveredPdfText && !textEditModal) {
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(hoveredPdfText.x - 2, hoveredPdfText.y - 2, hoveredPdfText.width + 4, hoveredPdfText.height + 4);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(hoveredPdfText.x - 2, hoveredPdfText.y - 2, hoveredPdfText.width + 4, hoveredPdfText.height + 4);
      ctx.restore();
    }

    ctx.restore();
  }, [currentPageNum, getPageAnnotations, selectedAnnotation, currentTool, hoveredPdfText, textEditModal]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations, annotations, hoveredPdfText, textEditModal]);

  const getAnnotationBounds = (ann) => {
    if (ann.type === 'whiteout' || ann.type === 'rect' || ann.type === 'image') {
      return { x: ann.x, y: ann.y, width: ann.width, height: ann.height };
    }
    if (ann.type === 'text') {
      const w = ann.width || (ann.text.length * ann.size * 0.6);
      return { x: ann.x, y: ann.y - ann.size, width: w, height: ann.size * 1.3 };
    }
    if (ann.points && ann.points.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      ann.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  const getMousePos = (e) => {
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Open Smart In-Place Text Editor
  const openTextEdit = (config) => {
    setTextEditModal(config);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 50);
  };

  // Apply Changes from Smart Text Editor
  const handleApplyTextEdit = () => {
    if (!textEditModal) return;
    const {
      mode,
      targetItem,
      targetAnnotation,
      text,
      fontCategory,
      fontSizePt,
      bold,
      italic,
      color,
      whiteoutCover,
      x,
      baselineY
    } = textEditModal;

    const trimmedText = text.trim();
    if (!trimmedText) {
      setTextEditModal(null);
      return;
    }

    // Determine target PDF font key based on category, bold, and italic
    let pdfFontKey = 'Helvetica';
    if (fontCategory === 'serif') {
      if (bold && italic) pdfFontKey = 'Times-BoldItalic';
      else if (bold) pdfFontKey = 'Times-Bold';
      else if (italic) pdfFontKey = 'Times-Italic';
      else pdfFontKey = 'Times-Roman';
    } else if (fontCategory === 'monospace') {
      if (bold && italic) pdfFontKey = 'Courier-BoldOblique';
      else if (bold) pdfFontKey = 'Courier-Bold';
      else if (italic) pdfFontKey = 'Courier-Oblique';
      else pdfFontKey = 'Courier';
    } else {
      if (bold && italic) pdfFontKey = 'Helvetica-BoldOblique';
      else if (bold) pdfFontKey = 'Helvetica-Bold';
      else if (italic) pdfFontKey = 'Helvetica-Oblique';
      else pdfFontKey = 'Helvetica';
    }

    const screenFontSize = fontSizePt * zoomScale;
    const ctx = overlayCanvasRef.current.getContext('2d');
    ctx.font = getCanvasFontCSS(pdfFontKey, screenFontSize, bold, italic);
    const measuredWidth = ctx.measureText(trimmedText).width;

    if (mode === 'editAnnotation' && targetAnnotation) {
      targetAnnotation.text = trimmedText;
      targetAnnotation.font = pdfFontKey;
      targetAnnotation.size = screenFontSize;
      targetAnnotation.ptSize = fontSizePt;
      targetAnnotation.bold = bold;
      targetAnnotation.italic = italic;
      targetAnnotation.color = color;
      targetAnnotation.width = measuredWidth;
      setTextEditModal(null);
      drawAnnotations();
      showToast('Text updated!', 'success');
      return;
    }

    if (mode === 'replace' && targetItem) {
      let whiteoutAnn = null;
      if (whiteoutCover) {
        whiteoutAnn = {
          type: 'whiteout',
          x: targetItem.x - 2,
          y: targetItem.y - 2,
          width: targetItem.width + 4,
          height: targetItem.height + 4,
          fill: '#ffffff'
        };
      }

      const textAnn = {
        type: 'text',
        x: targetItem.x,
        y: targetItem.baselineY,
        text: trimmedText,
        font: pdfFontKey,
        size: screenFontSize,
        ptSize: fontSizePt,
        color: color,
        bold: bold,
        italic: italic,
        width: measuredWidth
      };

      setAnnotations((prev) => {
        const next = new Map(prev);
        const list = [...(next.get(currentPageNum) || [])];
        if (whiteoutAnn) list.push(whiteoutAnn);
        list.push(textAnn);
        next.set(currentPageNum, list);
        return next;
      });

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIdx + 1);
        return [...sliced, {
          action: 'replaceText',
          pageNum: currentPageNum,
          whiteout: whiteoutAnn,
          text: textAnn
        }];
      });
      setHistoryIdx((prev) => prev + 1);

      setTextEditModal(null);
      showToast('Text replaced with matching font & style!', 'success');
      return;
    }

    // mode === 'add'
    const textAnn = {
      type: 'text',
      x: x,
      y: baselineY,
      text: trimmedText,
      font: pdfFontKey,
      size: screenFontSize,
      ptSize: fontSizePt,
      color: color,
      bold: bold,
      italic: italic,
      width: measuredWidth
    };

    setAnnotations((prev) => {
      const next = new Map(prev);
      const list = [...(next.get(currentPageNum) || [])];
      list.push(textAnn);
      next.set(currentPageNum, list);
      return next;
    });

    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      return [...sliced, { action: 'add', pageNum: currentPageNum, annotation: textAnn }];
    });
    setHistoryIdx((prev) => prev + 1);

    setTextEditModal(null);
    showToast('Text added to PDF!', 'success');
  };

  const handleCancelTextEdit = () => {
    setTextEditModal(null);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const s = stateRef.current;
    s.isDrawing = true;
    s.startX = pos.x;
    s.startY = pos.y;

    if (currentTool === 'editText') {
      // 1. Check if user clicked an existing text annotation
      const list = getPageAnnotations(currentPageNum);
      let clickedAnn = null;
      for (let i = list.length - 1; i >= 0; i--) {
        const ann = list[i];
        if (ann.type === 'text') {
          const b = getAnnotationBounds(ann);
          if (pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height) {
            clickedAnn = ann;
            break;
          }
        }
      }

      if (clickedAnn) {
        s.isDrawing = false;
        const b = getAnnotationBounds(clickedAnn);
        openTextEdit({
          mode: 'editAnnotation',
          targetAnnotation: clickedAnn,
          originalText: clickedAnn.text,
          text: clickedAnn.text,
          fontCategory: clickedAnn.font.startsWith('Times') ? 'serif' : clickedAnn.font.startsWith('Courier') ? 'monospace' : 'sans-serif',
          fontSizePt: clickedAnn.ptSize || Math.round(clickedAnn.size / zoomScale),
          bold: clickedAnn.bold || clickedAnn.font.includes('Bold'),
          italic: clickedAnn.italic || false,
          color: clickedAnn.color || strokeColor,
          whiteoutCover: false,
          x: clickedAnn.x,
          y: b.y,
          width: b.width,
          height: b.height,
          baselineY: clickedAnn.y,
          badgeInfo: 'Custom Text Annotation'
        });
        return;
      }

      // 2. Check if user clicked an original PDF text item to replace it!
      const hitPdfText = pdfTextItems.find(
        (it) => pos.x >= it.x && pos.x <= it.x + it.width && pos.y >= it.y && pos.y <= it.y + it.height
      );

      if (hitPdfText) {
        s.isDrawing = false;
        openTextEdit({
          mode: 'replace',
          targetItem: hitPdfText,
          originalText: hitPdfText.str,
          text: hitPdfText.str,
          fontCategory: hitPdfText.fontInfo.fontCategory,
          fontSizePt: hitPdfText.fontPtSize || Math.round(hitPdfText.fontHeight / zoomScale),
          bold: hitPdfText.fontInfo.isBold,
          italic: hitPdfText.fontInfo.isItalic,
          color: '#000000',
          whiteoutCover: true,
          x: hitPdfText.x,
          y: hitPdfText.y,
          width: hitPdfText.width,
          height: hitPdfText.height,
          baselineY: hitPdfText.baselineY,
          badgeInfo: `${hitPdfText.fontInfo.displayName} • ${hitPdfText.fontPtSize}pt`
        });
        return;
      }

      // 3. Clicked blank space: add new text
      s.isDrawing = false;
      const cat = fontFamily.startsWith('Times') ? 'serif' : fontFamily.startsWith('Courier') ? 'monospace' : 'sans-serif';
      const screenH = fontSize * zoomScale;
      openTextEdit({
        mode: 'add',
        targetItem: null,
        originalText: '',
        text: '',
        fontCategory: cat,
        fontSizePt: fontSize,
        bold: fontFamily.includes('Bold'),
        italic: false,
        color: strokeColor,
        whiteoutCover: false,
        x: pos.x,
        y: pos.y,
        width: 120,
        height: screenH,
        baselineY: pos.y + (screenH * 0.8),
        badgeInfo: 'New Text Placement'
      });
      return;
    }

    if (currentTool === 'select') {
      const list = getPageAnnotations(currentPageNum);
      let hit = null;
      for (let i = list.length - 1; i >= 0; i--) {
        const ann = list[i];
        const b = getAnnotationBounds(ann);
        if (pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height) {
          hit = ann;
          break;
        }
      }
      setSelectedAnnotation(hit);
      if (hit) {
        s.isDragging = true;
        s.dragOffsetX = pos.x - hit.x;
        s.dragOffsetY = pos.y - hit.y;
      }
    } else if (currentTool === 'text') {
      s.isDrawing = false;
      const cat = fontFamily.startsWith('Times') ? 'serif' : fontFamily.startsWith('Courier') ? 'monospace' : 'sans-serif';
      const screenH = fontSize * zoomScale;
      openTextEdit({
        mode: 'add',
        targetItem: null,
        originalText: '',
        text: '',
        fontCategory: cat,
        fontSizePt: fontSize,
        bold: fontFamily.includes('Bold'),
        italic: false,
        color: strokeColor,
        whiteoutCover: false,
        x: pos.x,
        y: pos.y,
        width: 120,
        height: screenH,
        baselineY: pos.y + (screenH * 0.8),
        badgeInfo: 'New Text Placement'
      });
    } else if (currentTool === 'draw' || currentTool === 'highlight') {
      setSelectedAnnotation(null);
      s.currentPath = [{ x: pos.x, y: pos.y }];
    } else {
      setSelectedAnnotation(null);
    }
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    const s = stateRef.current;

    // Detect hovered text for instant visual feedback in editText mode
    if (currentTool === 'editText' && !s.isDrawing && !textEditModal) {
      const hitPdfText = pdfTextItems.find(
        (it) => pos.x >= it.x && pos.x <= it.x + it.width && pos.y >= it.y && pos.y <= it.y + it.height
      );
      setHoveredPdfText(hitPdfText || null);
    }

    if (!s.isDrawing) return;

    if (currentTool === 'select' && s.isDragging && selectedAnnotation) {
      selectedAnnotation.x = pos.x - s.dragOffsetX;
      selectedAnnotation.y = pos.y - s.dragOffsetY;
      drawAnnotations();
    } else if (currentTool === 'whiteout' || currentTool === 'rect') {
      drawAnnotations();
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = pos.x - s.startX;
      const h = pos.y - s.startY;

      if (currentTool === 'whiteout') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.startX, s.startY, w, h);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.startX, s.startY, w, h);
      } else {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(s.startX, s.startY, w, h);
      }
      ctx.restore();
    } else if (currentTool === 'draw' || currentTool === 'highlight') {
      s.currentPath.push({ x: pos.x, y: pos.y });
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.strokeStyle = currentTool === 'highlight' ? 'rgba(253, 224, 71, 0.45)' : strokeColor;
      ctx.lineWidth = currentTool === 'highlight' ? 14 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const p1 = s.currentPath[s.currentPath.length - 2];
      const p2 = s.currentPath[s.currentPath.length - 1];
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handleMouseUp = (e) => {
    const s = stateRef.current;
    if (!s.isDrawing) return;
    s.isDrawing = false;
    const pos = getMousePos(e);

    if (currentTool === 'whiteout') {
      const w = pos.x - s.startX;
      const h = pos.y - s.startY;
      if (Math.abs(w) > 4 && Math.abs(h) > 4) {
        addAnnotation({
          type: 'whiteout',
          x: w > 0 ? s.startX : pos.x,
          y: h > 0 ? s.startY : pos.y,
          width: Math.abs(w),
          height: Math.abs(h),
          fill: '#ffffff'
        });
      }
    } else if (currentTool === 'rect') {
      const w = pos.x - s.startX;
      const h = pos.y - s.startY;
      if (Math.abs(w) > 4 && Math.abs(h) > 4) {
        addAnnotation({
          type: 'rect',
          x: w > 0 ? s.startX : pos.x,
          y: h > 0 ? s.startY : pos.y,
          width: Math.abs(w),
          height: Math.abs(h),
          stroke: strokeColor,
          strokeWidth: lineWidth,
          fill: null
        });
      }
    } else if (currentTool === 'draw' || currentTool === 'highlight') {
      if (s.currentPath.length > 1) {
        addAnnotation({
          type: currentTool,
          points: [...s.currentPath],
          stroke: currentTool === 'highlight' ? 'rgba(253, 224, 71, 0.45)' : strokeColor,
          strokeWidth: currentTool === 'highlight' ? 14 : lineWidth
        });
      }
      s.currentPath = [];
    }

    s.isDragging = false;
    drawAnnotations();
  };

  const addAnnotation = (ann) => {
    setAnnotations((prev) => {
      const next = new Map(prev);
      const list = [...(next.get(currentPageNum) || [])];
      list.push(ann);
      next.set(currentPageNum, list);
      return next;
    });

    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      return [...sliced, { action: 'add', pageNum: currentPageNum, annotation: ann }];
    });
    setHistoryIdx((prev) => prev + 1);
  };

  const deleteSelected = () => {
    if (!selectedAnnotation) return;
    setAnnotations((prev) => {
      const next = new Map(prev);
      const list = (next.get(currentPageNum) || []).filter((a) => a !== selectedAnnotation);
      next.set(currentPageNum, list);
      return next;
    });

    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      return [...sliced, { action: 'delete', pageNum: currentPageNum, annotation: selectedAnnotation }];
    });
    setHistoryIdx((prev) => prev + 1);
    setSelectedAnnotation(null);
    showToast('Item deleted', 'success');
  };

  const undo = () => {
    if (historyIdx < 0) return;
    const entry = history[historyIdx];
    setAnnotations((prev) => {
      const next = new Map(prev);
      const list = [...(next.get(entry.pageNum) || [])];
      if (entry.action === 'add') {
        const idx = list.indexOf(entry.annotation);
        if (idx !== -1) list.splice(idx, 1);
      } else if (entry.action === 'delete') {
        list.push(entry.annotation);
      } else if (entry.action === 'replaceText') {
        if (entry.whiteout) {
          const wIdx = list.indexOf(entry.whiteout);
          if (wIdx !== -1) list.splice(wIdx, 1);
        }
        if (entry.text) {
          const tIdx = list.indexOf(entry.text);
          if (tIdx !== -1) list.splice(tIdx, 1);
        }
      }
      next.set(entry.pageNum, list);
      return next;
    });
    setHistoryIdx((prev) => prev - 1);
  };

  const redo = () => {
    if (historyIdx >= history.length - 1) return;
    const nextIdx = historyIdx + 1;
    const entry = history[nextIdx];
    setAnnotations((prev) => {
      const next = new Map(prev);
      const list = [...(next.get(entry.pageNum) || [])];
      if (entry.action === 'add') {
        list.push(entry.annotation);
      } else if (entry.action === 'delete') {
        const idx = list.indexOf(entry.annotation);
        if (idx !== -1) list.splice(idx, 1);
      } else if (entry.action === 'replaceText') {
        if (entry.whiteout) list.push(entry.whiteout);
        if (entry.text) list.push(entry.text);
      }
      next.set(entry.pageNum, list);
      return next;
    });
    setHistoryIdx(nextIdx);
  };

  const handleInsertImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > 160) {
          h = (160 / w) * h;
          w = 160;
        }

        const ann = {
          type: 'image',
          x: 100,
          y: 100,
          width: w,
          height: h,
          dataUrl,
          imgElement: img,
        };
        addAnnotation(ann);
        setSelectedAnnotation(ann);
        showToast('Image inserted. Drag to place!', 'success');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const rotateCurrentPage = () => {
    setPageRotations((prev) => {
      const next = new Map(prev);
      const current = next.get(currentPageNum) || 0;
      next.set(currentPageNum, (current + 90) % 360);
      return next;
    });
    showToast('Page rotated 90°', 'success');
  };

  // Export PDF with PDF-lib (Client-Side Vector Export)
  const handleExportPDF = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);
    showToast('Compiling vector PDF client-side...', 'success');

    try {
      const doc = await PDFDocument.load(pdfBytes);
      const fonts = {
        'Helvetica': await doc.embedFont(StandardFonts.Helvetica),
        'Helvetica-Bold': await doc.embedFont(StandardFonts.HelveticaBold),
        'Helvetica-Oblique': await doc.embedFont(StandardFonts.HelveticaOblique),
        'Helvetica-BoldOblique': await doc.embedFont(StandardFonts.HelveticaBoldOblique),
        'Times-Roman': await doc.embedFont(StandardFonts.TimesRoman),
        'Times-Bold': await doc.embedFont(StandardFonts.TimesRomanBold),
        'Times-Italic': await doc.embedFont(StandardFonts.TimesRomanItalic),
        'Times-BoldItalic': await doc.embedFont(StandardFonts.TimesRomanBoldItalic),
        'Courier': await doc.embedFont(StandardFonts.Courier),
        'Courier-Bold': await doc.embedFont(StandardFonts.CourierBold),
        'Courier-Oblique': await doc.embedFont(StandardFonts.CourierOblique),
        'Courier-BoldOblique': await doc.embedFont(StandardFonts.CourierBoldOblique),
      };

      const scale = zoomScale;

      for (let p = 1; p <= doc.getPageCount(); p++) {
        const page = doc.getPage(p - 1);
        const { width: pWidth, height: pHeight } = page.getSize();

        // Apply rotation if any
        if (pageRotations.has(p)) {
          const addRot = pageRotations.get(p);
          const currentRot = page.getRotation().angle;
          page.setRotation(degrees((currentRot + addRot) % 360));
        }

        const pageAnnList = annotations.get(p) || [];
        for (const ann of pageAnnList) {
          if (ann.type === 'whiteout' || ann.type === 'rect') {
            const w = ann.width / scale;
            const h = ann.height / scale;
            const x = ann.x / scale;
            const y = pHeight - (ann.y / scale) - h;

            const opts = { x, y, width: w, height: h };
            if (ann.fill) {
              const hex = ann.fill;
              opts.color = rgb(
                parseInt(hex.slice(1, 3), 16) / 255,
                parseInt(hex.slice(3, 5), 16) / 255,
                parseInt(hex.slice(5, 7), 16) / 255
              );
            }
            if (ann.stroke && ann.strokeWidth) {
              const hex = ann.stroke;
              opts.borderColor = rgb(
                parseInt(hex.slice(1, 3), 16) / 255,
                parseInt(hex.slice(3, 5), 16) / 255,
                parseInt(hex.slice(5, 7), 16) / 255
              );
              opts.borderWidth = ann.strokeWidth / scale;
            }
            page.drawRectangle(opts);
          } else if (ann.type === 'text') {
            const embeddedFont = fonts[ann.font] || fonts['Helvetica'];
            const fSize = ann.ptSize || (ann.size / scale);
            const x = ann.x / scale;
            // Baseline position in PDF coords
            const y = pHeight - (ann.y / scale);

            const hex = ann.color || '#000000';
            const color = rgb(
              parseInt(hex.slice(1, 3), 16) / 255,
              parseInt(hex.slice(3, 5), 16) / 255,
              parseInt(hex.slice(5, 7), 16) / 255
            );

            page.drawText(ann.text, {
              x,
              y,
              size: fSize,
              font: embeddedFont,
              color
            });
          } else if (ann.type === 'draw' || ann.type === 'highlight') {
            if (ann.points && ann.points.length > 1) {
              const isHighlight = ann.type === 'highlight';
              const strokeCol = isHighlight ? rgb(0.99, 0.88, 0.28) : rgb(0.1, 0.1, 0.1);
              const thickness = (ann.strokeWidth || (isHighlight ? 14 : 2)) / scale;

              for (let i = 0; i < ann.points.length - 1; i++) {
                const p1 = ann.points[i];
                const p2 = ann.points[i + 1];
                page.drawLine({
                  start: { x: p1.x / scale, y: pHeight - (p1.y / scale) },
                  end: { x: p2.x / scale, y: pHeight - (p2.y / scale) },
                  thickness,
                  color: strokeCol,
                  opacity: isHighlight ? 0.45 : 1
                });
              }
            }
          } else if (ann.type === 'image' && ann.dataUrl) {
            let embeddedImg;
            if (ann.dataUrl.startsWith('data:image/png')) {
              embeddedImg = await doc.embedPng(ann.dataUrl);
            } else {
              embeddedImg = await doc.embedJpg(ann.dataUrl);
            }
            const w = ann.width / scale;
            const h = ann.height / scale;
            const x = ann.x / scale;
            const y = pHeight - (ann.y / scale) - h;

            page.drawImage(embeddedImg, {
              x,
              y,
              width: w,
              height: h
            });
          }
        }
      }

      const modifiedPdfBytes = await doc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited_${filename}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('PDF compiled & downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="pdf-editor-wrapper">
      {/* Top Toolbar */}
      {pdfDoc && (
        <>
          <div className="pdf-toolbar">
            <div className="toolbar-group">
              {onBackToDashboard && (
                <button
                  className="tool-btn"
                  onClick={onBackToDashboard}
                  title="Return to Tools Dashboard"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <ArrowLeft size={14} />
                  <span>All Tools</span>
                </button>
              )}

              <div className="toolbar-divider" />

              {/* Direct In-Place Text Editing (Flagship Feature) */}
              <button
                className={`tool-btn ${currentTool === 'editText' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('editText');
                  setTextEditModal(null);
                }}
                title="Edit Text: Click on any existing text or number on the PDF to edit it directly with matched font!"
                style={{ borderColor: currentTool === 'editText' ? 'var(--accent-cyan)' : undefined }}
              >
                <Edit3 size={14} color={currentTool === 'editText' ? '#ffffff' : 'var(--accent-cyan)'} />
                <span><strong>Edit Text</strong></span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('select');
                  setTextEditModal(null);
                }}
                title="Select & Move Annotations"
              >
                <MousePointer size={14} />
                <span>Select</span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'whiteout' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('whiteout');
                  setTextEditModal(null);
                }}
                title="Whiteout / Mask: Hide existing fares, dates, or badges"
              >
                <Square size={14} />
                <span>Whiteout</span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'text' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('text');
                  setTextEditModal(null);
                }}
                title="Add New Text: Click anywhere on page"
              >
                <Type size={14} />
                <span>Add Text</span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'draw' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('draw');
                  setTextEditModal(null);
                }}
                title="Freehand Pen"
              >
                <PenTool size={14} />
                <span>Pen</span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'highlight' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('highlight');
                  setTextEditModal(null);
                }}
                title="Highlighter"
              >
                <Highlighter size={14} />
                <span>Highlight</span>
              </button>

              <button
                className={`tool-btn ${currentTool === 'rect' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTool('rect');
                  setTextEditModal(null);
                }}
                title="Draw Box / Outline"
              >
                <Square size={14} />
                <span>Box</span>
              </button>

              <label className="tool-btn" style={{ cursor: 'pointer' }} title="Add Signature / Stamp PNG">
                <ImageIcon size={14} />
                <span>Add Stamp</span>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleInsertImage}
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="toolbar-divider" />

            {/* History & Delete */}
            <div className="toolbar-group">
              <button className="tool-btn" onClick={undo} disabled={historyIdx < 0} title="Undo">
                <Undo2 size={14} />
              </button>
              <button className="tool-btn" onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo">
                <Redo2 size={14} />
              </button>
              <button
                className="tool-btn"
                onClick={deleteSelected}
                disabled={!selectedAnnotation}
                title="Delete selected item"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Pagination & Zoom */}
            <div className="toolbar-group">
              <button
                className="tool-btn"
                onClick={() => {
                  setCurrentPageNum((p) => Math.max(1, p - 1));
                  setTextEditModal(null);
                }}
                disabled={currentPageNum <= 1}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: '70px', textAlign: 'center' }}>
                {currentPageNum} / {totalPageCount}
              </span>
              <button
                className="tool-btn"
                onClick={() => {
                  setCurrentPageNum((p) => Math.min(totalPageCount, p + 1));
                  setTextEditModal(null);
                }}
                disabled={currentPageNum >= totalPageCount}
              >
                <ChevronRight size={14} />
              </button>

              <div className="toolbar-divider" />

              <button
                className="tool-btn"
                onClick={() => {
                  setZoomScale((s) => Math.max(0.5, s - 0.25));
                  setTextEditModal(null);
                }}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.8125rem', minWidth: '40px', textAlign: 'center' }}>
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                className="tool-btn"
                onClick={() => {
                  setZoomScale((s) => Math.min(2.5, s + 0.25));
                  setTextEditModal(null);
                }}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>

              <button className="tool-btn" onClick={rotateCurrentPage} title="Rotate 90°">
                <RotateCw size={14} />
              </button>
            </div>

            {/* Actions */}
            <div className="toolbar-group">
              <button
                className="tool-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Open another PDF"
              >
                Open PDF
              </button>

              <button
                className="tool-btn btn-primary"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download size={14} />
                <span>{isExporting ? 'Exporting...' : 'Export & Download'}</span>
              </button>
            </div>
          </div>

          {/* Sub Properties Bar */}
          <div className="pdf-props-bar">
            {currentTool === 'editText' && (
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Sparkles size={14} />
                <span>Click any text to edit</span>
              </div>
            )}

            {currentTool === 'text' && (
              <>
                <div className="prop-control">
                  <label className="form-label" style={{ margin: 0 }}>Font:</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <option value="Helvetica">Helvetica / Arial</option>
                    <option value="Helvetica-Bold">Helvetica Bold</option>
                    <option value="Times-Roman">Times New Roman</option>
                    <option value="Times-Bold">Times Bold</option>
                    <option value="Courier">Courier New</option>
                    <option value="Courier-Bold">Courier Bold</option>
                  </select>
                </div>
                <div className="prop-control">
                  <label className="form-label" style={{ margin: 0 }}>Size:</label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                    min="6"
                    max="72"
                    style={{ width: '54px' }}
                  />
                </div>
                <div className="prop-control">
                  <label className="form-label" style={{ margin: 0 }}>Color:</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>
              </>
            )}

            {(currentTool === 'rect' || currentTool === 'draw' || currentTool === 'highlight') && (
              <>
                <div className="prop-control">
                  <label className="form-label" style={{ margin: 0 }}>Color:</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>
                <div className="prop-control">
                  <label className="form-label" style={{ margin: 0 }}>Thickness:</label>
                  <input
                    type="number"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value) || 2)}
                    min="1"
                    max="24"
                    style={{ width: '48px' }}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Main Workspace Stage */}
      <div className="pdf-workspace">
        {/* Thumbnail Sidebar */}
        {pdfDoc && (
          <aside className="pdf-sidebar">
            <div className="sidebar-title">Pages</div>
            <div ref={thumbListRef} />
          </aside>
        )}

        {/* Viewport Canvas */}
        <div className="pdf-viewport">
          {!pdfDoc ? (
            <div className="empty-dropzone" onClick={() => fileInputRef.current?.click()}>
              <div className="dropzone-icon">
                <UploadCloud size={32} />
              </div>
              <h2 className="dropzone-title">Select a PDF to Edit</h2>
              <p className="dropzone-desc" style={{ marginBottom: "1.25rem" }}>Drag and drop your file here, or browse from your device</p>
              <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="tool-btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
                >
                  <FileText size={16} />
                  <span>Browse PDF</span>
                </button>

              </div>
            </div>
          ) : (
            <div className="pdf-page-stage" ref={stageWrapperRef}>
              <canvas className="pdf-bg-canvas" ref={bgCanvasRef} />
              <canvas
                className="pdf-overlay-canvas"
                ref={overlayCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />

              {/* Smart In-Place Text Editing Floating Popover (Positioned directly below the editing text) */}
              {textEditModal && (() => {
                const canvasW = overlayCanvasRef.current?.clientWidth || 800;
                const canvasH = overlayCanvasRef.current?.clientHeight || 1000;
                
                // Position directly BELOW the editing text
                const itemY = typeof textEditModal.y === 'number' ? textEditModal.y : 40;
                const itemH = typeof textEditModal.height === 'number' ? textEditModal.height : 22;
                let topPos = itemY + itemH + 8;
                let isFlippedAbove = false;

                // If placing below exceeds the canvas height, flip directly above
                if (topPos + 220 > canvasH && itemY > 210) {
                  topPos = Math.max(10, itemY - 200);
                  isFlippedAbove = true;
                }

                // Align horizontally with the text, keeping within canvas boundaries
                const itemX = typeof textEditModal.x === 'number' ? textEditModal.x : 20;
                const leftPos = Math.max(12, Math.min(itemX, canvasW - 410));

                return (
                  <div
                    className={`pdf-text-editor-popover ${isFlippedAbove ? 'flipped-above' : 'placed-below'}`}
                    style={{
                      position: 'absolute',
                      left: `${leftPos}px`,
                      top: `${topPos}px`,
                      zIndex: 100
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="popover-header">
                      <div className="popover-badge">
                        <Sparkles size={13} color="var(--accent-cyan)" />
                        <span>{textEditModal.badgeInfo || 'Auto-Matched Style'}</span>
                      </div>
                      <button
                        className="popover-close-btn"
                        onClick={handleCancelTextEdit}
                        title="Cancel (Esc)"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Text Input with true Font Preview */}
                    <div className="popover-input-wrapper">
                      <input
                        ref={editInputRef}
                        type="text"
                        className="popover-input"
                        value={textEditModal.text}
                        onChange={(e) => setTextEditModal({ ...textEditModal, text: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyTextEdit();
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelTextEdit();
                          }
                        }}
                        style={{
                          fontFamily: textEditModal.fontCategory === 'serif'
                            ? '"Times New Roman", Times, Georgia, serif'
                            : textEditModal.fontCategory === 'monospace'
                            ? '"Courier New", Courier, monospace'
                            : 'Arial, Helvetica, sans-serif',
                          fontWeight: textEditModal.bold ? 'bold' : 'normal',
                          fontStyle: textEditModal.italic ? 'italic' : 'normal',
                          fontSize: `${Math.max(13, Math.min(22, textEditModal.fontSizePt * 1.1))}px`,
                          color: textEditModal.color
                        }}
                        placeholder="Type replacement text..."
                      />
                    </div>

                    {/* Typography & Style Bar */}
                    <div className="popover-controls-row">
                      {/* Font Family selector */}
                      <div className="popover-control-group">
                        <label>Font:</label>
                        <select
                          value={textEditModal.fontCategory}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setTextEditModal({
                              ...textEditModal,
                              fontCategory: newCat,
                              badgeInfo: `${newCat === 'serif' ? 'Times New Roman (Serif)' : newCat === 'monospace' ? 'Courier New (Mono)' : 'Arial / Helvetica (Sans)'} • ${textEditModal.fontSizePt}pt`
                            });
                          }}
                        >
                          <option value="sans-serif">Sans (Arial)</option>
                          <option value="serif">Serif (Times)</option>
                          <option value="monospace">Mono (Courier)</option>
                        </select>
                      </div>

                      {/* Font Size Stepper */}
                      <div className="popover-control-group">
                        <label>Size:</label>
                        <div className="size-stepper">
                          <button
                            type="button"
                            onClick={() => {
                              const newSize = Math.max(6, Math.round(textEditModal.fontSizePt - 1));
                              setTextEditModal({ ...textEditModal, fontSizePt: newSize });
                            }}
                          >
                            -
                          </button>
                          <span>{textEditModal.fontSizePt}pt</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSize = Math.min(72, Math.round(textEditModal.fontSizePt + 1));
                              setTextEditModal({ ...textEditModal, fontSizePt: newSize });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Bold Toggle */}
                      <button
                        type="button"
                        className={`popover-toggle-btn ${textEditModal.bold ? 'active' : ''}`}
                        onClick={() => setTextEditModal({ ...textEditModal, bold: !textEditModal.bold })}
                        title="Bold"
                      >
                        <Bold size={13} />
                      </button>

                      {/* Italic Toggle */}
                      <button
                        type="button"
                        className={`popover-toggle-btn ${textEditModal.italic ? 'active' : ''}`}
                        onClick={() => setTextEditModal({ ...textEditModal, italic: !textEditModal.italic })}
                        title="Italic"
                      >
                        <Italic size={13} />
                      </button>

                      {/* Color Picker */}
                      <div className="popover-color-picker" title="Text Color">
                        <input
                          type="color"
                          value={textEditModal.color}
                          onChange={(e) => setTextEditModal({ ...textEditModal, color: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Options row */}
                    {textEditModal.mode === 'replace' && (
                      <label className="popover-checkbox-row">
                        <input
                          type="checkbox"
                          checked={textEditModal.whiteoutCover}
                          onChange={(e) => setTextEditModal({ ...textEditModal, whiteoutCover: e.target.checked })}
                        />
                        <span>Whiteout original text underneath</span>
                      </label>
                    )}

                    {/* Actions */}
                    <div className="popover-actions">
                      <button
                        type="button"
                        className="btn-popover-cancel"
                        onClick={handleCancelTextEdit}
                      >
                        <X size={13} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        className="btn-popover-apply"
                        onClick={handleApplyTextEdit}
                      >
                        <Check size={13} />
                        <span>{textEditModal.mode === 'replace' ? 'Apply Change' : 'Place Text'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="application/pdf"
        style={{ display: 'none' }}
      />
    </div>
  );
}
