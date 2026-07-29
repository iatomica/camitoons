import React, { useState, useEffect } from 'react';
import { ColorearGame } from './games/ColorearGame';
import { RompecabezasGame } from './games/RompecabezasGame';
import { DiferenciasGame } from './games/DiferenciasGame';
import { MemoriaGame } from './games/MemoriaGame';
import { TatetiGame } from './games/TatetiGame';
import { DondeEstaLunaGame } from './games/DondeEstaLunaGame';
import { Gamepad2, Palette, Puzzle, Search, Eye, CircleDot, Star, Sparkles, Award } from 'lucide-react';

interface JuegosSectionProps {
  darkMode: boolean;
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
    subtitle: 'Láminas vectoriales con paleta de tonos de piel',
    icon: Palette,
    badge: 'Creatividad',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'rompecabezas',
    title: 'Rompecabezas',
    subtitle: 'Armá la imagen intercambiando piezas 3x3 y 4x4',
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

export const JuegosSection: React.FC<JuegosSectionProps> = ({ darkMode }) => {
  const [activeGameId, setActiveGameId] = useState<GameId>('colorear');

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

  const activeGameInfo = GAMES_LIST.find((g) => g.id === activeGameId) || GAMES_LIST[0];

  return (
    <section id="juegos" className="py-16 sm:py-24 relative overflow-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-widest shadow-sm">
            <Gamepad2 className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>Zona Infantil Interactiva</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Juegos Mágicos CamiToons
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            ¡Divertite aprendiendo con Luna y sus amigos! 6 minijuegos para estimular la imaginación, memoria, lógica y expresión artística.
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

        {/* Game Selector Hub Grid (8 Buttons) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {GAMES_LIST.map((game) => {
            const Icon = game.icon;
            const isActive = game.id === activeGameId;

            return (
              <button
                key={game.id}
                onClick={() => setActiveGameId(game.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 group relative overflow-hidden ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/30 scale-105 ring-2 ring-purple-300 z-10'
                    : darkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-purple-500/40'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl text-white shadow-md transition-transform group-hover:scale-110 bg-gradient-to-br ${game.gradient}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold line-clamp-2 leading-tight">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Game Display Area */}
        <div className="pt-4">
          {activeGameId === 'colorear' && <ColorearGame darkMode={darkMode} onWinStar={handleWinStar} />}
          {activeGameId === 'rompecabezas' && <RompecabezasGame darkMode={darkMode} onWinStar={handleWinStar} />}
          {activeGameId === 'diferencias' && <DiferenciasGame darkMode={darkMode} onWinStar={handleWinStar} />}
          {activeGameId === 'memoria' && <MemoriaGame darkMode={darkMode} onWinStar={handleWinStar} />}
          {activeGameId === 'tateti' && <TatetiGame darkMode={darkMode} onWinStar={handleWinStar} />}
          {activeGameId === 'donde-esta-luna' && <DondeEstaLunaGame darkMode={darkMode} onWinStar={handleWinStar} />}
        </div>

      </div>
    </section>
  );
};
