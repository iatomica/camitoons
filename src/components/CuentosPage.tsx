import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ArrowLeft, ChevronRight, FileText, Sparkles, Palette } from 'lucide-react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { BookDetailModal } from './BookDetailModal';

interface CuentosPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const CuentosPage: React.FC<CuentosPageProps> = ({ darkMode, onGoBackHome }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('todos');
  const [selectedBook, setSelectedBook] = useState<BookStory | null>(null);

  // Filter all 22 books by search query and age filter
  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter((b) => {
      // Age filter
      if (selectedAge !== 'todos' && b.recommendedAge !== selectedAge) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.displayTitle.toLowerCase().includes(q) ||
          b.recommendedAge.toLowerCase().includes(q) ||
          b.intro.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedAge]);

  const currentIndex = selectedBook
    ? filteredBooks.findIndex((b) => b.id === selectedBook.id)
    : -1;

  const handlePrevBook = () => {
    if (currentIndex > 0) {
      setSelectedBook(filteredBooks[currentIndex - 1]);
    } else if (filteredBooks.length > 0) {
      setSelectedBook(filteredBooks[filteredBooks.length - 1]);
    }
  };

  const handleNextBook = () => {
    if (currentIndex >= 0 && currentIndex < filteredBooks.length - 1) {
      setSelectedBook(filteredBooks[currentIndex + 1]);
    } else if (filteredBooks.length > 0) {
      setSelectedBook(filteredBooks[0]);
    }
  };

  const ageCounts = useMemo(() => {
    const counts = { '2 años': 0, '3 años': 0, '4 años': 0 };
    BOOKS_DATA.forEach((b) => {
      if (b.recommendedAge in counts) {
        counts[b.recommendedAge as keyof typeof counts]++;
      }
    });
    return counts;
  }, []);

  return (
    <div className={`min-h-screen py-10 sm:py-16 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header & Go Back Home Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            onClick={onGoBackHome}
            className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
              Catálogo Completo ({BOOKS_DATA.length} Títulos)
            </span>
          </div>
        </div>

        {/* Section Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Colección Completa de Cuentos{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              "Luna está creciendo"
            </span>
          </h1>
          <p className={`text-sm sm:text-base font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explora los {BOOKS_DATA.length} títulos oficiales con lectura física de paso de hoja en PDF, guías pedagógicas y módulo interactivo para colorear.
          </p>
        </div>

        {/* Search Bar & Age Filter Pills */}
        <div className="max-w-xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cuento por título o tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          {/* Filter Pills by Age */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-extrabold text-slate-500 mr-1">Filtrar por Edad:</span>
            
            <button
              onClick={() => setSelectedAge('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedAge === 'todos'
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : darkMode
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              Todos ({BOOKS_DATA.length})
            </button>

            <button
              onClick={() => setSelectedAge('2 años')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedAge === '2 años'
                  ? 'bg-pink-600 text-white shadow-md scale-105'
                  : darkMode
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
              }`}
            >
              2 Años ({ageCounts['2 años']})
            </button>

            <button
              onClick={() => setSelectedAge('3 años')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedAge === '3 años'
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : darkMode
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              3 Años ({ageCounts['3 años']})
            </button>

            <button
              onClick={() => setSelectedAge('4 años')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedAge === '4 años'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : darkMode
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              4 Años ({ageCounts['4 años']})
            </button>
          </div>
        </div>

        {/* Story Cards Grid (Full-Cover Portada Web Style with Styled Picture Frame / Recuadro) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group relative p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-950 h-[370px] sm:h-[410px]">
                {/* Full Card Cover Image */}
                <img
                  src={book.coverImage}
                  alt={book.displayTitle}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dynamic Gradient Overlay (Deepens on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 group-hover:via-slate-950/75 transition-all duration-300 pointer-events-none" />

                {/* Top Corner Badges (Always Visible) */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-purple-600/90 backdrop-blur-md text-white shadow-md border border-purple-400/30">
                    Edad: {book.recommendedAge}
                  </span>

                  {book.pdfUrl && (
                    <span className="bg-pink-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-pink-300/30 flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                    </span>
                  )}
                </div>

                {/* Card Bottom Content (Title always visible, Intro & Button reveal on Hover with Shadow) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white space-y-2.5 z-10 flex flex-col justify-end">
                  
                  {/* Title (Always Visible) */}
                  <h3 className="text-xl sm:text-2xl font-black drop-shadow-md leading-tight text-white group-hover:text-amber-300 transition-colors duration-300">
                    {book.displayTitle}
                  </h3>

                  {/* Intro Description & Action Button (Reveals gracefully on Hover with shadow) */}
                  <div className="space-y-3 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed font-medium drop-shadow-sm">
                      {book.intro}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/20">
                      <span className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">
                        Lectura & Guía
                      </span>
                      <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-xs shadow-md group-hover:scale-105 transition-transform">
                        <span>Ver Cuento</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Go Back Home Button */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onGoBackHome}
            className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>

      </div>

      {/* Book Detail & Coloring Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        darkMode={darkMode}
        onNextBook={handleNextBook}
        onPrevBook={handlePrevBook}
        currentIndex={currentIndex}
        totalBooks={filteredBooks.length}
      />
    </div>
  );
};
