import React, { useState, useMemo } from 'react';
import { MapPin, Users, Building2, Landmark, Check, Filter } from 'lucide-react';
import { SEMILLEROS_DATA, HERITAGE_SITES, ASSETS_DATA } from '../constants';

interface AtlasMapProps {
  onNavigateToHeritage?: (id: number) => void;
}

// Extract unique states for the filter
const ALL_ITEMS = [...SEMILLEROS_DATA, ...HERITAGE_SITES, ...ASSETS_DATA];
const STATES = Array.from(new Set(ALL_ITEMS.map(item => {
    // Logic to extract state from "City, State" or just "State" strings
    const parts = item.location.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
}))).sort();

export const AtlasMap: React.FC<AtlasMapProps> = ({ onNavigateToHeritage }) => {
  // Layer Toggles
  const [layers, setLayers] = useState({
    patrimonio: true,
    semilleros: true,
    infraestructura: true,
    alerta: true
  });

  // Geo Filters
  const [selectedState, setSelectedState] = useState('Todos');
  const [municipalityFilter, setMunicipalityFilter] = useState('');

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Quick Filters (Sidebar Buttons)
  const setQuickFilter = (type: 'all' | 'semilleros' | 'infrastructure') => {
      if (type === 'all') {
          setLayers({ patrimonio: true, semilleros: true, infraestructura: true, alerta: true });
      } else if (type === 'semilleros') {
          setLayers({ patrimonio: false, semilleros: true, infraestructura: false, alerta: false });
      } else if (type === 'infrastructure') {
          setLayers({ patrimonio: true, semilleros: false, infraestructura: true, alerta: true });
      }
  };

  const activeTab = useMemo(() => {
     if (layers.patrimonio && layers.semilleros && layers.infraestructura) return 'all';
     if (layers.semilleros && !layers.patrimonio && !layers.infraestructura) return 'semilleros';
     if (!layers.semilleros && (layers.patrimonio || layers.infraestructura)) return 'infrastructure';
     return 'custom';
  }, [layers]);


  // Filtering Logic
  const checkGeoFilter = (location: string) => {
     if (selectedState !== 'Todos') {
         if (!location.includes(selectedState)) return false;
     }
     if (municipalityFilter) {
         if (!location.toLowerCase().includes(municipalityFilter.toLowerCase())) return false;
     }
     return true;
  };

  const filteredSemilleros = useMemo(() => SEMILLEROS_DATA.filter(item => 
      layers.semilleros && checkGeoFilter(item.location)
  ), [layers.semilleros, selectedState, municipalityFilter]);

  const filteredHeritage = useMemo(() => HERITAGE_SITES.filter(site => 
      layers.patrimonio && checkGeoFilter(site.location)
  ), [layers.patrimonio, selectedState, municipalityFilter]);

  const filteredAssets = useMemo(() => ASSETS_DATA.filter(asset => {
      const isCritical = asset.state === 'Critical';
      
      // Filter by layer visibility
      if (isCritical) {
          if (!layers.alerta) return false;
      } else {
          if (!layers.infraestructura) return false;
      }

      // Filter by Geo
      return checkGeoFilter(asset.location);
  }), [layers.infraestructura, layers.alerta, selectedState, municipalityFilter]); 

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col lg:flex-row relative">
      {/* Sidebar / List View */}
      <div className="w-full bg-white lg:w-96 lg:border-r overflow-y-auto z-10 shadow-xl flex flex-col">
        <div className="p-6 sticky top-0 bg-white/95 backdrop-blur z-10 border-b shrink-0">
          <h2 className="mb-2 font-serif text-2xl font-bold text-slate-900">Atlas Cultural</h2>
          <p className="text-sm text-slate-500 mb-4">Mapeo del ecosistema cultural en tiempo real.</p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setQuickFilter('all')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}
            >
              Todo
            </button>
            <button 
               onClick={() => setQuickFilter('semilleros')}
               className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeTab === 'semilleros' ? 'bg-brand-600 text-white border-brand-600' : 'hover:bg-slate-100'}`}
            >
              Semilleros
            </button>
            <button 
               onClick={() => setQuickFilter('infrastructure')}
               className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeTab === 'infrastructure' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-100'}`}
            >
              Recintos
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {filteredSemilleros.length === 0 && filteredHeritage.length === 0 && filteredAssets.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                  No hay resultados para los filtros seleccionados.
              </div>
          )}

          {filteredSemilleros.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Semilleros Creativos ({filteredSemilleros.length})</h3>
              <div className="space-y-4">
                {filteredSemilleros.map((item) => (
                  <div key={`sem-${item.id}`} className="group relative overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md cursor-pointer hover:border-brand-200">
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-brand-600">{item.discipline}</span>
                        <span className="flex items-center text-xs text-slate-400">
                          <Users className="mr-1 h-3 w-3" /> {item.participants}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filteredHeritage.length > 0 || filteredAssets.length > 0) && (
            <div className="mt-8">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Recintos e Infraestructura ({filteredHeritage.length + filteredAssets.length})</h3>
               <div className="space-y-4">
                  {filteredHeritage.map((site) => (
                      <div key={`her-${site.id}`} onClick={() => onNavigateToHeritage?.(site.id)} className="group flex gap-4 p-3 rounded-xl border bg-white transition-all hover:shadow-md cursor-pointer hover:border-blue-200">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <img src={site.image} alt={site.title} className="h-full w-full object-cover"/>
                          </div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-700">Patrimonio</span>
                              </div>
                              <h3 className="font-bold text-slate-900 text-sm">{site.title}</h3>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{site.description}</p>
                          </div>
                      </div>
                  ))}
                  {filteredAssets.map((asset) => (
                      <div key={`ast-${asset.id}`} className="group flex gap-4 p-3 rounded-xl border bg-white transition-all hover:shadow-md cursor-pointer hover:border-blue-200">
                          <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Building2 className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{asset.type}</span>
                                  <span className={`h-1.5 w-1.5 rounded-full ${asset.state === 'Critical' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                              </div>
                              <h3 className="font-bold text-slate-900 text-sm">{asset.name}</h3>
                              <p className="text-xs text-slate-500 mt-1">ID: {asset.id}</p>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Simulation */}
      <div className="relative flex-1 bg-slate-50 overflow-hidden">
        {/* Real Map Background using iframe */}
        <div className="absolute inset-0 z-0">
             <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://www.openstreetmap.org/export/embed.html?bbox=-118.36914062500001%2C14.39211326442651%2C-86.044921875%2C32.65787574268685&amp;layer=mapnik" 
                className="w-full h-full opacity-70 grayscale-[30%] pointer-events-none"
                style={{filter: 'contrast(1.1) brightness(1.05)'}}
             ></iframe>
             <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply pointer-events-none"></div>
        </div>
        
        {/* Pins */}
        {filteredHeritage.map((site) => (
          <div 
            key={`pin-her-${site.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 transition-all duration-300"
            style={{ top: `${site.coordinates.top}%`, left: `${site.coordinates.left}%` }}
            onClick={() => onNavigateToHeritage?.(site.id)}
          >
             <div className="relative group cursor-pointer">
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-brand-500 animate-ping absolute opacity-50"></div>
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-brand-600 border-2 border-white shadow-lg transform transition group-hover:scale-125 group-hover:bg-brand-500 flex items-center justify-center">
                    <Landmark className="h-2 w-2 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-white p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center z-30">
                    <div className="font-bold text-slate-900 text-xs">{site.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{site.location}</div>
                </div>
             </div>
          </div>
        ))}

        {filteredSemilleros.map((item) => (
          <div 
            key={`pin-sem-${item.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 transition-all duration-300"
            style={{ top: `${item.coordinates.top}%`, left: `${item.coordinates.left}%` }}
          >
             <div className="relative group cursor-pointer">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-indigo-600 border border-white shadow-md transform transition group-hover:scale-125 group-hover:bg-indigo-500"></div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-white p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center z-30">
                    <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                    <div className="text-[10px] text-indigo-600 font-medium">{item.discipline}</div>
                </div>
             </div>
          </div>
        ))}

        {filteredAssets.map((asset) => (
          <div 
            key={`pin-ast-${asset.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 transition-all duration-300"
            style={{ top: `${asset.coordinates.top}%`, left: `${asset.coordinates.left}%` }}
          >
             <div className="relative group cursor-pointer">
                <div className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-sm border border-white shadow-md transform transition group-hover:scale-125 ${asset.state === 'Critical' ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-white p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center z-30">
                    <div className="font-bold text-slate-900 text-xs">{asset.name}</div>
                    <div className="text-[10px] text-slate-500">{asset.type}</div>
                    {asset.state === 'Critical' && <div className="text-[9px] text-red-600 font-bold mt-0.5">Mantenimiento Urgente</div>}
                </div>
             </div>
          </div>
        ))}

        {/* Legend / Layer Filters (Top Right) - Now Interactive */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 text-xs space-y-2 z-20">
            <button onClick={() => toggleLayer('patrimonio')} className={`flex items-center gap-2 w-full hover:bg-black/5 p-1 rounded transition-colors ${!layers.patrimonio ? 'opacity-50 grayscale' : ''}`}>
                <div className="h-3 w-3 rounded-full bg-brand-600 border border-white shrink-0"></div>
                <span className="text-slate-700 font-medium">Patrimonio</span>
            </button>
            <button onClick={() => toggleLayer('semilleros')} className={`flex items-center gap-2 w-full hover:bg-black/5 p-1 rounded transition-colors ${!layers.semilleros ? 'opacity-50 grayscale' : ''}`}>
                <div className="h-3 w-3 rounded-full bg-indigo-600 border border-white shrink-0"></div>
                <span className="text-slate-700 font-medium">Semilleros</span>
            </button>
            <button onClick={() => toggleLayer('infraestructura')} className={`flex items-center gap-2 w-full hover:bg-black/5 p-1 rounded transition-colors ${!layers.infraestructura ? 'opacity-50 grayscale' : ''}`}>
                <div className="h-3 w-3 rounded-sm bg-slate-700 border border-white shrink-0"></div>
                <span className="text-slate-700 font-medium">Infraestructura</span>
            </button>
             <button onClick={() => toggleLayer('alerta')} className={`flex items-center gap-2 w-full hover:bg-black/5 p-1 rounded transition-colors ${!layers.alerta ? 'opacity-50 grayscale' : ''}`}>
                <div className="h-3 w-3 rounded-sm bg-red-500 border border-white shrink-0"></div>
                <span className="text-slate-700 font-medium">Alerta</span>
            </button>
        </div>

        {/* Geo Filter (Bottom Left) */}
        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-gray-100 w-72 z-20">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Filtrar Mapa</span>
            </div>
            <div className="space-y-3">
                <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1 ml-1">Estado</label>
                    <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-700 py-2 px-3 focus:ring-2 focus:ring-brand-100 outline-none"
                    >
                        <option value="Todos">Todos</option>
                        {STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1 ml-1">Municipio / Localidad</label>
                    <input 
                        type="text" 
                        placeholder="Buscar..."
                        value={municipalityFilter}
                        onChange={(e) => setMunicipalityFilter(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-lg text-xs font-medium text-slate-700 py-2 px-3 focus:ring-2 focus:ring-brand-100 outline-none"
                    />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};