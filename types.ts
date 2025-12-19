export enum AppMode {
  PUBLIC = 'PUBLIC', // Module 4 & 2
  ADMIN = 'ADMIN'    // Module 1 & 3
}

export interface Semillero {
  id: string;
  name: string;
  discipline: string;
  location: string;
  participants: number;
  image: string;
  status: 'active' | 'inactive';
  coordinates: {
    top: number;
    left: number;
  };
}

export interface Asset {
  id: string;
  name: string; // Nombre del proyecto beneficiado
  type: string; // Instancia beneficiaria o Tipo de recinto (inferido)
  state: 'Operational' | 'Maintenance Required' | 'Critical' | 'Project'; // Mapped from logic or default
  
  // Real PAICE Data Fields
  year?: number;
  amount?: number;
  beneficiary?: string;
  projectLink?: string;
  municipality?: string;

  // Legacy fields kept for compatibility (can be mocked)
  ticketsOpen: number;
  visitors: number;
  statusSummary: string;
  actionsInProgress: string[];
  actionsNext: string[];
  lastInspection: string;
  
  location: string; // Estado
  coordinates: {
    top: number;
    left: number;
  };
}

export interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface HeritageSite {
  id: number;
  title: string;
  location: string;
  period: string;
  image: string;
  gallery: string[];
  description: string;
  coordinates: {
    top: number;
    left: number;
  };
}

export interface ScheduledVisit {
  id: string;
  siteId: number;
  siteTitle: string;
  date: string;
  timeSlot: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  requesterName: string;
  title?: string;
  description?: string;
  location?: string;
  labelColor?: string;
  reminders?: number[];
}
