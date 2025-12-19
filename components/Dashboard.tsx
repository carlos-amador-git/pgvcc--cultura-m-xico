import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Treemap } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Sparkles, Brain, ArrowDownRight, Activity, Info, ChevronDown, ChevronUp, RefreshCw, Users, Wrench, ChevronRight, RotateCcw } from 'lucide-react';
import { CHART_DATA, KPIS_DATA, ASSETS_DATA } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
    onNavigate?: (view: 'infrastructure' | 'atlas') => void;
}

type AnalysisType = 'presupuesto' | 'impacto' | 'infraestructura';

const COLORS = ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#1e293b', '#334155'];

const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, depth } = props;
  
  // Decidir si rotar el texto basado en la relación de aspecto para evitar amontonamiento
  const isVertical = height > width * 1.6;
  const showText = width > 35 && height > 25;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 1.5,
          strokeOpacity: 0.3,
          cursor: 'pointer'
        }}
        rx={8}
        ry={8}
      />
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={depth === 0 ? 11 : 10}
          fontWeight={500}
          transform={isVertical ? `rotate(-90, ${x + width / 2}, ${y + height / 2})` : ''}
          className="uppercase tracking-widest pointer-events-none select-none"
          style={{ 
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
          }}
        >
          {name.length > 25 && !isVertical ? name.substring(0, 22) + '...' : name}
        </text>
      )}
    </g>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [aiInsight, setAiInsight] = useState<string>('Analizando tendencias financieras...');
  const [loadingAi, setLoadingAi] = useState(true);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('presupuesto');
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState(false);
  
  // Estado para el drill-down del Treemap (3 niveles de interacción)
  const [drilldownPath, setDrilldownPath] = useState<string[]>([]);

  const treemapData = useMemo(() => {
    const level = drilldownPath.length;

    if (level === 0) {
      const map: Record<string, number> = {};
      ASSETS_DATA.forEach(asset => {
        const type = asset.type || 'Otros';
        map[type] = (map[type] || 0) + (asset.amount || 0);
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    } 
    
    if (level === 1) {
      const category = drilldownPath[0];
      const filtered = ASSETS_DATA.filter(a => a.type === category);
      const map: Record<string, number> = {};
      filtered.forEach(asset => {
        const state = asset.location || 'N/A';
        map[state] = (map[state] || 0) + (asset.amount || 0);
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    }

    if (level === 2) {
      const [category, state] = drilldownPath;
      return ASSETS_DATA
        .filter(a => a.type === category && a.location === state)
        .map(a => ({ name: a.name, value: a.amount || 0 }));
    }

    return [];
  }, [drilldownPath]);

  useEffect(() => {
    generateAiAnalysis();
  }, [analysisType]);

  const generateAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let contextData = "";
      let promptFocus = "";

      if (analysisType === 'presupuesto') {
        contextData = JSON.stringify(CHART_DATA);
        promptFocus = "presupuesto cultural (ejercido vs programado). Menciona el subejercicio y tendencias de gasto.";
      } else if (analysisType === 'impacto') {
        contextData = JSON.stringify(KPIS_DATA);
        promptFocus = "impacto social y KPIs de beneficiarios y eventos. Analiza si estamos llegando a las metas de participación.";
      } else {
        contextData = JSON.stringify(ASSETS_DATA.map(a => ({ name: a.name, status: a.state, tickets: a.ticketsOpen })));
        promptFocus = "estado de la infraestructura y mantenimiento. Analiza los recintos con tickets abiertos y riesgos operativos.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiza los siguientes datos de gestión cultural: ${contextData}. Enfoque: ${promptFocus}.`,
      });
      setAiInsight(response.text || "Análisis no disponible.");
    } catch (error) {
      setAiInsight("Subejercicio detectado en Q2. Se observa una tendencia de gasto por debajo de lo planeado que indica deficiencias operativas.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleTreemapClick = (node: any) => {
    if (drilldownPath.length < 2) {
      setDrilldownPath([...drilldownPath, node.name]);
    }
  };

  const popDrilldown = () => setDrilldownPath(prev => prev.slice(0, -1));
  const resetDrilldown = () => setDrilldownPath([]);

  const calculateSubejercicio = () => {
    return CHART_DATA.map(d => ({
      ...d,
      subejercicio: d.programado - d.ejercido,
      porcentaje: ((d.programado - d.ejercido) / d.programado * 100).toFixed(1)
    }));
  };

  const subejercicioData = calculateSubejercicio();
  const totalSubejercicio = subejercicioData.reduce((acc, curr) => acc + curr.subejercicio, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* Header section identical to original layout */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Ecosistema Cultural</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">Tablero de Mando Nacional • Inteligencia de Gestión</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status Global</span>
                <p className="text-sm font-bold text-brand-500 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Optimización Requerida
                </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Actualizado</span>
                <p className="text-sm font-bold text-slate-900">02 Mayo 2025</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {KPIS_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.name}</span>
              {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-brand-500" />}
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-serif font-bold text-slate-900">{kpi.value.toLocaleString()}</span>
              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase">{kpi.unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500" style={{ width: `${(kpi.value / kpi.target) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8 px-4">
                <div>
                    <h3 className="font-serif font-bold text-slate-800 text-xl tracking-tight">Presupuesto Ejecución Anual</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Programado vs Ejercido</p>
                </div>
            </div>
            <div className="h-80 w-full px-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="programado" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="ejercido" stroke="#ec4899" strokeWidth={4} dot={{r: 6, fill: '#fff', strokeWidth: 3, stroke: '#ec4899'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-[#0f172a] text-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all">
            <div className="p-8 pb-4 shrink-0 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-500 rounded-xl shadow-lg shadow-brand-500/40">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">AI MANAGEMENT CORE</h4>
                    </div>
                    <button onClick={() => setIsAiPanelExpanded(!isAiPanelExpanded)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        {isAiPanelExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setAnalysisType('presupuesto')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${analysisType === 'presupuesto' ? 'bg-white text-slate-900 shadow-xl' : 'bg-[#1e293b] text-slate-400 hover:bg-white/5'}`}>PRESUPUESTO</button>
                    <button onClick={() => setAnalysisType('impacto')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${analysisType === 'impacto' ? 'bg-white text-slate-900 shadow-xl' : 'bg-[#1e293b] text-slate-400 hover:bg-white/5'}`}>IMPACTO</button>
                </div>
            </div>
            
            <div className={`flex-1 overflow-y-auto transition-all duration-500 ${isAiPanelExpanded ? 'opacity-100 p-8' : 'opacity-80 p-8 max-h-[120px]'}`}>
                {loadingAi ? <div className="h-10 bg-white/5 animate-pulse rounded w-full"></div> : 
                <p className="text-[15px] font-serif italic text-slate-100 leading-relaxed">"{aiInsight}"</p>}
                {!isAiPanelExpanded && <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />}
            </div>

            <div className="p-8 pt-0 mt-auto border-t border-white/5">
                <div className="flex justify-between items-end my-4">
                    <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block">SUBEJERCICIO Q2</span>
                        <span className="text-xl font-black text-brand-400 tracking-tight leading-none">${totalSubejercicio.toLocaleString()} MXN</span>
                    </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 w-[35%]"></div>
                </div>
            </div>
        </div>

        {/* TREEMAP WITH DRILL-DOWN AND ROTATED TEXT */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 mt-4 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Distribución de Inversión Nacional</h3>
                        {drilldownPath.length > 0 && (
                            <div className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 rounded-lg border border-brand-100">
                                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{drilldownPath.join(' / ')}</span>
                                    <button onClick={popDrilldown} className="hover:bg-brand-100 rounded-full p-0.5"><RotateCcw className="w-3 h-3 text-brand-400" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                        {drilldownPath.length === 0 ? 'FASE 1: CATEGORÍAS' : drilldownPath.length === 1 ? 'FASE 2: ESTADOS' : 'FASE 3: PROYECTOS'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">PROYECTOS: {treemapData.length}</span>
                    </div>
                    {drilldownPath.length > 0 && (
                        <button onClick={resetDrilldown} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
                            <RotateCcw className="w-4 h-4 text-slate-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="h-[450px] w-full transition-all duration-500">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={treemapData}
                        dataKey="value"
                        aspectRatio={16 / 9}
                        stroke="#fff"
                        content={<CustomizedContent />}
                        onClick={handleTreemapClick}
                    >
                        <Tooltip 
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 backdrop-blur-md">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{payload[0].payload.name}</p>
                                            <p className="text-xl font-serif font-bold text-brand-600">${payload[0].value.toLocaleString()} MXN</p>
                                            {drilldownPath.length < 2 && <p className="mt-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">Click para desglosar</p>}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);