import React, { useState } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { Play, Info, X, FileText, Sparkles, GraduationCap } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [selectedBook, setSelectedBook] = useState<BookStory | null>(null);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  
  // Group books by recommended age
  const rows = [
    { title: 'Primeros Pasos (2 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('2')) },
    { title: 'Emociones & Descubrimiento (3 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('3')) },
    { title: 'Autonomía & Entorno (4 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('4')) }
  ];

  // Featured book for the large Billboard banner (e.g. Luna y los sonidos)
  const featuredBook = BOOKS_DATA.find(b => b.id === 'book-19') || BOOKS_DATA[0];

  const handleBookClick = (book: BookStory, rowIndex: number) => {
    if (selectedBook?.id === book.id) {
      setSelectedBook(null);
      setActiveRowIndex(null);
    } else {
      setSelectedBook(book);
      setActiveRowIndex(rowIndex);
    }
  };

  const handleOpenPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      const cleanUrl = pdfUrl.startsWith('/api/media/') ? pdfUrl : `/api/media/${pdfUrl}`;
      window.open(cleanUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#e5e5e5] font-sans overflow-x-hidden">
      
      {/* Mini Netflix Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="text-red-600 font-black text-2xl tracking-tighter cursor-pointer hover:scale-105 transition-transform" onClick={onGoBackHome}>
            CAMITOONS
          </span>
          <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest">
            Netflix UI Test
          </span>
        </div>
        <button
          onClick={onGoBackHome}
          className="text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors"
        >
          Volver al Inicio
        </button>
      </nav>

      {/* Hero Billboard Banner */}
      <div className="relative w-full h-[56.25vw] min-h-[380px] max-h-[750px] bg-black overflow-hidden flex items-center">
        {/* Full-width Cover Image with Netflix Blends */}
        <div className="absolute inset-0 z-0">
          <img
            src={featuredBook.coverImage}
            alt={featuredBook.displayTitle}
            className="w-full h-full object-cover object-center opacity-70"
          />
          {/* Gradients to blend into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/30 to-transparent" />
        </div>

        {/* Billboard Details Content */}
        <div className="relative z-10 max-w-2xl px-6 md:px-12 lg:px-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2">
            <span className="bg-red-600 text-white font-black text-[9px] sm:text-[11px] px-2 py-0.5 rounded">ORIGINAL</span>
            <span className="text-xs font-bold text-slate-300 tracking-wider">Cuento Recomendado</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
            {featuredBook.displayTitle}
          </h1>

          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold text-slate-300">
            <span className="text-green-400">98% Coincidencia</span>
            <span className="border border-slate-500 px-1.5 py-0.2 rounded text-[10px] text-white bg-slate-800">
              {featuredBook.recommendedAge}
            </span>
            <span>{featuredBook.pagesCount || 12} páginas</span>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 drop-shadow max-w-xl leading-relaxed">
            {featuredBook.intro || featuredBook.summary}
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => handleOpenPdf(featuredBook.pdfUrl)}
              className="inline-flex items-center space-x-2 bg-white hover:bg-white/90 text-black font-black px-6 py-2.5 sm:px-8 sm:py-3 rounded text-xs sm:text-sm shadow transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Leer Ahora</span>
            </button>
            <button
              onClick={() => setSelectedBook(featuredBook)}
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-black px-5 py-2.5 sm:px-7 sm:py-3 rounded text-xs sm:text-sm backdrop-blur transition-all hover:scale-105"
            >
              <Info className="w-4 h-4" />
              <span>Más Información</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rows Container */}
      <div className="relative z-20 -mt-16 sm:-mt-24 md:-mt-32 pb-24 space-y-12 px-4 md:px-12 lg:px-16">
        
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-3">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white hover:text-red-500 cursor-pointer transition-colors duration-200">
              {row.title}
            </h2>
            
            {/* Horizontal Scrollable Carousel */}
            <div className="relative group/row">
              <div className="flex space-x-2 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth">
                {row.books.map((book) => {
                  const isSelected = selectedBook?.id === book.id;
                  return (
                    <div
                      key={book.id}
                      onClick={() => handleBookClick(book, rowIndex)}
                      className={`flex-none w-[140px] sm:w-[200px] aspect-[2/3] bg-zinc-900 overflow-hidden relative cursor-pointer group transition-all duration-300 hover:scale-105 hover:z-30 select-none ${
                        isSelected ? 'ring-4 ring-red-600 scale-[1.02]' : ''
                      }`}
                    >
                      {/* Book Cover Image */}
                      <img
                        src={book.coverImage}
                        alt={book.displayTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <span className="text-[10px] font-black text-red-500 tracking-wider">CUENTO</span>
                        <span className="text-xs font-black text-white leading-tight mb-1">{book.displayTitle}</span>
                        <span className="text-[9px] font-bold text-slate-300">{book.recommendedAge}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inline Expandable Detail Panel (Only shows right under the active row) */}
            {activeRowIndex === rowIndex && selectedBook && (
              <div className="w-full bg-[#181818] border-y border-zinc-800 p-6 md:p-10 rounded-none relative animate-fade-in transition-all duration-500">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    setActiveRowIndex(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Image Cover & Basic Info */}
                  <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.displayTitle}
                      className="w-full max-w-[240px] aspect-[2/3] object-cover shadow-2xl border border-zinc-800"
                    />
                  </div>

                  {/* Right Column: Extended details */}
                  <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    
                    {/* Header */}
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                        {selectedBook.displayTitle}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm font-semibold text-slate-400">
                        <span className="text-red-500 font-bold uppercase tracking-wider text-xs">Cuento</span>
                        <span>•</span>
                        <span className="text-green-400">{selectedBook.recommendedAge}</span>
                        <span>•</span>
                        <span>{selectedBook.pagesCount || 12} páginas</span>
                      </div>
                    </div>

                    {/* Synopsis & Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 space-y-4">
                        <p className="text-sm leading-relaxed text-slate-200">
                          {selectedBook.summary}
                        </p>
                        
                        <div className="pt-2 flex flex-wrap gap-3">
                          <button
                            onClick={() => handleOpenPdf(selectedBook.pdfUrl)}
                            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded text-xs sm:text-sm shadow transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Leer PDF Completo</span>
                          </button>
                        </div>
                      </div>

                      {/* Educational Value Pill Card */}
                      <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800/80 p-5 space-y-3.5">
                        <div className="flex items-center space-x-2 text-xs font-black text-amber-500 uppercase tracking-widest">
                          <GraduationCap className="w-4 h-4" />
                          <span>Valor Pedagógico</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          {selectedBook.objective}
                        </p>
                      </div>
                    </div>

                    {/* Previews Grid for Coloring Pages */}
                    {selectedBook.coloringSvgs && selectedBook.coloringSvgs.length > 0 && (
                      <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                        <h4 className="text-xs uppercase font-black tracking-widest text-slate-400">
                          Láminas para colorear asociadas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.coloringSvgs.slice(0, 8).map((svg, sIdx) => (
                            <div
                              key={sIdx}
                              className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 border border-zinc-800 hover:border-red-500 transition-colors flex items-center justify-center p-1.5 cursor-pointer relative group"
                            >
                              <img src={svg} alt="Colorear" className="max-w-full max-h-full invert opacity-80" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-red-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  );
};
