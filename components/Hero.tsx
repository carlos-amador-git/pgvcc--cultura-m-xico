import React from 'react';
import { Search } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image - Night Ballet / Swan Lake vibe */}
      <img 
        src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1920&auto=format&fit=crop" 
        alt="Ballet de la Ciudad de México - Lago de los Cisnes" 
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 text-center text-white px-4">
        <span className="mb-4 rounded-full bg-white/10 backdrop-blur-md px-4 py-1 text-xs font-medium uppercase tracking-wider text-white border border-white/20 shadow-lg">
          Ventanilla Única de Cultura
        </span>
        <h1 className="mb-6 font-serif text-5xl font-bold md:text-7xl lg:text-8xl drop-shadow-2xl tracking-tight">
          La Cultura es un Derecho
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-100 md:text-xl font-light drop-shadow-md leading-relaxed">
          Descubre, participa y vive la riqueza del patrimonio cultural y comunitario de México.
          Un ecosistema digital unificado.
        </p>
        
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input 
            type="text" 
            className="block w-full rounded-full border-none bg-white/95 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-2xl focus:ring-4 focus:ring-brand-500/30 focus:bg-white transition-all backdrop-blur-sm" 
            placeholder="Buscar museos, semilleros, eventos..." 
          />
        </div>
      </div>
    </div>
  );
};