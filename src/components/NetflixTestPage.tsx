import React, { useState, useEffect } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { Play, X, FileText, ChevronLeft, ChevronRight, Palette, Puzzle, Search, Eye, CircleDot, Compass } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  
  // Carousel featured books (top 5)
  const featuredBooks = BOOKS_DATA.slice(0, 5);
  
  // Categorized collections
  const remainingBooks = BOOKS_DATA.slice(5);
  const rows = [
    { id: 'row-emociones', title: 'Luna y sus Emociones', books: remainingBooks.filter(b => b.recommendedAge.includes('3')) },
    { id: 'row-autonomia', title: 'Autonomía & Crecimiento', books: remainingBooks.filter(b => b.recommendedAge.includes('4')) },
    { id: 'row-primeros', title: 'Primeros Descubrimientos', books: remainingBooks.filter(b => b.recommendedAge.includes('2')) }
  ];

  const GAMES_LIST = [
    { title: 'Taller de Colorear', icon: Palette, color: 'text-pink-400' },
    { title: 'Rompecabezas', icon: Puzzle, color: 'text-amber-400' },
    { title: '5 Diferencias', icon: Search, color: 'text-purple-400' },
    { title: 'Memotest', icon: Eye, color: 'text-indigo-450' },
    { title: 'Ta-Te-Ti', icon: CircleDot, color: 'text-rose-450' },
    { title: 'Escondidas', icon: Compass, color: 'text-emerald-400' }
  ];

  const handleBookClick = (bookId: string) => {
    setExpandedBookId(prev => (prev === bookId ? null : bookId));
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
      const scrollAmount = 480;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c111b] bg-gradient-to-b from-[#0c111b] to-[#040714] text-[#f9f9f9] font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Disney+ Style Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c111b]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-8 min-w-0">
            <span 
              className="text-white font-sans font-black tracking-widest text-lg sm:text-xl cursor-pointer hover:opacity-85 transition-all shrink-0 uppercase" 
              onClick={onGoBackHome}
            >
              CAMITOONS
            </span>
            <nav className="hidden md:flex items-center space-x-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="#cuentos-test" className="hover:text-white transition-colors">Cuentos</a>
              <a href="#juegos-test" className="hover:text-white transition-colors">Juegos</a>
              <a href="#personajes-test" className="hover:text-white transition-colors">Personajes</a>
              <a href="#autora-test" className="hover:text-white transition-colors">Autora</a>
            </nav>
          </div>
          
          <button
            onClick={onGoBackHome}
            className="text-[10px] font-black uppercase tracking-[0.15em] bg-white/10 hover:bg-white/20 border border-white/15 text-white px-4 py-2 rounded transition-colors shrink-0"
          >
            Volver
          </button>
        </div>
      </header>

      {/* Hero Featured Row (Disney+ Slideshow style) */}
      <div className="pt-24 sm:pt-28 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group">
          <img
            src={BOOKS_DATA[18]?.coverImage || BOOKS_DATA[0].coverImage}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c111b] via-[#0c111b]/35 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c111b]/80 via-transparent to-transparent z-10" />

          {/* Minimalist Info Card overlay */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 z-20 max-w-lg space-y-2 sm:space-y-3.5">
            <span className="text-[9px] font-black tracking-[0.25em] text-blue-400 uppercase block">RECOMENDADO</span>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-sans font-black tracking-wide text-white leading-tight">
              {BOOKS_DATA[18]?.displayTitle || BOOKS_DATA[0].displayTitle}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2 max-w-sm sm:max-w-md">
              {BOOKS_DATA[18]?.intro || BOOKS_DATA[0].summary}
            </p>
            <div className="pt-1.5">
              <button
                onClick={() => handleOpenPdf(BOOKS_DATA[18]?.pdfUrl || BOOKS_DATA[0].pdfUrl)}
                className="inline-flex items-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-black px-5 py-2.5 rounded text-[10px] tracking-[0.1em] uppercase shadow transition-transform active:scale-95"
              >
                <Play className="w-3 h-3 fill-black text-black" />
                <span>Leer Cuento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div id="cuentos-test" className="mt-12 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-14">
        
        {/* Disney+ Style Featured Row */}
        <div className="space-y-3.5 relative group/featured">
          <div className="text-center space-y-1">
            <h2 className="text-xs sm:text-sm font-sans font-black tracking-[0.2em] uppercase text-blue-400">
              Estrenos Destacados
            </h2>
          </div>

          <div className="relative">
            {/* Minimalist Navigation Arrows */}
            <button 
              onClick={() => scrollRow('featured-row', 'left')}
              className="absolute -left-4 top-0 bottom-0 z-30 w-10 bg-gradient-to-r from-[#0c111b] to-transparent text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity hover:text-blue-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div 
              id="featured-row"
              className="flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start"
            >
              {featuredBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && featuredBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none w-[280px] sm:w-[460px] aspect-video bg-[#1a2232] rounded-xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_16px_36px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.displayTitle}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c111b] via-[#0c111b]/80 to-transparent z-10" />

                      <div className="relative z-20 h-full w-full p-4 flex flex-col justify-between">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedBookId(null); }}
                          className="self-end p-1 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Destacado</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-2 rounded text-[9px] tracking-wider uppercase transition-all shadow"
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
                    className={`flex-none aspect-video bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${
                      hasAnyExpanded ? 'w-[70px] sm:w-[90px] opacity-30 -mx-1 scale-95' : 'w-[140px] sm:w-[220px]'
                    }`}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c111b] via-[#0c111b]/40 to-transparent p-2">
                      <span className="text-[9px] font-black text-white truncate block">{book.displayTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('featured-row', 'right')}
              className="absolute -right-4 top-0 bottom-0 z-30 w-10 bg-gradient-to-l from-[#0c111b] to-transparent text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity hover:text-blue-400"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Rows 2+: Vertical Posters Rows */}
        {rows.map((row) => (
          <div key={row.id} className="space-y-3.5 relative group/row-container">
            <div className="text-center space-y-1">
              <h2 className="text-xs sm:text-sm font-sans font-black tracking-[0.2em] uppercase text-blue-400">
                {row.title}
              </h2>
            </div>

            <div className="relative">
              <button 
                onClick={() => scrollRow(row.id, 'left')}
                className="absolute -left-4 top-0 bottom-0 z-30 w-10 bg-gradient-to-r from-[#0c111b] to-transparent text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity hover:text-blue-400"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div 
                id={row.id}
                className="flex space-x-2.5 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start"
              >
                {row.books.map((book) => {
                  const isExpanded = expandedBookId === book.id;
                  const hasAnyExpanded = expandedBookId !== null && row.books.some(b => b.id === expandedBookId);
                  
                  if (isExpanded) {
                    return (
                      <div
                        key={book.id}
                        className="flex-none w-[300px] sm:w-[460px] aspect-video sm:aspect-[16/10] bg-[#1a2232] rounded-xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_16px_36px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.displayTitle}
                          className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c111b] via-[#0c111b]/85 to-transparent z-10" />

                        <div className="relative z-20 h-full w-full p-4 flex flex-col justify-between">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setExpandedBookId(null); }}
                            className="self-end p-1 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Cuento</span>
                            <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate leading-snug">{book.displayTitle}</h4>
                            <p className="text-[10px] text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">{book.summary}</p>
                            
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{book.recommendedAge}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-2 rounded text-[9px] tracking-wider uppercase transition-all shadow"
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
                      className={`flex-none aspect-[2/3] bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${
                        hasAnyExpanded ? 'w-[60px] sm:w-[90px] opacity-30 -mx-1 scale-95' : 'w-[105px] sm:w-[155px]'
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
                onClick={() => scrollRow(row.id, 'right')}
                className="absolute -right-4 top-0 bottom-0 z-30 w-10 bg-gradient-to-l from-[#0c111b] to-transparent text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity hover:text-blue-400"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}

        {/* Minijuegos Section */}
        <section id="juegos-test" className="py-12 border-t border-white/5 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[10px] font-sans font-black tracking-[0.25em] text-blue-400 uppercase">Actividades Lúdicas</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black tracking-wider uppercase text-white">Zona Interactiva</h2>
              <p className="text-xs text-slate-400">6 minijuegos alineados para aprender jugando.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {GAMES_LIST.map((game, idx) => {
                const Icon = game.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#121824] hover:bg-[#1a2232] border border-white/5 hover:border-slate-400 transition-all p-5 flex flex-col items-center justify-center text-center space-y-2.5 rounded-xl cursor-pointer group shadow-lg"
                  >
                    <div className={`${game.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">{game.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Árbol de Personajes Section */}
        <section id="personajes-test" className="py-12 border-t border-white/5 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[10px] font-sans font-black tracking-[0.25em] text-blue-400 uppercase">Universo CamiToons</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black tracking-wider uppercase text-white">Vínculos & Personajes</h2>
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
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-white/10 group-hover:border-slate-300 transition-colors shadow-lg">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Autora Section */}
        <section id="autora-test" className="py-12 border-t border-white/5 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img src="/api/media/Imagenes/cami autora.webp" alt="Camila" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8 space-y-2.5 text-center md:text-left">
              <h3 className="text-[10px] font-sans font-black tracking-[0.25em] text-blue-400 uppercase">Detrás de las ilustraciones</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black tracking-wider uppercase text-white">Camila • Autora e Ilustradora</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Diseño cada historia con un enfoque pedagógico y afectivo, creando un espacio de lectura compartida que acompaña de manera respetuosa el crecimiento de las infancias.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="py-8 bg-black/40 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CamiToons. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};
