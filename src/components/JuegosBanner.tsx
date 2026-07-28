import React from 'react';
import { Gamepad2, ArrowRight, Palette, Puzzle, Search, Link2, Eye, CircleDot, Compass, Mic } from 'lucide-react';

interface JuegosBannerProps {
  darkMode: boolean;
  onExploreGames: () => void;
}

export const JuegosBanner: React.FC<JuegosBannerProps> = ({ darkMode, onExploreGames }) => {
  const PREVIEW_GAMES = [
    { title: 'Taller de Colorear', icon: Palette, color: 'from-pink-500 to-rose-500' },
    { title: 'Rompecabezas', icon: Puzzle, color: 'from-amber-500 to-orange-500' },
    { title: '5 Diferencias', icon: Search, color: 'from-purple-500 to-pink-500' },
    { title: 'Asociación', icon: Link2, color: 'from-emerald-500 to-teal-500' },
    { title: 'Memotest', icon: Eye, color: 'from-indigo-500 to-purple-600' },
    { title: 'Ta-Te-Ti', icon: CircleDot, color: 'from-rose-500 to-pink-600' },
    { title: 'Escondidas', icon: Compass, color: 'from-amber-500 to-yellow-500' },
    { title: 'Karaoke CamiToons', icon: Mic, color: 'from-purple-600 to-pink-600' }
  ];

  return (
    <section id="juegos" className="py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aesthetic Minimalist Frame Box (Recuadro Celeste Suave) */}
        <div className="relative rounded-3xl border-2 border-sky-300 dark:border-sky-700/80 bg-gradient-to-br from-sky-50/90 via-cyan-50/60 to-purple-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 shadow-xl p-5 sm:p-9 overflow-hidden">
          
          {/* Subtle Background Sky Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
            <svg className="absolute -top-4 -right-4 w-40 h-24 text-sky-200/50 dark:text-sky-800/20 fill-current animate-pulse" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <svg className="absolute -bottom-6 -left-6 w-36 h-20 text-cyan-200/40 dark:text-cyan-800/15 fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Banner Left Info */}
            <div className="lg:col-span-5 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-white/90 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 shadow-sm">
                <Gamepad2 className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-bounce" />
                <span>Zona Infantil Interactiva</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-sky-950 dark:text-sky-100">
                Minijuegos Infantiles CamiToons
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium max-w-xl">
                Un espacio lúdico diseñado para aprender jugando con Luna: 8 actividades interactivas de colorear, memoria, rompecabezas, asociación, karaoke y más.
              </p>

              {/* Action CTA Button */}
              <div className="pt-2 flex justify-center md:justify-start">
                <button
                  onClick={onExploreGames}
                  id="btn-explore-games-banner"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-500/20 hover:scale-105 transition-all flex items-center space-x-2.5 group"
                >
                  <span>Explorar Minijuegos Infantiles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Banner Right Preview Cards (Large Icon Square Cards) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {PREVIEW_GAMES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={onExploreGames}
                    className="aspect-square rounded-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-sky-300 dark:border-sky-700 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center p-3 space-y-2.5"
                  >
                    {/* Large Icon Container */}
                    <div className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 sm:w-9 sm:h-9" />
                    </div>

                    {/* Title Text */}
                    <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
