import React, { useState } from 'react';
import { Sparkles, Calculator, Check, ArrowRight, Clock, ShieldCheck, HelpCircle, DollarSign, RefreshCw } from 'lucide-react';
import { COMMISSION_OPTIONS } from '../data/artworks';
import { CommissionQuote } from '../types';

interface CommissionCalculatorProps {
  darkMode: boolean;
  onApplyQuoteToContact: (quote: CommissionQuote) => void;
}

export const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({
  darkMode,
  onApplyQuoteToContact
}) => {
  const [selectedType, setSelectedType] = useState<string>('half-body');
  const [selectedStyle, setSelectedStyle] = useState<'lineart' | 'shading' | 'full'>('shading');
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'simple' | 'complex'>('simple');
  const [extraChars, setExtraChars] = useState<number>(0);
  const [commercialUse, setCommercialUse] = useState<boolean>(false);
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Current base item
  const baseItem = COMMISSION_OPTIONS.find((c) => c.id === selectedType) || COMMISSION_OPTIONS[1];

  // Calculate pricing
  let price = baseItem.basePrice;

  // Style multiplier
  if (selectedStyle === 'lineart') price *= 0.8;
  if (selectedStyle === 'full') price *= 1.35;

  // Background cost
  if (backgroundType === 'simple') price += 15;
  if (backgroundType === 'complex') price += 45;

  // Extra character cost (50% of base item per char)
  if (extraChars > 0) {
    price += extraChars * (baseItem.basePrice * 0.6);
  }

  // Commercial license
  if (commercialUse) {
    price *= 1.5;
  }

  // Express delivery
  if (expressDelivery) {
    price *= 1.25;
  }

  const finalPrice = Math.round(price);

  // Estimate turnaround days
  let totalDays = baseItem.estimatedDays;
  if (backgroundType === 'complex') totalDays += 3;
  if (extraChars > 0) totalDays += extraChars * 2;
  if (expressDelivery) totalDays = Math.max(2, Math.round(totalDays * 0.5));

  const handleApply = () => {
    const styleLabel =
      selectedStyle === 'lineart'
        ? 'Lineart + Color Plano'
        : selectedStyle === 'shading'
        ? 'Cel Shading + Sombras'
        : 'Pintura Digital Renderizada';

    const bgLabel =
      backgroundType === 'transparent'
        ? 'Sin fondo (Transparente)'
        : backgroundType === 'simple'
        ? 'Fondo Sencillo / Degradado'
        : 'Fondo Detallado Completo';

    const quote: CommissionQuote = {
      type: baseItem.name,
      style: styleLabel,
      background: bgLabel,
      extraCharacters: extraChars,
      commercialUse,
      expressDelivery,
      estimatedPrice: finalPrice,
      estimatedDays: totalDays
    };

    onApplyQuoteToContact(quote);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  return (
    <section id="encargos" className="py-12 lg:py-20 relative">
      
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadora de Encargos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Cotiza tu Ilustración en Tiempo Real
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Selecciona el tipo de dibujo, nivel de detalle y extras para obtener un presupuesto claro y sin sorpresas.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Options Column (Steps 1 to 4) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Base Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center space-x-2">
                <span>1. Tipo de Ilustración Base</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMISSION_OPTIONS.map((item) => {
                  const isSelected = selectedType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedType(item.id)}
                      id={`calc-option-${item.id}`}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex space-x-3 items-center ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20'
                          : darkMode
                          ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={item.imageSample}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-purple-300/30 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs sm:text-sm truncate">{item.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                        <p className="text-xs font-black text-purple-600 dark:text-purple-300 mt-1">
                          Desde ${item.basePrice} USD
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Render & Finish Style */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                2. Nivel de Renderizado & Acabado
              </label>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { id: 'lineart', label: 'Lineart + Color Plano', desc: 'Estilo manga/sketch limpio', factor: '-20%' },
                  { id: 'shading', label: 'Cel Shading Estándar', desc: 'Sombras definidas y brillo', factor: 'Recomendado' },
                  { id: 'full', label: 'Pintura Renderizada', desc: 'Luz avanzada y volumen', factor: '+35%' }
                ].map((st) => {
                  const isSelected = selectedStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStyle(st.id as any)}
                      id={`btn-calc-style-${st.id}`}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold ring-2 ring-purple-500/20'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold block">{st.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">{st.desc}</span>
                      <span className="text-[10px] font-mono text-purple-500 block mt-2">{st.factor}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Background & Complexity */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                3. Fondo & Entorno
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'transparent', label: 'Transparente / PNG', price: '$0' },
                  { id: 'simple', label: 'Degradado / Formas', price: '+$15' },
                  { id: 'complex', label: 'Paisaje / Entorno Detallado', price: '+$45' }
                ].map((bg) => {
                  const isSelected = backgroundType === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setBackgroundType(bg.id as any)}
                      id={`btn-calc-bg-${bg.id}`}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{bg.label}</span>
                      <span className="text-xs text-purple-500 font-mono mt-1 block">{bg.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Add-ons & Licensing */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                4. Opciones Adicionales
              </label>

              <div className="space-y-2">
                
                {/* Additional Characters */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">Personajes Adicionales</span>
                    <span className="text-[11px] text-slate-500">+$60% del precio base por personaje extra</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExtraChars(Math.max(0, extraChars - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center hover:opacity-80"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{extraChars}</span>
                    <button
                      onClick={() => setExtraChars(Math.min(3, extraChars + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center hover:opacity-80"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Commercial Use Toggle */}
                <div
                  onClick={() => setCommercialUse(!commercialUse)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    commercialUse
                      ? 'border-purple-500 bg-purple-500/10'
                      : darkMode
                      ? 'bg-slate-800/60 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Uso Comercial & Licencia</span>
                    <span className="text-[11px] text-slate-500">Para merchandising, libros, videojuegos o VTubers (+50%)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={commercialUse}
                    onChange={() => {}}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </div>

                {/* Express Delivery Toggle */}
                <div
                  onClick={() => setExpressDelivery(!expressDelivery)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    expressDelivery
                      ? 'border-purple-500 bg-purple-500/10'
                      : darkMode
                      ? 'bg-slate-800/60 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Entrega Prioritaria Express ⚡</span>
                    <span className="text-[11px] text-slate-500">Reduce el tiempo estimado a la mitad (+25%)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={expressDelivery}
                    onChange={() => {}}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Quote Summary Live Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold">Resumen de Cotización</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Estimado
                </span>
              </div>

              {/* Price Display */}
              <div className="text-center py-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/20 space-y-1">
                <p className="text-xs uppercase font-bold tracking-wider text-purple-400">Total Estimado</p>
                <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  ${finalPrice} <span className="text-lg font-normal text-slate-400">USD</span>
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 pt-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tiempo de elaboración: ~{totalDays} días laborables</span>
                </div>
              </div>

              {/* Line Items List */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Base: {baseItem.name}</span>
                  <span className="font-mono">${baseItem.basePrice}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Renderizado ({selectedStyle})</span>
                  <span className="font-mono">Incluido</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Fondo: {backgroundType}</span>
                  <span className="font-mono">
                    {backgroundType === 'simple' ? '+$15' : backgroundType === 'complex' ? '+$45' : '$0'}
                  </span>
                </div>
                {extraChars > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>{extraChars} Personaje(s) extra</span>
                    <span className="font-mono">+${Math.round(extraChars * baseItem.basePrice * 0.6)}</span>
                  </div>
                )}
                {commercialUse && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-purple-400 font-semibold">
                    <span>Uso Comercial</span>
                    <span className="font-mono">+50%</span>
                  </div>
                )}
                {expressDelivery && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-amber-400 font-semibold">
                    <span>Entrega Express</span>
                    <span className="font-mono">+25%</span>
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Incluye 2 rondas de revisiones en boceto gratis</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Archivos finales en PNG 300 DPI + Capas ordenadas</span>
                </div>
              </div>

              {/* Action Button: Apply to Contact Form */}
              <button
                id="btn-apply-quote-to-contact"
                onClick={handleApply}
                className="w-full py-4 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                {copiedQuote ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡Cotización Enviada al Formulario!</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Enviar Cotización al Formulario</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
