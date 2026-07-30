import React, { useState } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { getMediaUrl } from '../utils/media';
import { PdfFlipbookViewer } from './PdfFlipbookViewer';
import { Play, X, FileText, ChevronLeft, ChevronRight, Palette, Puzzle, Search, Eye, CircleDot, Compass } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

type ThemeType = 'disney' | 'midnight' | 'forest' | 'crimson';

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState<number>(0);
  const [readingBook, setReadingBook] = useState<BookStory | null>(null);
  const [infoBook, setInfoBook] = useState<BookStory | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeType>('disney');
  
  const camitoonsLogo = getMediaUrl('images/CamiToonsLogo.webp');

  // Theme dynamic configuration
  const themeStyles = {
    disney: {
      bg: 'bg-[#0c111b] bg-gradient-to-b from-[#0c111b] to-[#040714]',
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-600 hover:bg-blue-750',
      borderAccent: 'border-blue-500/35',
      headerBg: 'bg-[#0c111b]/95',
      badge: 'bg-blue-600/20 text-blue-400 border-blue-500/20',
      dot: 'bg-blue-500'
    },
    midnight: {
      bg: 'bg-[#12091c] bg-gradient-to-b from-[#12091c] to-[#07030c]',
      accentText: 'text-purple-400',
      accentBg: 'bg-purple-600 hover:bg-purple-750',
      borderAccent: 'border-purple-500/35',
      headerBg: 'bg-[#12091c]/95',
      badge: 'bg-purple-600/20 text-purple-400 border-purple-500/20',
      dot: 'bg-purple-500'
    },
    forest: {
      bg: 'bg-[#06120e] bg-gradient-to-b from-[#06120e] to-[#020605]',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-600 hover:bg-emerald-750',
      borderAccent: 'border-emerald-500/35',
      headerBg: 'bg-[#06120e]/95',
      badge: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500'
    },
    crimson: {
      bg: 'bg-[#1c070c] bg-gradient-to-b from-[#1c070c] to-[#0b0204]',
      accentText: 'text-red-400',
      accentBg: 'bg-red-650 hover:bg-red-750',
      borderAccent: 'border-red-500/35',
      headerBg: 'bg-[#1c070c]/95',
      badge: 'bg-red-600/20 text-red-400 border-red-500/20',
      dot: 'bg-red-500'
    }
  };

  const activeTheme = themeStyles[theme];

  // Slider featured books (3 titles)
  const sliderBooks = [
    BOOKS_DATA.find(b => b.id === 'book-19') || BOOKS_DATA[0],
    BOOKS_DATA.find(b => b.id === 'book-18') || BOOKS_DATA[1],
    BOOKS_DATA.find(b => b.id === 'book-13') || BOOKS_DATA[2]
  ];

  // Carousel featured books (top 5 for row 1)
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
    { title: 'Ta-Te-Ti', icon: CircleDot, color: 'text-rose-455' },
    { title: 'Escondidas', icon: Compass, color: 'text-emerald-400' }
  ];

  const handleBookClick = (bookId: string) => {
    setExpandedBookId(prev => (prev === bookId ? null : bookId));
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

  const handleNextSlide = () => {
    setActiveFeaturedIndex(prev => (prev === sliderBooks.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setActiveFeaturedIndex(prev => (prev === 0 ? sliderBooks.length - 1 : prev - 1));
  };

  // Touch handlers for mobile swipe gesture on main billboard banner
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

  // Helper to extract a shorter synopsis (the first sentence)
  const getShortSynopsis = (summary: string) => {
    if (!summary) return '';
    const firstSentence = summary.split('.')[0] + '.';
    return firstSentence.length > 95 ? firstSentence.substring(0, 92) + '...' : firstSentence;
  };

  const activeBillboardBook = sliderBooks[activeFeaturedIndex];

  return (
    <div className={`min-h-screen ${activeTheme.bg} text-[#f9f9f9] font-sans overflow-x-hidden selection:bg-blue-650 selection:text-white pb-20 transition-all duration-700`}>
      
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${activeTheme.headerBg} backdrop-blur-md border-b border-white/5 transition-all`}>
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
          
          <div className="flex items-center space-x-4 shrink-0">
            {/* Theme Selector Palette */}
            <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-full border border-white/10 shrink-0">
              <button onClick={() => setTheme('disney')} className={`w-3.5 h-3.5 rounded-full bg-blue-600 border ${theme === 'disney' ? 'border-white scale-110' : 'border-transparent opacity-65 hover:opacity-100'}`} title="Disney Blue" />
              <button onClick={() => setTheme('midnight')} className={`w-3.5 h-3.5 rounded-full bg-purple-650 border ${theme === 'midnight' ? 'border-white scale-110' : 'border-transparent opacity-65 hover:opacity-100'}`} title="Midnight Purple" />
              <button onClick={() => setTheme('forest')} className={`w-3.5 h-3.5 rounded-full bg-emerald-600 border ${theme === 'forest' ? 'border-white scale-110' : 'border-transparent opacity-65 hover:opacity-100'}`} title="Forest Green" />
              <button onClick={() => setTheme('crimson')} className={`w-3.5 h-3.5 rounded-full bg-red-650 border ${theme === 'crimson' ? 'border-white scale-110' : 'border-transparent opacity-65 hover:opacity-100'}`} title="Deep Crimson" />
            </div>

            <button
              onClick={onGoBackHome}
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* BLOCK 1: Full-Width Billboard Carousel Banner */}
      <div 
        className="relative w-full h-[65vh] min-h-[440px] max-h-[650px] bg-black overflow-hidden flex items-center group/billboard"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={activeBillboardBook.coverImage}
            alt="Hero Slide"
            className="w-full h-full object-cover object-center opacity-45 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to top, var(--tw-gradient-stops))` }} />
          <div className="absolute inset-0 bg-gradient-to-r via-transparent to-transparent z-10 animate-pulse-slow" style={{ backgroundImage: `linear-gradient(to right, ${theme === 'crimson' ? '#1c070c' : theme === 'forest' ? '#06120e' : theme === 'midnight' ? '#12091c' : '#0c111b'}, transparent)` }} />
        </div>

        {/* Billboard Navigation Dots */}
        <div className="absolute bottom-6 right-8 sm:right-12 z-20 flex space-x-2">
          {sliderBooks.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveFeaturedIndex(dotIdx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                dotIdx === activeFeaturedIndex ? `${activeTheme.dot} w-4` : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Billboard Nav Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 z-20 p-2 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 text-white opacity-0 group-hover/billboard:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 z-20 p-2 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 text-white opacity-0 group-hover/billboard:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Widescreen Content container */}
        <div className="relative z-10 max-w-2xl px-8 sm:px-16 lg:px-24 pt-20 sm:pt-28 space-y-4">
          <div className="inline-flex items-center space-x-2">
            <span className={`bg-white/10 text-white border border-white/15 font-black text-[9px] px-2 py-0.5 rounded tracking-wide`}>ESTRENO DESTACADO</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-350 uppercase tracking-widest">Colección CamiToons</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight text-white uppercase">
            {activeBillboardBook.displayTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-lg">
            {activeBillboardBook.intro || activeBillboardBook.summary}
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => setReadingBook(activeBillboardBook)}
              className="inline-flex items-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-bold px-5 py-2.5 rounded-lg text-xs transition-transform active:scale-95 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Leer Cuento</span>
            </button>
            <button
              onClick={() => setInfoBook(activeBillboardBook)}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
            >
              <span>+ Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div id="cuentos-test" className="mt-12 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* BLOCK 2: Widescreen Selection Carousel */}
        <div className="space-y-4 relative group/featured">
          <div className="text-center space-y-1">
            <h3 className={`text-[9px] uppercase font-black tracking-[0.3em] ${activeTheme.accentText}`}>Estrenos</h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Selección Especial</h2>
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollRow('featured-row', 'left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              id="featured-row"
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[170px] sm:h-[260px]"
            >
              {featuredRowBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && featuredRowBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto`}
                      style={{ flexGrow: 3, width: '380px', minWidth: '380px' }}
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
                        
                        <div className="space-y-1 sm:space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                          <span className={`text-[8px] font-black ${activeTheme.accentText} tracking-[0.2em] uppercase`}>Destacado</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-350 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3 h-3 fill-white text-white" />
                                <span>Leer</span>
                              </button>
                            </div>
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)] group/card"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '210px' : '330px',
                      minWidth: '150px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto">
                      <h4 className="text-[10px] sm:text-xs font-sans font-black text-white truncate mb-2">{book.displayTitle}</h4>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                          className={`$activeTheme.accentBg || 'bg-blue-605'} text-white p-1.5 rounded transition-transform active:scale-95`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                          className="text-[9px] font-black tracking-widest text-slate-300 hover:text-white uppercase"
                        >
                          Ver info
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent p-3 md:group-hover/card:hidden">
                      <span className="text-[10px] font-black text-white truncate block">{book.displayTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('featured-row', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/featured:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOCK 3: Minijuegos Grid */}
        <section id="juegos-test" className="py-8 border-t border-b border-white/5">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className={`text-[9px] font-sans font-black tracking-[0.3em] ${activeTheme.accentText} uppercase`}>Actividades</h3>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Zona Interactiva</h2>
              <p className="text-xs text-slate-400">6 minijuegos alineados para aprender jugando en casa.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {GAMES_LIST.map((game, idx) => {
                const Icon = game.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#121824] hover:bg-[#1a2232] border border-white/5 hover:border-slate-450 transition-all p-5 flex flex-col items-center justify-center text-center space-y-2.5 rounded-xl cursor-pointer group shadow-lg"
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

        {/* BLOCK 4: Carousel 2 - Emociones */}
        <div className="space-y-4 relative group/emociones">
          <div className="text-center space-y-1">
            <h3 className={`text-[9px] uppercase font-black tracking-[0.3em] ${activeTheme.accentText}`}>Colección</h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Luna y sus Emociones</h2>
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
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[260px] sm:h-[360px]"
            >
              {emocionesBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && emocionesBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto animate-[fadeIn_0.3s_ease-out]`}
                      style={{ flexGrow: 3, width: '360px', minWidth: '360px' }}
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
                        
                        <div className="space-y-1 sm:space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                          <span className={`text-[8px] font-black ${activeTheme.accentText} tracking-[0.2em] uppercase`}>Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-350 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3 h-3 fill-white text-white" />
                                <span>Leer</span>
                              </button>
                            </div>
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)] group/card"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '150px' : '240px',
                      minWidth: '100px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto">
                      <h4 className="text-[10px] sm:text-xs font-sans font-black text-white truncate mb-2">{book.displayTitle}</h4>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                          className={`$activeTheme.accentBg || 'bg-blue-605'} text-white p-1.5 rounded transition-transform active:scale-95`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                          className="text-[9px] font-black tracking-widest text-slate-300 hover:text-white uppercase"
                        >
                          Ver info
                        </button>
                      </div>
                    </div>
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

        {/* BLOCK 5: Decorative Illustration Fade Banner */}
        <div className="relative h-[180px] sm:h-[260px] w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5 animate-pulse-slow">
          <img
            src={BOOKS_DATA[10]?.coverImage || BOOKS_DATA[0].coverImage}
            alt="Decorative Fade Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to right, ${theme === 'crimson' ? '#0b0204' : theme === 'forest' ? '#020605' : theme === 'midnight' ? '#07030c' : '#040714'}, transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to left, ${theme === 'crimson' ? '#0b0204' : theme === 'forest' ? '#020605' : theme === 'midnight' ? '#07030c' : '#040714'}, transparent)` }} />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to top, ${theme === 'crimson' ? '#0b0204' : theme === 'forest' ? '#020605' : theme === 'midnight' ? '#07030c' : '#040714'}, transparent)` }} />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to bottom, ${theme === 'crimson' ? '#0b0204' : theme === 'forest' ? '#020605' : theme === 'midnight' ? '#07030c' : '#040714'}, transparent)` }} />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs sm:text-base text-slate-350 font-serif italic max-w-xl leading-relaxed">
              "La lectura compartida en las primeras infancias es un puente de afecto que fortalece la seguridad emocional y abre universos de exploración sensorial."
            </p>
            <span className={`text-[8px] font-black ${activeTheme.accentText} tracking-[0.2em] uppercase mt-2`}>CamiToons Pedagogía</span>
          </div>
        </div>

        {/* BLOCK 6: Carousel 3 - Autonomía */}
        <div className="space-y-4 relative group/autonomia">
          <div className="text-center space-y-1">
            <h3 className={`text-[9px] uppercase font-black tracking-[0.3em] ${activeTheme.accentText}`}>Colección</h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Autonomía & Crecimiento</h2>
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
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[220px] sm:h-[300px]"
            >
              {autonomiaBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && autonomiaBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto animate-[fadeIn_0.3s_ease-out]`}
                      style={{ flexGrow: 3, width: '360px', minWidth: '360px' }}
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
                        
                        <div className="space-y-1 sm:space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                          <span className={`text-[8px] font-black ${activeTheme.accentText} tracking-[0.2em] uppercase`}>Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-350 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3 h-3 fill-white text-white" />
                                <span>Leer</span>
                              </button>
                            </div>
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)] group/card"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '200px' : '300px',
                      minWidth: '120px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto">
                      <h4 className="text-[10px] sm:text-xs font-sans font-black text-white truncate mb-2">{book.displayTitle}</h4>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                          className={`$activeTheme.accentBg || 'bg-blue-605'} text-white p-1.5 rounded transition-transform active:scale-95`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                          className="text-[9px] font-black tracking-widest text-slate-300 hover:text-white uppercase"
                        >
                          Ver info
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => scrollRow('row-autonomia', 'right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/autonomia:opacity-100 transition-opacity rounded-full border border-white/10 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOCK 7: Árbol de Personajes */}
        <section id="personajes-test" className="py-8 border-t border-b border-white/5 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className={`text-[9px] font-sans font-black tracking-[0.25em] ${activeTheme.accentText} uppercase`}>Universo CamiToons</h3>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Vínculos & Personajes</h2>
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
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-350 group-hover:text-white transition-colors">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 8: Carousel 4 - Primeros Descubrimientos */}
        <div className="space-y-4 relative group/primeros">
          <div className="text-center space-y-1">
            <h3 className={`text-[9px] uppercase font-black tracking-[0.3em] ${activeTheme.accentText}`}>Colección</h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Primeros Descubrimientos</h2>
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
              className="w-full flex space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start h-[180px] sm:h-[240px]"
            >
              {primerosBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                const hasAnyExpanded = expandedBookId !== null && primerosBooks.some(b => b.id === expandedBookId);
                
                if (isExpanded) {
                  return (
                    <div
                      key={book.id}
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto animate-[fadeIn_0.3s_ease-out]`}
                      style={{ flexGrow: 3, width: '360px', minWidth: '360px' }}
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
                        
                        <div className="space-y-1 sm:space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                          <span className={`text-[8px] font-black ${activeTheme.accentText} tracking-[0.2em] uppercase`}>Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-355 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3 h-3 fill-white text-white" />
                                <span>Leer</span>
                              </button>
                            </div>
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
                    className="flex-none h-full bg-[#1a2232] overflow-hidden relative cursor-pointer rounded-2xl border border-white/5 hover:border-slate-300 hover:scale-105 hover:z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)] group/card"
                    style={{ 
                      flexGrow: hasAnyExpanded ? 0.8 : 1,
                      width: hasAnyExpanded ? '180px' : '360px',
                      minWidth: '120px',
                      opacity: hasAnyExpanded ? 0.35 : 1
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto">
                      <h4 className="text-[10px] sm:text-xs font-sans font-black text-white truncate mb-2">{book.displayTitle}</h4>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                          className={`$activeTheme.accentBg || 'bg-blue-605'} text-white p-1.5 rounded transition-transform active:scale-95`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                          className="text-[9px] font-black tracking-widest text-slate-300 hover:text-white uppercase"
                        >
                          Ver info
                        </button>
                      </div>
                    </div>
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

        {/* BLOCK 9: Autora Section */}
        <section id="autora-test" className="py-12 border-t border-white/5 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img src="/api/media/Imagenes/cami autora.webp" alt="Camila" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8 space-y-2.5 text-center md:text-left">
              <h3 className={`text-[10px] font-sans font-black tracking-[0.25em] ${activeTheme.accentText} uppercase`}>Detrás de las ilustraciones</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Camila • Autora e Ilustradora</h2>
              <p className="text-xs sm:text-sm text-slate-405 leading-relaxed font-semibold">
                Diseño cada historia con un enfoque pedagógico y afectivo, creando un espacio de lectura compartida que acompaña de manera respetuosa el crecimiento de las infancias.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Visor / Lector de Cuentos (Anti-descarga) */}
      {readingBook && (
        <div className="fixed inset-0 z-50 bg-[#0c111b] flex flex-col animate-fade-in">
          {/* Reader Header */}
          <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0c111b]/95 backdrop-blur-md">
            <span className="font-sans font-black tracking-[0.15em] text-xs uppercase text-slate-350">
              Visor CamiToons • {readingBook.displayTitle}
            </span>
            <button
              onClick={() => setReadingBook(null)}
              className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition-colors border border-white/10 active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
          </div>

          {/* Immersive flipbook viewer container */}
          <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
            {readingBook.pdfUrl ? (
              <div className="w-full max-w-5xl h-full min-h-[400px]">
                <PdfFlipbookViewer
                  pdfUrl={readingBook.pdfUrl}
                  bookTitle={readingBook.displayTitle}
                  darkMode={true}
                />
              </div>
            ) : (
              <div className="text-center p-12 space-y-3 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md mx-auto">
                <p className="text-sm font-bold">Lector no disponible</p>
                <p className="text-xs text-slate-400">El PDF de este título se está procesando.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOCK 10: Technical & Pedagogical Book Info Modal (Full Screen with Scrollable Details) */}
      {infoBook && (
        <div className="fixed inset-0 z-50 bg-[#0c111b]/98 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div className="relative bg-[#161f30] w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.9)] flex flex-col md:flex-row min-h-[450px]">
            
            {/* Close Button */}
            <button
              onClick={() => setInfoBook(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-slate-400 hover:text-white border border-white/5 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Large Fixed Book Cover Art */}
            <div className="w-full md:w-5/12 relative aspect-video md:aspect-auto min-h-[240px] md:min-h-[450px] bg-slate-900">
              <img
                src={infoBook.coverImage}
                alt={infoBook.displayTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#161f30] via-transparent to-transparent z-10" />
            </div>

            {/* Right Side: Scrollable Details Column without breaking UI */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2">
                  <span className={`bg-blue-600/20 ${activeTheme.accentText} text-[9px] font-black tracking-widest px-2 py-0.5 rounded border border-white/5 uppercase`}>
                    {infoBook.recommendedAge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {infoBook.pagesCount} Páginas
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-sans font-black uppercase text-white tracking-wide leading-tight">
                  {infoBook.displayTitle}
                </h2>

                {/* Inner Scroll Container for extensive documentation */}
                <div className="max-h-[220px] sm:max-h-[300px] overflow-y-auto pr-3 space-y-4 scrollbar-none">
                  <div>
                    <span className={`text-[9px] font-black ${activeTheme.accentText} tracking-wider uppercase block mb-1`}>Sinopsis Completa</span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {infoBook.summary}
                    </p>
                  </div>

                  <div>
                    <span className={`text-[9px] font-black ${activeTheme.accentText} tracking-wider uppercase block mb-1`}>Fundamentación Pedagógica y Afecto</span>
                    <p className="text-xs sm:text-sm text-slate-350 leading-relaxed italic bg-black/25 p-4 rounded-xl border border-white/5">
                      {infoBook.pedagogicalFocus || "Fomenta el desarrollo emocional, la empatía y la resolución constructiva de conflictos familiares en un entorno de crianza respetuosa."}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className={`text-[9px] font-black ${activeTheme.accentText} tracking-wider uppercase block`}>Detalles Técnicos</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div><strong className="text-slate-300">Autora:</strong> Camila Gio</div>
                      <div><strong className="text-slate-300">Ilustradora:</strong> Camila Gio</div>
                      <div><strong className="text-slate-300">Dimensiones:</strong> {infoBook.dimensions || "20 x 20 cm"}</div>
                      <div><strong className="text-slate-300">ISBN:</strong> {infoBook.isbn || "978-987-88-8280-2"}</div>
                      <div className="col-span-2">
                        <strong className="text-slate-300">Actividades:</strong> Incluye {infoBook.coloringSheetsCount || 4} láminas listas para pintar en la sección de juegos.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center space-x-3">
                <button
                  onClick={() => {
                    setReadingBook(infoBook);
                    setInfoBook(null);
                  }}
                  className={`inline-flex items-center space-x-2 ${activeTheme.accentBg} text-white font-black px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-lg`}
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Comenzar Lectura</span>
                </button>
                <button
                  onClick={() => setInfoBook(null)}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global CSS Keyframes injection */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
};
