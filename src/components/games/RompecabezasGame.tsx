import React, { useState, useEffect } from 'react';
import { LUNA_IMAGES } from '../../data/lunaImages';
import { Puzzle, RefreshCw, Trophy, Eye, Star, Sparkles, Clock, Move } from 'lucide-react';

interface RompecabezasGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
}

const PUZZLE_IMAGES = [
  { id: 'luna-main', name: 'Luna y los Sonidos', src: LUNA_IMAGES.main },
  { id: 'luna-1', name: 'Luna Soñadora', src: LUNA_IMAGES.diseno1 },
  { id: 'luna-2', name: 'Luna en la Ciudad', src: LUNA_IMAGES.diseno2 },
  { id: 'luna-3', name: 'Luna de Aventura', src: LUNA_IMAGES.diseno3 },
  { id: 'luna-6', name: 'Luna y Cami', src: LUNA_IMAGES.diseno6 }
];

export const RompecabezasGame: React.FC<RompecabezasGameProps> = ({ darkMode, onWinStar }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [gridSize, setGridSize] = useState<3 | 4>(3); // 3x3 or 4x4
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const currentImg = PUZZLE_IMAGES[selectedImgIndex].src;
  const totalTiles = gridSize * gridSize;

  // Initialize or shuffle puzzle
  const initPuzzle = () => {
    const original = Array.from({ length: totalTiles }, (_, i) => i);
    let shuffled = [...original];

    // Ensure it's actually shuffled
    let swapCount = 0;
    while (swapCount < totalTiles * 5) {
      const idx1 = Math.floor(Math.random() * totalTiles);
      const idx2 = Math.floor(Math.random() * totalTiles);
      const temp = shuffled[idx1];
      shuffled[idx1] = shuffled[idx2];
      shuffled[idx2] = temp;
      swapCount++;
    }

    setTiles(shuffled);
    setSelectedTileIndex(null);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setIsWon(false);
  };

  useEffect(() => {
    initPuzzle();
  }, [selectedImgIndex, gridSize]);

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

  // Check if puzzle is solved
  const checkVictory = (currentTiles: number[]) => {
    for (let i = 0; i < currentTiles.length; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (index: number) => {
    if (isWon) return;

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else if (selectedTileIndex === index) {
      setSelectedTileIndex(null);
    } else {
      // Swap tiles at selectedTileIndex and index
      const newTiles = [...tiles];
      const temp = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedTileIndex(null);
      setMoves((prev) => prev + 1);

      if (checkVictory(newTiles)) {
        setIsWon(true);
        setIsPlaying(false);
        if (onWinStar) onWinStar();
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header & Config Panel */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
          Subsección 1: Configuración del Rompecabezas
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
              <Puzzle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Rompecabezas CamiToons</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seleccioná una pieza y luego otra para intercambiarlas de lugar hasta armar la imagen
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center space-x-3 text-xs font-bold font-mono">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Move className="w-3.5 h-3.5" />
              <span>{moves} Movs</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{seconds}s</span>
            </div>
          </div>
        </div>

        {/* Option Selectors: Image & Grid Size */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Images */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {PUZZLE_IMAGES.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImgIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  selectedImgIndex === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                <img src={img.src} alt={img.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{img.name}</span>
              </button>
            ))}
          </div>

          {/* Grid Size & Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setGridSize(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                gridSize === 3
                  ? 'bg-pink-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Fácil (3x3)
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                gridSize === 4
                  ? 'bg-pink-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Desafío (4x4)
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                showPreview
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Ver imagen original"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={initPuzzle}
              className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow"
              title="Mezclar de nuevo"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal Popup */}
      {showPreview && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex flex-col items-center space-y-2 animate-fade-in">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-200">🔍 Imagen de Referencia:</p>
          <img src={currentImg} alt="Preview" className="max-h-48 rounded-2xl shadow-md border-2 border-amber-400 object-contain" />
        </div>
      )}

      {/* Main Board Canvas Grid */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 shadow-sm">
          Subsección 2: Tablero de Piezas Interactivas
        </div>
        <div className="relative p-3 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col items-center">
          
          {/* Victory Celebration Overlay */}
          {isWon && (
            <div className="absolute inset-0 z-30 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
              <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
              <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                ¡Felicidades! ¡Completaste el Rompecabezas! 🎉
              </h2>
            <p className="text-sm font-medium max-w-md text-purple-200">
              Lo lograste en <span className="font-bold text-amber-300">{moves} movimientos</span> y{' '}
              <span className="font-bold text-amber-300">{seconds} segundos</span>. ¡Ganaste una estrella de campeón! ⭐️
            </p>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
              ))}
            </div>
            <button
              onClick={initPuzzle}
              className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              🎮 Jugar de Nuevo
            </button>
          </div>
        )}

        {/* Puzzle Board Grid */}
        <div
          className="grid gap-1 sm:gap-2 w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 p-2 border-2 border-purple-200 dark:border-purple-800"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          {tiles.map((tileOrigPos, index) => {
            const isSelected = selectedTileIndex === index;

            // Calculate background position offset for this tile
            const rowOrig = Math.floor(tileOrigPos / gridSize);
            const colOrig = tileOrigPos % gridSize;

            const bgPosX = (colOrig / (gridSize - 1)) * 100;
            const bgPosY = (rowOrig / (gridSize - 1)) * 100;

            return (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                style={{
                  backgroundImage: `url(${currentImg})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`
                }}
                className={`w-full h-full rounded-xl transition-all duration-200 relative group overflow-hidden border-2 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 ring-4 ring-amber-400/60 scale-105 z-10 shadow-lg'
                    : 'border-white/40 dark:border-slate-700/60 hover:scale-102 hover:border-purple-400'
                }`}
              >
                {/* Tile indicator number (subtle) */}
                <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold bg-slate-900/60 text-white px-1.5 py-0.5 rounded-md opacity-50 group-hover:opacity-100">
                  {tileOrigPos + 1}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
          💡 Tocá una pieza para seleccionarla y luego otra para intercambiarlas
        </p>
      </div>
    </div>
  </div>
);
};
