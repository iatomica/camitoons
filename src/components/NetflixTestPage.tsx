import React, { useState } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { Play, X, FileText, ChevronLeft, ChevronRight, Palette, Puzzle, Search, Eye, CircleDot, Compass } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  
  // First 6 books for Disney+/Netflix style featured widescreen
  const featuredRowBooks = BOOKS_DATA.slice(0, 6);
  
  // Categorized rows (excluding featured books to avoid duplicates)
  const remainingBooks = BOOKS_DATA.slice(6);
  const rows = [
    { title: 'Luna y la Selva de las Emociones', books: remainingBooks.filter(b => b.recommendedAge.includes('3')) },
    { title: 'Autonomía y Nuevos Retos', books: remainingBooks.filter(b => b.recommendedAge.includes('4')) },
    { title: 'Primeros Descubrimientos', books: remainingBooks.filter(b => b.recommendedAge.includes('2')) }
  ];

  const GAMES_LIST = [
    { title: 'Taller de Colorear', icon: Palette, color: 'text-pink-500' },
    { title: 'Rompecabezas', icon: Puzzle, color: 'text-amber-500' },
    { title: '5 Diferencias', icon: Search, color: 'text-purple-500' },
    { title: 'Memotest', icon: Eye, color: 'text-indigo-500' },
    { title: 'Ta-Te-Ti', icon: CircleDot, color: 'text-rose-500' },
    { title: 'Escondidas', icon: Compass, color: 'text-emerald-500' }
  ];

  const handleBookClick = (bookId: string) => {
    if (expandedBookId === bookId) {
      setExpandedBookId(null);
    } else {
      setExpandedBookId(bookId);
    }
  };

  const handleOpenPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      const cleanUrl = pdfUrl.startsWith('/api/media/') ? pdfUrl : `/api/media/${pdfUrl}`;
      window.open(cleanUrl, '_blank');
    }
  };

  const scrollRow = (rowId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(rowId);
    if (el) {
      const scrollAmount = 500;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/60 to-transparent backdrop-blur-sm sm:backdrop-blur-none">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-6 min-w-0">
            <span 
              className="text-red-600 font-serif font-black text-xl sm:text-2xl tracking-tight cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0" 
              onClick={onGoBackHome}
            >
              CAMITOONS
            </span>
            <span className="bg-red-600/10 text-red-500 border border-red-500/20 text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-widest shrink-0">
              Modern UI
            </span>
          </div>
          
          <button
            onClick={onGoBackHome}
            className="text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-md transition-colors shrink-0"
          >
            Volver al Home
          </button>
        </div>
      </header>

      {/* Hero Billboard Banner */}
      <div className="relative w-full h-[65vh] min-h-[420px] max-h-[620px] bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={BOOKS_DATA[18]?.coverImage || BOOKS_DATA[0].coverImage}
            alt="Luna Destacado"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
        </div>

        {/* Added top padding to prevent header overlap */}
        <div className="relative z-10 max-w-xl px-6 md:px-12 lg:px-16 pt-20 sm:pt-28 space-y-4">
          <div className="inline-flex items-center space-x-2">
            <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded tracking-wide">ESTRENO</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest">Luna está Creciendo</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight text-white">
            {BOOKS_DATA[18]?.displayTitle || BOOKS_DATA[0].displayTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-lg">
            {BOOKS_DATA[18]?.intro || BOOKS_DATA[0].summary}
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => handleOpenPdf(BOOKS_DATA[18]?.pdfUrl || BOOKS_DATA[0].pdfUrl)}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-200 text-black font-bold px-5 py-2.5 rounded-lg text-xs transition-transform active:scale-95 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Leer Cuento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 -mt-12 sm:-mt-20 pb-24 space-y-16 px-6 max-w-7xl mx-auto">
        
        {/* Row 1: Widescreen Featured Row */}
        <div className="space-y-4 relative group/featured">
          <div className="text-center space-y-1">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-red-500">Estrenos Destacados</h3>
            <h2 className="text-lg sm:text-xl font-serif font-black text-white">Widescreen Selection</h2>
          </div>

          <div className="relative">
            {/* Scroll Navigation */}
            <button 
              onClick={() => scrollRow('featured-row', 'left')} 
              className="absolute left-0 top-0 bottom-0 z-30 w-10 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity duration-200 hover:bg-black/80 rounded-l-2xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              id="featured-row"
              className={`flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth ${
                featuredRowBooks.length < 5 ? 'justify-start md:justify-center' : 'justify-start'
              }`}
            >
              {featuredRowBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && featuredRowBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none w-[300px] sm:w-[480px] aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-2xl z-30 border border-zinc-800"
                    >
                      {/* Full size background image */}
                      <img
                        src={book.coverImage}
                        alt={book.displayTitle}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      {/* Sombra de degradado para legibilidad */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

                      <div className="relative z-20 h-full w-full p-4 flex flex-col justify-between">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedBookId(null); }}
                          className="self-end p-1 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-black text-red-500 tracking-widest uppercase">Cuento Destacado</span>
                          <h4 className="text-xs sm:text-sm font-serif font-black text-white truncate leading-snug">{book.displayTitle}</h4>
                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed max-w-sm sm:max-w-md">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] transition-all hover:scale-105 active:scale-95 shadow"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Leer PDF</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className={`flex-none aspect-video bg-zinc-950 overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-zinc-900 hover:border-zinc-700 hover:scale-105 hover:z-20 shadow-md ${
                      hasAnyExpanded
                        ? 'w-[70px] sm:w-[100px] opacity-35 -mx-1 sm:-mx-2 scale-95'
                        : 'w-[150px] sm:w-[240px]'
                    }`}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent p-2.5">
                      <span className="text-[9px] font-black text-white truncate block">{book.displayTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('featured-row', 'right')} 
              className="absolute right-0 top-0 bottom-0 z-30 w-10 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity duration-200 hover:bg-black/80 rounded-r-2xl"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rows 2+: Vertical Posters Rows */}
        {rows.map((row, rowIndex) => {
          const isShortRow = row.books.length < 5;
          return (
            <div key={rowIndex} className="space-y-4 relative group/row-container">
              <div className="text-center space-y-1">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Colección</h3>
                <h2 className="text-lg sm:text-xl font-serif font-black text-white">{row.title}</h2>
              </div>

              <div className="relative">
                <button 
                  onClick={() => scrollRow(`row-${rowIndex}`, 'left')} 
                  className="absolute left-0 top-0 bottom-0 z-30 w-10 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity duration-200 hover:bg-black/80 rounded-l-2xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div 
                  id={`row-${rowIndex}`}
                  className={`flex space-x-2 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth ${
                    isShortRow ? 'justify-start md:justify-center' : 'justify-start'
                  }`}
                >
                  {row.books.map((book) => {
                    const isExpanded = expandedBookId === book.id;
                    const hasAnyExpanded = expandedBookId !== null && row.books.some(b => b.id === expandedBookId);
                    
                    if (isExpanded) {
                      return (
                        <div
                          key={book.id}
                          className="flex-none w-[320px] sm:w-[480px] aspect-video sm:aspect-[16/10] bg-zinc-900 rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-2xl z-30 border border-zinc-800"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.displayTitle}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent z-10" />

                          <div className="relative z-20 h-full w-full p-4 flex flex-col justify-between">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setExpandedBookId(null); }}
                              className="self-end p-1 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <span className="text-[8px] font-black text-red-500 tracking-widest uppercase">Cuento Infantil</span>
                              <h4 className="text-xs sm:text-sm font-serif font-black text-white truncate leading-snug">{book.displayTitle}</h4>
                              <p className="text-[10px] text-slate-300 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-sm sm:max-w-md">{book.summary}</p>
                              
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{book.recommendedAge}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                                  className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] transition-all hover:scale-105 active:scale-95 shadow"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Leer PDF</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={book.id}
                        onClick={() => handleBookClick(book.id)}
                        className={`flex-none aspect-[2/3] bg-zinc-950 overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-zinc-900 hover:border-zinc-700 hover:scale-105 hover:z-20 shadow-md ${
                          hasAnyExpanded
                            ? 'w-[65px] sm:w-[95px] opacity-35 -mx-1 sm:-mx-2 scale-95'
                            : 'w-[110px] sm:w-[160px]'
                        }`}
                      >
                        <img
                          src={book.coverImage}
                          alt={book.displayTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => scrollRow(`row-${rowIndex}`, 'right')} 
                  className="absolute right-0 top-0 bottom-0 z-30 w-10 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity duration-200 hover:bg-black/80 rounded-r-2xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Minijuegos Section (Dark Minimalist) */}
        <section id="juegos-test" className="py-12 border-t border-zinc-900/60 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-red-500">Actividades Lúdicas</h3>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">Zona Infantil Interactiva</h2>
              <p className="text-xs text-slate-400">6 minijuegos minimalistas perfectamente alineados para aprender jugando.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {GAMES_LIST.map((game, idx) => {
                const Icon = game.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#0f0f0f] hover:bg-[#141414] border border-zinc-900 hover:border-zinc-800 transition-all p-5 flex flex-col items-center justify-center text-center space-y-2.5 rounded-xl cursor-pointer group shadow-md"
                  >
                    <div className={`${game.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{game.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Árbol de Personajes Section (Dark Minimalist Grid) */}
        <section id="personajes-test" className="py-12 border-t border-zinc-900/60 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-red-500">Universo CamiToons</h3>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">Vínculos & Personajes</h2>
              <p className="text-xs text-slate-400">El entorno afectivo que acompaña a Luna en sus historias.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Luna', img: '/api/media/Imagenes/personajes/arbol de vinculos/luna.webp' },
                { name: 'Mamá Clara', img: '/api/media/Imagenes/personajes/arbol de vinculos/mama.webp' },
                { name: 'Papá Gio', img: '/api/media/Imagenes/personajes/arbol de vinculos/papa.webp' },
                { name: 'Hermana Sol', img: '/api/media/Imagenes/personajes/arbol de vinculos/hermana.webp' },
                { name: 'Abuela Elsa', img: '/api/media/Imagenes/personajes/arbol de vinculos/Abuela Elsa .webp' },
                { name: 'Abuelo Ángel', img: '/api/media/Imagenes/personajes/arbol de vinculos/Abuelo angel.webp' }
              ].map((p, pIdx) => (
                <div key={pIdx} className="flex flex-col items-center space-y-2 cursor-pointer group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-850 group-hover:border-red-500 transition-colors shadow-lg">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Autora Section (Dark Minimalist Banner) */}
        <section id="autora-test" className="py-12 border-t border-zinc-900/60 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-zinc-900 shadow-xl">
                <img src="/api/media/Imagenes/cami autora.webp" alt="Camila" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8 space-y-2.5 text-center md:text-left">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-red-500">Detrás de las ilustraciones</h3>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">Camila • Autora e Ilustradora</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Diseño cada historia con un enfoque pedagógico y afectivo, creando un espacio de lectura compartida que acompaña de manera respetuosa el crecimiento de las infancias.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="py-8 bg-black/60 border-t border-zinc-900/60 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CamiToons. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};
