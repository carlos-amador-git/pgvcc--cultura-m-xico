import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { CHART_DATA, KPIS_DATA } from '../constants';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tablero de Mando Integral (TMI)</h1>
          <p className="text-slate-500">Inteligencia de negocio para la toma de decisiones estratégicas.</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-slate-400">Última actualización</span>
          <p className="text-sm font-bold text-slate-900">02 Mayo 2025</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {KPIS_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">{kpi.name}</span>
              {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
               kpi.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> : 
               <div className="h-1 w-4 bg-gray-300 rounded-full"></div>}
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-slate-900">{kpi.value.toLocaleString()}</span>
              <span className="ml-2 text-xs text-slate-400">{kpi.unit}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-brand-500'}`} 
                    style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                ></div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Meta: {kpi.target.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="mb-6 font-bold text-slate-800">Participación y Eventos (Mensual)</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="asistencia" fill="#ec4899" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="eventos" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="mb-6 font-bold text-slate-800">Evolución del Impacto Social</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="asistencia" stroke="#db2777" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Budget & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="col-span-2 bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-brand-500" />
                    Eficiencia Presupuestal
                </h3>
                <p className="text-slate-300 mb-6 max-w-lg">
                    La optimización de recursos mediante el SGIC ha permitido redirigir un 15% del presupuesto operativo hacia programas sustantivos de cultura comunitaria.
                </p>
                <div className="flex gap-8">
                    <div>
                        <span className="block text-3xl font-bold text-brand-400">$24M</span>
                        <span className="text-sm text-slate-400">Ahorro Estimado (Anual)</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-green-400">92%</span>
                        <span className="text-sm text-slate-400">Ejecución Correcta</span>
                    </div>
                </div>
            </div>
            {/* Decoration */}
            <div className="absolute right-0 top-0 h-64 w-64 bg-brand-600 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Alertas Prioritarias</h3>
            <div className="space-y-3">
                <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-red-700">Mantenimiento Urgente</h4>
                        <p className="text-xs text-red-600 mt-1">Centro Cultural Helénico reporta falla en sistema eléctrico.</p>
                    </div>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-700">Informe Completado</h4>
                        <p className="text-xs text-blue-600 mt-1">Reporte trimestral de Semilleros enviado a SHCP.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
