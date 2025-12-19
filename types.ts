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
  name: string;
  type: 'Museum' | 'Theater' | 'Library' | 'Center';
  state: 'Operational' | 'Maintenance Required' | 'Critical';
  ticketsOpen: number;
  visitors: number;
  statusSummary: string;
  actionsInProgress: string[];
  actionsNext: string[];
  lastInspection: string;
  location: string;
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