import React, { useState } from 'react';
import { DIFERENCIAS_PAIRS } from '../../data/lunaImages';
import { Search, Sparkles, HelpCircle, RotateCcw, Trophy, Star, Wrench, Check, Copy, Trash2, Save } from 'lucide-react';

interface DifferenceItem {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
  hint: string;
}

interface Level {
  id: string;
  title: string;
  originalImage: string;
  modifiedImage: string;
  defaultDifferences?: DifferenceItem[];
}

const BASE_LEVELS: Level[] = DIFERENCIAS_PAIRS.map((pair) => ({
  id: pair.id,
  title: pair.title,
  originalImage: pair.original,
  modifiedImage: pair.modified
}));

interface DiferenciasGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
  selectedLevelIndex?: number;
}

export const DiferenciasGame: React.FC<DiferenciasGameProps> = ({ darkMode, onWinStar, selectedLevelIndex: propSelectedLevelIndex }) => {
  const [levelIndex, setLevelIndex] = useState(propSelectedLevelIndex !== undefined ? propSelectedLevelIndex : 0);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [clickMismatch, setClickMismatch] = useState<{ x: number; y: number } | null>(null);

  // DevTool State
  const [isDevMode, setIsDevMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [newDiffName, setNewDiffName] = useState('Diferencia 1');

  // Persistent Custom Differences Map
  const [levelDifferencesMap, setLevelDifferencesMap] = useState<Record<string, DifferenceItem[]>>(() => {
    try {
      const saved = localStorage.getItem('camitoons_diferencias_custom_targets');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentLevel = BASE_LEVELS[levelIndex];
  const currentDifferences = levelDifferencesMap[currentLevel.id] || [];

  const isCompleted = currentDifferences.length > 0 && foundIds.length === currentDifferences.length;

  const saveDifferencesMap = (newMap: Record<string, DifferenceItem[]>) => {
    setLevelDifferencesMap(newMap);
    try {
      localStorage.setItem('camitoons_diferencias_custom_targets', JSON.stringify(newMap));
    } catch (err) {
      console.error('Error saving differences to localStorage', err);
    }
  };

  const handleLevelSelect = (idx: number) => {
    setLevelIndex(idx);
    setFoundIds([]);
    setActiveHint(null);
    setPendingPoint(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // In DevMode: Open modal to assign a new difference
    if (isDevMode) {
      setPendingPoint({ x: clickX, y: clickY });
      setNewDiffName(`Diferencia ${currentDifferences.length + 1}`);
      return;
    }

    if (isCompleted || currentDifferences.length === 0) return;

    // Check if clicked near any unfound difference (expanded 18% touch area)
    let matchedDiff: DifferenceItem | null = null;
    for (const diff of currentDifferences) {
      if (foundIds.includes(diff.id)) continue;

      const dist = Math.hypot(clickX - diff.xPercent, clickY - diff.yPercent);
      if (dist <= 18) {
        matchedDiff = diff;
        break;
      }
    }

    if (matchedDiff) {
      const newFound = [...foundIds, matchedDiff.id];
      setFoundIds(newFound);
      setActiveHint(null);
      setClickMismatch(null);

      if (newFound.length === currentDifferences.length) {
        if (onWinStar) onWinStar();
      }
    } else {
      // Temporary mismatch ripple
      setClickMismatch({ x: clickX, y: clickY });
      setTimeout(() => setClickMismatch(null), 800);
    }
  };

  // Add new difference in DevMode
  const handleAddPendingDifference = () => {
    if (!pendingPoint) return;
    const newDiff: DifferenceItem = {
      id: `${currentLevel.id}-d-${Date.now()}`,
      name: newDiffName.trim() || `Diferencia ${currentDifferences.length + 1}`,
      xPercent: pendingPoint.x,
      yPercent: pendingPoint.y,
      radiusPercent: 18,
      hint: `Revisá cerca de las coordenadas (${pendingPoint.x}%, ${pendingPoint.y}%)`
    };

    const updated = {
      ...levelDifferencesMap,
      [currentLevel.id]: [...currentDifferences, newDiff]
    };
    saveDifferencesMap(updated);
    setPendingPoint(null);
  };

  // Delete single difference
  const handleDeleteDiff = (diffId: string) => {
    const updated = {
      ...levelDifferencesMap,
      [currentLevel.id]: currentDifferences.filter((d) => d.id !== diffId)
    };
    saveDifferencesMap(updated);
  };

  // Clear differences for level
  const handleClearCurrentLevel = () => {
    const updated = { ...levelDifferencesMap };
    delete updated[currentLevel.id];
    saveDifferencesMap(updated);
    setFoundIds([]);
  };

  // Copy JSON config
  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(currentDifferences, null, 2);
    navigator.clipboard?.writeText(jsonStr);
    alert('¡Configuración JSON de diferencias copiada al portapapeles!');
  };

  const handleShowHint = () => {
    const unfound = currentDifferences.filter((d) => !foundIds.includes(d.id));
    if (unfound.length > 0) {
      const randomHint = unfound[Math.floor(Math.random() * unfound.length)];
      setActiveHint(`💡 Pista: ${randomHint.hint}`);
    }
  };

  return (
    <div className="space-y-6 max-w-[96vw] mx-auto animate-fade-in">
      {/* DevMode Point Config Modal */}
      {isDevMode && pendingPoint && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-pink-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-pink-600 text-white">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-pink-200">
                  📍 Asignar Nueva Diferencia
                </h4>
              </div>
              <button
                onClick={() => setPendingPoint(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 flex items-center justify-between">
              <span>Coordenadas fijadas:</span>
              <span className="font-bold text-white bg-pink-900 px-2 py-0.5 rounded border border-pink-700">
                X: {pendingPoint.x}%, Y: {pendingPoint.y}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">
                  Nombre de la Diferencia:
                </label>
                <input
                  type="text"
                  value={newDiffName}
                  onChange={(e) => setNewDiffName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-pink-500/50 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ej: Cambio en la flor / Estrella faltante..."
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPendingPoint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddPendingDifference}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Diferencia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
            Subsección 1: Panel de Progreso y Niveles
          </div>

          {/* DevTool Mode Toggle */}
          <button
            onClick={() => {
              setIsDevMode(!isDevMode);
              setPendingPoint(null);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all flex items-center space-x-1.5 border shadow-sm ${
              isDevMode
                ? 'bg-pink-600 text-white border-pink-700 ring-2 ring-pink-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-pink-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isDevMode ? '🛠️ DevTool ACTIVADO' : '🛠️ Modo DevTool'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md">
              <Search className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Encuentra las Diferencias</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentDifferences.length === 0
                  ? 'Entrá en Modo DevTool 🛠️ para marcar las diferencias entre las dos imágenes.'
                  : 'Observá atentamente ambas imágenes y tocá sobre las diferencias para marcarlas.'}
              </p>
            </div>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-extrabold text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span>
                Encontradas: {foundIds.length} / {currentDifferences.length}
              </span>
            </div>
          </div>
        </div>

        {/* Level Switcher & Hint button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {propSelectedLevelIndex === undefined && (
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {BASE_LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelSelect(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    levelIndex === idx
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                  }`}
                >
                  {lvl.title}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShowHint}
              disabled={isCompleted || currentDifferences.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Pedir Pista</span>
            </button>

            <button
              onClick={() => handleLevelSelect(levelIndex)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              title="Reiniciar Nivel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeHint && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold text-center animate-fade-in">
            {activeHint}
          </div>
        )}

        {/* DevTool Control & Manager Panel */}
        {isDevMode && (
          <div className="p-4 rounded-3xl bg-slate-950 border-2 border-pink-600 text-white space-y-3 shadow-xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-pink-400 animate-spin" />
                <span className="font-extrabold text-sm text-pink-200">
                  🛠️ Panel DevTool: Asignación de Diferencias ({currentLevel.title})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJSON}
                  disabled={currentDifferences.length === 0}
                  className="px-3 py-1 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center space-x-1 disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar JSON</span>
                </button>
                <button
                  onClick={handleClearCurrentLevel}
                  disabled={currentDifferences.length === 0}
                  className="px-3 py-1 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center space-x-1 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Diferencias</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              👉 Tocá en cualquiera de las dos imágenes donde se encuentre la diferencia para guardar su punto.
            </p>

            {/* List of current level differences */}
            {currentDifferences.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {currentDifferences.map((d) => (
                  <div
                    key={d.id}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 border border-pink-700 text-xs font-mono font-bold flex items-center space-x-2 shadow"
                  >
                    <span>🔍 {d.name}</span>
                    <span className="text-amber-300 font-normal">({d.xPercent}%, {d.yPercent}%)</span>
                    <button
                      onClick={() => handleDeleteDiff(d.id)}
                      className="text-pink-400 hover:text-white ml-1 font-extrabold"
                      title="Eliminar diferencia"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Side-by-Side Images Area */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-pink-800 dark:text-pink-300 bg-pink-100 dark:bg-pink-950 border border-pink-300 dark:border-pink-800 shadow-sm">
          Subsección 2: Comparador de Láminas de Observación
        </div>
        <div className="relative p-4 rounded-3xl bg-white dark:bg-slate-900 border-4 border-purple-300 dark:border-purple-800 shadow-2xl overflow-hidden">
          
          {/* Victory Celebration */}
          {isCompleted && !isDevMode && (
            <div className="absolute inset-0 z-30 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-bounce-in">
              <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
              <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                ¡Excelente vista! ¡Encontraste las {currentDifferences.length} Diferencias! 🌟
              </h2>
              <p className="text-sm text-purple-200 font-medium max-w-md">
                Sos un gran observador del mundo CamiToons. ¡Ganaste una estrella dorada!
              </p>
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-amber-400 animate-pulse" />
                ))}
              </div>
              <button
                onClick={() => handleLevelSelect((levelIndex + 1) % BASE_LEVELS.length)}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
              >
                🚀 Siguiente Nivel
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Image 1: Original */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center space-x-1">
                <span>📷 Imagen 1 (Lámina Original)</span>
              </span>
              <div
                onClick={handleImageClick}
                className={`relative w-full aspect-16/9 rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-md select-none bg-slate-100 ${
                  isDevMode ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
              >
                <img src={currentLevel.originalImage} alt="Original" className="w-full h-full object-contain p-1" />

                {/* Found items overlays */}
                {currentDifferences.map((diff) => {
                  const isFound = foundIds.includes(diff.id);
                  if (!isFound) return null;
                  return (
                    <div
                      key={diff.id}
                      style={{
                        left: `${diff.xPercent}%`,
                        top: `${diff.yPercent}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-emerald-500 text-white shadow-2xl border-2 border-white ring-4 ring-emerald-400/40 flex items-center justify-center animate-bounce-in pointer-events-none"
                    >
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  );
                })}

                {/* DevMode difference target pin */}
                {isDevMode && currentDifferences.map((diff) => (
                  <div
                    key={diff.id}
                    style={{
                      left: `${diff.xPercent}%`,
                      top: `${diff.yPercent}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full bg-pink-500/90 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg animate-pulse">
                      🎯
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[9px] font-mono font-black shadow whitespace-nowrap border border-pink-700">
                      {diff.name} ({diff.xPercent}%, {diff.yPercent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image 2: Modified (With differences) */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                🔍 Imagen 2 (Lámina Comparativa)
              </span>
              <div
                onClick={handleImageClick}
                className={`relative w-full aspect-16/9 rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-800 shadow-md select-none bg-slate-100 ${
                  isDevMode ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
              >
                <img src={currentLevel.modifiedImage} alt="Modified" className="w-full h-full object-contain p-1" />

                {/* Found items overlays */}
                {currentDifferences.map((diff) => {
                  const isFound = foundIds.includes(diff.id);
                  if (!isFound) return null;
                  return (
                    <div
                      key={diff.id}
                      style={{
                        left: `${diff.xPercent}%`,
                        top: `${diff.yPercent}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-emerald-500 text-white shadow-2xl border-2 border-white ring-4 ring-emerald-400/40 flex items-center justify-center animate-bounce-in pointer-events-none"
                    >
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  );
                })}

                {/* DevMode difference target pin */}
                {isDevMode && currentDifferences.map((diff) => (
                  <div
                    key={diff.id}
                    style={{
                      left: `${diff.xPercent}%`,
                      top: `${diff.yPercent}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full bg-pink-500/90 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg animate-pulse">
                      🎯
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[9px] font-mono font-black shadow whitespace-nowrap border border-pink-700">
                      {diff.name} ({diff.xPercent}%, {diff.yPercent}%)
                    </span>
                  </div>
                ))}

                {/* Ripple on Missed Click */}
                {clickMismatch && !isDevMode && (
                  <div
                    style={{ left: `${clickMismatch.x}%`, top: `${clickMismatch.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-rose-500 bg-rose-500/30 animate-ping pointer-events-none"
                  />
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
