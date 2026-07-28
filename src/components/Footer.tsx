import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import camitoonsLogo from '../assets/images/CamiToonsLogo.webp';

interface FooterProps {
  darkMode: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ darkMode, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t transition-colors pt-12 pb-8 ${
        darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 text-slate-200 border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo & Bio */}
          <div className="md:col-span-5 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <img
                src={camitoonsLogo}
                alt="CamiToons Logo"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-sm font-light leading-relaxed">
              Camila Belén Maestrojuan • Docente e Ilustradora de Literatura Infantil. Autora de la colección "Luna está creciendo".
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <button onClick={() => onNavigate('cuentos')} className="hover:text-purple-300 transition-colors">
              Colección Cuentos
            </button>
            <button onClick={() => onNavigate('juegos')} className="hover:text-purple-300 transition-colors">
              Juegos Infantiles
            </button>
            <button onClick={() => onNavigate('personajes')} className="hover:text-purple-300 transition-colors">
              Árbol de Personajes
            </button>
            <button onClick={() => onNavigate('sobre-mi')} className="hover:text-purple-300 transition-colors">
              Sobre la Autora
            </button>
          </div>

          {/* Back to top */}
          <div className="md:col-span-3 flex justify-center md:justify-end">
            <button
              onClick={scrollToTop}
              id="btn-footer-back-to-top"
              className="px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-2 border border-slate-700"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} CamiToons (camitoons.com). Todos los derechos reservados.</p>
          <p className="flex items-center space-x-1">
            <span>Diseñado con</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>e Ilustraciones Originales</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
