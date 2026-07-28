import React, { useState } from 'react';
import { Sparkles, Check, RefreshCw, Trophy, Star, Link2 } from 'lucide-react';

interface PairItem {
  id: string;
  leftText: string;
  leftIcon: string;
  rightText: string;
  rightIcon: string;
  color: string;
}

const SETS: { id: string; title: string; pairs: PairItem[] }[] = [
  {
    id: 'set-1',
    title: 'Luna y sus Aventuras',
    pairs: [
      { id: 'p1', leftText: 'Luna', leftIcon: '👧🏻', rightText: 'Corona de Princesa', rightIcon: '👑', color: 'bg-pink-500' },
      { id: 'p2', leftText: 'Pincel de Cami', leftIcon: '🖌️', rightText: 'Paleta de Pintura', rightIcon: '🎨', color: 'bg-purple-500' },
      { id: 'p3', leftText: 'Luna sueña que viaja', leftIcon: '🚀', rightText: 'Monopatín y Tren', rightIcon: '🚂', color: 'bg-blue-500' },
      { id: 'p4', leftText: 'Luna y su chupete', leftIcon: '🍼', rightText: 'Globos de colores', rightIcon: '🎈', color: 'bg-amber-500' },
      { id: 'p5', leftText: 'Luna y el campo', leftIcon: '🐥', rightText: 'Granja y animales', rightIcon: '🐮', color: 'bg-emerald-500' }
    ]
  },
  {
    id: 'set-2',
    title: 'Sonidos y Objetos del Cuento',
    pairs: [
      { id: 'p1', leftText: 'Guitarra mágica', leftIcon: '🎸', rightText: 'Notas musicales', rightIcon: '🎵', color: 'bg-purple-500' },
      { id: 'p2', leftText: 'Sol radiante', leftIcon: '☀️', rightText: 'Arcoíris en el cielo', rightIcon: '🌈', color: 'bg-amber-500' },
      { id: 'p3', leftText: 'Reloj del día', leftIcon: '⏰', rightText: 'Hora de jugar', rightIcon: '🧸', color: 'bg-pink-500' },
      { id: 'p4', leftText: 'Semilla pequeña', leftIcon: '🌱', rightText: 'Flor del jardín', rightIcon: '🌻', color: 'bg-emerald-500' },
      { id: 'p5', leftText: 'Cama abrigada', leftIcon: '🛏️', rightText: 'Sueños felices', rightIcon: '🌙', color: 'bg-indigo-500' }
    ]
  }
];

interface AsociacionGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
}

export const AsociacionGame: React.FC<AsociacionGameProps> = ({ darkMode, onWinStar }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const currentSet = SETS[currentSetIndex];

  // Left and Right items (Right side is shuffled)
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<PairItem[]>(() => {
    return [...currentSet.pairs].sort(() => Math.random() - 0.5);
  });

  const handleSetChange = (idx: number) => {
    setCurrentSetIndex(idx);
    setSelectedLeftId(null);
    setMatchedIds([]);
    setShuffledRight([...SETS[idx].pairs].sort(() => Math.random() - 0.5));
  };

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeftId(id);
  };

  const handleRightClick = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    if (!selectedLeftId) return;

    if (selectedLeftId === pairId) {
      // Correct match!
      const newMatched = [...matchedIds, pairId];
      setMatchedIds(newMatched);
      setSelectedLeftId(null);

      if (newMatched.length === currentSet.pairs.length) {
        if (onWinStar) onWinStar();
      }
    } else {
      // Mismatch
      setSelectedLeftId(null);
    }
  };

  const isCompleted = matchedIds.length === currentSet.pairs.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
          Subsección 1: Selección de Categoría y Desafío
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
              <Link2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Juego de Asociación CamiToons</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tocá un elemento de la izquierda y luego su pareja correspondiente en la derecha
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {SETS.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => handleSetChange(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentSetIndex === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                {set.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-800 shadow-sm">
          Subsección 2: Tablero para Unir Parejas Lógicas
        </div>
        <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden">
        
        {/* Victory Screen */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">
              ¡Genial! ¡Asociaste todas las parejas correctamente! 🌟
            </h2>
            <p className="text-sm text-purple-200 font-medium max-w-md">
              Demostraste una memoria y lógica brillantes. ¡Ganaste una estrella dorada!
            </p>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
              ))}
            </div>
            <button
              onClick={() => handleSetChange((currentSetIndex + 1) % SETS.length)}
              className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              🔄 Siguiente Desafío
            </button>
          </div>
        )}

        {/* 2-Column Matching Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider text-center">
              1. Elegí de esta columna:
            </h4>

            {currentSet.pairs.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedLeftId === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => handleLeftClick(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-sm ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-80'
                      : isSelected
                      ? 'bg-purple-100 dark:bg-purple-950 border-purple-600 text-purple-900 dark:text-purple-100 ring-4 ring-purple-400 scale-102 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{pair.leftIcon}</span>
                    <span className="text-sm font-extrabold">{pair.leftText}</span>
                  </div>
                  {isMatched && <Check className="w-5 h-5 text-emerald-500 font-bold" />}
                </button>
              );
            })}
          </div>

          {/* Right Column (Shuffled) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider text-center">
              2. Tocá su pareja acá:
            </h4>

            {shuffledRight.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);

              return (
                <button
                  key={pair.id}
                  onClick={() => handleRightClick(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-sm ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-80'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{pair.rightIcon}</span>
                    <span className="text-sm font-extrabold">{pair.rightText}</span>
                  </div>
                  {isMatched && <Check className="w-5 h-5 text-emerald-500 font-bold" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  </div>
);
};
