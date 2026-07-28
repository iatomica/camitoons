import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Pause, RotateCcw, Music, Sparkles, Volume2, Trophy, Star, VolumeX } from 'lucide-react';

interface LyricLine {
  timeSec: number;
  text: string;
  noteFreq: number; // Hz for procedural synth sound
}

interface Song {
  id: string;
  title: string;
  author: string;
  themeColor: string;
  lyrics: LyricLine[];
}

const SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'El Canto de Luna y los Sonidos',
    author: 'CamiToons Colección',
    themeColor: 'from-pink-500 to-purple-600',
    lyrics: [
      { timeSec: 0, text: '🎵 Luna mira al cielo y empieza a cantar 🎵', noteFreq: 261.63 }, // C4
      { timeSec: 3, text: 'Escucha los sonidos que la hacen soñar...', noteFreq: 293.66 }, // D4
      { timeSec: 6, text: '¡Pío pío canta el pajarito feliz! 🐦', noteFreq: 329.63 }, // E4
      { timeSec: 9, text: '¡Brum brum hace el autito del jardín! 🚗', noteFreq: 349.23 }, // F4
      { timeSec: 12, text: '¡Guau guau dice el perrito al saludar! 🐶', noteFreq: 392.00 }, // G4
      { timeSec: 15, text: '¡Y Luna con su voz no para de cantar! ✨', noteFreq: 440.00 }, // A4
      { timeSec: 18, text: '¡Canta, baila y ríe con amor! 💖', noteFreq: 493.88 }, // B4
      { timeSec: 21, text: '¡El mundo CamiToons se llena de color! 🌈', noteFreq: 523.25 } // C5
    ]
  },
  {
    id: 'song-2',
    title: 'Viajando en el Sueño Mágico',
    author: 'CamiToons Colección',
    themeColor: 'from-purple-500 to-indigo-600',
    lyrics: [
      { timeSec: 0, text: '🚀 Subo a mi nave, vamos a volar 🚀', noteFreq: 293.66 },
      { timeSec: 3, text: 'Por las estrellas voy a navegar...', noteFreq: 349.23 },
      { timeSec: 6, text: 'En monopatín voy rápido y veloz! 🛹', noteFreq: 392.00 },
      { timeSec: 9, text: '¡Pedaleo alegre con mi hermosa voz! 🚲', noteFreq: 440.00 },
      { timeSec: 12, text: 'El tren hace chu-chu por el camino real! 🚂', noteFreq: 523.25 },
      { timeSec: 15, text: '¡Viajar e imaginar es algo genial! ⭐', noteFreq: 587.33 }
    ]
  },
  {
    id: 'song-3',
    title: 'Los Amigos del Campo',
    author: 'CamiToons Colección',
    themeColor: 'from-emerald-500 to-teal-600',
    lyrics: [
      { timeSec: 0, text: '🌾 En el campo de la abuelita Luna está 🌾', noteFreq: 329.63 },
      { timeSec: 3, text: 'Los animalitos vienen a jugar...', noteFreq: 392.00 },
      { timeSec: 6, text: 'La vaquita muuu nos da su cariño! 🐮', noteFreq: 440.00 },
      { timeSec: 9, text: 'El patito cuac se baña en el río! 🦆', noteFreq: 493.88 },
      { timeSec: 12, text: '¡Qué lindo es cuidar la naturaleza hoy! 🌻', noteFreq: 523.25 },
      { timeSec: 15, text: '¡Juntos en la granja felices somos hoy! 🎈', noteFreq: 659.25 }
    ]
  }
];

interface KaraokeGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
}

export const KaraokeGame: React.FC<KaraokeGameProps> = ({ darkMode, onWinStar }) => {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const activeSong = SONGS[songIndex];
  const maxTime = activeSong.lyrics[activeSong.lyrics.length - 1].timeSec + 4;

  // Play synthetic tone using Web Audio API
  const playTone = (freq: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  // Karaoke Play Timer Loop
  useEffect(() => {
    let interval: any = null;

    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;

          // Find active line
          let lineIdx = -1;
          for (let i = activeSong.lyrics.length - 1; i >= 0; i--) {
            if (activeSong.lyrics[i].timeSec <= next) {
              lineIdx = i;
              break;
            }
          }

          if (lineIdx !== -1 && lineIdx !== currentLineIndex) {
            setCurrentLineIndex(lineIdx);
            playTone(activeSong.lyrics[lineIdx].noteFreq);
          }

          if (next >= maxTime) {
            setIsPlaying(false);
            setIsCompleted(true);
            if (onWinStar) onWinStar();
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, currentLineIndex, songIndex, isMuted]);

  const handleSongSelect = (idx: number) => {
    setSongIndex(idx);
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentLineIndex(0);
    setIsCompleted(false);
  };

  const handleTogglePlay = () => {
    if (isCompleted) {
      setCurrentTime(0);
      setCurrentLineIndex(0);
      setIsCompleted(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentLineIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
          Subsección 1: Selección de Canción
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
              <Mic className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Karaoke Infantil CamiToons</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cantá las canciones de Luna con la pelotita rebotadora que guía la letra
              </p>
            </div>
          </div>

          {/* Song Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {SONGS.map((song, idx) => (
              <button
                key={song.id}
                onClick={() => handleSongSelect(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  songIndex === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{song.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
              <span>{isMuted ? 'Melodía Silenciada' : 'Melodía Activada'}</span>
            </button>

            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                micEnabled
                  ? 'bg-rose-500 text-white shadow ring-2 ring-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{micEnabled ? 'Micrófono En Vivo 🎙️' : 'Activar Micrófono'}</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
            title="Reiniciar Canción"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Karaoke Stage Player */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-pink-800 dark:text-pink-300 bg-pink-100 dark:bg-pink-950 border border-pink-300 dark:border-pink-800 shadow-sm">
          Subsección 2: Escenario de Karaoke y Letra Rítmica
        </div>
        <div className={`relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br ${activeSong.themeColor} text-white shadow-2xl overflow-hidden min-h-[420px] flex flex-col items-center justify-between border-4 border-white/30`}>
        
        {/* Victory Celebration */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 bg-purple-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
              ¡Bravo! ¡Excelente interpretación! 🎤🌟
            </h2>
            <p className="text-sm text-purple-200 font-medium max-w-md">
              Cantaste toda la canción con un entusiasmo sensacional. ¡Ganaste una estrella de música!
            </p>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
              ))}
            </div>
            <button
              onClick={() => handleSongSelect((songIndex + 1) % SONGS.length)}
              className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              🎶 Siguiente Canción
            </button>
          </div>
        )}

        {/* Floating Animated Equalizer particles */}
        {isPlaying && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-40">
            <div className="flex items-end space-x-1 h-12">
              <span className="w-2 bg-white rounded-full animate-bounce h-8" />
              <span className="w-2 bg-white rounded-full animate-bounce h-12 delay-100" />
              <span className="w-2 bg-white rounded-full animate-bounce h-6 delay-200" />
            </div>
            <div className="flex items-end space-x-1 h-12">
              <span className="w-2 bg-white rounded-full animate-bounce h-10 delay-150" />
              <span className="w-2 bg-white rounded-full animate-bounce h-5 delay-75" />
              <span className="w-2 bg-white rounded-full animate-bounce h-11 delay-300" />
            </div>
          </div>
        )}

        {/* Song Info Badge */}
        <div className="text-center space-y-1 z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-amber-200">
            {activeSong.author}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">{activeSong.title}</h2>
        </div>

        {/* Lyrics Display with Bouncing Ball Marker */}
        <div className="my-8 w-full max-w-2xl text-center space-y-6 z-10">
          
          {/* Current Active Line */}
          <div className="relative p-6 rounded-3xl bg-black/25 backdrop-blur-md border border-white/20 shadow-xl space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Línea {currentLineIndex + 1} de {activeSong.lyrics.length}
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-black leading-relaxed tracking-wide drop-shadow-md transition-all duration-300 text-amber-200">
              {activeSong.lyrics[currentLineIndex].text}
            </p>
          </div>

          {/* Upcoming Next Line Preview */}
          {currentLineIndex < activeSong.lyrics.length - 1 && (
            <p className="text-sm font-semibold opacity-70 italic">
              Siguiente: "{activeSong.lyrics[currentLineIndex + 1].text}"
            </p>
          )}
        </div>

        {/* Bottom Playback Bar */}
        <div className="w-full max-w-md flex flex-col items-center space-y-3 z-10">
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden border border-white/30">
            <div
              style={{ width: `${(currentTime / maxTime) * 100}%` }}
              className="bg-amber-400 h-full rounded-full transition-all duration-1000"
            />
          </div>

          {/* Big Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 rounded-full bg-amber-400 text-purple-950 font-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-purple-950" /> : <Play className="w-8 h-8 fill-purple-950 ml-1" />}
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};
