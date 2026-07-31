import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Gamepad2, Heart, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LUNA_IMAGES } from '../data/lunaImages';

interface HeroProps {
  darkMode: boolean;
  onExploreGallery: () => void;
  onContact?: () => void;
  // Kept props empty to avoid breaking callers, but unused
  blocks?: any;
  isAdminLogged?: boolean;
  onRefreshBlocks?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  darkMode,
  onExploreGallery,
  onContact
}) => {
  const scrollToGames = () => {
    const gamesElem = document.getElementById('juegos');
    if (gamesElem) {
      gamesElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative pt-24 sm:pt-28 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Project Presentation Header Badge */}
        <div className="flex justify-center md:justify-start">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md transition-all shadow-md ${
            darkMode
              ? 'bg-purple-950/80 text-purple-200 border border-purple-700/60 shadow-purple-950/40'
              : 'bg-purple-100 text-purple-900 border border-purple-200'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </span>
            <span>Presentación del Proyecto CamiToons • Colección "Luna está creciendo"</span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1" />
          </div>
        </div>

        {/* Main 2-Column Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Project Presentation & Purpose */}
          <div className="lg:col-span-7 text-center md:text-left space-y-6">
            
            {/* Author & Creator Header */}
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <img
                src={LUNA_IMAGES.diseno6}
                alt="Proyecto CamiToons"
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-xl border-4 border-purple-400/80 transform hover:rotate-3 transition-transform duration-300"
              />
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
                  Colección "Luna está creciendo"
                </span>
                
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Proyecto{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                    Literario
                  </span>
                </h1>

                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                  Sostenido desde una mirada pedagógica • CamiToons.com
                </p>
              </div>
            </div>

            {/* Core Project Presentation Text */}
            <p className={`text-base sm:text-lg font-medium leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              La colección "Luna está creciendo" es una propuesta integral pensada para las primeras infancias. A través de cuentos ilustrados y herramientas lúdicas, cada historia aborda emociones, hábitos, el juego simbólico y el descubrimiento del entorno de una manera cálida y respetuosa.
            </p>

            {/* Age Range Pills Feature Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-center sm:text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-pink-500 text-white">
                  2 Años
                </span>
                <p className="text-xs font-extrabold text-pink-900 dark:text-pink-200">
                  Primeras Palabras & Juego
                </p>
                <p className="text-[11px] text-pink-700 dark:text-pink-300 opacity-90">
                  Chupete, transportes, formas y el campo.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-center sm:text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white">
                  3 Años
                </span>
                <p className="text-xs font-extrabold text-purple-900 dark:text-purple-200">
                  Emociones & Exploración
                </p>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 opacity-90">
                  Arcoíris, selva, estaciones y juguetes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center sm:text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                  4 Años
                </span>
                <p className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                  Autonomía & Hábitos
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 opacity-90">
                  Higiene, familia, sonidos y el árbol.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
              <button
                id="btn-hero-explore-gallery"
                onClick={onExploreGallery}
                className="px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Cuentos (22 Títulos)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={scrollToGames}
                className="px-5 py-3.5 rounded-2xl text-sm font-extrabold text-purple-900 dark:text-purple-100 bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 hover:bg-purple-200 transition-all flex items-center space-x-2 shadow-sm"
              >
                <Gamepad2 className="w-4 h-4 text-purple-600" />
                <span>Minijuegos Infantiles</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className={`pt-6 border-t grid grid-cols-3 gap-4 text-center md:text-left ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-lg sm:text-xl font-black">22 Cuentos</span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">En PDF con paso de hoja</p>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-pink-600 dark:text-pink-400">
                  <Heart className="w-4 h-4 fill-pink-500" />
                  <span className="text-lg sm:text-xl font-black">Educación</span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Emocional & Pedagógica</p>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-amber-500">
                  <Award className="w-4 h-4 fill-amber-400" />
                  <span className="text-lg sm:text-xl font-black">8 Juegos</span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Interactivos para colorear y aprender</p>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Artwork Card with Styled Picture Frame (Recuadro) */}
          <div className="lg:col-span-5 relative group">
            
            {/* Styled Picture Frame Container (Recuadro) */}
            <div className="relative p-3 bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
              
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-900">
                <img
                  src={LUNA_IMAGES.portadaWeb}
                  alt="Luna Portada Web - CamiToons"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[450px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Card Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                      Ilustración Oficial • Luna
                    </span>
                    <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Colección CamiToons</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black">Personaje principal: Luna</h3>

                  <div className="pt-2 flex items-center justify-end text-xs">
                    <button
                      onClick={onExploreGallery}
                      className="font-extrabold text-amber-300 hover:text-white underline underline-offset-4 transition-colors"
                    >
                      Ver Catálogo Completo →
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Educational Quality Stamp */}
            <div className={`absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 p-4 rounded-2xl shadow-xl backdrop-blur-md border max-w-xs hidden sm:flex items-center space-x-3 z-20 ${
              darkMode
                ? 'bg-slate-900/95 border-purple-800 text-white'
                : 'bg-white/95 border-purple-200 text-slate-900'
            }`}>
              <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black">Fundamentación Pedagógica</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Cada cuento incluye su guía didáctica para familias y escuelas.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
