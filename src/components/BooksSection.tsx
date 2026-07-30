import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Sparkles, ChevronRight, FileText, ArrowRight, Palette } from 'lucide-react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { BookDetailModal } from './BookDetailModal';

interface BooksSectionProps {
  darkMode: boolean;
  isHomePage?: boolean;
  onViewAll?: () => void;
  books?: BookStory[];
}

export const BooksSection: React.FC<BooksSectionProps> = ({ darkMode, isHomePage = true, onViewAll, books }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<BookStory | null>(null);

  const availableBooks = useMemo(() => {
    const activeBooks = books || BOOKS_DATA;
    if (isHomePage) {
      return activeBooks.filter((b) => b.pdfUrl && b.coloringSvgs && b.coloringSvgs.length > 0);
    }
    return activeBooks;
  }, [isHomePage, books]);

  // Apply search query filter
  const filteredBooks = useMemo(() => {
    let list = availableBooks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => {
        return (
          b.displayTitle.toLowerCase().includes(q) ||
          b.recommendedAge.toLowerCase().includes(q) ||
          b.intro.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q)
        );
      });
    }

    // On Home page, limit display to 6 cards
    if (isHomePage) {
      return list.slice(0, 6);
    }
    return list;
  }, [availableBooks, searchQuery, isHomePage]);

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

  return (
    <section id="cuentos" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800">
            <BookOpen className="w-4 h-4" />
            <span>Colección "Luna está creciendo" ({availableBooks.length} Cuentos Destacados)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Cuentos{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              "Luna está creciendo"
            </span>
          </h2>

          <p className={`text-sm sm:text-base font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Cada cuento incluye su edición en PDF con paso de hoja interactivo, guía pedagógica para familias y módulo para colorear.
          </p>

          {/* Quick Search Input */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cuento por título o edad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Story Cards Grid (Full-Cover Portada Web Style with Styled Picture Frame / Recuadro) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        {/* Home Page Action Button: Ver todos los cuentos */}
        {isHomePage && onViewAll && (
          <div className="text-center pt-6">
            <button
              onClick={onViewAll}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 transition-all group"
            >
              <span>Ver todos los cuentos ({(books || BOOKS_DATA).length} Títulos)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>

      {/* Book Detail & Rationale Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        darkMode={darkMode}
        onNextBook={handleNextBook}
        onPrevBook={handlePrevBook}
        currentIndex={currentIndex}
        totalBooks={filteredBooks.length}
      />
    </section>
  );
};
