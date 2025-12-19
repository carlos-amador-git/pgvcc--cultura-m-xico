import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Landmark, ChevronDown, Loader2, Globe, Sparkles, Building2, MapPin } from 'lucide-react';
import { HERITAGE_SITES, ASSETS_DATA } from '../constants';

interface AtlasMapProps {
  onNavigateToHeritage?: (id: number) => void;
}

declare const L: any; // Integración global vía script tag

const ALL_STATES = Array.from(new Set([...HERITAGE_SITES, ...ASSETS_DATA].map(item => {
    const parts = item.location.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
}))).sort();

// Conversor de Coordenadas: % top/left a Lat/Lng aproximado para México
const toLatLng = (top: number, left: number) => {
    const lat = 32.7 - (top * (32.7 - 14.5) / 100);
    const lng = -117.1 + (left * (117.1 - 86.7) / 100);
    return [lat, lng];
};

export const AtlasMap: React.FC<AtlasMapProps> = ({ onNavigateToHeritage }) => {
  const [layers, setLayers] = useState({ patrimonio: true, infraestructura: true });
  const [selectedState, setSelectedState] = useState('Todos');
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Inicialización de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
    }).setView([23.6, -102.5], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
        map.remove();
    };
  }, []);

  // Manejo de Marcadores dinámicos
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapInstanceRef.current;

    if (layers.patrimonio) {
        HERITAGE_SITES.forEach(site => {
            if (selectedState !== 'Todos' && !site.location.includes(selectedState)) return;

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="relative group">
                        <div class="h-9 w-9 rounded-full bg-[#ec4899] border-[3px] border-white shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center transition-all hover:scale-125">
                            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#ec4899]/20 animate-ping"></div>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            const marker = L.marker(toLatLng(site.coordinates.top, site.coordinates.left), { icon })
                .addTo(map)
                .on('click', () => onNavigateToHeritage?.(site.id))
                .bindTooltip(site.title, { direction: 'top', className: 'rounded-xl shadow-2xl px-4 py-2 font-bold bg-slate-900 text-white' });
            
            markersRef.current.push(marker);
        });
    }

    if (layers.infraestructura) {
        ASSETS_DATA.forEach(asset => {
            if (selectedState !== 'Todos' && !asset.location.includes(selectedState)) return;

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="h-4 w-4 bg-[#2563eb] rounded-full border-[2.5px] border-white shadow-lg transition-transform hover:scale-150"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            const marker = L.marker(toLatLng(asset.coordinates.top, asset.coordinates.left), { icon })
                .addTo(map)
                .bindTooltip(`${asset.name}`, { direction: 'top', className: 'rounded-lg bg-white text-slate-800 font-bold' });
            
            markersRef.current.push(marker);
        });
    }

    if (selectedState !== 'Todos' && markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 8 });
    }

  }, [layers, selectedState, isMapReady, onNavigateToHeritage]);

  const filteredHeritage = useMemo(() => 
    HERITAGE_SITES.filter(site => layers.patrimonio && (selectedState === 'Todos' || site.location.includes(selectedState))),
    [layers.patrimonio, selectedState]
  );

  const filteredAssets = useMemo(() => 
    ASSETS_DATA.filter(asset => layers.infraestructura && (selectedState === 'Todos' || asset.location.includes(selectedState))),
    [layers.infraestructura, selectedState]
  );

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col lg:flex-row relative bg-white overflow-hidden">
      <div className="w-full bg-white lg:w-96 lg:border-r overflow-y-auto z-20 flex flex-col border-slate-100 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.03)]">
        <div className="p-10 sticky top-0 bg-white/95 backdrop-blur z-20 border-b shrink-0">
          <h2 className="mb-2 font-serif text-4xl font-bold text-slate-900 tracking-tight leading-none">Atlas Cultural</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mb-10 italic">Plataforma de Consulta Nacional</p>
          
          <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtro por Estado</label>
              <div className="relative group">
                <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold rounded-2xl py-4.5 px-6 focus:ring-4 appearance-none cursor-pointer border hover:bg-white"
                >
                    <option value="Todos">Territorio Nacional</option>
                    {ALL_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 bg-slate-50/10">
          {/* Listado de Patrimonio */}
          {filteredHeritage.length > 0 && (
              <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b pb-2">Patrimonio Nacional</h3>
                  {filteredHeritage.map((site) => (
                    <div key={`her-${site.id}`} onClick={() => onNavigateToHeritage?.(site.id)} className="p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-brand-200 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1">
                        <div className="flex gap-4">
                            <img src={site.image} className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-inner bg-slate-100" />
                            <div>
                                <span className="text-[8px] font-bold text-brand-500 uppercase tracking-widest block mb-0.5">Tesoro</span>
                                <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 leading-tight mb-1">{site.title}</h4>
                                <p className="text-[10px] text-slate-400">{site.location}</p>
                            </div>
                        </div>
                    </div>
                  ))}
              </div>
          )}

          {/* Listado de Infraestructura */}
          {filteredAssets.length > 0 && (
              <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b pb-2">Proyectos PAICE</h3>
                  {filteredAssets.map((asset) => (
                    <div key={`as-${asset.id}`} className="p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm group border-l-4 border-l-blue-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{asset.type}</span>
                            <span className="text-[9px] font-bold text-slate-400">${asset.amount?.toLocaleString()}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-1">{asset.name}</h4>
                        <div className="flex items-center text-[10px] text-slate-400 font-medium">
                            <MapPin className="w-2.5 h-2.5 mr-1" /> {asset.location}
                        </div>
                    </div>
                  ))}
              </div>
          )}

          {filteredHeritage.length === 0 && filteredAssets.length === 0 && (
              <div className="py-20 text-center">
                  <Globe className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 italic">No hay resultados en esta zona con las capas seleccionadas.</p>
              </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-[#f8fafc] overflow-hidden">
        {!isMapReady && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-6" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Sincronizando Cartografía...</span>
            </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute bottom-12 right-12 bg-white/95 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-10 space-y-6 z-[1000] border border-slate-100 min-w-[300px]">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b pb-6 mb-4 flex justify-between items-center">
             Capas Activas <Globe className="w-3 h-3" />
           </h4>
           <div className="space-y-5">
                <button onClick={() => setLayers(l => ({...l, patrimonio: !l.patrimonio}))} className={`flex items-center gap-5 w-full transition-all group ${!layers.patrimonio ? 'opacity-30 grayscale' : 'hover:translate-x-2'}`}>
                    <div className="h-7 w-7 rounded-full bg-brand-500 shadow-xl border-2 border-white flex items-center justify-center">
                        <Landmark className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-brand-600">Patrimonio Cultural</span>
                </button>
                <button onClick={() => setLayers(l => ({...l, infraestructura: !l.infraestructura}))} className={`flex items-center gap-5 w-full transition-all group ${!layers.infraestructura ? 'opacity-30 grayscale' : 'hover:translate-x-2'}`}>
                    <div className="h-6 w-6 bg-blue-600 rounded-full shadow-xl border-2 border-white"></div>
                    <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600">Proyectos PAICE</span>
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};