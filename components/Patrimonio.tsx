import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ArrowRight, X, Search, Landmark, Image as ImageIcon, Share2, Twitter, Copy, Check, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { HERITAGE_SITES } from '../constants';
import { CalendarView } from './CalendarView';
import { ScheduledVisit } from '../types';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

interface PatrimonioProps {
  initialSiteId?: number | null;
  onBack?: () => void;
  onScheduleVisit: (visit: ScheduledVisit) => void;
  onMoveVisit?: (visitId: string, updates: Pick<ScheduledVisit, 'date' | 'timeSlot'>) => void | Promise<void>;
  onUpsertVisit?: (visit: ScheduledVisit) => void | Promise<void>;
  onDeleteVisit?: (visitId: string) => void | Promise<void>;
  scheduledVisits: ScheduledVisit[];
}

export const Patrimonio: React.FC<PatrimonioProps> = ({ initialSiteId, onBack, onScheduleVisit, onMoveVisit, onUpsertVisit, onDeleteVisit, scheduledVisits }) => {
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number>(0);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Sincronizar con selección inicial del mapa
  useEffect(() => {
    if (initialSiteId !== null) {
      const idx = HERITAGE_SITES.findIndex(s => s.id === initialSiteId);
      if (idx !== -1) {
        setSelectedSiteIndex(idx);
        setActivePreviewImage(HERITAGE_SITES[idx].image);
      }
    } else {
      setActivePreviewImage(HERITAGE_SITES[selectedSiteIndex].image);
    }
    setIsDescriptionExpanded(false); // Reset expansion on site change
  }, [initialSiteId, selectedSiteIndex]);

  const filteredCatalog = HERITAGE_SITES.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSiteSelection = (index: number) => {
      setSelectedSiteIndex(index);
      setShowCatalog(false);
      setActivePreviewImage(HERITAGE_SITES[index].image);
      setIsDescriptionExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (visit: Partial<ScheduledVisit>) => {
    onScheduleVisit({
      ...visit,
      id: Math.random().toString(36).substr(2, 9),
      siteId: selectedSite.id,
      siteTitle: selectedSite.title,
      status: 'Pending',
      requesterName: visit.requesterName || 'Usuario Invitado',
      title: visit.title ?? `Visita a ${selectedSite.title}`,
      description: visit.description,
      location: visit.location ?? selectedSite.location,
      labelColor: visit.labelColor,
      reminders: visit.reminders
    } as ScheduledVisit);
    setShowCalendar(false);
  };

  const selectedSite = HERITAGE_SITES[selectedSiteIndex];
  const shareUrl = `https://cultura.mexico.gob.mx/patrimonio/${selectedSite.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `Descubre la majestuosidad de ${selectedSite.title} en el nuevo Atlas Cultural de México.`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      {/* Hero Principal */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-slate-900">
         {onBack && (
           <button
              type="button"
              onClick={onBack}
              className="absolute top-8 left-8 z-20 p-4 md:p-5 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/60 hover:bg-white transition-all active:scale-95"
              aria-label="Volver al mapa"
            >
              <ChevronLeft className="h-5 w-5 text-slate-950" />
            </button>
         )}
         <img 
            src={selectedSite.image} 
            alt={selectedSite.title} 
            className="absolute inset-0 h-full w-full object-cover opacity-70 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto z-10">
             <div className="flex items-center gap-2 text-brand-400 mb-4 tracking-[0.3em] font-black uppercase text-[11px]">
                <Landmark className="h-4 w-4" /> Registro Nacional #00{selectedSite.id}
             </div>
             <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-none drop-shadow-lg">{selectedSite.title}</h1>
             <div className="flex flex-wrap gap-4 items-center">
                <span className="flex items-center text-white text-sm bg-slate-950/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 shadow-2xl font-bold">
                    <MapPin className="h-4 w-4 mr-2 text-brand-500"/> {selectedSite.location}
                </span>
                <span className="flex items-center text-white text-sm bg-slate-950/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 shadow-2xl font-bold">
                    <Calendar className="h-4 w-4 mr-2 text-brand-500"/> {selectedSite.period}
                </span>
             </div>
          </div>
      </div>

      {/* Contenido Descriptivo */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b-2 border-slate-900 pb-10">
           <div className="max-w-xl">
             <h2 className="text-4xl font-serif font-bold text-slate-950 mb-3">Reseña Histórica</h2>
             <p className="text-slate-800 leading-relaxed font-bold text-lg">Conoce a fondo los detalles arquitectónicos y culturales que hacen de este recinto una pieza fundamental del patrimonio.</p>
           </div>
           <button 
                onClick={() => setShowCatalog(true)}
                className="flex items-center bg-slate-950 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-slate-400 hover:bg-brand-600 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]"
           >
             Abrir Catálogo Completo <ArrowRight className="ml-3 h-5 w-5"/>
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
                {/* Contenedor de Texto con Degradado */}
                <div className="relative">
                  <div 
                    className={`text-slate-950 text-xl leading-relaxed font-medium transition-all duration-700 ease-in-out overflow-hidden whitespace-pre-line ${
                      isDescriptionExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-[180px] opacity-100'
                    }`}
                  >
                      {selectedSite.description}
                  </div>
                  
                  {!isDescriptionExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />
                  )}
                </div>

                {/* BOTONES: Fuera del contenedor con degradado para asegurar visibilidad */}
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button 
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-950 hover:bg-brand-600 transition-all font-black text-[11px] uppercase tracking-[0.25em] text-white shadow-2xl shadow-slate-300 active:scale-95"
                  >
                    {isDescriptionExpanded ? (
                      <>Contraer reseña <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Continuar leyendo <ChevronDown className="h-4 w-4" /></>
                    )}
                  </button>

                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl border-[3px] border-slate-950 hover:border-brand-500 hover:text-brand-600 transition-all font-black text-[11px] uppercase tracking-[0.25em] text-slate-950 bg-white shadow-xl"
                  >
                    <Share2 className="h-4 w-4" /> Compartir Experiencia
                  </button>
                </div>

                {/* Sección de Galería Interactiva */}
                <div className="relative pt-24 mt-24 border-t-2 border-slate-950">
                    <h3 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.4em] mb-12 flex items-center gap-3 bg-slate-100 w-fit px-6 py-2.5 rounded-full border-2 border-slate-200">
                        <ImageIcon className="w-5 h-5 text-brand-600" /> ARCHIVO DE IMÁGENES
                    </h3>

                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 relative">
                            <div className="relative overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white h-[450px] lg:h-[550px] w-full bg-slate-200">
                                <SwitchTransition mode="out-in">
                                    <CSSTransition
                                        key={activePreviewImage}
                                        nodeRef={imageRef}
                                        timeout={400}
                                        classNames="image-fade"
                                    >
                                        <div ref={imageRef} className="w-full h-full relative">
                                            <img 
                                                src={activePreviewImage || selectedSite.image} 
                                                className="w-full h-full object-cover" 
                                                alt="Vista Detallada"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-12 text-white pointer-events-none">
                                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-400 mb-3 drop-shadow-md">Perspectiva del Patrimonio</p>
                                                <h4 className="text-4xl font-serif font-bold tracking-tight drop-shadow-xl">{selectedSite.title}</h4>
                                            </div>
                                        </div>
                                    </CSSTransition>
                                </SwitchTransition>
                            </div>
                        </div>

                        <div className="lg:w-1/3 grid grid-cols-2 gap-5 h-fit">
                            {[selectedSite.image, ...selectedSite.gallery].slice(0, 6).map((img, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setActivePreviewImage(img)}
                                    className={`cursor-pointer relative group rounded-[2rem] overflow-hidden aspect-square border-4 transition-all duration-300 ${
                                        activePreviewImage === img 
                                        ? 'border-brand-500 ring-8 ring-brand-500/20 scale-95 shadow-[0_20px_50px_rgba(236,72,153,0.3)]' 
                                        : 'border-white opacity-80 hover:opacity-100 shadow-md'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
                                        alt={`Thumbnail ${idx}`}
                                    />
                                    <div className={`absolute inset-0 bg-brand-500/20 transition-opacity ${activePreviewImage === img ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-900 shadow-xl">
                    <h4 className="font-black text-slate-950 mb-8 text-[12px] uppercase tracking-[0.4em] border-b-2 border-slate-900 pb-5 flex justify-between items-center">
                      INFORMACIÓN CLAVE <Landmark className="w-4 h-4 text-brand-600" />
                    </h4>
                    <div className="space-y-8">
                        <div className="flex justify-between items-center py-2 border-b border-slate-300">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">PERIODO</span>
                            <span className="text-sm font-black text-slate-950">{selectedSite.period}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">UBICACIÓN</span>
                            <span className="text-sm font-black text-slate-950">{selectedSite.location}</span>
                        </div>
                    </div>
                </div>
                
                <div 
                  onClick={() => setShowCalendar(true)}
                  className="bg-brand-500 p-10 rounded-[2.5rem] flex items-center gap-8 cursor-pointer hover:bg-brand-600 hover:scale-[1.03] transition-all shadow-[0_20px_50px_rgba(236,72,153,0.3)] group active:scale-95"
                >
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-2xl group-hover:rotate-12 transition-transform">
                        <Calendar className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="text-[13px] font-black text-white uppercase tracking-[0.2em] mb-1.5">Agenda una visita</div>
                        <div className="text-[11px] text-white/80 uppercase font-black tracking-widest">9:00 - 17:00 HRS</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* MODAL: Calendario de Agenda */}
      {showCalendar && (
        <CalendarView 
          onClose={() => setShowCalendar(false)} 
          onConfirm={handleConfirmBooking}
          onMoveVisit={onMoveVisit}
          onUpsertVisit={onUpsertVisit}
          onDeleteVisit={onDeleteVisit}
          siteTitle={selectedSite.title}
          scheduledVisits={scheduledVisits}
        />
      )}

      {/* MODAL: Compartir */}
      {showShareModal && (
        <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500 border-4 border-slate-950">
            <div className="p-10 border-b-4 border-slate-950 flex justify-between items-center bg-slate-100">
              <h3 className="text-2xl font-serif font-bold text-slate-950">Compartir Patrimonio</h3>
              <button onClick={() => setShowShareModal(false)} className="p-3 bg-white rounded-full hover:bg-slate-200 text-slate-950 border-2 border-slate-950 transition-colors shadow-lg">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-10 space-y-10">
              <p className="text-lg text-slate-950 font-bold leading-relaxed">Difunde la riqueza cultural de México con tu comunidad de forma sencilla y directa.</p>
              
              <div className="space-y-6">
                <div className="relative group">
                  <div className="flex items-center gap-4 bg-slate-100 border-2 border-slate-300 rounded-3xl p-6 pr-20 overflow-hidden shadow-inner">
                    <span className="text-[11px] font-black text-slate-950 truncate uppercase tracking-widest">{shareUrl}</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-3.5 rounded-2xl hover:bg-brand-600 transition-all flex items-center gap-2 shadow-2xl"
                  >
                    {linkCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                
                <button 
                  onClick={shareOnTwitter}
                  className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-[12px] flex items-center justify-center gap-4 shadow-2xl hover:bg-brand-600 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-[0.3em]"
                >
                  <Twitter className="h-5 w-5" /> Compartir en X (Twitter)
                </button>
              </div>

              {linkCopied && (
                <p className="text-[12px] font-black text-brand-600 uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-3">
                  ¡Enlace copiado al portapapeles con éxito!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Catálogo de Sitios */}
      {showCatalog && (
          <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="flex justify-between items-center mb-16 sticky top-0 bg-white py-8 border-b-4 border-slate-950 z-20">
                      <h2 className="text-5xl font-serif font-bold text-slate-950">Catálogo Patrimonial</h2>
                      <button onClick={() => setShowCatalog(false)} className="p-5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors group border-2 border-slate-900 shadow-xl">
                          <X className="h-8 w-8 text-slate-950 group-hover:rotate-90 transition-transform" />
                      </button>
                  </div>

                  <div className="relative mb-20 max-w-3xl mx-auto">
                      <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-brand-600 h-8 w-8" />
                      <input 
                        type="text" 
                        placeholder="Buscar por recinto o estado..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-24 pr-10 py-8 rounded-[3rem] bg-slate-50 border-4 border-slate-950 focus:border-brand-600 focus:ring-8 focus:ring-brand-600/10 shadow-2xl text-2xl placeholder-slate-400 font-black"
                      />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                      {filteredCatalog.map((site) => (
                          <div 
                            key={site.id} 
                            onClick={() => handleSiteSelection(HERITAGE_SITES.findIndex(s => s.id === site.id))}
                            className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] hover:-translate-y-5 transition-all duration-500"
                          >
                              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200 relative border-b-4 border-slate-950">
                                  <img src={site.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="p-10">
                                  <h4 className="font-black text-slate-950 text-xl mb-3 group-hover:text-brand-600 transition-colors leading-tight">{site.title}</h4>
                                  <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-brand-600" />
                                    <p className="text-[11px] text-slate-600 font-black tracking-[0.2em] uppercase">{site.location}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {filteredCatalog.length === 0 && (
                          <div className="col-span-full py-48 text-center">
                              <Search className="w-24 h-24 text-slate-200 mx-auto mb-8" />
                              <p className="text-slate-950 text-3xl font-serif font-bold italic">No se encontraron sitios con ese nombre.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
