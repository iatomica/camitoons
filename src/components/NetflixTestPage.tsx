import React, { useState } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { getMediaUrl } from '../utils/media';
import { Play, X, FileText, ChevronLeft, ChevronRight, Palette, Puzzle, Search, Eye, CircleDot, Compass } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  
  const camitoonsLogo = getMediaUrl('images/CamiToonsLogo.webp');

  // Featured books (first 5)
  const featuredRowBooks = BOOKS_DATA.slice(0, 5);
  
  // Categorized collections
  const remainingBooks = BOOKS_DATA.slice(5);
  
  const emocionesBooks = remainingBooks.filter(b => b.recommendedAge.includes('3')).slice(0, 5);
  const autonomiaBooks = remainingBooks.filter(b => b.recommendedAge.includes('4')).slice(0, 5);
  const primerosBooks = remainingBooks.filter(b => b.recommendedAge.includes('2')).slice(0, 5);

  const GAMES_LIST = [
    { title: 'Taller de Colorear', icon: Palette, color: 'text-pink-400' },
    { title: 'Rompecabezas', icon: Puzzle, color: 'text-amber-400' },
    { title: '5 Diferencias', icon: Search, color: 'text-purple-400' },
    { title: 'Memotest', icon: Eye, color: 'text-indigo-400' },
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
      const scrollAmount = 450;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c111b] bg-gradient-to-b from-[#0c111b] to-[#040714] text-[#f9f9f9] font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c111b]/95 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-6 min-w-0">
            <div className="h-10 sm:h-12 w-auto flex items-center shrink-0 cursor-pointer" onClick={onGoBackHome}>
              <img src={camitoonsLogo} alt="CamiToons Logo" className="h-full w-auto object-contain" />
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              <a href="#cuentos-test" className="hover:text-white transition-colors">Cuentos</a>
              <a href="#juegos-test" className="hover:text-white transition-colors">Juegos</a>
              <a href="#personajes-test" className="hover:text-white transition-colors">Personajes</a>
              <a href="#autora-test" className="hover:text-white transition-colors">Autora</a>
            </nav>
          </div>
          
          <button
            onClick={onGoBackHome}
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 border border-white/15 text-white px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            Volver
          </button>
        </div>
      </header>

      {/* Floating Billboard Slide */}
      <div className="pt-24 sm:pt-28 px-6 max-w-7xl mx-auto">
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group">
          <img
            src={BOOKS_DATA[18]?.coverImage || BOOKS_DATA[0].coverImage}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c111b] via-[#0c111b]/35 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c111b]/80 via-transparent to-transparent z-10" />

          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 z-20 max-w-md space-y-2 sm:space-y-3.5">
            <span className="text-[9px] font-black tracking-[0.25em] text-blue-400 uppercase block">RECOMENDADO</span>
            <h1 className="text-xl sm:text-3xl font-sans font-black tracking-wide text-white leading-tight">
              {BOOKS_DATA[18]?.displayTitle || BOOKS_DATA[0].displayTitle}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed line-clamp-2 max-w-sm">
              {BOOKS_DATA[18]?.intro || BOOKS_DATA[0].summary}
            </p>
            <div className="pt-1">
              <button
                onClick={() => handleOpenPdf(BOOKS_DATA[18]?.pdfUrl || BOOKS_DATA[0].pdfUrl)}
                className="inline-flex items-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-black px-4.5 py-2.5 rounded text-[10px] tracking-[0.1em] uppercase shadow transition-transform active:scale-95"
              >
                <Play className="w-3 h-3 fill-black text-black" />
                <span>Leer Cuento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interleaved Sections Grid Container */}
      <div id="cuentos-test" className="mt-12 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* BLOCK 1: Widescreen Featured Row */}
        <div className="space-y-4 relative group/featured">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-blue-400">Estrenos</h3>
            <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Selección Especial</h2>
          </div>

          <div className="relative">
            {/* Minimalist Circular Navigation Button Left */}
            <button 
              onClick={() => scrollRow('featured-row', 'left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* w-full flex row with height rigid to cover the block width, with overflow-x-auto for scroll compatibility */}
            <div 
              id="featured-row"
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[140px] sm:h-[220px]"
            >
              {featuredRowBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && featuredRowBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                      style={{ flexGrow: 3, width: '280px', minWidth: '280px' }}
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
                          className="self-end p-0.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Destacado</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 leading-relaxed max-w-md">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-lg text-[9px] tracking-wider uppercase transition-all shadow active:scale-95"
                            >
                              <FileText className="w-3.5 h-3.5" />
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '150px' : '220px',
                      minWidth: '100px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent p-3">
                      <span className="text-[10px] font-black text-white truncate block">{book.displayTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimalist Circular Navigation Button Right */}
            <button 
              onClick={() => scrollRow('featured-row', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOCK 2: Minijuegos Grid */}
        <section id="juegos-test" className="py-8 border-t border-b border-white/5">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[9px] font-sans font-black tracking-[0.3em] text-blue-400 uppercase">Actividades</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Zona Interactiva</h2>
              <p className="text-xs text-slate-400">6 minijuegos alineados para aprender jugando en casa.</p>
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

        {/* BLOCK 3: Carousel 2 - Emociones */}
        <div className="space-y-4 relative group/emociones">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-blue-400">Colección</h3>
            <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Luna y sus Emociones</h2>
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollRow('row-emociones', 'left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/emociones:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              id="row-emociones"
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[220px] sm:h-[320px]"
            >
              {emocionesBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && emocionesBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                      style={{ flexGrow: 3, width: '280px', minWidth: '280px' }}
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
                          className="self-end p-0.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-3 leading-relaxed max-w-md">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-lg text-[9px] tracking-wider uppercase transition-all shadow active:scale-95"
                            >
                              <FileText className="w-3.5 h-3.5" />
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '110px' : '210px',
                      minWidth: '80px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('row-emociones', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/emociones:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOCK 4: Decorative Illustration Fade Banner */}
        <div className="relative h-[180px] sm:h-[260px] w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <img
            src={BOOKS_DATA[10]?.coverImage || BOOKS_DATA[0].coverImage}
            alt="Decorative Fade Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0c111b] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c111b] to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c111b] to-transparent z-10" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0c111b] to-transparent z-10" />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs sm:text-base text-slate-300 font-serif italic max-w-xl leading-relaxed">
              "La lectura compartida en las primeras infancias es un puente de afecto que fortalece la seguridad emocional y abre universos de exploración sensorial."
            </p>
            <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase mt-2">CamiToons Pedagogía</span>
          </div>
        </div>

        {/* BLOCK 5: Carousel 3 - Autonomía */}
        <div className="space-y-4 relative group/autonomia">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-blue-400">Colección</h3>
            <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Autonomía & Crecimiento</h2>
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollRow('row-autonomia', 'left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/autonomia:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              id="row-autonomia"
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[180px] sm:h-[260px]"
            >
              {autonomiaBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && autonomiaBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                      style={{ flexGrow: 3, width: '280px', minWidth: '280px' }}
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
                          className="self-end p-0.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-3 leading-relaxed max-w-md">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-lg text-[9px] tracking-wider uppercase transition-all shadow active:scale-95"
                            >
                              <FileText className="w-3.5 h-3.5" />
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '130px' : '260px',
                      minWidth: '90px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('row-autonomia', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/autonomia:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* BLOCK 6: Árbol de Personajes */}
        <section id="personajes-test" className="py-8 border-t border-b border-white/5 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[9px] font-sans font-black tracking-[0.25em] text-blue-400 uppercase">Universo CamiToons</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Vínculos & Personajes</h2>
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

        {/* BLOCK 7: Carousel 4 - Primeros Descubrimientos */}
        <div className="space-y-4 relative group/primeros">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-blue-400">Colección</h3>
            <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Primeros Descubrimientos</h2>
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollRow('row-primeros', 'left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/primeros:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              id="row-primeros"
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[140px] sm:h-[200px]"
            >
              {primerosBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && primerosBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className="flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border border-blue-500/35 z-30"
                      style={{ flexGrow: 3, width: '280px', minWidth: '280px' }}
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
                          className="self-end p-0.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-3 leading-relaxed max-w-md">{book.summary}</p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenPdf(book.pdfUrl); }}
                              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-lg text-[9px] tracking-wider uppercase transition-all shadow active:scale-95"
                            >
                              <FileText className="w-3.5 h-3.5" />
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '150px' : '300px',
                      minWidth: '100px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('row-primeros', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/primeros:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOCK 8: Autora Section */}
        <section id="autora-test" className="py-12 border-t border-white/5 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img src="/api/media/Imagenes/cami autora.webp" alt="Camila" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8 space-y-2.5 text-center md:text-left">
              <h3 className="text-[10px] font-sans font-black tracking-[0.25em] text-blue-400 uppercase">Detrás de las ilustraciones</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Camila • Autora e Ilustradora</h2>
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
