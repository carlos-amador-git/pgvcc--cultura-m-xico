import React, { useState } from 'react';
import { ASSETS_DATA } from '../constants';
import { Asset } from '../types';
import { Settings, Wrench, AlertTriangle, CheckCircle2, X, Calendar, Activity, FileText, Users, ArrowRight, PlayCircle, Clock } from 'lucide-react';

export const InfrastructureList: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-brand-600" />
            SGIC
          </h1>
          <p className="text-slate-500">Sistema de Gestión de Infraestructura Cultural</p>
        </div>
        <button className="mt-4 md:mt-0 bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-200">
          + Nuevo Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Activo / Recinto</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Visitantes (Mes)</th>
                <th className="px-6 py-4">Última Inspección</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ASSETS_DATA.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{asset.name}</td>
                  <td className="px-6 py-4 text-slate-500">{asset.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${asset.state === 'Operational' ? 'bg-green-100 text-green-800' : 
                        asset.state === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {asset.state === 'Operational' && <CheckCircle2 className="w-3 h-3 mr-1"/>}
                      {asset.state === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1"/>}
                      {asset.state === 'Maintenance Required' && <Wrench className="w-3 h-3 mr-1"/>}
                      {asset.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center font-bold text-slate-700">
                        <Users className="w-3 h-3 mr-1.5 text-slate-400" />
                        {asset.visitors.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{asset.lastInspection}</td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => setSelectedAsset(asset)}
                        className="text-brand-600 hover:text-brand-800 font-medium text-xs hover:underline"
                    >
                        Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center">
            <span className="text-xs text-slate-400">Mostrando {ASSETS_DATA.length} de 254 activos registrados</span>
        </div>
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
             
             {/* Header */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white z-10">
               <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedAsset.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${selectedAsset.state === 'Operational' ? 'bg-green-100 text-green-800' : 
                        selectedAsset.state === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedAsset.state}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                     <span className="capitalize">{selectedAsset.type}</span> • ID: {selectedAsset.id}
                  </p>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="p-2 text-slate-400 hover:bg-gray-100 rounded-full transition-colors">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             {/* Content */}
             <div className="p-6 overflow-y-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Visitantes (Mensual)</div>
                        <div className="flex items-center gap-2 text-slate-900 font-medium text-lg">
                            <Users className="h-5 w-5 text-brand-600"/> {selectedAsset.visitors.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Última Inspección</div>
                        <div className="flex items-center gap-2 text-slate-900 font-medium text-lg">
                            <Calendar className="h-5 w-5 text-brand-600"/> {selectedAsset.lastInspection}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 col-span-2 md:col-span-1">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tickets Abiertos</div>
                        <div className="flex items-center gap-2 text-slate-900 font-medium text-lg">
                            <Activity className="h-5 w-5 text-brand-600"/> {selectedAsset.ticketsOpen}
                        </div>
                    </div>
                </div>

                {/* Status Summary */}
                <div className="mb-8">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-slate-500"/>
                        Resumen del Estado
                    </h3>
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-slate-700 leading-relaxed">
                        {selectedAsset.statusSummary}
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Actions In Progress */}
                    <div className="bg-amber-50/30 rounded-xl border border-amber-100/50 overflow-hidden">
                        <div className="bg-amber-50/80 px-4 py-3 border-b border-amber-100 flex items-center gap-2">
                             <PlayCircle className="h-4 w-4 text-amber-600" />
                             <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Acciones en Marcha</h4>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {selectedAsset.actionsInProgress.map((action, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Next Actions */}
                     <div className="bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                             <Clock className="h-4 w-4 text-slate-600" />
                             <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Acciones a Seguir</h4>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {selectedAsset.actionsNext.map((action, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

             </div>
             
             {/* Footer */}
             <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 z-10">
                <button 
                    onClick={() => setSelectedAsset(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cerrar
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-md shadow-brand-200">
                    Gestionar Activo
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};