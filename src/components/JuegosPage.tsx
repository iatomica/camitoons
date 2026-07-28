import React from 'react';
import { JuegosSection } from './JuegosSection';
import { ArrowLeft, Gamepad2, Sparkles } from 'lucide-react';

interface JuegosPageProps {
  darkMode: boolean;
  onGoBackHome: () => void;
}

export const JuegosPage: React.FC<JuegosPageProps> = ({ darkMode, onGoBackHome }) => {
  return (
    <div className={`min-h-screen pt-24 sm:pt-28 pb-16 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={onGoBackHome}
            id="btn-back-to-home-from-games"
            className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Volver a la Página Principal</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Gamepad2 className="w-4 h-4 text-purple-500" />
            <span>CamiToons • Módulo de Minijuegos Infantiles</span>
          </div>
        </div>

        {/* Full Interactive Games Module */}
        <JuegosSection darkMode={darkMode} />

      </div>
    </div>
  );
};
