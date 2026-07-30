import React, { useState } from 'react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';
import { getMediaUrl } from '../utils/media';
import { PdfFlipbookViewer } from './PdfFlipbookViewer';
import { Play, X, FileText, ChevronLeft, ChevronRight, Palette, Puzzle, Search, Eye, CircleDot, Compass, Users, Sparkles, User, Smile, Sun, Heart, HeartHandshake, ZoomIn, Instagram, Youtube, Facebook } from 'lucide-react';

interface NetflixTestPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
  books?: BookStory[];
}

interface FundamentacionSection {
  title: string;
  paragraphs: string[];
}

export interface CharacterNode {
  id: string;
  name: string;
  role: string;
  relation: string;
  image: string;
  color: string;
  x: number; 
  y: number; 
  featuredBooks: string[];
  description: string;
  icon: any;
}

const CHARACTERS_DATA: CharacterNode[] = [
  {
    id: 'luna-center',
    name: 'Luna',
    role: 'Protagonista Principal',
    relation: 'Corazón del Universo CamiToons',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/luna.webp?v=2',
    color: 'from-purple-500 to-pink-500',
    x: 50,
    y: 50,
    featuredBooks: ['Toda la Colección "Luna está creciendo"'],
    description: 'Niña curiosa, alegre y soñadora que descubre el mundo paso a paso abordando las emociones, la familia y el aprendizaje cotidiano.',
    icon: Sparkles
  },
  {
    id: 'abuela-elsa',
    name: 'Abuela Elsa',
    role: 'Transmisora de Saberes',
    relation: 'Vínculo de los Abuelos',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/Abuela Elsa .webp',
    color: 'from-emerald-500 to-amber-500',
    x: 50,
    y: 15,
    featuredBooks: ['Luna y el campo', 'Luna planta un árbol'],
    description: 'Abuela afectuosa que enseña a Luna a amar la naturaleza, cuidar a los animales y valorar las vivencias familiares.',
    icon: Compass
  },
  {
    id: 'amigos-pares',
    name: 'Amigos y pares',
    role: 'Socialización & Empatía',
    relation: 'Primeros Vínculos Pares',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/amigos-pares.webp',
    color: 'from-violet-500 to-purple-450',
    x: 70,
    y: 20,
    featuredBooks: ['Luna y el primer día', 'Luna y las emociones', 'Luna encuentra colores'],
    description: 'Pares con los que Luna explora el jardín de infantes, la convivencia, la empatía, el juego en grupo y el compartir.',
    icon: Users
  },
  {
    id: 'papa-luna',
    name: 'Papá Gio',
    role: 'Apoyo & Protección',
    relation: 'Vínculo Paternal',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/papa.webp',
    color: 'from-blue-500 to-indigo-500',
    x: 83,
    y: 35,
    featuredBooks: ['Luna y la familia', 'Luna y los oficios'],
    description: 'Brinda sostén, juego y contención afectiva en el crecimiento de Luna y las aventuras cotidianas en el hogar.',
    icon: User
  },
  {
    id: 'hermano',
    name: 'Hermano Javier',
    role: 'Aventuras & Compartir',
    relation: 'Vínculo Fraterno',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/hermano.webp',
    color: 'from-teal-400 to-emerald-500',
    x: 85,
    y: 55,
    featuredBooks: ['Luna y la familia', 'Luna y su juego favorito'],
    description: 'Compañero de travesuras y aventuras, con quien Luna comparte juegos, crea mundos imaginarios y aprende el valor de crecer juntos.',
    icon: Smile
  },
  {
    id: 'abuelo-angel',
    name: 'Abuelo Ángel',
    role: 'Historias & Recuerdos',
    relation: 'Vínculo de los Abuelos',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/Abuelo angel.webp',
    color: 'from-amber-500 to-orange-400',
    x: 77,
    y: 74,
    featuredBooks: ['Luna y la familia', 'Luna planta un árbol'],
    description: 'Abuelo sabio que transmite valores, relatos inolvidables and momentos llenos de paz y cariño familiar.',
    icon: Sun
  },
  {
    id: 'prima-luna',
    name: 'Prima Julia',
    role: 'Juego Corporal & Diversión',
    relation: 'Vínculo Familiar',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/prima.webp',
    color: 'from-pink-400 to-purple-500',
    x: 60,
    y: 85,
    featuredBooks: ['Luna se mueve', 'Luna y el campo'],
    description: 'Prima alegre con quien Luna comparte risas, corre por caminos de piedra y disfruta del movimiento al aire libre.',
    icon: Smile
  },
  {
    id: 'anana-gato',
    name: 'Ananá',
    role: 'Compañero Fiel & Afecto',
    relation: 'Mascota de la Familia',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/anana.webp',
    color: 'from-amber-400 to-yellow-500',
    x: 40,
    y: 85,
    featuredBooks: ['Luna y la familia', 'Luna y las emociones'],
    description: 'El tierno perrito de la familia que acompaña a Luna en sus momentos de calma, juego libre y ternura en el hogar.',
    icon: Heart
  },
  {
    id: 'jazmin-amiga',
    name: 'Amiga Jazmín',
    role: 'Amistad & Confianza',
    relation: 'Vínculo de Amistad Cercana',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/jazmin.webp',
    color: 'from-rose-400 to-pink-500',
    x: 23,
    y: 74,
    featuredBooks: ['Luna y su chupete', 'Luna y sus emociones', 'Luna y el primer día'],
    description: 'Amiga del alma de Luna, con quien comparte confidencias, diálogos sinceros y sus primeros pasos en la escuela.',
    icon: HeartHandshake
  },
  {
    id: 'hermana',
    name: 'Hermana Sol',
    role: 'Juego & Complicidad',
    relation: 'Vínculo Fraterno',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/hermana.webp',
    color: 'from-purple-400 to-pink-400',
    x: 15,
    y: 55,
    featuredBooks: ['Luna y la familia', 'Luna se mueve'],
    description: 'Gran compañera con quien Luna comparte abrazos, enseñanzas, sueños y hermosas aventuras.',
    icon: Users
  },
  {
    id: 'marcos-amigo',
    name: 'Marcos',
    role: 'Exploración & Aventura',
    relation: 'Compañero de Aventuras',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/marcos.webp',
    color: 'from-cyan-500 to-blue-500',
    x: 17,
    y: 35,
    featuredBooks: ['Luna explora', 'Luna y el primer día'],
    description: 'El curioso gatito de la familia, muy explorador con quien Luna sigue pistas y resuelve divertidos caminos juntos.',
    icon: Compass
  },
  {
    id: 'mama-luna',
    name: 'Mamá Clara',
    role: 'Figura de Afecto & Guía',
    relation: 'Vínculo Maternal',
    image: '/api/media/Imagenes/personajes/arbol de vinculos/mama.webp',
    color: 'from-pink-500 to-rose-400',
    x: 30,
    y: 20,
    featuredBooks: ['Luna y la familia', 'Luna y su chupete', 'Luna se lava los dientes'],
    description: 'Con dulzura y dedicación, acompaña a Luna en cada paso de su crecimiento, compartiendo sus descubrimientos, emociones y pequeños momentos cotidianos.',
    icon: Heart
  }
];

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
    if (/^(Guía para familias y educadores|Propuesta emocional|Esta propuesta favors|Esta propuesta favorece|Recursos adicionales)/i.test(trimmed)) return true;
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

export const NetflixTestPage: React.FC<NetflixTestPageProps> = ({ darkMode, onGoBackHome, books }) => {
  const activeBooks = books || BOOKS_DATA;
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState<number>(0);
  const [readingBook, setReadingBook] = useState<BookStory | null>(null);
  const [infoBook, setInfoBook] = useState<BookStory | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterNode>(CHARACTERS_DATA[0]);
  const [hoveredCharacterId, setHoveredCharacterId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; name: string } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(true); 

  const camitoonsLogo = getMediaUrl('images/CamiToonsLogo.webp');
  const centerNode = CHARACTERS_DATA[0];

  // Strict Midnight Purple theme settings (locked as default & only theme style)
  const activeTheme = {
    bg: 'bg-[#12091c] bg-gradient-to-b from-[#12091c] to-[#07030c]',
    text: 'text-[#f9f9f9]',
    textMuted: 'text-slate-400',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    borderAccent: 'border-purple-500/20',
    headerBg: 'bg-[#12091c]/95 border-white/5',
    cardBg: 'bg-[#1a2232] border-white/5 shadow-2xl',
    badge: 'bg-purple-600/20 text-purple-400 border-purple-500/20',
    dot: 'bg-purple-500',
    navLink: 'text-slate-400 hover:text-white',
    glowColor: '#12091c'
  };

  // Slider featured books (3 titles)
  const sliderBooks = [
    activeBooks.find(b => b.id === 'book-19') || activeBooks[0],
    activeBooks.find(b => b.id === 'book-18') || activeBooks[1],
    activeBooks.find(b => b.id === 'book-13') || activeBooks[2]
  ];

  // Carousel featured books (top 5 for row 1)
  const featuredRowBooks = activeBooks.slice(0, 5);
  
  // Categorized collections
  const remainingBooks = activeBooks.slice(5);
  
  const emocionesBooks = remainingBooks.filter(b => b.recommendedAge.includes('3')).slice(0, 5);
  const autonomiaBooks = remainingBooks.filter(b => b.recommendedAge.includes('4')).slice(0, 5);
  const primerosBooks = remainingBooks.filter(b => b.recommendedAge.includes('2')).slice(0, 5);

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

  const getShortSynopsis = (summary: string) => {
    if (!summary) return '';
    const firstSentence = summary.split('.')[0] + '.';
    return firstSentence.length > 95 ? firstSentence.substring(0, 92) + '...' : firstSentence;
  };

  // Adapts the title font size according to string length to prevent UI layout collision
  const getTitleFontSize = (title: string) => {
    const len = title.length;
    if (len > 35) return 'text-xl sm:text-3xl lg:text-4xl'; 
    if (len > 20) return 'text-2xl sm:text-4xl lg:text-5xl'; 
    return 'text-3xl sm:text-5xl lg:text-6xl'; 
  };

  // Memoized full pedagogical segments parse for the opened book details modal
  const parsedFundamentacion = React.useMemo(() => {
    if (!infoBook?.fullFundamentacion) return [];
    return parseFundamentacionSections(infoBook.fullFundamentacion);
  }, [infoBook?.fullFundamentacion]);

  const activeBillboardBook = sliderBooks[activeFeaturedIndex];

  // Triggers selection with smooth panel unfold
  const selectCharacterNode = (node: CharacterNode) => {
    setSelectedCharacter(node);
    setIsDetailOpen(true);
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white pb-20 transition-all duration-700`}>
      
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
          
          <button
            onClick={onGoBackHome}
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            Volver
          </button>
        </div>
      </header>

      {/* BLOCK 1: Larger Full-Width Billboard Carousel Banner */}
      <div 
        className="relative w-full h-[75vh] min-h-[500px] max-h-[780px] bg-black overflow-hidden flex items-center group/billboard"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={activeBillboardBook.coverImage}
            alt="Hero Slide"
            className="w-full h-full object-cover object-center opacity-45 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to top, #12091c, transparent)` }} />
          <div className="absolute inset-0 bg-gradient-to-r via-transparent to-transparent z-10 animate-pulse-slow" style={{ backgroundImage: `linear-gradient(to right, ${activeTheme.glowColor}, transparent)` }} />
        </div>

        {/* Billboard Navigation Dots */}
        <div className="absolute bottom-8 right-10 sm:right-16 z-20 flex space-x-2.5">
          {sliderBooks.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveFeaturedIndex(dotIdx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                dotIdx === activeFeaturedIndex ? `${activeTheme.dot} w-5` : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Billboard Nav Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-6 z-20 p-2.5 rounded-full bg-black/35 hover:bg-black/70 border border-white/10 text-white opacity-0 group-hover/billboard:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5.5 h-5.5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-6 z-20 p-2.5 rounded-full bg-black/35 hover:bg-black/70 border border-white/10 text-white opacity-0 group-hover/billboard:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5.5 h-5.5" />
        </button>

        {/* Widescreen Content container with adaptive title font sizing */}
        <div className="relative z-10 max-w-2xl px-10 sm:px-20 lg:px-28 pt-28 sm:pt-36 space-y-5 pb-12">
          <div className="inline-flex items-center space-x-2">
            <span className="bg-white/10 text-white border border-white/15 font-black text-[9px] px-2.5 py-0.5 rounded tracking-wide uppercase">ESTRENO DESTACADO</span>
            <span className="text-slate-355 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Colección CamiToons</span>
          </div>

          <h1 className={`${getTitleFontSize(activeBillboardBook.displayTitle)} font-sans font-black tracking-tight leading-tight text-white uppercase transition-all duration-300`}>
            {activeBillboardBook.displayTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-lg">
            {activeBillboardBook.intro || activeBillboardBook.summary}
          </p>

          <div className="pt-3 flex items-center space-x-3">
            <button
              onClick={() => setReadingBook(activeBillboardBook)}
              className="inline-flex items-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-bold px-6 py-3 rounded-xl text-xs transition-transform active:scale-95 shadow-md"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Leer Cuento</span>
            </button>
            
            {/* Highly contrasted info button with white letters */}
            <button
              onClick={() => setInfoBook(activeBillboardBook)}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-bold px-6 py-3 rounded-xl text-xs transition-colors active:scale-95"
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
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-purple-400">Estrenos</h3>
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
                          <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase">Destacado</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
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
                          className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded transition-transform active:scale-95"
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

        {/* BLOCK 3: Games Row - 1.5X Larger Illustration with neon purple hover glow and no card bounding */}
        <section id="juegos-test" className="py-12 border-t border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">
            
            {/* Ambient glow in background */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[140px] pointer-events-none" />

            {/* Col span 5 for left-side texts */}
            <div className="md:col-span-5 space-y-5 text-center md:text-left relative z-10">
              <div className="inline-flex items-center space-x-2">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-500/20 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
                  Actividades Lúdicas
                </span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">CamiToons Play</span>
              </div>

              {/* Title simplified to only "Juegos" */}
              <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase text-white tracking-wider leading-tight">
                Juegos
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
                Acompaña a Luna en sus aventuras lúdicas pintando láminas vectoriales, armando rompecabezas divertidos, jugando al Ta-Te-Ti y estimulando la memoria con actividades seguras diseñadas especialmente para compartir en familia.
              </p>

              <div className="pt-2 flex justify-center md:justify-start">
                <button
                  onClick={() => {
                    window.location.hash = '#/juegos';
                  }}
                  className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-lg border border-purple-500/20"
                >
                  <Palette className="w-4 h-4" />
                  <span>Ver Todos los Juegos</span>
                </button>
              </div>
            </div>

            {/* Col span 7 for the 1.5X larger transparent WebP illustration */}
            <div className="md:col-span-7 flex justify-center md:justify-end relative z-10">
              <div 
                className="w-full max-w-[550px] md:max-w-[720px] transition-all duration-700 ease-out cursor-pointer group/gameimg"
                onClick={() => { window.location.hash = '#/juegos'; }}
              >
                <img
                  src={getMediaUrl('Imagenes/Juegos.webp')}
                  alt="Actividades CamiToons"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)] group-hover/gameimg:scale-105 group-hover/gameimg:-rotate-1 group-hover/gameimg:drop-shadow-[0_25px_60px_rgba(147,51,234,0.4)] transition-all duration-500"
                />
              </div>
            </div>

          </div>
        </section>

        {/* BLOCK 4: Carousel 2 - Emociones */}
        <div className="space-y-4 relative group/emociones">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-purple-405">Colección</h3>
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
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto`}
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
                          <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-305 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
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
                          className="bg-purple-650 hover:bg-purple-700 text-white p-1.5 rounded transition-transform active:scale-95"
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
            src={activeBooks[10]?.coverImage || activeBooks[0]?.coverImage || '/api/media/Imagenes/rompecabezas/10.jpeg'}
            alt="Decorative Fade Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to right, #12091c, transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to left, #12091c, transparent)` }} />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to top, #12091c, transparent)` }} />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-transparent z-10" style={{ backgroundImage: `linear-gradient(to bottom, #12091c, transparent)` }} />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs sm:text-base text-slate-300 font-serif italic max-w-xl leading-relaxed">
              "La lectura compartida en las primeras infancias es un puente de afecto que fortalece la seguridad emocional y abre universos de exploración sensorial."
            </p>
            <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase mt-2">CamiToons Pedagogía</span>
          </div>
        </div>

        {/* BLOCK 6: Carousel 3 - Autonomía */}
        <div className="space-y-4 relative group/autonomia">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-purple-400">Colección</h3>
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
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto`}
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
                          <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-355 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
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
                          className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded transition-transform active:scale-95"
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

        {/* BLOCK 7: Interactive Relationship Tree - Centered large tree with sliding right-side details panel */}
        <section id="personajes-test" className="py-12 border-t border-b border-white/5 relative">
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[9px] font-sans font-black tracking-[0.25em] text-purple-400 uppercase">Universo CamiToons</h3>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Árbol de Vínculos</h2>
              <p className="text-xs text-slate-400">Toca un personaje para descubrir su historia y su vínculo afectivo con Luna.</p>
            </div>

            {/* Flexible row layout with transitions */}
            <div className="flex flex-col lg:flex-row items-stretch gap-8 relative max-w-7xl mx-auto overflow-hidden">
              
              {/* Left/Center Box: Interactive graph container utilizing arbol_vinculos.webp background */}
              <div 
                className={`relative h-[480px] sm:h-[580px] rounded-3xl overflow-hidden border border-purple-500/20 bg-[#160d21]/30 flex items-center justify-center p-4 shadow-inner transition-all duration-700 ease-out z-20 ${
                  isDetailOpen ? 'w-full lg:w-7/12' : 'w-full lg:w-8/12 lg:max-w-3xl mx-auto'
                }`}
              >
                
                {/* Background WebP Optimized Tree Illustration */}
                <img
                  src={getMediaUrl('Imagenes/arbol_vinculos.webp')}
                  alt="Árbol de vínculos fondo"
                  className="absolute inset-0 w-full h-full object-contain opacity-55 pointer-events-none select-none z-0"
                />

                {/* Connecting Lines SVG overlay */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {/* Connecting lines from outer characters to Luna in the center */}
                  {CHARACTERS_DATA.slice(1).map((node) => {
                    const isHighlighted =
                      selectedCharacter.id === node.id ||
                      selectedCharacter.id === centerNode.id ||
                      hoveredCharacterId === node.id;

                    return (
                      <line
                        key={node.id}
                        x1={node.x}
                        y1={node.y}
                        x2={centerNode.x}
                        y2={centerNode.y}
                        stroke={isHighlighted ? 'rgba(236,72,153,0.85)' : 'rgba(168,85,247,0.2)'}
                        strokeWidth={isHighlighted ? '0.8' : '0.4'}
                        strokeDasharray="2 3"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Node Circles */}
                {CHARACTERS_DATA.map((node) => {
                  const isSelected = selectedCharacter.id === node.id;
                  const isHovered = hoveredCharacterId === node.id;
                  const isCenter = node.id === centerNode.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => selectCharacterNode(node)}
                      onMouseEnter={() => setHoveredCharacterId(node.id)}
                      onMouseLeave={() => setHoveredCharacterId(null)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 transform ${
                        isSelected ? 'z-45 scale-120' : isHovered ? 'z-30 scale-110' : 'z-20 scale-100 opacity-90'
                      }`}
                    >
                      <div
                        className={`rounded-full p-0.5 transition-all duration-500 bg-[#12091c] border ${
                          isSelected
                            ? 'w-14 h-14 sm:w-16 sm:h-16 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                            : isCenter
                            ? 'w-16 h-16 sm:w-20 sm:h-20 border-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.4)]'
                            : 'w-10 h-10 sm:w-12 sm:h-12 border-purple-500/30 hover:border-purple-400'
                        }`}
                      >
                        <img
                          src={node.image}
                          alt={node.name}
                          className="w-full h-full rounded-full object-cover shadow-inner"
                        />
                      </div>

                      {/* Tooltip Label */}
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-500/40 shadow-lg scale-105'
                            : 'bg-[#12091c]/90 text-slate-300 border-purple-500/10'
                        }`}
                      >
                        {node.name}
                      </span>
                    </div>
                  );
                })}

              </div>

              {/* Right Column: Sliding Character detail panel (unfolds dynamic width) */}
              <div 
                className={`transition-all duration-700 ease-out flex flex-col justify-between z-10 ${
                  isDetailOpen 
                    ? 'w-full lg:w-5/12 opacity-100 scale-100 max-h-[1000px] pointer-events-auto' 
                    : 'w-0 opacity-0 scale-95 max-h-0 lg:max-h-none pointer-events-none overflow-hidden'
                }`}
              >
                
                {/* Details Sheet Card with scaled up image */}
                <div className="p-6 rounded-3xl bg-[#160d21]/60 border border-purple-500/10 shadow-2xl backdrop-blur-sm space-y-5 flex-1 relative">
                  
                  {/* Close button inside panel */}
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white border border-white/5 transition-transform active:scale-90"
                    title="Cerrar panel"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                    
                    {/* Much larger avatar picture (1.5X larger layout) */}
                    <div 
                      onClick={() => setZoomedImage({ src: selectedCharacter.image, name: selectedCharacter.name })}
                      className="relative group/avatar cursor-pointer shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-purple-500/35 hover:border-purple-400 transition-colors shadow-2xl"
                      title="Ampliar avatar"
                    >
                      <img
                        src={selectedCharacter.image}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="space-y-1">
                        <h4 className="text-xl sm:text-2xl font-sans font-black text-white uppercase tracking-wide">{selectedCharacter.name}</h4>
                        <div className="inline-block bg-purple-600/30 text-purple-300 border border-purple-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                          {selectedCharacter.role}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-purple-400">{selectedCharacter.relation}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block">Descripción del Vínculo</span>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                      {selectedCharacter.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block">Cuentos Destacados</span>
                    <ul className="text-xs space-y-1.5 text-slate-400 font-semibold pl-1.5">
                      {selectedCharacter.featuredBooks.map((bkName, bkIdx) => (
                        <li key={bkIdx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          <span>{bkName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* Pedagogical orientation box positioned centered and directly below the tree/details row */}
            <div className="max-w-3xl mx-auto mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/20 via-purple-900/10 to-[#12091c]/25 border border-purple-500/15 shadow-2xl text-center space-y-3.5">
              <div className="flex items-center justify-center space-x-2.5">
                <span className="bg-purple-500/20 text-purple-300 p-2 rounded-xl border border-purple-500/30">
                  <Heart className="w-5 h-5 fill-purple-400" />
                </span>
                <h4 className="text-sm sm:text-base font-sans font-black uppercase text-white tracking-wider">Importancia Afectiva</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium max-w-2xl mx-auto">
                Así como un árbol necesita raíces profundas para crecer firme, las infancias necesitan relaciones basadas en el cariño, la escucha activa y la seguridad emocional. Cada rama del árbol representa una historia y cada vínculo contribuye al florecimiento integral de Luna en sus aventuras de crecimiento.
              </p>
            </div>

          </div>
        </section>

        {/* BLOCK 8: Carousel 4 - Primeros Descubrimientos */}
        <div className="space-y-4 relative group/primeros">
          <div className="text-center space-y-1">
            <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-purple-400">Colección</h3>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-black uppercase text-white tracking-wider">Primeros Descubrimientos</h2>
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
                      className={`flex-none h-full bg-[#1a2232] rounded-2xl overflow-hidden relative transition-all duration-500 ease-in-out shadow-[0_20px_45px_rgba(0,0,0,0.8)] border ${activeTheme.borderAccent} z-30 overflow-y-auto`}
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
                          <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase">Cuento</span>
                          <h4 className="text-xs sm:text-sm font-sans font-black text-white truncate">{book.displayTitle}</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed max-w-md">{getShortSynopsis(book.summary)}</p>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{book.recommendedAge}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setInfoBook(book); }}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/5"
                              >
                                + Info
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                                className={`inline-flex items-center space-x-1.5 ${activeTheme.accentBg} text-white font-black px-3.5 py-1.5 rounded text-[9px] tracking-wider uppercase transition-all shadow active:scale-95`}
                              >
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col justify-end p-4 opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto">
                      <h4 className="text-[10px] sm:text-xs font-sans font-black text-white truncate mb-2">{book.displayTitle}</h4>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReadingBook(book); }}
                          className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded transition-transform active:scale-95"
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
              <h3 className="text-[10px] font-sans font-black tracking-[0.25em] text-purple-400 uppercase">Detrás de las ilustraciones</h3>
              <h2 className="text-xl sm:text-2xl font-sans font-black uppercase text-white">Camila • Autora e Ilustradora</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Diseño cada historia con un enfoque pedagógico y afectivo, creando un espacio de lectura compartida que acompaña de manera respetuosa el crecimiento de las infancias.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCK 10: Comunidad & Apoyo (Donación y Redes Sociales) */}
        <section className="py-12 border-t border-white/5 max-w-4xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Donación al Proyecto Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/20 via-purple-900/10 to-[#12091c]/25 border border-purple-500/15 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2">
                  <span className="bg-purple-500/20 text-purple-300 p-1.5 rounded-xl border border-purple-500/30">
                    <Heart className="w-5 h-5 fill-purple-400" />
                  </span>
                  <h4 className="text-base font-sans font-black uppercase text-white tracking-wider">Donación al Proyecto</h4>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                  CamiToons es una iniciativa independiente dedicada a crear cuentos infantiles y herramientas lúdicas libres de publicidad. Tu apoyo nos ayuda a seguir expandiendo este universo afectivo y pedagógico para más familias.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://cafecito.app/camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md text-center"
                >
                  ☕ <span>Invitar un Cafecito</span>
                </a>
                <a
                  href="https://paypal.me/camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg border border-purple-500/20 text-center"
                >
                  💳 <span>Donar por PayPal</span>
                </a>
              </div>
            </div>

            {/* Redes Sociales / Comunidad Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#160d21]/40 border border-purple-500/10 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2">
                  <span className="bg-purple-500/20 text-purple-300 p-1.5 rounded-xl border border-purple-500/30">
                    <Users className="w-5 h-5" />
                  </span>
                  <h4 className="text-base font-sans font-black uppercase text-white tracking-wider">Comunidad CamiToons</h4>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                  ¡Acompáñanos en nuestras redes sociales! Compartimos novedades, adelantos de los próximos cuentos de Luna, sugerencias didácticas y recursos gratuitos para descargar en el hogar o la escuela.
                </p>
              </div>

              {/* Social Media Link Icons with micro-animations */}
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                <a
                  href="https://instagram.com/camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 border border-white/10 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-md"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-md"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com/@camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-slate-900 border border-white/10 hover:border-teal-400 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-md"
                  title="TikTok"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94.1 1.89-.1 2.76-.5.01-.84-.02-1.68.01-2.52.88.4 1.7.99 2.38 1.73.74.78 1.25 1.77 1.48 2.83.25.96.2 1.97-.13 2.9-.4 1.13-1.16 2.11-2.15 2.76-1.12.76-2.52 1.07-3.83.84-1.34-.18-2.58-.87-3.41-1.95-.91-1.13-1.28-2.61-1.07-4.04.2-.01.4-.01.6-.02.43-.01.86-.01 1.3-.01.07 1.04.47 2.05 1.21 2.78.75.76 1.83 1.12 2.89.97 1.04-.13 1.97-.77 2.47-1.7.53-.94.6-2.07.2-3.07-.36-.93-1.1-1.69-2.01-2.06-.5-.21-1.04-.3-1.58-.29-.02.26-.02.52-.03.78v8.66c0 1.29-.36 2.56-1.07 3.62-.75 1.06-1.89 1.79-3.15 2.04-1.32.27-2.73.08-3.92-.55-1.18-.68-2.07-1.83-2.45-3.16-.39-1.31-.25-2.75.4-3.95.69-1.23 1.88-2.09 3.25-2.35 1.17-.24 2.41-.01 3.44.62v-2.92c-.88-.41-1.84-.61-2.81-.59-1.42.02-2.82.47-3.98 1.3-1.18.89-1.99 2.23-2.23 3.7-.27 1.47-.02 3.01.71 4.31.75 1.28 2.01 2.19 3.46 2.5 1.49.33 3.07.13 4.43-.57 1.35-.74 2.37-2.04 2.76-3.55.33-1.16.27-2.4-.14-3.51-.01-1.74-.01-3.48-.01-5.22z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/camitoons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-md"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
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

      {/* BLOCK 10: Technical & Pedagogical Book Info Modal (Full Screen in Purple theme with extensive documentation) */}
      {infoBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col md:flex-row min-h-[450px] bg-[#160d21]">
            
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
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#160d21] via-transparent to-transparent z-10" />
            </div>

            {/* Right Side: Scrollable Details Column */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-[#f9f9f9]">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2">
                  <span className="bg-purple-650/20 text-purple-400 border border-purple-500/25 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
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
                <div className="max-h-[260px] sm:max-h-[340px] overflow-y-auto pr-3 space-y-4 scrollbar-none">
                  {infoBook.intro && (
                    <div>
                      <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block mb-1">1. Introducción</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                        {infoBook.intro}
                      </p>
                    </div>
                  )}

                  {infoBook.objective && (
                    <div>
                      <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block mb-1">2. Objetivo del Cuento</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                        {infoBook.objective}
                      </p>
                    </div>
                  )}

                  {infoBook.summary && (
                    <div>
                      <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block mb-1">3. Resumen del Cuento</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {infoBook.summary}
                      </p>
                    </div>
                  )}

                  {/* Orientaciones Pedagógicas loop mapping exactly as in BookDetailModal */}
                  {parsedFundamentacion.map((sec, idx) => {
                    const isListSection = /^[45678]\./.test(sec.title) || /temas clave|sugerencias|preguntas|consejos/i.test(sec.title);
                    return (
                      <div key={idx} className="space-y-1.5 pt-3 border-t border-white/10">
                        <span className="text-[9px] font-black text-purple-300 tracking-wider uppercase block">
                          {sec.title}
                        </span>
                        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                          {sec.paragraphs.map((para, pIdx) => {
                            const isQuestion = para.startsWith('¿') || para.endsWith('?');
                            const isSubTitle = !isQuestion && para.length < 65 && !para.endsWith('.') && !para.endsWith(',') && (para.startsWith('Juego') || para.startsWith('Creamos') || para.startsWith('Inventamos') || para.startsWith('Clasificamos') || para.startsWith('Dibujamos') || para.startsWith('La ensalada') || para.startsWith('El plato') || para.startsWith('Exploramos') || para.startsWith('Cocinamos') || para.startsWith('Mi menú') || para.startsWith('Jugamos') || para.startsWith('La fiesta') || para.startsWith('Cantamos') || para.startsWith('El semáforo') || para.startsWith('Canción') || para.startsWith('Circuito') || para.startsWith('Exploradores') || para.startsWith('Del movement') || para.startsWith('Del movimiento') || para.startsWith('Recursos'));

                            if (isSubTitle) {
                              return (
                                <h5 key={pIdx} className="font-extrabold text-purple-300 text-xs pt-1">
                                  📌 {para}
                                </h5>
                              );
                            }

                            if (isQuestion) {
                              return (
                                <p key={pIdx} className="pl-3 border-l-2 border-purple-500 text-purple-200 font-semibold py-0.5 my-1">
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

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-purple-300 text-[9px] font-black tracking-wider uppercase block">Detalles Técnicos</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div><strong className="text-slate-300 font-bold">Autora:</strong> Camila Gio</div>
                      <div><strong className="text-slate-300 font-bold">Ilustradora:</strong> Camila Gio</div>
                      <div><strong className="text-slate-300 font-bold">Dimensiones:</strong> {infoBook.dimensions || "20 x 20 cm"}</div>
                      <div><strong className="text-slate-300 font-bold">ISBN:</strong> {infoBook.isbn || "978-987-88-8280-2"}</div>
                      <div className="col-span-2">
                        <strong className="text-slate-300 font-bold">Actividades:</strong> Incluye {infoBook.coloringSheetsCount || 4} láminas listas para pintar en la sección de juegos.
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

      {/* Fullscreen Zoom modal for family tree avatars */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="relative bg-[#160d21] p-3 rounded-3xl border border-purple-500/20 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/55 hover:bg-black/75 text-slate-300 hover:text-white border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
              <img src={zoomedImage.src} alt={zoomedImage.name} className="w-full h-full object-cover" />
            </div>
            <h5 className="text-center font-sans font-black uppercase text-sm text-white tracking-wider pb-1">{zoomedImage.name}</h5>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-black/40 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CamiToons. Todos los derechos reservados.</p>
      </footer>

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
