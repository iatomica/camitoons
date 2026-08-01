import React, { useState } from 'react';
import { Sparkles, Users, Heart, BookOpen, Sun, Compass, Smile, Award, HeartHandshake, User, ZoomIn, X } from 'lucide-react';
import { LUNA_IMAGES } from '../data/lunaImages';

export interface CharacterNode {
  id: string;
  name: string;
  role: string;
  relation: string;
  image: string;
  cardImage: string;
  color: string;
  x: number; // Percentage position for responsive SVG positioning
  y: number; // Percentage position
  featuredBooks: string[];
  description: string;
  icon: any;
}

export const CHARACTERS_DATA: CharacterNode[] = [
  {
    id: 'luna-center',
    name: 'Luna',
    role: 'Protagonista Principal',
    relation: 'Corazón del Universo CamiToons',
    image: LUNA_IMAGES.lunaCentral,
    cardImage: LUNA_IMAGES.tarjetas.luna,
    color: 'from-purple-500 to-pink-500',
    x: 50,
    y: 50,
    featuredBooks: ['Toda la Colección "Luna está creciendo"'],
    description: 'Niña curiosa, alegre y soñadora que descubre el mundo paso a paso abordando las emociones, la familia y el aprendizaje cotidiano.',
    icon: Sparkles
  },
  {
    id: 'abuela-elsa',
    name: 'Abuela Elsa',
    role: 'Transmisora de Saberes',
    relation: 'Vínculo de los Abuelos',
    image: LUNA_IMAGES.abuelaElsa,
    cardImage: LUNA_IMAGES.tarjetas.abuelaElsa,
    color: 'from-emerald-500 to-amber-500',
    x: 50,
    y: 15,
    featuredBooks: ['Luna y el campo', 'Luna planta un árbol'],
    description: 'Abuela afectuosa que enseña a Luna a amar la naturaleza, cuidar a los animales y valorar las vivencias familiares.',
    icon: Compass
  },
  {
    id: 'amigos-pares',
    name: 'Amigos y pares',
    role: 'Socialización & Empatía',
    relation: 'Primeros Vínculos Pares',
    image: LUNA_IMAGES.amigosPares,
    cardImage: LUNA_IMAGES.tarjetas.amigosPares,
    color: 'from-violet-500 to-purple-400',
    x: 70,
    y: 20,
    featuredBooks: ['Luna y el primer día', 'Luna y las emociones', 'Luna encuentra colores'],
    description: 'Pares con los que Luna explora el jardín de infantes, la convivencia, la empatía, el juego en grupo y el compartir.',
    icon: BookOpen
  },
  {
    id: 'papa-luna',
    name: 'Papá Gio',
    role: 'Apoyo & Protección',
    relation: 'Vínculo Paternal',
    image: LUNA_IMAGES.papa,
    cardImage: LUNA_IMAGES.tarjetas.papa,
    color: 'from-blue-500 to-indigo-500',
    x: 83,
    y: 35,
    featuredBooks: ['Luna y la familia', 'Luna y los oficios'],
    description: 'Brinda sostén, juego y contención afectiva en el crecimiento de Luna y las aventuras cotidianas en el hogar.',
    icon: User
  },
  {
    id: 'hermano',
    name: 'Hermano Javier',
    role: 'Aventuras & Compartir',
    relation: 'Vínculo Fraterno',
    image: LUNA_IMAGES.hermano,
    cardImage: LUNA_IMAGES.tarjetas.hermano,
    color: 'from-teal-400 to-emerald-500',
    x: 85,
    y: 55,
    featuredBooks: ['Luna y la familia', 'Luna y su juego favorito'],
    description: 'Compañero de travesuras y aventuras, con quien Luna comparte juegos, crea mundos imaginarios y aprende, día a día, el valor de compartir y crecer juntos',
    icon: Smile
  },
  {
    id: 'abuelo-angel',
    name: 'Abuelo Ángel',
    role: 'Historias & Recuerdos',
    relation: 'Vínculo de los Abuelos',
    image: LUNA_IMAGES.abueloAngel,
    cardImage: LUNA_IMAGES.tarjetas.abueloAngel,
    color: 'from-amber-500 to-orange-400',
    x: 77,
    y: 74,
    featuredBooks: ['Luna y la familia', 'Luna planta un árbol'],
    description: 'Abuelo sabio que transmite valores, relatos inolvidables y momentos llenos de paz y cariño familiar.',
    icon: Sun
  },
  {
    id: 'prima-luna',
    name: 'Prima Julia',
    role: 'Juego Corporal & Diversión',
    relation: 'Vínculo Familiar',
    image: LUNA_IMAGES.prima,
    cardImage: LUNA_IMAGES.tarjetas.prima,
    color: 'from-pink-400 to-purple-500',
    x: 60,
    y: 85,
    featuredBooks: ['Luna se mueve', 'Luna y el campo'],
    description: 'Prima alegre con quien Luna comparte risas, corre por caminos de piedra y disfruta del movimiento al aire libre.',
    icon: Smile
  },
  {
    id: 'anana-gato',
    name: 'Ananá',
    role: 'Compañero Fiel & Afecto',
    relation: 'Mascota de la Familia',
    image: LUNA_IMAGES.anana,
    cardImage: LUNA_IMAGES.tarjetas.anana,
    color: 'from-amber-400 to-yellow-500',
    x: 40,
    y: 85,
    featuredBooks: ['Luna y la familia', 'Luna y las emociones'],
    description: 'El tierno perrito de la familia que acompaña a Luna en sus momentos de calma, juego libre y ternura en el hogar.',
    icon: Heart
  },
  {
    id: 'jazmin-amiga',
    name: 'Amiga Jazmín',
    role: 'Amistad & Confianza',
    relation: 'Vínculo de Amistad Cercana',
    image: LUNA_IMAGES.jazmin,
    cardImage: LUNA_IMAGES.tarjetas.jazmin,
    color: 'from-rose-400 to-pink-500',
    x: 23,
    y: 74,
    featuredBooks: ['Luna y su chupete', 'Luna y sus emociones', 'Luna y el primer día'],
    description: 'Amiga del alma de Luna, con quien comparte confidencias, diálogos sinceros y sus primeros pasos en la escuela.',
    icon: HeartHandshake
  },
  {
    id: 'hermana',
    name: 'Hermana Sol',
    role: 'Juego & Complicidad',
    relation: 'Vínculo Fraterno',
    image: LUNA_IMAGES.hermana,
    cardImage: LUNA_IMAGES.tarjetas.hermana,
    color: 'from-purple-400 to-pink-400',
    x: 15,
    y: 55,
    featuredBooks: ['Luna y la familia', 'Luna se mueve'],
    description: 'Gran compañera con quien Luna comparte abrazos, enseñanzas, sueños y hermosas aventuras.',
    icon: Users
  },
  {
    id: 'marcos-amigo',
    name: 'Marcos',
    role: 'Exploración & Aventura',
    relation: 'Compañero de Aventuras',
    image: LUNA_IMAGES.marcos,
    cardImage: LUNA_IMAGES.tarjetas.marcos,
    color: 'from-cyan-500 to-blue-500',
    x: 17,
    y: 35,
    featuredBooks: ['Luna explora', 'Luna y el primer día'],
    description: 'El curioso gatito de la familia, muy explorador con quien Luna sigue pistas y resuelve divertidos caminos juntos.',
    icon: Compass
  },
  {
    id: 'mama-luna',
    name: 'Mamá Clara',
    role: 'Figura de Afecto & Guía',
    relation: 'Vínculo Maternal',
    image: LUNA_IMAGES.mama,
    cardImage: LUNA_IMAGES.tarjetas.mama,
    color: 'from-pink-500 to-rose-400',
    x: 30,
    y: 20,
    featuredBooks: ['Luna y la familia', 'Luna y su chupete', 'Luna se lava los dientes'],
    description: 'Con dulzura y dedicación, acompaña a Luna en cada paso de su crecimiento, compartiendo sus descubrimientos, emociones y pequeños momentos cotidianos.',
    icon: Heart
  }
];

interface CharacterNetworkSectionProps {
  darkMode: boolean;
}

export const CharacterNetworkSection: React.FC<CharacterNetworkSectionProps> = ({ darkMode }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterNode>(CHARACTERS_DATA[0]);
  const [hoveredCharacterId, setHoveredCharacterId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; name: string } | null>(null);

  const centerNode = CHARACTERS_DATA[0];

  const handleNodeClick = (node: CharacterNode) => {
    setSelectedCharacter(node);
  };

  return (
    <section id="personajes" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-purple-50/30 to-pink-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Soft Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 shadow-sm">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Mapa & Red de Vínculos Afectivos</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              Árbol de vínculos
            </span>
          </h2>

          <p className={`text-sm sm:text-base font-extrabold italic max-w-2xl mx-auto ${darkMode ? 'text-amber-300' : 'text-purple-900'}`}>
            "Crecer no es solo aprender cosas nuevas; también es aprender a querer, compartir y construir lazos que nos ayuden a florecer."
          </p>
        </div>

        {/* Main Grid: Graph + Detail Card + Fundamentación Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive SVG Tree Graph (Warm Light Background) */}
          <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] rounded-3xl overflow-hidden border-2 border-amber-200 dark:border-purple-800/60 shadow-xl bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-purple-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
            
            {/* Background SVG Tree Illustration & Dotted Connecting Arrows */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                {/* Tree Foliage Gradient */}
                <radialGradient id="tree-foliage" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="trunk-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#78350F" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0.25" />
                </linearGradient>

                <linearGradient id="line-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="line-grad-idle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
                </linearGradient>

                {/* Arrowhead Markers Pointing towards Luna */}
                <marker
                  id="arrowhead-active"
                  markerWidth="5"
                  markerHeight="5"
                  refX="14"
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#EC4899" opacity="0.9" />
                </marker>
                <marker
                  id="arrowhead-idle"
                  markerWidth="4"
                  markerHeight="4"
                  refX="12"
                  refY="2"
                  orient="auto"
                >
                  <path d="M 0 0 L 4 2 L 0 4 z" fill="#C084FC" opacity="0.6" />
                </marker>
              </defs>

              {/* Tree Soft Canopy Foliage Circles */}
              <circle cx="50" cy="40" r="38" fill="url(#tree-foliage)" />
              <circle cx="28" cy="45" r="22" fill="url(#tree-foliage)" />
              <circle cx="72" cy="45" r="22" fill="url(#tree-foliage)" />
              <circle cx="50" cy="20" r="18" fill="url(#tree-foliage)" />

              {/* Stylized Organic Tree Trunk & Main Branches */}
              <path
                d="M 45 100 Q 47 75 48 55 M 55 100 Q 53 75 52 55"
                stroke="url(#trunk-grad)"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 48 65 C 35 60 25 50 18 38 M 52 65 C 65 60 75 50 82 38 M 49 50 Q 50 30 50 15"
                stroke="url(#trunk-grad)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 46 82 C 35 80 25 78 20 74 M 54 82 C 65 80 75 78 80 74"
                stroke="url(#trunk-grad)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Dotted Lines with Arrowheads pointing towards Center Node (Luna) */}
              {CHARACTERS_DATA.slice(1).map((node) => {
                const isHighlighted =
                  selectedCharacter.id === node.id ||
                  selectedCharacter.id === centerNode.id ||
                  hoveredCharacterId === node.id;

                return (
                  <g key={node.id}>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={centerNode.x}
                      y2={centerNode.y}
                      stroke={isHighlighted ? 'url(#line-grad-active)' : 'url(#line-grad-idle)'}
                      strokeWidth={isHighlighted ? '1.4' : '0.8'}
                      vectorEffect="non-scaling-stroke"
                      strokeDasharray="4 4"
                      markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead-idle)'}
                      className="transition-all duration-500"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes as Interactive Circle Avatars */}
            {CHARACTERS_DATA.map((node) => {
              const isSelected = selectedCharacter.id === node.id;
              const isHovered = hoveredCharacterId === node.id;
              const isCenter = node.id === centerNode.id;
              const NodeIcon = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredCharacterId(node.id)}
                  onMouseLeave={() => setHoveredCharacterId(null)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 transform group ${
                    isSelected ? 'z-40 scale-125' : isHovered ? 'z-30 scale-110' : 'z-20 scale-100 opacity-90'
                  }`}
                >
                  <div
                    className={`relative rounded-full p-1 transition-all duration-500 bg-white shadow-md ${
                      isSelected
                        ? 'w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-pink-500 shadow-2xl shadow-pink-500/50'
                        : isCenter
                        ? 'w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-purple-500 shadow-2xl shadow-purple-500/40'
                        : 'w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-purple-300 hover:ring-purple-500'
                    }`}
                  >
                    <img
                      src={node.image}
                      alt={node.name}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />

                    {/* Node Badge Icon */}
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                      <NodeIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Node Label Tooltip */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black whitespace-nowrap border shadow-md transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-300 scale-110 shadow-lg'
                        : darkMode
                        ? 'bg-slate-900/90 text-slate-200 border-slate-700'
                        : 'bg-white/95 text-slate-800 border-purple-200'
                    }`}
                  >
                    {node.name}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Right Column: Character Details + Fundamentación Box */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Character Details Display Card */}
            <div
              className={`p-5 rounded-3xl border transition-all duration-300 shadow-xl space-y-4 backdrop-blur-xl ${
                darkMode 
                  ? 'bg-gradient-to-br from-pink-950/75 via-[#451025]/75 to-amber-950/50 border-pink-500/30 text-white shadow-pink-950/20' 
                  : 'bg-gradient-to-br from-pink-500/80 via-pink-450/75 to-amber-400/60 border-pink-300/40 text-white shadow-pink-200/20'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  onClick={() => setZoomedImage({ src: selectedCharacter.image, name: selectedCharacter.name })}
                  className="relative group/avatar cursor-pointer shrink-0"
                  title="Toca para agrandar la imagen"
                >
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform duration-300 group-hover/avatar:scale-110 filter drop-shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-6 h-6 text-white filter drop-shadow-md" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-black text-white">{selectedCharacter.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/20">
                      {selectedCharacter.role}
                    </span>
                  </div>
                  <p className="text-[11px] font-black text-pink-100/90 font-extrabold mt-0.5">
                    {selectedCharacter.relation}
                  </p>
                  <button
                    onClick={() => setZoomedImage({ src: selectedCharacter.image, name: selectedCharacter.name })}
                    className="mt-1.5 inline-flex items-center space-x-1 text-[10px] font-extrabold text-white hover:underline"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Ver foto ampliada</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed font-semibold text-white/95">
                {selectedCharacter.description}
              </p>
            </div>

            {/* NEW: "Nuestro árbol de vínculos" Fundamentación Box */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-purple-50/70 dark:from-amber-950/30 dark:to-purple-950/30 shadow-md text-slate-900 dark:text-slate-100 space-y-3.5">
              
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-amber-900 dark:text-amber-200">
                  Árbol de vínculos
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Representa el mundo de Luna. Ella es el corazón desde donde nacen y crecen todos los vínculos que la acompañan: su familia, sus amigos y todas las personas que forman parte de su vida.
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Así como un árbol necesita raíces fuertes para crecer, las personas necesitan relaciones basadas en el cariño, el respeto, la escucha y el cuidado. Cada rama cuenta una historia y cada vínculo ayuda a Luna a descubrir quién es, a comprender sus emociones, a sentirse acompañada y querida.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen High-Resolution Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-purple-300 dark:border-purple-800 space-y-4 text-center transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900 transition shadow-sm"
              title="Cerrar vista ampliada"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-hidden rounded-2xl border-2 border-purple-400/40 shadow-lg bg-purple-50/50 dark:bg-slate-950/50 p-6 flex items-center justify-center">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.name}
                className="max-w-full h-72 sm:h-88 object-contain filter drop-shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-200">
                {zoomedImage.name}
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Colección "Luna está creciendo"
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
