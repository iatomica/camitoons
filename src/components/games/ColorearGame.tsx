import React, { useState } from 'react';
import { BOOKS_DATA } from '../../data/booksCatalog';
import { SvgColoringViewer, UNIFIED_COLOR_PALETTE } from '../SvgColoringViewer';
import { Palette, BookOpen, Sparkles, Paintbrush, Eraser, Check, Sliders, RotateCcw, Download } from 'lucide-react';

interface ColorearGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
}

export const ColorearGame: React.FC<ColorearGameProps> = ({ darkMode }) => {
  // Filter books that have coloringSvgs
  const booksWithColoring = BOOKS_DATA.filter(
    (b) => b.coloringSvgs && b.coloringSvgs.length > 0
  );

  const [selectedBookId, setSelectedBookId] = useState<string>(
    booksWithColoring[0]?.id || 'book-1'
  );

  const [selectedColor, setSelectedColor] = useState<string>('#EC4899');
  const [selectedTool, setSelectedTool] = useState<'bucket' | 'brush' | 'eraser'>('bucket');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [resetCount, setResetCount] = useState<number>(0);
  const [downloadCount, setDownloadCount] = useState<number>(0);

  const activeBook = booksWithColoring.find((b) => b.id === selectedBookId) || booksWithColoring[0];

  // Guaranteed Unique Color Array (No repeated colors)
  const uniqueColors = Array.from(new Set(UNIFIED_COLOR_PALETTE));

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Vertical Sidebar: Book Selector & Color Palette */}
        <div className="lg:col-span-4 space-y-5 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800/50 shadow-md">
          
          {/* 1. Header & Book Selector Section */}
          <div className="space-y-3">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
              Subsección 1: Selección de Cuentos
            </div>
            <div className="flex items-center space-x-3 text-left pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md flex-shrink-0">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-1.5 leading-tight">
                  <span>Elegí un Cuento para Colorear</span>
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                  Seleccioná una historia para pintar sus láminas vectoriales
                </p>
              </div>
            </div>

            {/* Vertical Stack of Book Title Buttons */}
            <div className="flex flex-col space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
              {booksWithColoring.map((book) => {
                const isSelected = book.id === selectedBookId;
                return (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBookId(book.id)}
                    className={`w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-3 text-left border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.01] ring-2 ring-purple-300'
                        : darkMode
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="w-8 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-white/30">
                      <img src={book.coverImage} alt={book.displayTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">{book.displayTitle}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                        {book.recommendedAge} • {book.coloringSvgs?.length || 0} láminas
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Herramientas & Paleta de Colores Únicos Section */}
          <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 space-y-3.5">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-950 border border-pink-200 dark:border-pink-800">
              Subsección 2: Herramientas y Paleta
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Herramientas & Paleta
                </span>
              </div>

              {/* Color actual preview badge */}
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div
                  style={{ backgroundColor: selectedColor }}
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                />
                <span className="text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                  {selectedColor}
                </span>
              </div>
            </div>

            {/* Tool Selector Toggles (Balde, Pincel, Goma) */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedTool('bucket')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-extrabold border transition-all flex items-center justify-center space-x-1 ${
                  selectedTool === 'bucket'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-102 ring-2 ring-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Balde</span>
              </button>

              <button
                onClick={() => setSelectedTool('brush')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-extrabold border transition-all flex items-center justify-center space-x-1 ${
                  selectedTool === 'brush'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-102 ring-2 ring-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>Pincel</span>
              </button>

              <button
                onClick={() => setSelectedTool('eraser')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-extrabold border transition-all flex items-center justify-center space-x-1 ${
                  selectedTool === 'eraser'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-102 ring-2 ring-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Goma</span>
              </button>
            </div>

            {/* Brush Size Slider when Brush/Eraser active */}
            {(selectedTool === 'brush' || selectedTool === 'eraser') && (
              <div className="flex items-center space-x-3 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-200 dark:border-purple-800">
                <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300">Grosor:</span>
                <input
                  type="range"
                  min="8"
                  max="60"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer h-1.5 bg-purple-200 rounded-lg"
                />
                <span className="text-[10px] font-mono font-extrabold text-purple-700 dark:text-purple-300 w-6 text-center">
                  {brushSize}
                </span>
              </div>
            )}

            {/* Canvas Actions Row: Reiniciar & Guardar Dibujo */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setResetCount((c) => c + 1)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-rose-100 hover:text-rose-600 transition-colors flex items-center justify-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                title="Reiniciar lámina"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>Reiniciar</span>
              </button>

              <button
                onClick={() => setDownloadCount((c) => c + 1)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-1.5"
                title="Guardar Dibujo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Guardar Dibujo</span>
              </button>
            </div>

            {/* Single Continuous Unified Palette Grid (SIN COLORES REPETIDOS) */}
            <div className="pt-1 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Colores Disponibles (Únicos):</span>
              <div className="flex flex-wrap items-center gap-1.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                {uniqueColors.map((colorHex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColor(colorHex);
                      if (selectedTool === 'eraser') setSelectedTool('bucket');
                    }}
                    style={{ backgroundColor: colorHex }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border transition-all shadow-sm flex items-center justify-center relative ${
                      selectedColor === colorHex && selectedTool !== 'eraser'
                        ? 'scale-115 border-purple-600 ring-2 ring-purple-400 z-10 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:scale-110'
                    }`}
                    title={colorHex}
                  >
                    {selectedColor === colorHex && selectedTool !== 'eraser' && (
                      <Check className={`w-4 h-4 ${colorHex === '#FFFFFF' || colorHex === '#FFDFC4' || colorHex === '#F0D5BE' || colorHex === '#EECEB1' || colorHex === '#FDE047' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}

                {/* Custom Color Wheel Selector */}
                <label
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-dashed border-purple-400 dark:border-purple-600 flex items-center justify-center cursor-pointer bg-purple-50 dark:bg-purple-950/60 hover:scale-110 transition-all relative overflow-hidden"
                  title="Rueda de Color Personalizada"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      if (selectedTool === 'eraser') setSelectedTool('bucket');
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Svg Coloring Canvas */}
        <div className="lg:col-span-8 w-full space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 shadow-sm">
            Subsección 3: Lienzo para Colorear
          </div>
          {activeBook && (
            <SvgColoringViewer
              coloringSvgs={activeBook.coloringSvgs || []}
              bookTitle={activeBook.displayTitle}
              darkMode={darkMode}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onResetTrigger={resetCount}
              onDownloadTrigger={downloadCount}
            />
          )}
        </div>

      </div>
    </div>
  );
};
