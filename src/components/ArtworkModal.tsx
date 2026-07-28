import React, { useState } from 'react';
import { X, Heart, Share2, Sparkles, Download, Check, Eye, Tag, Calendar, Layers } from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkModalProps {
  artwork: Artwork | null;
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: (artworkId: string) => void;
  onClose: () => void;
  onRequestSimilar: (artwork: Artwork) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  darkMode,
  isFavorite,
  onToggleFavorite,
  onClose,
  onRequestSimilar
}) => {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(false);

  if (!artwork) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border my-auto transition-all duration-300 z-10 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Top Header Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {artwork.categoryLabel}
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              • {artwork.year}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(artwork.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className={`p-2 rounded-full transition-colors relative ${
                darkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Compartir Ilustración"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              id="btn-close-artwork-modal"
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          
          {/* Artwork High-Res Display Container */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex items-center justify-center relative min-h-[300px] sm:min-h-[450px]">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              onClick={() => setZoom(!zoom)}
              className={`max-h-[60vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 cursor-zoom-in ${
                zoom ? 'scale-125' : 'hover:scale-[1.02]'
              }`}
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
              Haz clic para Zoom
            </span>
          </div>

          {/* Details & Backstory Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{artwork.title}</h2>
                {artwork.client && (
                  <p className="text-xs text-purple-500 font-medium mt-1">
                    Cliente / Proyecto: {artwork.client}
                  </p>
                )}
              </div>

              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {artwork.description}
              </p>

              {/* Story behind the piece */}
              {artwork.story && (
                <div className={`p-4 rounded-2xl text-xs space-y-1.5 border ${
                  darkMode ? 'bg-purple-950/20 border-purple-800/40 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
                }`}>
                  <p className="font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
                    <span>Historia del Proceso Creativo:</span>
                  </p>
                  <p className="italic font-light leading-relaxed">{artwork.story}</p>
                </div>
              )}

              {/* Tools & Tech Used */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Software & Herramientas:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {artwork.softwareUsed.map((sw, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                        darkMode ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Palette Swatches */}
              {artwork.colorPalette && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Paleta de Colores:
                  </p>
                  <div className="flex items-center space-x-2">
                    {artwork.colorPalette.map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full shadow-inner border border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {artwork.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 flex items-center space-x-1"
                  >
                    <Tag className="w-3 h-3 text-purple-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                id="btn-modal-request-similar"
                onClick={() => {
                  onRequestSimilar(artwork);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Solicitar Encargo Similar</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
