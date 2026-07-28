import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Check, Sparkles, AlertCircle, Paperclip, Mail, User, DollarSign, Clock } from 'lucide-react';
import { CommissionQuote } from '../types';

interface ContactFormProps {
  darkMode: boolean;
  prefilledQuote?: CommissionQuote | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({ darkMode, prefilledQuote }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'commission',
    budget: '$50 - $150 USD',
    deadline: 'Sin prisa (2–3 semanas)',
    subject: '',
    message: '',
    referenceUrls: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refCode, setRefCode] = useState('');

  // Update form if prefilledQuote is received
  useEffect(() => {
    if (prefilledQuote) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: 'commission',
        budget: `$${prefilledQuote.estimatedPrice} USD (Cotizado en Calculadora)`,
        subject: `Encargo: ${prefilledQuote.type} (${prefilledQuote.style})`,
        message: `Hola Cami, he realizado una cotización en tu calculadora web con las siguientes características:\n\n- Tipo: ${prefilledQuote.type}\n- Estilo: ${prefilledQuote.style}\n- Fondo: ${prefilledQuote.background}\n- Personajes extra: ${prefilledQuote.extraCharacters}\n- Uso comercial: ${prefilledQuote.commercialUse ? 'Sí' : 'No'}\n- Entrega Express: ${prefilledQuote.expressDelivery ? 'Sí' : 'No'}\n- Total estimado: $${prefilledQuote.estimatedPrice} USD (~${prefilledQuote.estimatedDays} días)\n\nMe gustaría confirmar la disponibilidad y revisar los detalles del personaje.`
      }));
    }
  }, [prefilledQuote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedCode = 'CAMI-' + Math.floor(100000 + Math.random() * 900000);
      setRefCode(generatedCode);
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section id="contacto" className="py-12 lg:py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contacto para Familias & Educadores</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ponte en Contacto con la Autora
          </h2>
        </div>

        {/* Form Box */}
        <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <Check className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black">¡Mensaje Recibido con Éxito!</h3>
              
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Muchas gracias <strong>{formData.name}</strong> por escribir. Te responderé muy pronto a <span className="text-purple-400 font-mono">{formData.email}</span> con toda la información sobre los libros y actividades.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto text-left text-xs font-mono space-y-1">
                <p className="text-slate-500">Código de Confirmación:</p>
                <p className="text-purple-300 font-bold text-sm">{refCode}</p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    inquiryType: 'school',
                    budget: '',
                    deadline: '',
                    subject: '',
                    message: '',
                    referenceUrls: ''
                  });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tu Nombre o Nombre de Institución *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Colegio San Martín / Mamá de Lucas"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    id="input-contact-name"
                    className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    id="input-contact-email"
                    className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Inquiry Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ¿Cómo puedo ayudarte? *
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  id="select-contact-inquiry-type"
                  className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="school">Visita Escolar / Lectura de Cuentos (Educadores & Escuelas)</option>
                  <option value="book_info">Consulta sobre Libros y Dónde Comprar (Familias)</option>
                  <option value="workshop">Talleres Creativos para Niños y Familias</option>
                  <option value="press">Prensa, Entrevistas o Feria del Libro</option>
                  <option value="general">Mensaje para Cami Toons / Consulta General</option>
                </select>
              </div>

              {/* Row 3: Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Asunto del Mensaje *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lectura de cuentos para alumnos de 1º a 3º básico"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  id="input-contact-subject"
                  className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Row 4: Detailed Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Escribe tu mensaje o detalles para la autora *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Cuéntame sobre tu colegio, biblioteca, grupo de niños o cualquier consulta acerca de los libros infantiles de Luna..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  id="textarea-contact-message"
                  className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                id="btn-submit-contact-form"
                className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Enviando mensaje...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensaje a Cami Toons</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
