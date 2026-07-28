import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PageFlip } from 'page-flip';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2, AlertCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;

interface PdfFlipbookViewerProps {
  pdfUrl: string;
  bookTitle: string;
  darkMode: boolean;
}

export const PdfFlipbookViewer: React.FC<PdfFlipbookViewerProps> = ({ pdfUrl, bookTitle, darkMode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<string>('Cargando cuento...');
  const [error, setError] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load PDF, split double spreads, and format into 1:1 square single pages
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPageImages([]);
    setCurrentPage(1);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      withCredentials: false
    });

    loadingTask.promise
      .then(async (doc) => {
        if (!isMounted) return;
        const numPdfPages = doc.numPages;
        const images: string[] = [];
        let backCoverImage: string | null = null;

        for (let i = 1; i <= numPdfPages; i++) {
          if (!isMounted) return;
          setLoadingProgress(`Procesando pliego ${i} de ${numPdfPages}...`);

          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1.8 });

          const fullCanvas = document.createElement('canvas');
          const fullContext = fullCanvas.getContext('2d');

          if (fullContext) {
            fullCanvas.width = Math.floor(viewport.width);
            fullCanvas.height = Math.floor(viewport.height);

            await page.render({
              canvasContext: fullContext,
              viewport,
              canvas: fullCanvas as unknown as HTMLCanvasElement
            }).promise;

            const isDoubleSpread = (viewport.width / viewport.height) > 1.15;

            if (isDoubleSpread) {
              const halfWidth = Math.floor(fullCanvas.width / 2);
              const pageHeight = fullCanvas.height;

              // Left Half (1:1 square page)
              const leftCanvas = document.createElement('canvas');
              leftCanvas.width = halfWidth;
              leftCanvas.height = pageHeight;
              const leftCtx = leftCanvas.getContext('2d');
              let leftDataUrl = '';
              if (leftCtx) {
                leftCtx.drawImage(fullCanvas, 0, 0, halfWidth, pageHeight, 0, 0, halfWidth, pageHeight);
                leftDataUrl = leftCanvas.toDataURL('image/webp', 0.94);
              }

              // Right Half (1:1 square page)
              const rightCanvas = document.createElement('canvas');
              rightCanvas.width = halfWidth;
              rightCanvas.height = pageHeight;
              const rightCtx = rightCanvas.getContext('2d');
              let rightDataUrl = '';
              if (rightCtx) {
                rightCtx.drawImage(fullCanvas, halfWidth, 0, halfWidth, pageHeight, 0, 0, halfWidth, pageHeight);
                rightDataUrl = rightCanvas.toDataURL('image/webp', 0.94);
              }

              if (i === 1) {
                // PDF Page 1: Right half = Portada (Front Cover), Left half = Contraportada (Back Cover)
                images.push(rightDataUrl);
                backCoverImage = leftDataUrl;
              } else {
                images.push(leftDataUrl);
                images.push(rightDataUrl);
              }
            } else {
              images.push(fullCanvas.toDataURL('image/webp', 0.94));
            }
          }
        }

        if (backCoverImage) {
          images.push(backCoverImage);
        }

        if (isMounted) {
          setPageImages(images);
          setTotalPages(images.length);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error al procesar PDF para flipbook:', err);
        setError('No se pudo cargar el cuento interactivo.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  // Initialize PageFlip with 1:1 Square single page dimensions
  useEffect(() => {
    if (pageImages.length === 0 || !bookRef.current) return;

    if (pageFlipInstance.current) {
      try {
        pageFlipInstance.current.destroy();
      } catch (e) {}
    }

    const isMobile = window.innerWidth < 640;
    const squareSize = isMobile ? 320 : 450;

    const pageFlip = new PageFlip(bookRef.current, {
      width: squareSize,       // 1:1 Square single page width
      height: squareSize,      // 1:1 Square single page height
      size: 'stretch',
      minWidth: 260,
      maxWidth: 550,
      minHeight: 260,
      maxHeight: 550,
      drawShadow: true,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: isMobile,
      startPage: 0
    });

    try {
      const pageElements = bookRef.current.querySelectorAll('.page-slide');
      if (pageElements.length > 0) {
        pageFlip.loadFromHTML(pageElements as unknown as NodeListOf<HTMLElement>);
        pageFlipInstance.current = pageFlip;

        pageFlip.on('flip', (e) => {
          setCurrentPage((e.data as number) + 1);
        });
      }
    } catch (err) {
      console.error('Error al inicializar PageFlip:', err);
    }

    return () => {
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
          pageFlipInstance.current = null;
        } catch (e) {}
      }
    };
  }, [pageImages]);

  // Fullscreen listener
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const handlePrevPage = () => {
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flipPrev();
    }
  };

  const handleNextPage = () => {
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flipNext();
    }
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen().catch(console.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-amber-700 dark:text-amber-400">
        <Loader2 className="w-10 h-10 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-stone-800 dark:text-stone-200">Cargando páginas del cuento...</p>
          <p className="text-xs text-stone-500 font-mono">{loadingProgress}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-2">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <p className="text-sm font-bold text-stone-700 dark:text-stone-300">{error}</p>
      </div>
    );
  }

  const isClosedBook = currentPage === 1 || currentPage === totalPages;

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden flex flex-col items-center justify-center select-none bg-[#F7F4EE] dark:bg-[#1A1816] text-stone-800 dark:text-stone-100 transition-colors shadow-inner"
    >
      {/* Soft Book Desk Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#E8E2D5_1px,transparent_1px)] dark:bg-[radial-gradient(#2A2622_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* PageFlip Container without Clipping Overflow */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
        <div
          ref={bookRef}
          className={`stpageflip-container shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isClosedBook ? 'scale-[0.98]' : 'scale-100'
          }`}
        >
          {pageImages.map((imgSrc, idx) => (
            <div
              key={idx}
              className="page-slide bg-white flex items-center justify-center cursor-grab active:cursor-grabbing border-0 outline-none shadow-sm"
              data-density="hard"
            >
              <img
                src={imgSrc}
                alt={`Página ${idx + 1}`}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Warm Cream Minimalist Control Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 px-4 py-2 rounded-full bg-stone-900/90 text-amber-50 backdrop-blur-md border border-stone-700/80 shadow-2xl text-xs font-semibold">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-full hover:bg-stone-800 disabled:opacity-30 transition-colors"
          title="Pasar hoja atrás (←)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 font-mono text-amber-100 text-xs tracking-wider">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-full hover:bg-stone-800 disabled:opacity-30 transition-colors"
          title="Pasar hoja adelante (→)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="w-px h-3.5 bg-stone-700 mx-1" />

        <button
          onClick={toggleFullScreen}
          className="p-1.5 rounded-full hover:bg-stone-800 transition-colors text-amber-200 hover:text-white"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-stone-500 dark:text-stone-400 tracking-wide pointer-events-none bg-stone-200/50 dark:bg-stone-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
        ✨ Formato Cuento Interactivo 1:1 • Arrastrá o haz clic para pasar
      </p>
    </div>
  );
};
