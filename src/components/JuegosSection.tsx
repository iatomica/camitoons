import React, { useState, useEffect } from 'react';
import { ColorearGame } from './games/ColorearGame';
import { RompecabezasGame } from './games/RompecabezasGame';
import { DiferenciasGame } from './games/DiferenciasGame';
import { MemoriaGame } from './games/MemoriaGame';
import { TatetiGame } from './games/TatetiGame';
import { DondeEstaLunaGame } from './games/DondeEstaLunaGame';
import { LUNA_IMAGES, DIFERENCIAS_PAIRS } from '../data/lunaImages';
import { 
  Gamepad2, Palette, Puzzle, Search, Eye, CircleDot, Star, 
  Sparkles, Award, ArrowLeft, Play, LayoutGrid 
} from 'lucide-react';
import { BOOKS_DATA, BookStory } from '../data/booksCatalog';

interface JuegosSectionProps {
  darkMode: boolean;
  books?: BookStory[];
}

export type GameId =
  | 'colorear'
  | 'rompecabezas'
  | 'diferencias'
  | 'memoria'
  | 'tateti'
  | 'donde-esta-luna';

const GAMES_LIST: {
  id: GameId;
  title: string;
  subtitle: string;
  icon: any;
  badge: string;
  gradient: string;
}[] = [
  {
    id: 'colorear',
    title: 'Taller de Colorear',
    subtitle: 'Pintá las láminas vectoriales de los cuentos',
    icon: Palette,
    badge: 'Creatividad',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'rompecabezas',
    title: 'Rompecabezas',
    subtitle: 'Armá la imagen intercambiando las piezas',
    icon: Puzzle,
    badge: 'Lógica',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'diferencias',
    title: 'Encuentra las Diferencias',
    subtitle: 'Observá bien y encontrá los 5 cambios ocultos',
    icon: Search,
    badge: 'Atención',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'memoria',
    title: 'Memotest (Memoria)',
    subtitle: 'Da vuelta las cartas y encontrá las parejas',
    icon: Eye,
    badge: 'Concentración',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'tateti',
    title: 'Ta-Te-Ti',
    subtitle: 'Jugá contra Luna o con un amigo (🌸 vs ⭐️)',
    icon: CircleDot,
    badge: 'Estrategia',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'donde-esta-luna',
    title: 'Escondidas',
    subtitle: 'Buscá a Luna y sus objetos con la lupa',
    icon: Search,
    badge: 'Exploración',
    gradient: 'from-amber-500 to-yellow-500'
  }
];

export const JuegosSection: React.FC<JuegosSectionProps> = ({ darkMode, books }) => {
  // Initially null: no game loaded in memory/DOM until selected!
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  
  // Selected level/story within the active game
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  // Total earned stars counter saved in localStorage
  const [earnedStars, setEarnedStars] = useState<number>(() => {
    const saved = localStorage.getItem('camitoons_stars');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('camitoons_stars', earnedStars.toString());
  }, [earnedStars]);

  const handleWinStar = () => {
    setEarnedStars((prev) => prev + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const activeGameInfo = GAMES_LIST.find((g) => g.id === activeGameId);

  // Lists for level select
  const activeBooks = books || BOOKS_DATA;
  const booksWithColoring = activeBooks.filter(
    (b) => b.coloringSvgs && b.coloringSvgs.length > 0
  );

  const PUZZLE_LEVELS = [
    { id: 0, name: 'Luna y los Sonidos', src: LUNA_IMAGES.main },
    { id: 1, name: 'Luna Soñadora', src: LUNA_IMAGES.diseno1 },
    { id: 2, name: 'Luna en la Ciudad', src: LUNA_IMAGES.diseno2 },
    { id: 3, name: 'Luna de Aventura', src: LUNA_IMAGES.diseno3 },
    { id: 4, name: 'Luna y Cami', src: LUNA_IMAGES.diseno6 }
  ];

  const DIFERENCIAS_LEVELS = DIFERENCIAS_PAIRS.map((pair, idx) => ({
    id: idx,
    title: pair.title,
    original: pair.original,
    modified: pair.modified
  }));

  const MEMOTEST_LEVELS = [
    { pairs: 4, name: 'Fácil (4 parejas)', desc: 'Ideal para los más chiquitos' },
    { pairs: 6, name: 'Medio (6 parejas)', desc: 'Desafío estándar de memoria' },
    { pairs: 8, name: 'Difícil (8 parejas)', desc: '¡Para súper cerebros!' }
  ];

  const ESCONDIDAS_SCENES = [
    { id: 0, title: 'Los panaderos', bgSrc: LUNA_IMAGES.escondidas?.[0] || LUNA_IMAGES.banner },
    { id: 1, title: 'Los cinco patitos', bgSrc: LUNA_IMAGES.escondidas?.[1] || LUNA_IMAGES.main },
    { id: 2, title: 'La odontóloga', bgSrc: LUNA_IMAGES.escondidas?.[2] || LUNA_IMAGES.banner },
    { id: 3, title: 'La escuela', bgSrc: LUNA_IMAGES.escondidas?.[3] || LUNA_IMAGES.main },
    { id: 4, title: 'La amiga de Luna', bgSrc: LUNA_IMAGES.escondidas?.[4] || LUNA_IMAGES.banner },
    { id: 5, title: 'El abuelo Ángel', bgSrc: LUNA_IMAGES.escondidas?.[5] || LUNA_IMAGES.main },
    { id: 6, title: 'Ananá y su casa', bgSrc: LUNA_IMAGES.escB || LUNA_IMAGES.banner },
    { id: 7, title: 'El sapo', bgSrc: LUNA_IMAGES.escC || LUNA_IMAGES.main }
  ];

  const handleSelectGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    setSelectedLevel(null);
  };

  const handleBackToGames = () => {
    setActiveGameId(null);
    setSelectedLevel(null);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
  };

  return (
    <section id="juegos" className="py-8 sm:py-12 relative overflow-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10 space-y-8">
        
        {/* Floating Celebration Toast */}
        {showCelebration && (
          <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-2xl flex items-center space-x-3 animate-bounce-in">
            <Star className="w-8 h-8 fill-slate-950 animate-spin" />
            <div>
              <p className="text-sm font-black">¡Ganaste 1 Estrella Dorada! ⭐</p>
              <p className="text-xs font-semibold opacity-90">¡Sigue jugando y acumulando premios!</p>
            </div>
          </div>
        )}

        {/* Phase 1: Game Selector Hub (activeGameId === null) */}
        {activeGameId === null && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-widest shadow-sm">
                <Gamepad2 className="w-4 h-4 text-purple-600" />
                <span>Zona Infantil Interactiva</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Juegos Mágicos CamiToons
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 font-semibold max-w-xl mx-auto">
                Elegí uno de los juegos para empezar a jugar y acumular estrellas. Cada minijuego estimula la imaginación, memoria, lógica y expresión artística.
              </p>

              {/* Stars Counter Trophy Pill */}
              <div className="pt-2 flex justify-center">
                <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 text-slate-900 animate-bounce" />
                  <span>Estrellas Ganadas: {earnedStars}</span>
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-slate-950 text-slate-950" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Card Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {GAMES_LIST.map((game) => {
                const Icon = game.icon;
                return (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGame(game.id)}
                    className="group relative rounded-3xl p-6 border-2 text-left bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/50 hover:border-purple-500 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Corner gradient glow */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${game.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl text-white bg-gradient-to-br ${game.gradient} shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                          darkMode ? 'bg-purple-950/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {game.badge}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-650 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                          {game.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center text-xs font-black text-purple-600 dark:text-purple-400 gap-1 uppercase tracking-wider">
                        <span>Jugar ahora</span>
                        <span className="transform group-hover:translate-x-1.5 transition-transform">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 2: Level/Story Selection Phase (activeGameId !== null && selectedLevel === null) */}
        {activeGameId !== null && selectedLevel === null && activeGameInfo && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header with Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={handleBackToGames}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Volver a Minijuegos</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl text-white bg-gradient-to-br ${activeGameInfo.gradient}`}>
                  {React.createElement(activeGameInfo.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {activeGameInfo.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">Seleccioná un nivel o cuento para empezar</p>
                </div>
              </div>
            </div>

            {/* LEVEL OPTIONS CARDS GRIDS */}
            
            {/* 1. Colorear story chooser */}
            {activeGameId === 'colorear' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {booksWithColoring.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => setSelectedLevel(book.id)}
                      className="group p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-purple-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 text-center flex flex-col justify-between space-y-3"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950">
                        <img src={book.coverImage} alt={book.displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{book.displayTitle}</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{book.recommendedAge} • {book.coloringSvgs?.length || 0} láminas</p>
                      </div>
                      <div className="inline-flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-purple-600 group-hover:bg-purple-750 text-white font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Pintar</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Rompecabezas image chooser */}
            {activeGameId === 'rompecabezas' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {PUZZLE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className="group p-3 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-amber-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 text-center flex flex-col justify-between space-y-3"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950">
                      <img src={lvl.src} alt={lvl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{lvl.name}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Piezas deslizantes</p>
                    </div>
                    <div className="inline-flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm">
                      <span>Armar</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 3. Diferencias level chooser */}
            {activeGameId === 'diferencias' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {DIFERENCIAS_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className="group p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-pink-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center space-x-4"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-950">
                      <img src={lvl.original} alt={lvl.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0 flex-1 space-y-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{lvl.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Encontrá los 5 cambios ocultos en la ilustración.</p>
                      <span className="inline-flex text-[9px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest pt-1">Iniciar Desafío →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 4. Memoria difficulty selector */}
            {activeGameId === 'memoria' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {MEMOTEST_LEVELS.map((lvl) => (
                  <button
                    key={lvl.pairs}
                    onClick={() => setSelectedLevel(lvl.pairs)}
                    className="group p-5 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-indigo-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 text-center flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">{lvl.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{lvl.desc}</p>
                    </div>
                    <div className="py-2.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-750 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm">
                      Comenzar
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 5. Tateti Direct Start */}
            {activeGameId === 'tateti' && (
              <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-3xl flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 shadow-inner">
                  <CircleDot className="w-8 h-8 animate-spin-slow" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Ta-Te-Ti de Luna</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Estrategia clásica de tres en línea. Jugá contra la IA de Luna o contra un amigo en la misma pantalla usando los tiernos símbolos de flor 🌸 y estrella ⭐️.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLevel(true)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-widest shadow-md shadow-rose-950/20 active:scale-95 transition-transform"
                >
                  Empezar Ta-Te-Ti
                </button>
              </div>
            )}

            {/* 6. Escondidas scene selector */}
            {activeGameId === 'donde-esta-luna' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {ESCONDIDAS_SCENES.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedLevel(sc.id)}
                    className="group p-3 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-yellow-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 text-center flex flex-col justify-between space-y-3"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950">
                      <img src={sc.bgSrc} alt={sc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{sc.title}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Escena {sc.id + 1}</p>
                    </div>
                    <div className="inline-flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-yellow-500 group-hover:bg-yellow-600 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm">
                      <span>Buscar</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Phase 3: Active Game Rendering Board (activeGameId !== null && selectedLevel !== null) */}
        {activeGameId !== null && selectedLevel !== null && activeGameInfo && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Control Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-850">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToLevels}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-350 font-extrabold text-xs transition-colors hover:bg-slate-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cuentos / Niveles</span>
                </button>
                
                <button
                  onClick={handleBackToGames}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-extrabold transition-colors hover:bg-slate-200"
                >
                  <span>Todos los Juegos</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {activeGameInfo.title}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sección Completa Activa</p>
                </div>
                <div className={`p-2 rounded-xl text-white bg-gradient-to-br ${activeGameInfo.gradient} shadow-md`}>
                  {React.createElement(activeGameInfo.icon, { className: 'w-4 h-4' })}
                </div>
              </div>
            </div>

            {/* FULL GAME COMPONENT CONTAINER (OCCUPIES COMPLETE ROW/SECTION) */}
            <div className="w-full">
              {activeGameId === 'colorear' && (
                <ColorearGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                  books={books} 
                  selectedBookId={selectedLevel} 
                />
              )}
              {activeGameId === 'rompecabezas' && (
                <RompecabezasGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                  selectedImgIndex={selectedLevel} 
                />
              )}
              {activeGameId === 'diferencias' && (
                <DiferenciasGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                  selectedLevelIndex={selectedLevel} 
                />
              )}
              {activeGameId === 'memoria' && (
                <MemoriaGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                  selectedPairsCount={selectedLevel} 
                />
              )}
              {activeGameId === 'tateti' && (
                <TatetiGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                />
              )}
              {activeGameId === 'donde-esta-luna' && (
                <DondeEstaLunaGame 
                  darkMode={darkMode} 
                  onWinStar={handleWinStar} 
                  selectedSceneIndex={selectedLevel} 
                />
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
