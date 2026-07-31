import React, { useState } from 'react';
import { LUNA_IMAGES } from '../../data/lunaImages';
import { Search, Sparkles, Trophy, Star, Eye, HelpCircle, RefreshCw, Wrench, Check, Copy, Trash2, Save } from 'lucide-react';

interface TargetItem {
  id: string;
  name: string;
  icon: string;
  xPercent: number; // 0-100%
  yPercent: number; // 0-100%
  hint: string;
  isMain: boolean;
}

interface Scene {
  id: string;
  title: string;
  subtitle?: string;
  bgSrc: string;
}

const BASE_SCENES: Scene[] = [
  {
    id: 'scene-1',
    title: 'Los panaderos',
    subtitle: 'Hay que preparar los panes ¿Donde estarán los panaderos?',
    bgSrc: LUNA_IMAGES.escondidas?.[0] || LUNA_IMAGES.banner
  },
  {
    id: 'scene-2',
    title: 'Los cinco patitos',
    subtitle: 'La mamá pata busca a sus cinco patitos ¿Estarán nadando?',
    bgSrc: LUNA_IMAGES.escondidas?.[1] || LUNA_IMAGES.main
  },
  {
    id: 'scene-3',
    title: 'La odontóloga',
    subtitle: 'Luna busca a su odontóloga ¿Donde estará?',
    bgSrc: LUNA_IMAGES.escondidas?.[2] || LUNA_IMAGES.banner
  },
  {
    id: 'scene-4',
    title: 'La escuela',
    subtitle: 'Luna hoy fue a la escuela ¿Ya habra salido?',
    bgSrc: LUNA_IMAGES.escondidas?.[3] || LUNA_IMAGES.main
  },
  {
    id: 'scene-5',
    title: 'La amiga de Luna',
    subtitle: 'La amiga de Luna salio a pasear y habia tanta ropa que quedo atascada en el vestidor ¿La encontraste?',
    bgSrc: LUNA_IMAGES.escondidas?.[4] || LUNA_IMAGES.banner
  },
  {
    id: 'scene-6',
    title: 'El abuelo Ángel',
    subtitle: 'El abuelo compro frutas, pero se le perdió la manzana ¿Se le habrá caído?',
    bgSrc: LUNA_IMAGES.escondidas?.[5] || LUNA_IMAGES.main
  },
  {
    id: 'scene-7',
    title: 'Ananá y su casa',
    subtitle: 'Al perrito de la familia le encanta correr en el parque ¿Estará buscando su pelota?',
    bgSrc: LUNA_IMAGES.escB || LUNA_IMAGES.banner
  },
  {
    id: 'scene-8',
    title: 'El sapo',
    subtitle: 'El sapo salta de aqui para allá ¿Y ahora donde parece estar?',
    bgSrc: LUNA_IMAGES.escC || LUNA_IMAGES.main
  },
  {
    id: 'scene-9',
    title: 'El gato Marcos',
    subtitle: 'Marcos se escondió ¿Donde estará?',
    bgSrc: LUNA_IMAGES.escG || LUNA_IMAGES.banner
  },
  {
    id: 'scene-10',
    title: 'El parque y los perros',
    subtitle: 'Los perritos juegan y corren sin parar. ¿Están detrás de los árboles?',
    bgSrc: LUNA_IMAGES.escV || LUNA_IMAGES.main
  },
  {
    id: 'scene-11',
    title: 'El hermanito',
    subtitle: 'En el coche no está Javier.. le gusta jugar a las escondidas.. ¿Lo encontraste ya?',
    bgSrc: LUNA_IMAGES.escE || LUNA_IMAGES.banner
  },
  {
    id: 'scene-12',
    title: 'El elefante oculto',
    subtitle: 'Luna pasea por la selva, pero escucha un elefante al pasar ¿Estará cerca?',
    bgSrc: LUNA_IMAGES.escH || LUNA_IMAGES.main
  },
  {
    id: 'scene-13',
    title: 'Luna y el tren',
    subtitle: 'A lo lejos se escucha la bocina del tren.. Y Luna tiene que subir.. ¿Donde estará?',
    bgSrc: LUNA_IMAGES.escF || LUNA_IMAGES.banner
  },
  {
    id: 'scene-14',
    title: 'La hermana de Luna',
    subtitle: 'La hermana de Luna se escondió por algún lado ¿La viste?',
    bgSrc: LUNA_IMAGES.escGM || LUNA_IMAGES.banner
  }
];

const AVAILABLE_ICONS = ['👧🏻', '⭐️', '🖌️', '💖', '🌸', '👑', '🔍', '☀️', '🦋', '🍼', '📖', '🎈', '🍬', '🎨', '🔔', '🌈'];

interface DondeEstaLunaGameProps {
  darkMode: boolean;
  onWinStar?: () => void;
  selectedSceneIndex?: number;
}

export const DondeEstaLunaGame: React.FC<DondeEstaLunaGameProps> = ({ darkMode, onWinStar, selectedSceneIndex: propSelectedSceneIndex }) => {
  const [sceneIndex, setSceneIndex] = useState(propSelectedSceneIndex !== undefined ? propSelectedSceneIndex : 0);
  const [foundTargetIds, setFoundTargetIds] = useState<string[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [useLens, setUseLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  // DevTool Modal State
  const [isDevMode, setIsDevMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [newPointName, setNewPointName] = useState('Luna');
  const [newPointIcon, setNewPointIcon] = useState('👧🏻');

  // Persistent Custom Targets Storage
  const [sceneTargetsMap, setSceneTargetsMap] = useState<Record<string, TargetItem[]>>(() => {
    try {
      const saved = localStorage.getItem('camitoons_escondidas_custom_targets');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentScene = BASE_SCENES[sceneIndex];
  const currentTargets = sceneTargetsMap[currentScene.id] || [];

  const allFound = currentTargets.length > 0 && foundTargetIds.length === currentTargets.length;

  // Save to LocalStorage helper
  const saveTargetsMap = (newMap: Record<string, TargetItem[]>) => {
    setSceneTargetsMap(newMap);
    try {
      localStorage.setItem('camitoons_escondidas_custom_targets', JSON.stringify(newMap));
    } catch (err) {
      console.error('Error saving custom targets to localStorage', err);
    }
  };

  const handleSceneChange = (idx: number) => {
    setSceneIndex(idx);
    setFoundTargetIds([]);
    setActiveHint(null);
    setPendingPoint(null);
  };

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // In DevMode: Open configuration modal for this point
    if (isDevMode) {
      setPendingPoint({ x: clickX, y: clickY });
      if (currentTargets.length === 0) {
        setNewPointName('Luna');
        setNewPointIcon('👧🏻');
      } else {
        setNewPointName(`Objeto ${currentTargets.length + 1}`);
        setNewPointIcon(AVAILABLE_ICONS[currentTargets.length % AVAILABLE_ICONS.length]);
      }
      return;
    }

    if (allFound || currentTargets.length === 0) return;

    // Player Mode: Hit check with Expanded Radius (18%-20% touch area)
    for (const target of currentTargets) {
      if (foundTargetIds.includes(target.id)) continue;

      const dist = Math.hypot(clickX - target.xPercent, clickY - target.yPercent);
      if (dist <= 18) { // Expanded hit area radius
        const newFound = [...foundTargetIds, target.id];
        setFoundTargetIds(newFound);
        setActiveHint(null);

        if (target.isMain || newFound.length === currentTargets.length) {
          if (onWinStar) onWinStar();
        }
        break;
      }
    }
  };

  // Save pending point from Modal
  const handleAddPendingPoint = () => {
    if (!pendingPoint) return;
    const isLuna = newPointName.trim().toLowerCase().includes('luna');
    const newTarget: TargetItem = {
      id: `${currentScene.id}-t-${Date.now()}`,
      name: newPointName.trim() || 'Objeto Oculto',
      icon: newPointIcon,
      xPercent: pendingPoint.x,
      yPercent: pendingPoint.y,
      hint: `${newPointName} está ubicado cerca de las coordenadas (${pendingPoint.x}%, ${pendingPoint.y}%)`,
      isMain: isLuna
    };

    const updated = {
      ...sceneTargetsMap,
      [currentScene.id]: [...currentTargets, newTarget]
    };
    saveTargetsMap(updated);
    setPendingPoint(null);
  };

  // Delete target point in DevMode
  const handleDeleteTarget = (targetId: string) => {
    const updated = {
      ...sceneTargetsMap,
      [currentScene.id]: currentTargets.filter((t) => t.id !== targetId)
    };
    saveTargetsMap(updated);
  };

  // Clear all targets for active scene
  const handleClearCurrentSceneTargets = () => {
    const updated = { ...sceneTargetsMap };
    delete updated[currentScene.id];
    saveTargetsMap(updated);
    setFoundTargetIds([]);
  };

  // Copy JSON config of active scene
  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(currentTargets, null, 2);
    navigator.clipboard?.writeText(jsonStr);
    alert('¡Configuración JSON de puntos copiada al portapapeles!');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  const handleShowHint = () => {
    const unfound = currentTargets.filter((t) => !foundTargetIds.includes(t.id));
    if (unfound.length > 0) {
      const hintItem = unfound.find((t) => t.isMain) || unfound[0];
      setActiveHint(`💡 Pista para encontrar a ${hintItem.name}: Buscá cerca de (${hintItem.xPercent}%, ${hintItem.yPercent}%)`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* DevMode Point Config Modal */}
      {isDevMode && pendingPoint && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-rose-200">
                  📍 Guardar Nuevo Punto Oculto
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
              <span className="font-bold text-white bg-rose-900 px-2 py-0.5 rounded border border-rose-700">
                X: {pendingPoint.x}%, Y: {pendingPoint.y}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">
                  Nombre del Objeto o Personaje:
                </label>
                <input
                  type="text"
                  value={newPointName}
                  onChange={(e) => setNewPointName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Ej: Luna / Flor / Estrella / Caramelo..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-300 font-extrabold mb-1">
                  Seleccionar Icono Representativo:
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 rounded-2xl bg-slate-950 border border-slate-800">
                  {AVAILABLE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewPointIcon(icon)}
                      className={`p-2 rounded-xl text-lg flex items-center justify-center transition-all ${
                        newPointIcon === icon
                          ? 'bg-purple-600 scale-110 shadow ring-2 ring-purple-300'
                          : 'hover:bg-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
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
                onClick={handleAddPendingPoint}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Punto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            Subsección 1: Lista de Pistas u Objetos Ocultos
          </div>

          {/* DevTool Mode Toggle */}
          <button
            onClick={() => {
              setIsDevMode(!isDevMode);
              setPendingPoint(null);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all flex items-center space-x-1.5 border shadow-sm ${
              isDevMode
                ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isDevMode ? '🛠️ DevTool ACTIVADO' : '🛠️ Modo DevTool'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md">
              <Search className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Escondidas</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTargets.length === 0
                  ? 'Entrá en Modo DevTool 🛠️ para asignar los puntos escondidos en esta imagen.'
                  : 'Explorá la ilustración para encontrar a Luna y sus objetos escondidos.'}
              </p>
            </div>
          </div>

          {/* Targets Checklist Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {currentTargets.length === 0 ? (
              <span className="text-xs italic text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                Sin puntos asignados aún (Usá 🛠️ DevTool)
              </span>
            ) : (
              currentTargets.map((target) => {
                const isFound = foundTargetIds.includes(target.id);
                return (
                  <div
                    key={target.id}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 border transition-all ${
                      isFound
                        ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 text-emerald-800 dark:text-emerald-300 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="text-sm">{target.icon}</span>
                    <span>{target.name}</span>
                    {isFound ? (
                      <div className="flex items-center justify-center bg-emerald-600 text-white p-0.5 rounded-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-[10px] opacity-40">❓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Scene Switcher & Helper Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {propSelectedSceneIndex === undefined && (
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {BASE_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => handleSceneChange(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    sceneIndex === idx
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setUseLens(!useLens)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                useLens
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{useLens ? 'Lupa Activada 🔍' : 'Activar Lupa'}</span>
            </button>

            <button
              onClick={handleShowHint}
              disabled={allFound || currentTargets.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Pedir Pista</span>
            </button>

            <button
              onClick={() => handleSceneChange(sceneIndex)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              title="Reiniciar Nivel"
            >
              <RefreshCw className="w-4 h-4" />
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
          <div className="p-4 rounded-3xl bg-rose-950 border-2 border-rose-600 text-white space-y-3 shadow-xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-rose-400 animate-spin" />
                <span className="font-extrabold text-sm text-rose-200">
                  🛠️ Panel DevTool: Asignación de Puntos ({currentScene.title})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJSON}
                  disabled={currentTargets.length === 0}
                  className="px-3 py-1 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center space-x-1 disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar JSON</span>
                </button>
                <button
                  onClick={handleClearCurrentSceneTargets}
                  disabled={currentTargets.length === 0}
                  className="px-3 py-1 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center space-x-1 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Puntos</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-rose-200">
              👉 Tocá en cualquier punto de la imagen para abrir el modal y guardar la configuración del objeto oculto.
            </p>

            {/* List of current scene targets */}
            {currentTargets.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {currentTargets.map((t) => (
                  <div
                    key={t.id}
                    className="px-2.5 py-1 rounded-xl bg-rose-900/90 border border-rose-700 text-xs font-mono font-bold flex items-center space-x-2 shadow"
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                    <span className="text-amber-300 font-normal">({t.xPercent}%, {t.yPercent}%)</span>
                    <button
                      onClick={() => handleDeleteTarget(t.id)}
                      className="text-rose-300 hover:text-white ml-1 font-extrabold"
                      title="Eliminar punto"
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

      {/* Main Search Panorama Area */}
      <div className="space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-800 shadow-sm">
          Subsección 2: Escenario de Exploración con Lupa
        </div>

        <div
          onClick={handleSceneClick}
          onMouseMove={handleMouseMove}
          className={`relative w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-md bg-slate-100 ${
            isDevMode ? 'cursor-crosshair' : 'cursor-pointer'
          }`}
        >
          <img src={currentScene.bgSrc} alt={currentScene.title} className="w-full h-full object-contain p-1" />

          {/* Floating Story Banner Overlay directly ON TOP of the image */}
          {currentScene.subtitle && !isDevMode && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[90%] w-auto p-3 sm:p-4 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-amber-100 text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center text-center space-x-2.5 pointer-events-none animate-fade-in">
              <span className="text-xl">💡</span>
              <span>{currentScene.subtitle}</span>
            </div>
          )}

          {/* Target Overlay Markers */}
          {currentTargets.map((target) => {
            const isFound = foundTargetIds.includes(target.id);

            if (isFound) {
              /* Found target marker: ONLY show the check icon badge */
              return (
                <div
                  key={target.id}
                  style={{
                    left: `${target.xPercent}%`,
                    top: `${target.yPercent}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-bounce-in pointer-events-none"
                >
                  <div className="p-2 rounded-full bg-emerald-500 text-white shadow-2xl border-2 border-white ring-4 ring-emerald-400/40 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-black shadow flex items-center space-x-1">
                    <span>{target.icon}</span>
                    <span>{target.name}</span>
                  </span>
                </div>
              );
            }

            if (isDevMode) {
              /* DevTool target pin location */
              return (
                <div
                  key={target.id}
                  style={{
                    left: `${target.xPercent}%`,
                    top: `${target.yPercent}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/90 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg animate-pulse">
                    🎯
                  </div>
                  <span className="mt-0.5 px-1.5 py-0.5 rounded bg-rose-950 text-amber-300 text-[9px] font-mono font-black shadow whitespace-nowrap border border-rose-700">
                    {target.name} ({target.xPercent}%, {target.yPercent}%)
                  </span>
                </div>
              );
            }

            /* Normal gameplay: Target click area expanded to w-24 h-24 (18%-20% radius) and completely INVISIBLE */
            return (
              <div
                key={target.id}
                style={{
                  left: `${target.xPercent}%`,
                  top: `${target.yPercent}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-transparent z-10"
              />
            );
          })}

          {/* DevMode Live Crosshair & Cursor Position */}
          {isDevMode && (
            <div
              style={{
                left: `${lensPos.x}%`,
                top: `${lensPos.y}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 flex flex-col items-center"
            >
              <div className="w-8 h-8 border-2 border-amber-400 rounded-full flex items-center justify-center bg-amber-400/20 shadow-xl">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded bg-rose-950 text-amber-300 text-[10px] font-mono font-black shadow border border-amber-400/50">
                X: {Math.round(lensPos.x)}%, Y: {Math.round(lensPos.y)}%
              </span>
            </div>
          )}

          {/* Magnifying Glass Overlay */}
          {useLens && !isDevMode && (
            <div
              style={{
                left: `${lensPos.x}%`,
                top: `${lensPos.y}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-4 border-amber-400 bg-amber-400/10 backdrop-contrast-125 backdrop-brightness-110 shadow-2xl pointer-events-none flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full border border-white/60 ring-2 ring-amber-500/40 animate-pulse" />
            </div>
          )}
        </div>

        <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
          💡 Tocá en cualquier lugar de la imagen donde creas que está Luna o los objetos ocultos
        </p>
      </div>
    </div>
  );
};
