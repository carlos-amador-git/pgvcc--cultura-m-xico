import React, { useState } from 'react';
import { ASSETS_DATA } from '../constants';
import { Asset, ScheduledVisit } from '../types';
import { Building2, X, Calendar, Activity, CheckCircle2, AlertCircle, Wrench, Clock, FileText, ChevronRight, User, MapPin as MapPinIcon, Check } from 'lucide-react';
import { CalendarView } from './CalendarView';

interface InfrastructureListProps {
  scheduledVisits?: ScheduledVisit[];
  onAddInspection?: (visit: ScheduledVisit) => void;
  onMoveVisit?: (visitId: string, updates: Pick<ScheduledVisit, 'date' | 'timeSlot'>) => void | Promise<void>;
  onUpsertVisit?: (visit: ScheduledVisit) => void | Promise<void>;
  onDeleteVisit?: (visitId: string) => void | Promise<void>;
}

export const InfrastructureList: React.FC<InfrastructureListProps> = ({ scheduledVisits = [], onMoveVisit, onUpsertVisit, onDeleteVisit }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'agenda'>('inventory');
  const [showInspectionCalendar, setShowInspectionCalendar] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getStatusBadge = (state: string, tickets: number) => {
    if (tickets > 0) return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100"><AlertCircle className="w-3 h-3 mr-1.5"/> Mantenimiento ({tickets})</span>;
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100"><CheckCircle2 className="w-3 h-3 mr-1.5"/> Operacional</span>;
  };

  const handleConfirmInspection = (visitData: Partial<ScheduledVisit>) => {
    // Aquí se integraría con el backend o estado global para auditorías técnicas
    console.log('Inspección programada para:', selectedAsset?.name, visitData);
    setShowInspectionCalendar(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen relative">
      {/* Toast de Éxito */}
      {showSuccessToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
           <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
           </div>
           <span className="text-xs font-bold uppercase tracking-widest">Inspección Programada con Éxito</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Gestión del Activo</h1>
          <p className="text-slate-500 font-medium mt-1">SGIC - Supervisión de Infraestructura Cultural</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Inventario
          </button>
          <button 
            onClick={() => setActiveTab('agenda')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'agenda' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-600'} flex items-center gap-2`}
          >
            Agenda <span className="bg-brand-500 text-white px-2 py-0.5 rounded-full text-[8px]">{scheduledVisits.length}</span>
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-widest font-black text-[10px]">
                <tr>
                  <th className="px-8 py-6">Ficha del Recinto</th>
                  <th className="px-8 py-6">Estado / Tickets</th>
                  <th className="px-8 py-6">Clasificación</th>
                  <th className="px-8 py-6">Inversión (MXN)</th>
                  <th className="px-8 py-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ASSETS_DATA.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                        <div className="font-black text-slate-900 text-sm">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 tracking-wider uppercase font-bold mt-0.5">{asset.location}</div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(asset.state, asset.ticketsOpen)}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded border uppercase tracking-widest">{asset.type}</span>
                    </td>
                    <td className="px-8 py-6 font-mono font-bold text-slate-700 text-sm">
                      ${asset.amount?.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                          onClick={() => setSelectedAsset(asset)}
                          className="text-brand-600 hover:text-brand-700 font-black text-[10px] bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest inline-flex items-center gap-2"
                      >
                          Expediente <ChevronRight className="w-3 h-3"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {scheduledVisits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {scheduledVisits.map((visit) => (
                      <div key={visit.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${visit.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                {visit.status}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">Folio: #{visit.id.toUpperCase()}</span>
                         </div>
                         <h3 className="font-serif font-bold text-xl text-slate-900 mb-2 leading-tight">{visit.siteTitle}</h3>
                         <div className="flex items-center gap-2 text-brand-600 text-xs font-bold mb-6">
                            <Calendar className="w-3.5 h-3.5" /> {visit.date} • {visit.timeSlot}
                         </div>
                         
                         <div className="space-y-3 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-slate-300" />
                                <span className="text-xs text-slate-600 font-medium">{visit.requesterName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-slate-300" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{visit.type}</span>
                            </div>
                         </div>
                         
                         <div className="mt-8 flex gap-3">
                            <button className="flex-1 bg-slate-950 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Aprobar</button>
                            <button className="px-4 bg-slate-50 text-slate-400 py-3 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-4 h-4" /></button>
                         </div>
                      </div>
                   ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-medium italic">No hay visitas programadas por el momento.</p>
                </div>
            )}
        </div>
      )}

      {/* Modal: Expediente Digital Detallado (Existing) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
             
             <div className="p-10 border-b border-slate-100 flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 leading-tight">{selectedAsset.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedAsset.ticketsOpen > 0 ? 'bg-brand-50 text-brand-600' : 'bg-green-50 text-green-600'}`}>
                        {selectedAsset.state.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                     PAICE Folio: {selectedAsset.id} • {selectedAsset.location}
                  </p>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             <div className="p-10 overflow-y-auto flex-1 bg-slate-50/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 text-center shadow-sm">
                        <Activity className="h-5 w-5 text-brand-500 mx-auto mb-3" />
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets</div>
                        <div className="text-2xl font-black text-slate-900">{selectedAsset.ticketsOpen}</div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 text-center shadow-sm">
                        <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-3" />
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inversión</div>
                        <div className="text-xl font-black text-slate-900">${(selectedAsset.amount! / 1000).toFixed(0)}k</div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 text-center shadow-sm col-span-2">
                        <FileText className="h-5 w-5 text-green-500 mx-auto mb-3" />
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Inspección</div>
                        <div className="text-sm font-bold text-slate-900 mt-2 tracking-wide">{selectedAsset.lastInspection}</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Bitácora de Mantenimiento</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center group">
                                <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">T1</div>
                                <div>
                                    <div className="text-xs font-black text-slate-800">Servicio de Impermeabilización</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-tight">Cerrado el 15/02/2025</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center group">
                                <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">T2</div>
                                <div>
                                    <div className="text-xs font-black text-slate-800">Reparación luminaria sala A</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-tight">Pendiente por dictamen</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Acciones Críticas</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-brand-600" />
                                <span className="text-[10px] font-bold text-brand-900 tracking-tight">Falla en sistema eléctrico (Zona Exterior)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl opacity-50">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-tight">Limpieza de cisternas (Semanal)</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
             
             <div className="p-10 border-t border-slate-100 flex justify-end gap-6 bg-slate-50/50">
                <button onClick={() => setSelectedAsset(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Regresar al listado</button>
                <button 
                  onClick={() => setShowInspectionCalendar(true)}
                  className="px-10 py-4 bg-slate-950 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
                >
                  Agendar Inspección
                </button>
             </div>
           </div>
        </div>
      )}

      {/* Calendario de Inspección Técnica (Reutilizado del módulo público) */}
      {showInspectionCalendar && selectedAsset && (
        <CalendarView 
          siteTitle={selectedAsset.name}
          isInspection={true}
          onClose={() => setShowInspectionCalendar(false)}
          onConfirm={handleConfirmInspection}
          onMoveVisit={onMoveVisit}
          onUpsertVisit={onUpsertVisit}
          onDeleteVisit={onDeleteVisit}
          scheduledVisits={scheduledVisits}
        />
      )}
    </div>
  );
};
