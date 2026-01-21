import React, { useEffect, useRef, useState } from 'react';
import { Hero } from './components/Hero';
import { AtlasMap } from './components/AtlasMap';
import { Dashboard } from './components/Dashboard';
import { InfrastructureList } from './components/InfrastructureList';
import { Patrimonio } from './components/Patrimonio';
import { AppMode, ScheduledVisit } from './types';
import { LayoutGrid, Building2, Menu, X, Globe } from 'lucide-react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

type ActiveView = 'home' | 'atlas' | 'patrimonio' | 'dashboard' | 'infrastructure';

type NavState = {
  activeView: ActiveView;
  mode: AppMode;
  initialHeritageId: number | null;
};

const INITIAL_NAV_STATE: NavState = {
  activeView: 'home',
  mode: AppMode.PUBLIC,
  initialHeritageId: null
};

const IconHacienda = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22h20" />
    <path d="M4 22v-9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9" />
    <path d="M4 11l9-4l9 4" />
    <path d="M10 22v-4a2 2 0 1 1 4 0v4" />
    <rect x="6" y="14" width="2" height="3" rx="0.5" />
    <rect x="16" y="14" width="2" height="3" rx="0.5" />
    <circle cx="12" cy="7" r="1" fill="currentColor" className="text-brand-300" stroke="none" strokeWidth="0" />
  </svg>
);

const IconAtlas = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6l6-3l6 3l6-3v15l-6 3l-6-3l-6 3V6z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
    <circle cx="12" cy="12" r="2" className="text-brand-500" fill="currentColor" stroke="none"/>
  </svg>
);

const IconPyramid = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22h20" />
    <path d="M5 22l3-6h8l3 6" />
    <path d="M9 16l2-5h2l2 5" />
    <rect x="11" y="7" width="2" height="4" />
    <path d="M10 7h4" />
  </svg>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(INITIAL_NAV_STATE.mode);
  const [activeView, setActiveView] = useState<ActiveView>(INITIAL_NAV_STATE.activeView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialHeritageId, setInitialHeritageId] = useState<number | null>(INITIAL_NAV_STATE.initialHeritageId);
  const isHandlingPopStateRef = useRef(false);
  
  // Usamos una referencia para evitar el error findDOMNode de react-transition-group
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const SCHEDULED_VISITS_STORAGE_KEY = 'pgvcc.scheduledVisits';

  const isScheduledVisit = (value: unknown): value is ScheduledVisit => {
    const v = value as ScheduledVisit;
    return Boolean(
      v &&
        typeof v === 'object' &&
        typeof v.id === 'string' &&
        typeof v.siteId === 'number' &&
        typeof v.siteTitle === 'string' &&
        typeof v.date === 'string' &&
        typeof v.timeSlot === 'string' &&
        typeof v.type === 'string' &&
        (v.status === 'Pending' || v.status === 'Confirmed' || v.status === 'Completed') &&
        typeof v.requesterName === 'string' &&
        (v.title === undefined || typeof v.title === 'string') &&
        (v.description === undefined || typeof v.description === 'string') &&
        (v.location === undefined || typeof v.location === 'string') &&
        (v.labelColor === undefined || typeof v.labelColor === 'string') &&
        (v.reminders === undefined || (Array.isArray(v.reminders) && v.reminders.every(r => typeof r === 'number')))
    );
  };

  // Shared state for scheduled visits
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>(() => {
    try {
      const raw = localStorage.getItem(SCHEDULED_VISITS_STORAGE_KEY);
      if (!raw) throw new Error('missing');
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) throw new Error('invalid');
      const visits = parsed.filter(isScheduledVisit);
      if (visits.length > 0) return visits;
    } catch {}
    return [
      { id: 'v1', siteId: 1, siteTitle: 'Chichén Itzá', date: '2025-12-17', timeSlot: '09:15 - 10:15', type: 'Escolar', status: 'Confirmed', requesterName: 'Escuela Primaria Benito Juárez' }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULED_VISITS_STORAGE_KEY, JSON.stringify(scheduledVisits));
    } catch {}
  }, [scheduledVisits]);

  const isNavState = (value: unknown): value is NavState => {
    const v = value as NavState;
    return Boolean(
      v &&
        typeof v === 'object' &&
        (v.activeView === 'home' ||
          v.activeView === 'atlas' ||
          v.activeView === 'patrimonio' ||
          v.activeView === 'dashboard' ||
          v.activeView === 'infrastructure') &&
        (v.mode === AppMode.PUBLIC || v.mode === AppMode.ADMIN) &&
        (typeof v.initialHeritageId === 'number' || v.initialHeritageId === null)
    );
  };

  useEffect(() => {
    try {
      window.history.replaceState(INITIAL_NAV_STATE, document.title);
    } catch {}

    const handlePopState = (event: PopStateEvent) => {
      if (!isNavState(event.state)) return;

      isHandlingPopStateRef.current = true;
      setMode(event.state.mode);
      setActiveView(event.state.activeView);
      setInitialHeritageId(event.state.initialHeritageId);
      setMobileMenuOpen(false);
      setTimeout(() => {
        isHandlingPopStateRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const applyNavigation = (next: NavState, historyBehavior: 'push' | 'replace' = 'push') => {
    setMode(next.mode);
    setActiveView(next.activeView);
    setInitialHeritageId(next.initialHeritageId);
    setMobileMenuOpen(false);

    if (isHandlingPopStateRef.current) return;
    try {
      if (historyBehavior === 'push') window.history.pushState(next, document.title);
      if (historyBehavior === 'replace') window.history.replaceState(next, document.title);
    } catch {}
  };

  const handleNavigateToHeritage = (id: number) => {
    applyNavigation({ activeView: 'patrimonio', mode: AppMode.PUBLIC, initialHeritageId: id }, 'push');
  };

  const handleNavClick = (view: ActiveView, newMode: AppMode) => {
    applyNavigation({ activeView: view, mode: newMode, initialHeritageId: null }, 'push');
  };

  const handleBackFromPatrimonio = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    applyNavigation({ activeView: 'atlas', mode: AppMode.PUBLIC, initialHeritageId: null }, 'replace');
  };

  const handleAddVisit = (visit: ScheduledVisit) => {
    setScheduledVisits(prev => [visit, ...prev]);
  };

  const handleMoveVisit = (visitId: string, updates: Pick<ScheduledVisit, 'date' | 'timeSlot'>) => {
    setScheduledVisits(prev => prev.map(v => (v.id === visitId ? { ...v, ...updates } : v)));
  };

  const handleUpsertVisit = (visit: ScheduledVisit) => {
    setScheduledVisits(prev => {
      const existing = prev.find(v => v.id === visit.id);
      if (!existing) return [visit, ...prev];
      return prev.map(v => (v.id === visit.id ? { ...v, ...visit } : v));
    });
  };

  const handleDeleteVisit = (visitId: string) => {
    setScheduledVisits(prev => prev.filter(v => v.id !== visitId));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Hero />;
      case 'atlas': return <AtlasMap onNavigateToHeritage={handleNavigateToHeritage} />;
      case 'patrimonio': return <Patrimonio initialSiteId={initialHeritageId} onBack={handleBackFromPatrimonio} onScheduleVisit={handleAddVisit} scheduledVisits={scheduledVisits} onMoveVisit={handleMoveVisit} onUpsertVisit={handleUpsertVisit} onDeleteVisit={handleDeleteVisit} />;
      case 'dashboard': return <Dashboard onNavigate={(v) => applyNavigation({ activeView: v, mode, initialHeritageId: null }, 'push')} />;
      case 'infrastructure': return <InfrastructureList scheduledVisits={scheduledVisits} onMoveVisit={handleMoveVisit} onUpsertVisit={handleUpsertVisit} onDeleteVisit={handleDeleteVisit} />;
      default: return <Hero />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col overflow-x-hidden">
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('home', AppMode.PUBLIC)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <span className="font-serif text-xl font-bold">M</span>
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-slate-950 tracking-tight">Cultura</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">México</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-bold uppercase tracking-widest text-[10px]">
            <div className="flex items-center gap-6 text-slate-500">
               <button onClick={() => handleNavClick('home', AppMode.PUBLIC)} className={`flex items-center gap-2 hover:text-brand-600 transition-all ${activeView === 'home' ? 'text-brand-600 scale-105' : 'hover:scale-105'}`}>
                 <IconHacienda className="h-4 w-4" /> Inicio
               </button>
               <button onClick={() => handleNavClick('atlas', AppMode.PUBLIC)} className={`flex items-center gap-2 hover:text-brand-600 transition-all ${activeView === 'atlas' ? 'text-brand-600 scale-105' : 'hover:scale-105'}`}>
                 <IconAtlas className="h-4 w-4" /> Atlas
               </button>
               <button onClick={() => handleNavClick('patrimonio', AppMode.PUBLIC)} className={`flex items-center gap-2 hover:text-brand-600 transition-all ${activeView === 'patrimonio' ? 'text-brand-600 scale-105' : 'hover:scale-105'}`}>
                 <IconPyramid className="h-4 w-4" /> Patrimonio
               </button>
            </div>
            <div className="h-6 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3">
                <button onClick={() => handleNavClick('dashboard', AppMode.ADMIN)} className={`px-4 py-2 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-slate-950 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Dashboard</button>
                <button onClick={() => handleNavClick('infrastructure', AppMode.ADMIN)} className={`px-4 py-2 rounded-xl transition-all ${activeView === 'infrastructure' ? 'bg-slate-950 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Gestión</button>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-8 font-black uppercase tracking-[0.3em] text-xs">
             <button onClick={() => handleNavClick('home', AppMode.PUBLIC)} className="text-left py-4 border-b border-slate-100 flex items-center justify-between">Inicio <IconHacienda className="h-4 w-4" /></button>
             <button onClick={() => handleNavClick('atlas', AppMode.PUBLIC)} className="text-left py-4 border-b border-slate-100 flex items-center justify-between">Atlas <IconAtlas className="h-4 w-4" /></button>
             <button onClick={() => handleNavClick('patrimonio', AppMode.PUBLIC)} className="text-left py-4 border-b border-slate-100 flex items-center justify-between">Patrimonio <IconPyramid className="h-4 w-4" /></button>
             <div className="pt-10 flex flex-col gap-4">
                <button onClick={() => handleNavClick('dashboard', AppMode.ADMIN)} className="w-full bg-slate-950 text-white py-5 rounded-2xl shadow-xl">Dashboard Administrativo</button>
                <button onClick={() => handleNavClick('infrastructure', AppMode.ADMIN)} className="w-full bg-slate-100 text-slate-600 py-5 rounded-2xl">Gestión de Activos</button>
             </div>
          </div>
        </div>
      )}

      <main className="flex-1 transition-all duration-300 relative">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeView}
            nodeRef={nodeRef}
            timeout={500}
            classNames="page-transition"
            unmountOnExit
          >
            <div ref={nodeRef}>
              {renderContent()}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </main>
      
      {/* Footer minimalista tipo Arts & Culture */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 items-center justify-center flex rounded bg-slate-950 text-white font-serif font-bold text-sm">M</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secretaría de Cultura • México 2025</span>
          </div>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Transparencia</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
