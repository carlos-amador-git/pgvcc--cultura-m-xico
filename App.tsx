import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { AtlasMap } from './components/AtlasMap';
import { Dashboard } from './components/Dashboard';
import { InfrastructureList } from './components/InfrastructureList';
import { Patrimonio } from './components/Patrimonio';
import { AppMode } from './types';
import { LayoutGrid, Building2, Menu, X, Globe } from 'lucide-react';

// --- Custom Navigation Icons ---

const IconHacienda = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22h20" />
    <path d="M4 22v-9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9" />
    <path d="M4 11l9-4l9 4" />
    <path d="M10 22v-4a2 2 0 1 1 4 0v4" />
    <rect x="6" y="14" width="2" height="3" rx="0.5" />
    <rect x="16" y="14" width="2" height="3" rx="0.5" />
    <circle cx="12" cy="7" r="1" fill="currentColor" className="text-brand-300" stroke="none" />
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

// -------------------------------

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PUBLIC);
  const [activeView, setActiveView] = useState<'home' | 'atlas' | 'patrimonio' | 'dashboard' | 'infrastructure'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialHeritageId, setInitialHeritageId] = useState<number | null>(null);

  const handleNavigateToHeritage = (id: number) => {
    setInitialHeritageId(id);
    setActiveView('patrimonio');
  };

  // Determine what to render based on view
  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Hero />;
      case 'atlas': return <AtlasMap onNavigateToHeritage={handleNavigateToHeritage} />;
      case 'patrimonio': return <Patrimonio initialSiteId={initialHeritageId} />;
      case 'dashboard': return <Dashboard />;
      case 'infrastructure': return <InfrastructureList />;
      default: return <Hero />;
    }
  };

  const handleNavClick = (view: typeof activeView, newMode: AppMode) => {
    setMode(newMode);
    setActiveView(view);
    setMobileMenuOpen(false);
    // Reset initial heritage ID when navigating manually to prevent auto-opening
    if (view === 'patrimonio') {
        setInitialHeritageId(null);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home', AppMode.PUBLIC)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg shadow-brand-500/20">
              <span className="font-serif text-xl font-bold">M</span>
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-slate-900 tracking-tight">Cultura</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-brand-600">Gobierno de México</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
               <button 
                onClick={() => handleNavClick('home', AppMode.PUBLIC)}
                className={`flex items-center gap-2 hover:text-brand-600 transition-colors ${activeView === 'home' ? 'text-brand-600 font-semibold' : ''}`}
               >
                 <IconHacienda className="h-4 w-4" />
                 Inicio
               </button>
               <button 
                onClick={() => handleNavClick('atlas', AppMode.PUBLIC)}
                className={`flex items-center gap-2 hover:text-brand-600 transition-colors ${activeView === 'atlas' ? 'text-brand-600 font-semibold' : ''}`}
               >
                 <IconAtlas className="h-4 w-4" />
                 Atlas Cultural
               </button>
               <button 
                onClick={() => handleNavClick('patrimonio', AppMode.PUBLIC)}
                className={`flex items-center gap-2 hover:text-brand-600 transition-colors ${activeView === 'patrimonio' ? 'text-brand-600 font-semibold' : ''}`}
               >
                 <IconPyramid className="h-4 w-4" />
                 Patrimonio
               </button>
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleNavClick('dashboard', AppMode.ADMIN)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${mode === AppMode.ADMIN && activeView === 'dashboard'
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
                >
                    <LayoutGrid className="h-4 w-4" />
                    Dashboard
                </button>
                 <button 
                    onClick={() => handleNavClick('infrastructure', AppMode.ADMIN)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${mode === AppMode.ADMIN && activeView === 'infrastructure'
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
                >
                    <Building2 className="h-4 w-4" />
                    Infraestructura
                </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b shadow-xl md:hidden flex flex-col p-4 gap-4 z-40">
             <button onClick={() => handleNavClick('home', AppMode.PUBLIC)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <IconHacienda className="h-5 w-5 text-brand-500"/> Inicio
             </button>
             <button onClick={() => handleNavClick('atlas', AppMode.PUBLIC)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <IconAtlas className="h-5 w-5 text-brand-500"/> Atlas Cultural
             </button>
             <button onClick={() => handleNavClick('patrimonio', AppMode.PUBLIC)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <IconPyramid className="h-5 w-5 text-brand-500"/> Patrimonio
             </button>
             <div className="h-px w-full bg-gray-100 my-2"></div>
             <p className="text-xs font-bold text-slate-400 uppercase px-3">Administración</p>
             <button onClick={() => handleNavClick('dashboard', AppMode.ADMIN)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <LayoutGrid className="h-5 w-5 text-slate-700"/> Dashboard (TMI)
             </button>
             <button onClick={() => handleNavClick('infrastructure', AppMode.ADMIN)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <Building2 className="h-5 w-5 text-slate-700"/> Infraestructura (SGIC)
             </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {renderContent()}
      </main>

      {/* Simplified Footer */}
      {mode === AppMode.PUBLIC && activeView === 'home' && (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-serif text-xl mb-4">Cultura</h4>
                    <p className="text-slate-400 text-sm">Secretaría de Cultura del Gobierno de México.</p>
                </div>
                <div>
                    <h5 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Explora</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>Semilleros Creativos</li>
                        <li>Museos</li>
                        <li>Patrimonio</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Trámites</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>Convocatorias</li>
                        <li>Ventanilla Digital</li>
                        <li>Denuncias</li>
                    </ul>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5"/> <span className="text-sm font-medium">Español</span>
                    </div>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;