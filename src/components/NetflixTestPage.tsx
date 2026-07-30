import React, { useState, useRef } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { Play, Info, X, FileText, ChevronLeft, ChevronRight, Gamepad2, Award, Star, Compass, Palette, Puzzle, Search, Eye, CircleDot } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome }) => {
  const [selectedBook, setSelectedBook] = useState<BookStory | null>(null);
  
  // Row categories
  const rows = [
    { title: 'Primeros Pasos (2 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('2')) },
    { title: 'Emociones & Exploración (3 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('3')) },
    { title: 'Autonomía & Entorno (4 años)', books: BOOKS_DATA.filter(b => b.recommendedAge.includes('4')) }
  ];

  // Games list adapted for dark minimal UI
  const GAMES_LIST = [
    { title: 'Taller de Colorear', icon: Palette, color: 'text-pink-500' },
    { title: 'Rompecabezas', icon: Puzzle, color: 'text-amber-500' },
    { title: '5 Diferencias', icon: Search, color: 'text-purple-500' },
    { title: 'Memotest', icon: Eye, color: 'text-indigo-500' },
    { title: 'Ta-Te-Ti', icon: CircleDot, color: 'text-rose-500' },
    { title: 'Escondidas', icon: Compass, color: 'text-emerald-500' }
  ];

  // Featured book for billboard
  const featuredBook = BOOKS_DATA.find(b => b.id === 'book-19') || BOOKS_DATA[0];

  const handleOpenPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      const cleanUrl = pdfUrl.startsWith('/api/media/') ? pdfUrl : `/api/media/${pdfUrl}`;
      window.open(cleanUrl, '_blank');
    }
  };

  // Scroll handler for carousels
  const scrollRow = (rowId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(rowId);
    if (el) {
      const scrollAmount = 400;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Netflix-style Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/50 to-transparent transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-6 min-w-0">
            <span 
              className="text-red-600 font-black text-xl sm:text-2xl tracking-tighter cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0" 
              onClick={onGoBackHome}
            >
              CAMITOONS
            </span>
            <nav className="hidden md:flex items-center space-x-5 text-xs sm:text-sm font-semibold text-slate-300">
              <a href="#cuentos-test" className="hover:text-white transition-colors">Cuentos</a>
              <a href="#juegos-test" className="hover:text-white transition-colors">Juegos</a>
              <a href="#personajes-test" className="hover:text-white transition-colors">Personajes</a>
              <a href="#autora-test" className="hover:text-white transition-colors">Sobre mí</a>
            </nav>
          </div>
          
          <button
            onClick={onGoBackHome}
            className="text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded transition-colors shrink-0"
          >
            Salir de Prueba
          </button>
        </div>
      </header>

      {/* Hero Billboard Banner */}
      <div className="relative w-full h-[65vh] min-h-[400px] max-h-[680px] bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={featuredBook.coverImage}
            alt={featuredBook.displayTitle}
            className="w-full h-full object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl px-4 sm:px-12 lg:px-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2">
            <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded tracking-wide">ORIGINAL</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest">Recomendado</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            {featuredBook.displayTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-lg">
            {featuredBook.intro || featuredBook.summary}
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => handleOpenPdf(featuredBook.pdfUrl)}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-200 text-black font-bold px-5 py-2.5 rounded text-xs transition-transform active:scale-95 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Leer PDF</span>
            </button>
            <button
              onClick={() => setSelectedBook(featuredBook)}
              className="inline-flex items-center space-x-2 bg-[#333]/70 hover:bg-[#333]/90 text-white font-bold px-5 py-2.5 rounded text-xs transition-transform active:scale-95 backdrop-blur-sm"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Ver Más</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cuentos Rows Section */}
      <section id="cuentos-test" className="relative z-20 -mt-10 sm:-mt-16 pb-12 px-4 sm:px-12 lg:px-16 space-y-12">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-2.5 relative group/row-container">
            <h3 className="text-sm sm:text-lg font-black tracking-wider uppercase text-slate-300">
              {row.title}
            </h3>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Left Scroll Button */}
              <button 
                onClick={() => scrollRow(`row-${rowIndex}`, 'left')}
                className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity duration-200 hover:bg-black/80"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Scrollable Row */}
              <div 
                id={`row-${rowIndex}`}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
              >
                {row.books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className="flex-none w-[110px] sm:w-[160px] aspect-[2/3] bg-zinc-950 overflow-hidden relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.displayTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 hover:bg-black/0 transition-colors" />
                  </div>
                ))}
              </div>

              {/* Right Scroll Button */}
              <button 
                onClick={() => scrollRow(`row-${rowIndex}`, 'right')}
                className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/row-container:opacity-100 transition-opacity duration-200 hover:bg-black/80"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Minijuegos Section (Dark Minimalist) */}
      <section id="juegos-test" className="py-16 border-t border-zinc-900 bg-zinc-950/20 px-4 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xs uppercase font-black tracking-widest text-red-500">Actividades Lúdicas</h3>
            <h2 className="text-xl sm:text-3xl font-black text-white">Zona Infantil Interactiva</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">6 minijuegos minimalistas para aprender jugando.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GAMES_LIST.map((game, idx) => {
              const Icon = game.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#111] hover:bg-[#161616] border border-zinc-900 hover:border-zinc-800 transition-all p-5 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group"
                >
                  <div className={`${game.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{game.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Árbol de Personajes Section (Dark Minimalist Grid) */}
      <section id="personajes-test" className="py-16 border-t border-zinc-900 px-4 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xs uppercase font-black tracking-widest text-red-500">Universo CamiToons</h3>
            <h2 className="text-xl sm:text-3xl font-black text-white">Vínculos & Personajes</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">El entorno afectivo que acompaña a Luna en sus historias.</p>
          </div>

          {/* Clean minimal grid of characters */}
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-red-500 transition-colors">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autora Section (Dark Minimalist Banner) */}
      <section id="autora-test" className="py-16 border-t border-zinc-900 bg-zinc-950/20 px-4 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-md overflow-hidden border border-zinc-800">
              <img src="/api/media/Imagenes/cami autora.webp" alt="Camila" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-8 space-y-3.5 text-center md:text-left">
            <h3 className="text-xs uppercase font-black tracking-widest text-red-500">Detrás de las ilustraciones</h3>
            <h2 className="text-xl sm:text-2xl font-black text-white">Camila • Autora e Ilustradora</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Diseño cada historia con un enfoque pedagógico y afectivo, creando un espacio de lectura compartida que acompaña de manera respetuosa el crecimiento de las infancias.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Centered Overlay Modal (Zoom Poster Detail) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="bg-[#181818] w-full max-w-2xl border border-zinc-800 rounded-lg overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Left Column: Poster Image */}
            <div className="w-full md:w-5/12 aspect-[4/5] md:aspect-auto bg-black relative shrink-0">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.displayTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#181818]" />
            </div>

            {/* Modal Right Column: Minimal Details */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Colección Cuento</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedBook.displayTitle}
                  </h3>
                  <div className="flex items-center space-x-2.5 text-xs text-slate-400 font-semibold">
                    <span className="border border-slate-700 bg-zinc-800 text-slate-300 px-1.5 py-0.5 rounded text-[9px]">
                      {selectedBook.recommendedAge}
                    </span>
                    <span>•</span>
                    <span>{selectedBook.pagesCount || 12} páginas</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedBook.summary}
                </p>
                
                <p className="text-[11px] text-slate-400 italic border-l-2 border-red-500 pl-2 leading-relaxed">
                  <strong>Enfoque:</strong> {selectedBook.objective.replace(/\\/g, '')}
                </p>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => handleOpenPdf(selectedBook.pdfUrl)}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded text-xs transition-colors shadow-lg active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Leer PDF Completo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-zinc-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CamiToons. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};
