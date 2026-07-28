import React from 'react';
import { User, BookOpen, Heart, Sparkles, Compass, Users, Smile } from 'lucide-react';
import { LUNA_IMAGES } from '../data/lunaImages';

interface AboutSectionProps {
  darkMode: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ darkMode }) => {
  return (
    <section id="sobre-mi" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Author Bio Unified Soft Sky-Blue Card (Compact & Cozy with Subtle Clouds) */}
        <div className="relative max-w-4xl mx-auto rounded-3xl border-2 border-sky-200 dark:border-sky-800/60 bg-gradient-to-br from-sky-50/95 via-cyan-50/70 to-blue-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 shadow-lg p-5 sm:p-7 text-slate-900 dark:text-slate-100 overflow-hidden">
          
          {/* Subtle Background Sky Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
            {/* Cloud 1 Top Right */}
            <svg className="absolute -top-3 -right-4 w-36 h-20 text-sky-200/60 dark:text-sky-800/25 fill-current animate-pulse" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            {/* Cloud 2 Bottom Left */}
            <svg className="absolute -bottom-4 -left-4 w-32 h-18 text-cyan-200/50 dark:text-cyan-800/20 fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            {/* Cloud 3 Top Center */}
            <svg className="absolute top-1 left-1/3 w-24 h-14 text-blue-200/40 dark:text-blue-900/20 fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Incorporated Photo in Styled Picture Frame (Recuadro) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-2.5">
              
              {/* Picture Frame (Recuadro) */}
              <div className="relative p-2.5 bg-white dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-700 rounded-2xl shadow-md transition-all hover:shadow-lg">
                <div className="relative max-w-[155px] sm:max-w-[175px] rounded-xl overflow-hidden border border-sky-200 dark:border-sky-800">
                  <img
                    src={LUNA_IMAGES.camiAuthor}
                    alt="Camila Maestrojuan"
                    referrerPolicy="no-referrer"
                    className="w-full h-[195px] object-cover object-center"
                  />
                </div>
              </div>

              {/* Author Info Below Photo */}
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-sky-950 dark:text-sky-100">
                  Camila Maestrojuan
                </h3>
                <p className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                  Autora & Docente de Educación Inicial
                </p>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Creadora de "Luna está creciendo"
                </p>
              </div>
            </div>

            {/* Biography Text & Badges */}
            <div className="lg:col-span-8 space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 shadow-sm">
                <User className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>Biografía de la Autora</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                <p>
                  Me llamo <strong className="text-sky-700 dark:text-sky-300 font-bold">Camila Maestrojuan</strong>, soy docente de Educación Inicial. A partir de mi experiencia en instituciones y del vínculo cotidiano con infancias, nace el deseo de escribir literatura infantil.
                </p>

                <p>
                  Con el motivo de celebrar la ternura de los primeros años de vida, se creó la colección <strong className="text-pink-600 dark:text-pink-400 font-bold">"Luna está creciendo"</strong>, en donde se disfrutan historias construidas con amor y con una profunda intención pedagógica.
                </p>

                <p>
                  Su escritura pone foco en la educación emocional, en los vínculos y la curiosidad por el entorno, con un lenguaje cercano y una mirada respetuosa de las etapas evolutivas de cada niño\a.
                </p>
              </div>

              {/* Author Badges */}
              <div className="pt-1">
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {[
                    'Docente de Educación Inicial',
                    'Educación Emocional',
                    'Literatura Infantil',
                    'Autora Independiente'
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-white/90 dark:bg-slate-800/90 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Project Presentation / Collection Section */}
        <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl space-y-10 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 border-purple-100'
        }`}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Presentación del Proyecto</span>
            </div>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 italic">
              Historias para crecer
            </p>
            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              La colección “Luna está creciendo” acompaña a niños y niñas en sus primeros años de vida, abordando con ternura temas como la familia, las emociones y el descubrimiento del mundo. Cada historia busca fortalecer el desarrollo emocional y social, fomentando valores de empatía, respeto y curiosidad.
            </p>
          </div>

          {/* Core Pillars Grid with Styled Picture Frame / Recuadro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. ¿Quién es Luna? */}
            <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-3xl shadow-md hover:shadow-lg transition-all">
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-slate-950/60 border border-sky-200 dark:border-sky-800/60 space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                    <Smile className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">¿Quién es Luna?</h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Es una niña curiosa, sensible y con una mirada atenta hacia el mundo que la rodea. A través de sus vivencias cotidianas, va descubriendo quién es, qué siente y cómo se relaciona con los demás. Cada paso que da está lleno de preguntas, aprendizajes y emociones que poco a poco le ayudan a construir su identidad.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Mirada Pedagógica */}
            <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-3xl shadow-md hover:shadow-lg transition-all">
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-slate-950/60 border border-sky-200 dark:border-sky-800/60 space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Mirada Pedagógica</h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Dichos cuentos están sostenidos por una mirada pedagógica que valora la educación emocional, la importancia del juego y el vínculo con los otros. En cada historia, Luna crece un poquito más, siempre acompañada de personas significativas que la ayudan a atravesar alegrías, dudas, enojos y descubrimientos.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Puente Intergeneracional */}
            <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-3xl shadow-md hover:shadow-lg transition-all">
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-slate-950/60 border border-sky-200 dark:border-sky-800/60 space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Puente Intergeneracional</h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Cada cuento está pensado como un puente entre generaciones, entre las escuelas y el hogar, entre lo que sentimos y lo que podemos poner en palabras. Y que cada relato sea una oportunidad para compartir, para mirar a las infancias con nuevos ojos, y para sembrar, a través de la literatura, valores que perduren.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};


