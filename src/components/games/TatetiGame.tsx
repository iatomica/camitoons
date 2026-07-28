import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Star, RefreshCw, User, Bot, CircleDot } from 'lucide-react';

type BoardState = Array<string | null>; // 'X' | 'O' | null

interface TatetiGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
}

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const TatetiGame: React.FC<TatetiGameProps> = ({ darkMode, onWinStar }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isVsAi, setIsVsAi] = useState(true);
  const [xIsNext, setXIsNext] = useState(true); // Player 1 is X (🌸), Player 2 / AI is O (⭐️)
  const [scores, setScores] = useState({ p1: 0, p2: 0, ties: 0 });
  const [winnerLine, setWinnerLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<'X' | 'O' | 'TIE' | null>(null);

  // Check for winner
  const checkWinner = (currentBoard: BoardState) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'TIE', line: null };
    }
    return null;
  };

  // AI Turn (Luna's turn)
  useEffect(() => {
    if (isVsAi && !xIsNext && !winner) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, isVsAi, winner, board]);

  const makeAiMove = () => {
    const emptyIndices: number[] = [];
    board.forEach((val, idx) => {
      if (val === null) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    // Smart AI logic: 1. Try to win, 2. Try to block opponent, 3. Take center/random
    let choice = -1;

    // Check if AI can win
    for (const idx of emptyIndices) {
      const boardCopy = [...board];
      boardCopy[idx] = 'O';
      if (checkWinner(boardCopy)?.winner === 'O') {
        choice = idx;
        break;
      }
    }

    // Block player win
    if (choice === -1) {
      for (const idx of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[idx] = 'X';
        if (checkWinner(boardCopy)?.winner === 'X') {
          choice = idx;
          break;
        }
      }
    }

    // Pick center if available
    if (choice === -1 && board[4] === null) {
      choice = 4;
    }

    // Otherwise random
    if (choice === -1) {
      choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    handleMove(choice, 'O');
  };

  const handleMove = (index: number, playerSymbol: 'X' | 'O') => {
    if (board[index] !== null || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(winResult.winner as any);
      setWinnerLine(winResult.line);

      if (winResult.winner === 'X') {
        setScores((prev) => ({ ...prev, p1: prev.p1 + 1 }));
        if (onWinStar) onWinStar();
      } else if (winResult.winner === 'O') {
        setScores((prev) => ({ ...prev, p2: prev.p2 + 1 }));
      } else {
        setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
      }
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const handleCellClick = (index: number) => {
    if (isVsAi && !xIsNext) return; // Wait for AI turn
    handleMove(index, xIsNext ? 'X' : 'O');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinnerLine(null);
    setXIsNext(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Controls Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
          Subsección 1: Modo de Juego y Marcador
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md">
              <CircleDot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Ta-Te-Ti</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alineá 3 fichas en línea horizontal, vertical o diagonal para ganar
              </p>
            </div>
          </div>

          {/* Mode selector buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsVsAi(true);
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isVsAi
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>vs Luna (IA)</span>
            </button>

            <button
              onClick={() => {
                setIsVsAi(false);
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                !isVsAi
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>2 Jugadores</span>
            </button>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center font-bold text-xs">
          <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200">
            <p className="text-[10px] uppercase font-black opacity-70">Jugador 1 (🌸)</p>
            <p className="text-lg font-black">{scores.p1} Victorias</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <p className="text-[10px] uppercase font-black opacity-70">Empates</p>
            <p className="text-lg font-black">{scores.ties}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
            <p className="text-[10px] uppercase font-black opacity-70">
              {isVsAi ? 'Luna ⭐️' : 'Jugador 2 ⭐️'}
            </p>
            <p className="text-lg font-black">{scores.p2} Victorias</p>
          </div>
        </div>
      </div>

      {/* Main Board Grid */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-pink-800 dark:text-pink-300 bg-pink-100 dark:bg-pink-950 border border-pink-300 dark:border-pink-800 shadow-sm">
          Subsección 2: Tablero de Ta-Te-Ti
        </div>
        <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Victory / Draw Overlay */}
        {winner && (
          <div className="absolute inset-0 z-30 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
              {winner === 'X'
                ? '¡Ganaste el Ta-Te-Ti! 🌸'
                : winner === 'O'
                ? isVsAi
                  ? '¡Luna ganó esta ronda! ⭐️'
                  : '¡Ganó el Jugador 2! ⭐️'
                : '¡Empate emocionante! 🤝'}
            </h2>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
              ))}
            </div>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jugar Otra Ronda</span>
            </button>
          </div>
        )}

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[360px] aspect-square p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border-2 border-purple-300 dark:border-purple-800 shadow-inner">
          {board.map((cell, index) => {
            const isWinningCell = winnerLine?.includes(index);

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={cell !== null || winner !== null}
                className={`w-full h-full rounded-2xl text-4xl sm:text-5xl font-black transition-all flex items-center justify-center shadow-md select-none border-2 ${
                  isWinningCell
                    ? 'bg-amber-300 border-amber-500 text-amber-900 scale-105 animate-bounce z-10'
                    : cell === 'X'
                    ? 'bg-white dark:bg-slate-800 border-pink-400 text-pink-500'
                    : cell === 'O'
                    ? 'bg-white dark:bg-slate-800 border-amber-400 text-amber-500'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                }`}
              >
                {cell === 'X' ? '🌸' : cell === 'O' ? '⭐️' : ''}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          Turno actual:{' '}
          <span className="font-extrabold text-purple-600 dark:text-purple-400">
            {xIsNext ? 'Jugador 1 (🌸)' : isVsAi ? 'Luna ⭐️' : 'Jugador 2 (⭐️)'}
          </span>
        </p>
      </div>
    </div>
  </div>
);
};
