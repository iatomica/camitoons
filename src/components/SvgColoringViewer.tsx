import React, { useState, useEffect, useRef } from 'react';
import { Palette, Download, RotateCcw, Sparkles, ChevronLeft, ChevronRight, Eraser, Check, Paintbrush, ZoomIn, ZoomOut, Maximize2, Minimize2, Heart, Plus, Sliders } from 'lucide-react';

interface SvgColoringViewerProps {
  coloringSvgs: string[];
  bookTitle: string;
  darkMode: boolean;
  selectedColor?: string;
  setSelectedColor?: (color: string) => void;
  selectedTool?: 'bucket' | 'brush' | 'eraser';
  setSelectedTool?: (tool: 'bucket' | 'brush' | 'eraser') => void;
  brushSize?: number;
  setBrushSize?: (size: number) => void;
  onResetTrigger?: number;
  onDownloadTrigger?: number;
}

// Complete Unique Unified Palette (All Skin Tones, Rainbow Colors & Pastels together with NO REPEATED COLORS)
export const UNIFIED_COLOR_PALETTE = Array.from(new Set([
  // Skin Tones
  '#FFDFC4', '#F0D5BE', '#EECEB1', '#E0AC69', '#C68642', '#A05822', '#8D5524', '#5C3317', '#F3D2C1',
  // Rainbow Colors
  '#EC4899', '#F472B6', '#A855F7', '#C084FC', '#6366F1', '#60A5FA', '#3B82F6', '#06B6D4',
  '#10B981', '#34D399', '#84CC16', '#EAB308', '#FDE047', '#F97316', '#EF4444', '#854D0E',
  '#1E293B', '#FFFFFF',
  // Pastels
  '#FFD1DC', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F3E5F5', '#FFF9C4'
]));

// Helper: Convert hex color string to RGB object
function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export const SvgColoringViewer: React.FC<SvgColoringViewerProps> = ({
  coloringSvgs,
  bookTitle,
  darkMode,
  selectedColor: propSelectedColor,
  setSelectedColor: propSetSelectedColor,
  selectedTool: propSelectedTool,
  setSelectedTool: propSetSelectedTool,
  brushSize: propBrushSize,
  setBrushSize: propSetBrushSize,
  onResetTrigger,
  onDownloadTrigger
}) => {
  // Omit the first image if there are multiple images to avoid the visual glitch and start directly from page 2
  const validColoringSvgs = (coloringSvgs && coloringSvgs.length > 1)
    ? coloringSvgs.slice(1)
    : (coloringSvgs || []);

  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [internalColor, setInternalColor] = useState<string>('#A855F7');
  const [internalTool, setInternalTool] = useState<'bucket' | 'brush' | 'eraser'>('bucket');
  const [internalBrushSize, setInternalBrushSize] = useState<number>(28);

  const selectedColor = propSelectedColor !== undefined ? propSelectedColor : internalColor;
  const setSelectedColor = propSetSelectedColor || setInternalColor;
  const selectedTool = propSelectedTool !== undefined ? propSelectedTool : internalTool;
  const setSelectedTool = propSetSelectedTool || setInternalTool;
  const brushSize = propBrushSize !== undefined ? propBrushSize : internalBrushSize;
  const setBrushSize = propSetBrushSize || setInternalBrushSize;

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineArtCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSvgUrl = validColoringSvgs[selectedPageIndex] || '';

  // Handle Triggers from Left Sidebar
  useEffect(() => {
    if (onResetTrigger && onResetTrigger > 0) {
      handleReset();
    }
  }, [onResetTrigger]);

  useEffect(() => {
    if (onDownloadTrigger && onDownloadTrigger > 0) {
      handleDownload();
    }
  }, [onDownloadTrigger]);

  // Fetch, Auto-Detect Inverted Masks, and Normalize into Crisp Black Line-Art on White Canvas
  useEffect(() => {
    if (!currentSvgUrl) return;
    setLoading(true);

    fetch(currentSvgUrl)
      .then((res) => res.text())
      .then((svgText) => {
        const imgMatch = svgText.match(/<image[^>]+(?:xlink:href|href)="([^"]+)"/i);
        const imgSrc = (imgMatch && imgMatch[1]) ? imgMatch[1] : currentSvgUrl;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSrc;

        img.onload = () => {
          const w = img.naturalWidth || 1200;
          const h = img.naturalHeight || 1200;

          // 1. Create Line Art Overlay Canvas
          const lineCanvas = document.createElement('canvas');
          lineCanvas.width = w;
          lineCanvas.height = h;
          const lineCtx = lineCanvas.getContext('2d', { willReadFrequently: true });

          if (lineCtx) {
            lineCtx.drawImage(img, 0, 0, w, h);
            const lineImgData = lineCtx.getImageData(0, 0, w, h);
            const data = lineImgData.data;

            // Sample brightness to check if image is an inverted dark mask
            let sampleBrightness = 0;
            const sampleCount = Math.min(1000, data.length / 4);
            for (let i = 0; i < sampleCount * 4; i += 4) {
              sampleBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            const avgBrightness = sampleBrightness / sampleCount;

            if (avgBrightness < 120) {
              for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
                data[i + 3] = 255;
              }
              lineCtx.putImageData(lineImgData, 0, 0);
            }
            lineArtCanvasRef.current = lineCanvas;
          }

          // 2. Initialize Main Drawing Canvas
          const mainCanvas = colorCanvasRef.current;
          if (mainCanvas) {
            mainCanvas.width = w;
            mainCanvas.height = h;
            const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
            if (mainCtx && lineCanvas) {
              mainCtx.fillStyle = '#FFFFFF';
              mainCtx.fillRect(0, 0, w, h);
              mainCtx.drawImage(lineCanvas, 0, 0);
            }
          }

          setLoading(false);
        };

        img.onerror = () => {
          console.error('Error al cargar la lámina SVG:', currentSvgUrl);
          setLoading(false);
        };
      })
      .catch((err) => {
        console.error('Error al descargar SVG:', err);
        setLoading(false);
      });
  }, [currentSvgUrl]);

  // Precision Canvas Flood Fill Algorithm (Balde de Pintura)
  const performFloodFill = (startX: number, startY: number) => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const fillRgb = hexToRgb(selectedTool === 'eraser' ? '#FFFFFF' : selectedColor);

    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    // Locked Black Stroke: If clicking on black line (RGB < 65), lock it!
    if (startR < 65 && startG < 65 && startB < 65) {
      return;
    }

    const isTargetColor = (r: number, g: number, b: number) => {
      return Math.abs(r - startR) < 55 && Math.abs(g - startG) < 55 && Math.abs(b - startB) < 55;
    };

    const stack: number[] = [startX, startY];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      const idx = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx]) {
        continue;
      }
      visited[idx] = 1;

      const pos = idx * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];

      if (r < 65 && g < 65 && b < 65) {
        continue;
      }

      if (isTargetColor(r, g, b)) {
        data[pos] = fillRgb.r;
        data[pos + 1] = fillRgb.g;
        data[pos + 2] = fillRgb.b;
        data[pos + 3] = 255;

        stack.push(x + 1, y);
        stack.push(x - 1, y);
        stack.push(x, y + 1);
        stack.push(x, y - 1);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Re-overlay line art in multiply mode
    if (lineArtCanvasRef.current) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(lineArtCanvasRef.current, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    return {
      x: Math.max(0, Math.min(canvas.width - 1, x)),
      y: Math.max(0, Math.min(canvas.height - 1, y))
    };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    if (selectedTool === 'bucket') {
      performFloodFill(x, y);
    } else {
      setIsDrawing(true);
      drawBrush(x, y);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool === 'bucket') return;
    const { x, y } = getCanvasCoords(e);
    drawBrush(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const drawBrush = (x: number, y: number) => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = selectedTool === 'eraser' ? '#FFFFFF' : selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    if (lineArtCanvasRef.current) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(lineArtCanvasRef.current, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const handleReset = () => {
    const canvas = colorCanvasRef.current;
    const lineCanvas = lineArtCanvasRef.current;
    if (canvas && lineCanvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(lineCanvas, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDownload = () => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `CamiToons_${bookTitle}_Pagina_${selectedPageIndex + 1}_Coloreado.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(console.error);
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    }
  };

  if (!validColoringSvgs || validColoringSvgs.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-sm font-semibold">No se encontraron láminas para colorear en este cuento.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col space-y-5 w-full max-w-5xl mx-auto bg-slate-50 dark:bg-slate-950 p-3 sm:p-6 rounded-3xl shadow-xl select-none">
      
      {/* Header & Page Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md">
            <Palette className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Cuento: {bookTitle}</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h4>
            <p className="text-xs font-bold text-purple-600 dark:text-purple-300">
              Lámina {selectedPageIndex + 1} de {validColoringSvgs.length} páginas para colorear
            </p>
          </div>
        </div>

        {/* Page Switcher & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1.5 border-r border-slate-200 dark:border-slate-800 pr-3 mr-1">
            <button
              onClick={() => setZoomScale((prev) => Math.max(0.7, prev - 0.2))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 text-slate-700 dark:text-slate-300 font-bold transition-colors"
              title="Alejar (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-slate-500 w-10 text-center">
              {Math.round(zoomScale * 100)}%
            </span>

            <button
              onClick={() => setZoomScale((prev) => Math.min(2.2, prev + 0.2))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 text-slate-700 dark:text-slate-300 font-bold transition-colors"
              title="Acercar (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white transition-colors ml-1"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedPageIndex((prev) => Math.max(0, prev - 1));
              setZoomScale(1);
            }}
            disabled={selectedPageIndex === 0}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-purple-600 hover:text-white transition-colors"
            title="Lámina anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-black font-mono text-purple-700 dark:text-purple-300 px-3 bg-purple-100 dark:bg-purple-950/80 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
            Lámina {selectedPageIndex + 1} / {validColoringSvgs.length}
          </span>

          <button
            onClick={() => {
              setSelectedPageIndex((prev) => Math.min(validColoringSvgs.length - 1, prev + 1));
              setZoomScale(1);
            }}
            disabled={selectedPageIndex === validColoringSvgs.length - 1}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-purple-600 hover:text-white transition-colors"
            title="Siguiente lámina"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ALWAYS MOUNTED HUGE High-DPI Canvas Area */}
      <div className="relative w-full h-[540px] sm:h-[680px] bg-white rounded-3xl border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden flex items-center justify-center p-2 sm:p-4">
        
        {loading && (
          <div className="absolute inset-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 text-purple-600">
            <Sparkles className="w-10 h-10 animate-spin" />
            <p className="text-sm font-extrabold">Cargando lámina vectorial en 4K y bloqueando trazos...</p>
          </div>
        )}

        <div
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
          className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out select-none cursor-crosshair overflow-hidden"
        >
          <canvas
            ref={colorCanvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="w-full h-full object-contain touch-none cursor-crosshair rounded-2xl bg-white"
          />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-extrabold text-slate-700 bg-white/95 dark:bg-slate-900/95 dark:text-slate-200 px-4 py-2 rounded-full shadow-lg border border-purple-200 dark:border-purple-800 pointer-events-none backdrop-blur-md z-20">
          🎨 Tocá con el balde dentro de cualquier figura para pintarla • Trazos negros bloqueados en 4K
        </div>

        {/* Thumbnail Selector at Bottom */}
        <div className="absolute top-4 right-4 flex space-x-1 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-full border border-slate-700 text-white z-20">
          {validColoringSvgs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPageIndex(idx);
                setZoomScale(1);
              }}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                selectedPageIndex === idx
                  ? 'bg-purple-600 text-white font-extrabold scale-110 shadow'
                  : 'hover:bg-white/20 text-slate-300'
              }`}
              title={`Lámina ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
