import React, { useState, useEffect } from 'react';
import { X, BookOpen, FileText, ChevronLeft, ChevronRight, BookMarked, Sparkles } from 'lucide-react';
import { BookStory } from '../data/booksCatalog';
import { PdfFlipbookViewer } from './PdfFlipbookViewer';

interface BookDetailModalProps {
  book: BookStory | null;
  onClose: () => void;
  darkMode: boolean;
  onNextBook?: () => void;
  onPrevBook?: () => void;
  currentIndex?: number;
  totalBooks?: number;
}

interface FundamentacionSection {
  title: string;
  paragraphs: string[];
}

function parseFundamentacionSections(text: string): FundamentacionSection[] {
  if (!text) return [];

  const normalized = text.replace(/\\n/g, '\n');
  const lines = normalized.split('\n');

  const sections: FundamentacionSection[] = [];
  let currentSection: FundamentacionSection | null = null;

  const isHeader = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^\d+\.\s+[^\n]+/.test(trimmed)) return true;
    if (/^(Guía para familias y educadores|Propuesta emocional|Esta propuesta favorece|Recursos adicionales)/i.test(trimmed)) return true;
    return false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('Cuento:') || line.startsWith('Edad recomendada:')) {
      continue;
    }

    if (isHeader(line)) {
      if (/^[123]\.\s+(Introducción|Objetivo|Resumen)/i.test(line) || /^Guía para familias y educadores/i.test(line)) {
        currentSection = null;
        continue;
      }

      if (currentSection && currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
      }

      currentSection = {
        title: line,
        paragraphs: []
      };
    } else if (currentSection) {
      currentSection.paragraphs.push(line);
    }
  }

  if (currentSection && currentSection.paragraphs.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  darkMode,
  onNextBook,
  onPrevBook,
  currentIndex,
  totalBooks
}) => {
  const [activeTab, setActiveTab] = useState<'fundamentacion' | 'lector-pdf'>('fundamentacion');

  const parsedFundamentacion = React.useMemo(() => {
    if (!book?.fullFundamentacion) return [];
    return parseFundamentacionSections(book.fullFundamentacion);
  }, [book?.fullFundamentacion]);

  // Keyboard navigation (Escape to close, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!book) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevBook) {
        onPrevBook();
      } else if (e.key === 'ArrowRight' && onNextBook) {
        onNextBook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, onPrevBook, onNextBook, onClose]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      
      {/* Minimalist Floating Side Arrow Prev (Desktop) */}
      {onPrevBook && (
        <button
          onClick={onPrevBook}
          id="btn-floating-prev-book"
          className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-slate-700/80 shadow-2xl transition-all hover:scale-110 z-50 backdrop-blur-md"
          title="Cuento anterior (Flecha izquierda)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Minimalist Floating Side Arrow Next (Desktop) */}
      {onNextBook && (
        <button
          onClick={onNextBook}
          id="btn-floating-next-book"
          className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-slate-700/80 shadow-2xl transition-all hover:scale-110 z-50 backdrop-blur-md"
          title="Siguiente cuento (Flecha derecha)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border transition-all my-6 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Colección "Luna está creciendo"
              </span>
              <h2 className="text-lg sm:text-2xl font-black">{book.displayTitle}</h2>
            </div>
          </div>

          {/* Minimalist Top Arrow Navigator & Close Button */}
          <div className="flex items-center space-x-2">
            {onPrevBook && onNextBook && (
              <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-300/60 dark:border-slate-700/60 shadow-inner">
                <button
                  onClick={onPrevBook}
                  id="btn-header-prev-book"
                  className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
                  title="Cuento anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {currentIndex !== undefined && totalBooks !== undefined && (
                  <span className="text-[11px] font-bold px-2 text-slate-600 dark:text-slate-300 font-mono select-none">
                    {currentIndex + 1} / {totalBooks}
                  </span>
                )}

                <button
                  onClick={onNextBook}
                  id="btn-header-next-book"
                  className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
                  title="Siguiente cuento"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('fundamentacion')}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === 'fundamentacion'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Fundamentación Pedagógica</span>
            </button>

            <button
              onClick={() => setActiveTab('lector-pdf')}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === 'lector-pdf'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Lector del Cuento (PDF)</span>
            </button>
          </div>

          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            Edad: {book.recommendedAge}
          </span>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'fundamentacion' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Single Reference Cover Image Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-950 group">
                  <img
                    src={book.coverImage}
                    alt={`Portada de referencia - ${book.displayTitle}`}
                    className="w-full h-[360px] sm:h-[430px] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow">
                    Portada de Referencia Autorizada
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Recurso para Familias & Docentes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Diseñado por Camila Belén Maestrojuan (Autora & Docente) para acompañar la lectura del cuento.
                  </p>
                </div>
              </div>

              {/* Fundamentación Detail Text Column */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Book Title & Key badges */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                    {book.displayTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Recomendado: {book.recommendedAge}
                    </span>
                    <button
                      onClick={() => setActiveTab('lector-pdf')}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:underline flex items-center space-x-1"
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Abrir Lector PDF</span>
                    </button>
                  </div>
                </div>

                {/* Intro & Objetivos quick highlights */}
                {book.intro && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      1. Introducción
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {book.intro}
                    </p>
                  </div>
                )}

                {book.objective && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      2. Objetivo del Cuento
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {book.objective}
                    </p>
                  </div>
                )}

                {book.summary && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      3. Resumen del Cuento
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {book.summary}
                    </p>
                  </div>
                )}

                {/* Continuous exposed Orientaciones Pedagógicas sections in the exact same format */}
                {parsedFundamentacion.map((sec, idx) => {
                  const isListSection = /^[45678]\./.test(sec.title) || /temas clave|sugerencias|preguntas|consejos/i.test(sec.title);
                  return (
                    <div key={idx} className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {sec.title}
                      </h4>
                      <div className={isListSection ? "space-y-1 text-sm leading-normal text-slate-700 dark:text-slate-300 font-medium" : "space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium"}>
                        {sec.paragraphs.map((para, pIdx) => {
                          const isQuestion = para.startsWith('¿') || para.endsWith('?');
                          const isSubTitle = !isQuestion && para.length < 65 && !para.endsWith('.') && !para.endsWith(',') && (para.startsWith('Juego') || para.startsWith('Creamos') || para.startsWith('Inventamos') || para.startsWith('Clasificamos') || para.startsWith('Dibujamos') || para.startsWith('La ensalada') || para.startsWith('El plato') || para.startsWith('Exploramos') || para.startsWith('Cocinamos') || para.startsWith('Mi menú') || para.startsWith('Jugamos') || para.startsWith('La fiesta') || para.startsWith('Cantamos') || para.startsWith('El semáforo') || para.startsWith('Canción') || para.startsWith('Circuito') || para.startsWith('Exploradores') || para.startsWith('Del movimiento') || para.startsWith('Recursos'));

                          if (isSubTitle) {
                            return (
                              <h5 key={pIdx} className="font-extrabold text-purple-900 dark:text-purple-200 text-xs sm:text-sm pt-1">
                                📌 {para}
                              </h5>
                            );
                          }

                          if (isQuestion) {
                            return (
                              <p key={pIdx} className="pl-3 border-l-2 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200 font-semibold py-0.5">
                                {para}
                              </p>
                            );
                          }

                          return (
                            <p key={pIdx} className={isListSection ? "my-0 py-0" : ""}>
                              {para}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          ) : activeTab === 'lector-pdf' ? (
            /* Interactive PDF Reader Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Lector Interactivo de Cuento</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hojeá el cuento haciendo clic en los bordes o usando las flechas laterales.
                  </p>
                </div>
              </div>

              {book.pdfUrl ? (
                <PdfFlipbookViewer
                  pdfUrl={book.pdfUrl}
                  bookTitle={book.displayTitle}
                  darkMode={darkMode}
                />
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
                  <p className="text-sm font-bold">PDF del cuento no disponible actualmente</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    El archivo PDF correspondiente a este título estará disponible en la próxima actualización.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
