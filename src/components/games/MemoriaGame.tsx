import React, { useState, useEffect } from 'react';
import { LUNA_IMAGES } from '../../data/lunaImages';
import { Sparkles, Trophy, Star, RefreshCw, Eye, Move, Clock } from 'lucide-react';

interface CardItem {
  id: number;
  pairId: string;
  name: string;
  imgSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_DATA = [
  { pairId: 'c1', name: 'Luna Soñadora', imgSrc: LUNA_IMAGES.memotest[0] },
  { pairId: 'c2', name: 'Luna y Sonidos', imgSrc: LUNA_IMAGES.memotest[1] },
  { pairId: 'c3', name: 'Luna y Cami', imgSrc: LUNA_IMAGES.memotest[2] },
  { pairId: 'c4', name: 'Luna Feliz', imgSrc: LUNA_IMAGES.memotest[3] },
  { pairId: 'c5', name: 'Luna en el Jardín', imgSrc: LUNA_IMAGES.memotest[4] },
  { pairId: 'c6', name: 'Luna Jugando', imgSrc: LUNA_IMAGES.memotest[5] },
  { pairId: 'c7', name: 'Luna Creadora', imgSrc: LUNA_IMAGES.memotest[6] },
  { pairId: 'c8', name: 'Luna y Amigos', imgSrc: LUNA_IMAGES.memotest[7] },
  { pairId: 'c9', name: 'Luna Curiosa', imgSrc: LUNA_IMAGES.memotest[8] },
  { pairId: 'c10', name: 'Luna Cantarina', imgSrc: LUNA_IMAGES.memotest[9] },
  { pairId: 'c11', name: 'Luna Alegre', imgSrc: LUNA_IMAGES.memotest[10] }
];

interface MemoriaGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
  selectedPairsCount?: number;
}

export const MemoriaGame: React.FC<MemoriaGameProps> = ({ darkMode, onWinStar, selectedPairsCount }) => {
  const [numPairs, setNumPairs] = useState<4 | 6 | 8>(() => {
    if (selectedPairsCount === 4 || selectedPairsCount === 6 || selectedPairsCount === 8) {
      return selectedPairsCount;
    }
    return 6;
  });
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Initialize deck with randomly selected and shuffled pairs from active WebP images
  const initGame = () => {
    // Shuffle full catalog to vary images randomly on each round
    const shuffledCatalog = [...CARD_DATA].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledCatalog.slice(0, numPairs);

    const deck: CardItem[] = [];

    selectedPairs.forEach((item, index) => {
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        name: item.name,
        imgSrc: item.imgSrc,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        name: item.name,
        imgSrc: item.imgSrc,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle final deck
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    setCards(shuffledDeck);
    setFlippedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setIsWon(false);
    setIsBusy(false);
  };

  useEffect(() => {
    initGame();
  }, [numPairs]);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const handleCardClick = (id: number) => {
    if (isBusy || isWon) return;

    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip card
    const updatedCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsBusy(true);

      const [firstId, secondId] = newFlipped;
      const card1 = updatedCards.find((c) => c.id === firstId)!;
      const card2 = updatedCards.find((c) => c.id === secondId)!;

      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === card1.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setIsBusy(false);

          // Check if all matched
          const allMatched = updatedCards.every(
            (c) => c.isMatched || c.pairId === card1.pairId
          );
          if (allMatched) {
            setIsWon(true);
            setIsPlaying(false);
            if (onWinStar) onWinStar();
          }
        }, 500);
      } else {
        // No match -> flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsBusy(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Controls Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
          Subsección 1: Dificultad e Intentos
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
              <Eye className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Memotest CamiToons</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encontrá los pares de las ilustraciones WebP mágicas de Luna y CamiToons
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold font-mono">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Move className="w-3.5 h-3.5" />
              <span>{moves} Intentos</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{seconds}s</span>
            </div>
          </div>
        </div>

        {/* Level Difficulty Options (3 Opciones: 4, 6, 8 pares) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {selectedPairsCount === undefined && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setNumPairs(4)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  numPairs === 4
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                Memotest de 4
              </button>
              <button
                onClick={() => setNumPairs(6)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  numPairs === 6
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                Memotest de 6
              </button>
              <button
                onClick={() => setNumPairs(8)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  numPairs === 8
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                Memotest de 8
              </button>
            </div>
          )}

          <button
            onClick={initGame}
            className="p-2 px-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow flex items-center space-x-1.5 text-xs font-bold whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mezclar Cartas</span>
          </button>
        </div>
      </div>

      {/* Main Board Grid */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-800 shadow-sm">
          Subsección 2: Tablero de Cartas Mágicas ({numPairs * 2} Cartas)
        </div>
        <div className="relative p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden min-h-[420px] flex items-center justify-center">
          
          {/* Victory celebration */}
          {isWon && (
            <div className="absolute inset-0 z-30 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
              <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
              <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
                ¡Increíble Memoria! ¡Ganaste el Memotest! 🌟
              </h2>
              <p className="text-sm text-purple-200 font-medium max-w-md">
                Encontraste los <span className="font-bold text-amber-300">{numPairs} pares</span> de imágenes WebP en <span className="font-bold text-amber-300">{moves} intentos</span> y{' '}
                <span className="font-bold text-amber-300">{seconds} segundos</span>.
              </p>
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
                ))}
              </div>
              <button
                onClick={initGame}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
              >
                🎮 Jugar de Nuevo
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div
            className={`grid gap-2.5 sm:gap-3 w-full max-w-4xl ${
              numPairs === 4
                ? 'grid-cols-2 sm:grid-cols-4'
                : numPairs === 6
                ? 'grid-cols-3 sm:grid-cols-4'
                : 'grid-cols-4 sm:grid-cols-4'
            }`}
          >
            {cards.map((card) => {
              const isOpen = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isOpen}
                  className="w-full aspect-3/4 rounded-2xl cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
                >
                  <div
                    className={`w-full h-full rounded-2xl border-2 transition-all duration-300 shadow-md relative overflow-hidden ${
                      isOpen
                        ? 'border-purple-500 bg-white dark:bg-slate-900 ring-2 ring-purple-300'
                        : 'border-purple-300 dark:border-purple-700 bg-gradient-to-tr from-purple-600 to-pink-500'
                    }`}
                  >
                    {isOpen ? (
                      /* Card Front (Revealed Complete WebP Image with object-contain to ensure NO cropping) */
                      <div className="w-full h-full relative flex items-center justify-center p-1.5 bg-white dark:bg-slate-900">
                        <img
                          src={card.imgSrc}
                          alt={card.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {card.isMatched && (
                          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-xl sm:text-2xl animate-bounce">✨</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Card Back (Hidden state) */
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-white shadow-inner">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase mt-1.5 opacity-90">
                          CamiToons
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
