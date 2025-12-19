import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, Clock, Ticket, X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon, Filter, Check, Share2, Link as LinkIcon, Facebook, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import { HERITAGE_SITES } from '../constants';

const EVENTS = [
  {
    id: 1,
    title: "Equinoccio de Primavera",
    date: "21 Mar, 2025",
    isoDate: "2025-03-21",
    time: "05:00 AM",
    location: "Chichén Itzá, Yucatán",
    image: "https://picsum.photos/id/1043/400/300",
    type: "Ceremonia",
    price: "$95 MXN"
  },
  {
    id: 2,
    title: "Noche de Museos: Virreinato",
    date: "28 May, 2025",
    isoDate: "2025-05-28",
    time: "06:00 PM",
    location: "Centro Histórico, CDMX",
    image: "https://picsum.photos/id/1060/400/300",
    type: "Recorrido",
    price: "Gratuito"
  },
  {
    id: 3,
    title: "Festival Cumbre Tajín",
    date: "15-20 Mar, 2025",
    isoDate: "2025-03-15",
    time: "10:00 AM",
    location: "Tajín, Veracruz",
    image: "https://picsum.photos/id/1039/400/300",
    type: "Festival",
    price: "$200 MXN"
  },
  {
    id: 4,
    title: "Concierto: Voces Zapotecas",
    date: "05 Abr, 2025",
    isoDate: "2025-04-05",
    time: "07:00 PM",
    location: "Monte Albán, Oaxaca",
    image: "https://picsum.photos/id/1011/400/300",
    type: "Concierto",
    price: "$150 MXN"
  }
];

interface PatrimonioProps {
  initialSiteId?: number | null;
}

export const Patrimonio: React.FC<PatrimonioProps> = ({ initialSiteId }) => {
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filter States
  const [filterType, setFilterType] = useState<'all' | 'Ceremonia' | 'Recorrido' | 'Festival' | 'Concierto'>('all');
  const [filterTime, setFilterTime] = useState<'all' | 'month' | 'upcoming' | 'range'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  
  // Share Popover State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Handle initial site selection from navigation
  useEffect(() => {
    if (initialSiteId !== null && initialSiteId !== undefined) {
      const index = HERITAGE_SITES.findIndex(s => s.id === initialSiteId);
      if (index !== -1) {
        setSelectedSiteIndex(index);
      }
    }
  }, [initialSiteId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSiteIndex !== null) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0); // Reset image index when site changes
      setIsShareOpen(false); // Reset share menu
      setLinkCopied(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedSiteIndex]);

  const handlePrevSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSiteIndex !== null) {
      setSelectedSiteIndex((prev) => (prev === 0 ? HERITAGE_SITES.length - 1 : prev! - 1));
    }
  };

  const handleNextSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSiteIndex !== null) {
      setSelectedSiteIndex((prev) => (prev === HERITAGE_SITES.length - 1 ? 0 : prev! + 1));
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSite) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedSite.gallery.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSite) {
      setCurrentImageIndex((prev) => (prev === selectedSite.gallery.length - 1 ? 0 : prev + 1));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => {
        setLinkCopied(false);
        setIsShareOpen(false);
    }, 2000);
  };

  const selectPreset = (preset: 'all' | 'month' | 'upcoming') => {
    setFilterTime(preset);
    setIsDateFilterOpen(false);
    setDateRange({ start: '', end: '' });
  };

  const applyDateRange = () => {
    if (dateRange.start || dateRange.end) {
        setFilterTime('range');
        setIsDateFilterOpen(false);
    }
  };

  // Filter Logic
  // Simulating "Current Date" as March 1st, 2025 for demo purposes
  const SIMULATED_TODAY = new Date("2025-03-01");

  const filteredEvents = EVENTS.filter(event => {
    // Type Filter
    if (filterType !== 'all' && event.type !== filterType) return false;

    // Time Filter
    const eventDate = new Date(event.isoDate);
    
    if (filterTime === 'range') {
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;
        
        if (start && end) {
            return eventDate >= start && eventDate <= end;
        } else if (start) {
             return eventDate >= start;
        } else if (end) {
             return eventDate <= end;
        }
        return true;
    }

    if (filterTime === 'month') {
        // Events in the next 30 days
        const nextMonth = new Date(SIMULATED_TODAY);
        nextMonth.setDate(nextMonth.getDate() + 30);
        return eventDate >= SIMULATED_TODAY && eventDate <= nextMonth;
    }
    if (filterTime === 'upcoming') {
        // Events after today
        return eventDate >= SIMULATED_TODAY;
    }

    return true;
  });

  const selectedSite = selectedSiteIndex !== null ? HERITAGE_SITES[selectedSiteIndex] : null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="relative h-[50vh] w-full overflow-hidden bg-slate-900">
         <img 
            src="https://picsum.photos/id/1067/1920/800" 
            alt="Patrimonio Nacional" 
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
             <span className="text-brand-400 font-bold tracking-widest uppercase text-sm mb-2 block">Colección Nacional</span>
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Patrimonio Cultural</h1>
             <p className="text-gray-200 text-lg max-w-2xl">
               Un recorrido visual por los monumentos, sitios históricos y expresiones culturales que definen nuestra identidad.
             </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12">
           <div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Sitios Emblemáticos</h2>
             <p className="text-slate-500">Explora la riqueza histórica de nuestras civilizaciones.</p>
           </div>
           <button className="hidden md:flex items-center text-brand-600 font-medium hover:text-brand-800 transition">
             Ver todo el catálogo <ArrowRight className="ml-2 h-4 w-4"/>
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HERITAGE_SITES.map((site, index) => (
              <div 
                key={site.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedSiteIndex(index)}
              >
                 <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-100">
                    <img 
                      src={site.image} 
                      alt={site.title} 
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                        <ZoomIn className="text-white h-12 w-12 opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500 delay-75 drop-shadow-lg" />
                    </div>
                    {/* Description Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                       <p className="text-white text-sm font-medium leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                         {site.description}
                       </p>
                    </div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{site.title}</h3>
                 <div className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-wide font-medium">
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1"/> {site.location}</span>
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1"/> {site.period}</span>
                 </div>
              </div>
            ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Agenda Cultural</h2>
                  <p className="text-slate-500 mt-2">Actividades imperdibles en nuestros recintos.</p>
              </div>
              
              {/* Refined Filter Toolbar */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                 
                 {/* Date Filter Dropdown */}
                 <div className="relative w-full sm:w-auto">
                    <button 
                        onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                        className={`w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            filterTime !== 'all' 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-100' 
                            : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {filterTime === 'all' && 'Fecha: Todo'}
                                {filterTime === 'month' && 'Fecha: Este Mes'}
                                {filterTime === 'upcoming' && 'Fecha: Próximos'}
                                {filterTime === 'range' && 'Fecha: Personalizada'}
                            </span>
                        </div>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDateFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDateFilterOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsDateFilterOpen(false)}
                            ></div>
                            <div className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                <div className="space-y-1 mb-2">
                                    <button onClick={() => selectPreset('all')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-between transition-colors">
                                        Todo {filterTime === 'all' && <Check className="h-3 w-3 text-brand-600"/>}
                                    </button>
                                    <button onClick={() => selectPreset('month')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-between transition-colors">
                                        Este Mes {filterTime === 'month' && <Check className="h-3 w-3 text-brand-600"/>}
                                    </button>
                                    <button onClick={() => selectPreset('upcoming')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-between transition-colors">
                                        Próximos Eventos {filterTime === 'upcoming' && <Check className="h-3 w-3 text-brand-600"/>}
                                    </button>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-3 px-2 pb-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rango Específico</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Desde</label>
                                                <input 
                                                    type="date" 
                                                    value={dateRange.start}
                                                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                                    className="w-full bg-slate-50 hover:bg-slate-100 border-none rounded-lg py-1.5 px-2 text-xs font-medium focus:ring-2 focus:ring-brand-100 text-slate-700 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Hasta</label>
                                                <input 
                                                    type="date" 
                                                    value={dateRange.end}
                                                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                                    className="w-full bg-slate-50 hover:bg-slate-100 border-none rounded-lg py-1.5 px-2 text-xs font-medium focus:ring-2 focus:ring-brand-100 text-slate-700 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={applyDateRange}
                                            className="w-full bg-brand-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-sm shadow-brand-200"
                                        >
                                            Aplicar Rango
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                 </div>

                 <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

                 {/* Type Dropdown */}
                 <div className="relative w-full sm:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full sm:w-48 appearance-none bg-slate-50 hover:bg-slate-100 border-none rounded-xl py-2 pl-3 pr-10 text-xs font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-brand-100 outline-none transition-colors"
                    >
                        <option value="all">Todos los eventos</option>
                        <option value="Ceremonia">Ceremonias</option>
                        <option value="Festival">Festivales</option>
                        <option value="Recorrido">Recorridos</option>
                        <option value="Concierto">Conciertos</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                    </div>
                 </div>
              </div>
           </div>

           {filteredEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group animate-in fade-in zoom-in duration-300">
                          <div className="h-48 overflow-hidden relative">
                              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                                 {event.type}
                              </div>
                          </div>
                          <div className="p-6">
                              <div className="flex items-center gap-4 text-xs font-medium text-brand-600 mb-3">
                                  <span className="flex items-center"><Calendar className="h-3 w-3 mr-1"/> {event.date}</span>
                                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> {event.time}</span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{event.title}</h3>
                              <p className="flex items-center text-sm text-slate-500 mb-4">
                                  <MapPin className="h-3 w-3 mr-1.5 shrink-0"/> {event.location}
                              </p>
                              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                 <span className="text-sm font-bold text-slate-900">{event.price}</span>
                                 <button className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                                    <Ticket className="h-4 w-4 mr-1.5"/>
                                    Reservar
                                 </button>
                              </div>
                          </div>
                      </div>
                  ))}
               </div>
           ) : (
               <div className="flex flex-col items-center justify-center py-16 text-center">
                   <div className="bg-gray-100 p-4 rounded-full mb-4">
                       <Calendar className="h-8 w-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">No hay eventos encontrados</h3>
                   <p className="text-slate-500">Intenta ajustar tus filtros para ver más resultados.</p>
                   <button 
                    onClick={() => { setFilterType('all'); setFilterTime('all'); setDateRange({start:'', end:''}); }}
                    className="mt-4 text-brand-600 text-sm font-medium hover:underline"
                   >
                       Limpiar filtros
                   </button>
               </div>
           )}
        </div>
      </div>

      <div className="bg-white py-16">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Preservación Digital</h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-8">
              Utilizamos fotogrametría y escaneo láser 3D para documentar y monitorear el estado de conservación de nuestros monumentos más preciados.
            </p>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition shadow-lg">
              Acceder al Archivo Digital
            </button>
         </div>
      </div>

      {/* Gallery Modal */}
      {selectedSite && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedSiteIndex(null)}
        >
            <button 
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 z-20"
                onClick={() => setSelectedSiteIndex(null)}
            >
                <X className="h-8 w-8" />
            </button>

            {/* Global Site Navigation (Outside Modal) */}
            <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-full hidden lg:block z-20"
                onClick={handlePrevSite}
                title="Sitio Anterior"
            >
                <ChevronLeft className="h-12 w-12" />
            </button>

            <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-full hidden lg:block z-20"
                onClick={handleNextSite}
                title="Siguiente Sitio"
            >
                <ChevronRight className="h-12 w-12" />
            </button>

            <div 
                className="max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" 
                onClick={e => e.stopPropagation()}
            >
                {/* Image & Carousel Container */}
                <div className="md:w-3/4 h-[60vh] md:h-[80vh] bg-black relative flex flex-col">
                    
                    {/* Main Image Area */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black group/image">
                        <img 
                            src={selectedSite.gallery[currentImageIndex]} 
                            alt={`${selectedSite.title} - Imagen ${currentImageIndex + 1}`} 
                            className="max-w-full max-h-full object-contain transition-opacity duration-300"
                        />
                        
                        {/* Image Navigation Overlays */}
                        <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                             <button 
                                onClick={handlePrevImage}
                                className="pointer-events-auto p-2 rounded-full bg-black/40 text-white/70 hover:bg-white hover:text-black hover:scale-110 transition-all opacity-0 group-hover/image:opacity-100"
                             >
                                <ChevronLeft className="h-8 w-8" />
                             </button>
                             <button 
                                onClick={handleNextImage}
                                className="pointer-events-auto p-2 rounded-full bg-black/40 text-white/70 hover:bg-white hover:text-black hover:scale-110 transition-all opacity-0 group-hover/image:opacity-100"
                             >
                                <ChevronRight className="h-8 w-8" />
                             </button>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="h-20 bg-zinc-950 flex items-center justify-center gap-2 p-2 border-t border-white/10 z-10 shrink-0 overflow-x-auto">
                        {selectedSite.gallery.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                className={`h-14 w-20 relative overflow-hidden rounded-md transition-all flex-shrink-0 border-2 ${currentImageIndex === idx ? 'border-brand-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Info Sidebar */}
                <div className="md:w-1/4 p-6 md:p-8 text-white flex flex-col overflow-y-auto bg-zinc-900 h-auto md:h-[80vh]">
                    <div className="mb-auto">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2 text-brand-400">
                                <ImageIcon className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Galería Oficial</span>
                           </div>
                           
                           {/* Share Popover */}
                           <div className="relative">
                               <button 
                                   onClick={(e) => { e.stopPropagation(); setIsShareOpen(!isShareOpen); }}
                                   className={`p-2 rounded-full transition-colors ${isShareOpen ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                   title="Compartir"
                               >
                                   <Share2 className="h-4 w-4" />
                               </button>
                               {isShareOpen && (
                                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                                       <div className="px-4 py-2 border-b border-gray-100">
                                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compartir</p>
                                       </div>
                                       <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                           <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                                       </button>
                                       <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                           <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Twitter
                                       </button>
                                       <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                           <Linkedin className="h-4 w-4 text-[#0A66C2]" /> LinkedIn
                                       </button>
                                       <div className="h-px bg-gray-100 my-1"></div>
                                       <button 
                                          onClick={handleCopyLink}
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                       >
                                           {linkCopied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4 text-gray-500" />}
                                           {linkCopied ? 'Enlace copiado' : 'Copiar enlace'}
                                       </button>
                                   </div>
                               )}
                           </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight">{selectedSite.title}</h3>
                        <div className="space-y-3 mb-6">
                             <div className="flex items-center text-sm text-zinc-300 font-medium uppercase tracking-wider">
                                <MapPin className="h-4 w-4 mr-2 text-zinc-500"/> 
                                {selectedSite.location}
                             </div>
                             <div className="flex items-center text-sm text-zinc-300 font-medium uppercase tracking-wider">
                                <Calendar className="h-4 w-4 mr-2 text-zinc-500"/> 
                                {selectedSite.period}
                             </div>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-4">
                            {selectedSite.description}
                        </p>
                    </div>

                    {/* Mobile Navigation controls for Sites (visible only on small screens) */}
                    <div className="flex md:hidden items-center justify-between pt-6 mt-6 border-t border-white/10">
                        <button onClick={handlePrevSite} className="flex items-center text-sm font-medium text-white hover:text-brand-400 transition-colors">
                            <ChevronLeft className="h-4 w-4 mr-1"/> Sitio Anterior
                        </button>
                        <span className="text-xs text-zinc-600">{selectedSiteIndex + 1} / {HERITAGE_SITES.length}</span>
                        <button onClick={handleNextSite} className="flex items-center text-sm font-medium text-white hover:text-brand-400 transition-colors">
                            Siguiente <ChevronRight className="h-4 w-4 ml-1"/>
                        </button>
                    </div>
                    
                     <div className="hidden md:flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                        <span className="text-xs text-zinc-600 font-mono tracking-widest">
                            {selectedSiteIndex + 1} / {HERITAGE_SITES.length}
                        </span>
                        <button className="text-xs font-medium text-white hover:text-brand-400 transition-colors">
                            Ver detalles completos
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};