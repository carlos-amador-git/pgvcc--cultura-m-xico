import { Asset, KPI, Semillero, HeritageSite } from './types';

export const HERO_IMAGES = [
  "https://picsum.photos/id/1015/1600/900", // Landscapes
  "https://picsum.photos/id/1047/1600/900", // Urban
  "https://picsum.photos/id/1016/1600/900", // Nature
];

export const SEMILLEROS_DATA: Semillero[] = [
  { id: '1', name: 'Semillero de Artes Vivas', discipline: 'Teatro y Danza', location: 'Oaxaca, Oax.', participants: 45, image: 'https://picsum.photos/id/1005/400/300', status: 'active', coordinates: { top: 84, left: 66 } },
  { id: '2', name: 'Orquesta Comunitaria', discipline: 'Música', location: 'Tlalnepantla, Edo. Méx', participants: 120, image: 'https://picsum.photos/id/1082/400/300', status: 'active', coordinates: { top: 71, left: 58 } },
  { id: '3', name: 'Taller de Gráfica', discipline: 'Artes Visuales', location: 'Morelia, Mich.', participants: 30, image: 'https://picsum.photos/id/1025/400/300', status: 'active', coordinates: { top: 70, left: 52 } },
  { id: '4', name: 'Voces de la Sierra', discipline: 'Lenguas Indígenas', location: 'Chiapas', participants: 25, image: 'https://picsum.photos/id/1011/400/300', status: 'active', coordinates: { top: 85, left: 79 } },
  { id: '5', name: 'Circo Social del Sur', discipline: 'Artes Escénicas', location: 'Guerrero', participants: 60, image: 'https://picsum.photos/id/158/400/300', status: 'active', coordinates: { top: 81, left: 57 } },
];

const getStateCoordinates = (stateName: string): { top: number, left: number } => {
    const normalized = stateName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const coords: Record<string, {top: number, left: number}> = {
        'aguascalientes': { top: 60, left: 48 },
        'baja california': { top: 15, left: 15 },
        'baja california sur': { top: 40, left: 25 },
        'campeche': { top: 75, left: 85 },
        'chiapas': { top: 85, left: 80 },
        'chihuahua': { top: 25, left: 35 },
        'ciudad de mexico': { top: 71, left: 59 },
        'coahuila': { top: 35, left: 50 },
        'colima': { top: 71, left: 42 },
        'durango': { top: 45, left: 40 },
        'guanajuato': { top: 63, left: 52 },
        'guerrero': { top: 80, left: 55 },
        'hidalgo': { top: 67, left: 58 },
        'jalisco': { top: 66, left: 45 },
        'mexico': { top: 70, left: 57 },
        'michoacan': { top: 70, left: 50 },
        'morelos': { top: 73, left: 58 },
        'nayarit': { top: 60, left: 40 },
        'nuevo leon': { top: 38, left: 55 },
        'oaxaca': { top: 82, left: 68 },
        'puebla': { top: 72, left: 61 },
        'queretaro': { top: 65, left: 56 },
        'quintana roo': { top: 72, left: 95 },
        'san luis potosi': { top: 58, left: 53 },
        'sinaloa': { top: 40, left: 32 },
        'sonora': { top: 20, left: 25 },
        'tabasco': { top: 78, left: 78 },
        'tamaulipas': { top: 45, left: 60 },
        'tlaxcala': { top: 71, left: 60 },
        'veracruz': { top: 70, left: 65 },
        'yucatan': { top: 65, left: 90 },
        'zacatecas': { top: 55, left: 48 },
    };
    const base = coords[normalized] || { top: 50, left: 50 };
    return { top: base.top, left: base.left };
};

export const ASSETS_DATA: Asset[] = [
    // --- AUDITORIO (Guanajuato, Ciudad de México, Jalisco) ---
    { id: 'A-GTO-1', year: 2022, location: 'Guanajuato', municipality: 'Celaya', name: 'Auditorio Francisco Eduardo Tresguerras', amount: 1200000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2022-06-29', coordinates: getStateCoordinates('Guanajuato') },
    { id: 'A-GTO-2', year: 2023, location: 'Guanajuato', municipality: 'Irapuato', name: 'Teatro de la Ciudad - Sala de Conciertos', amount: 1100000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-01-10', coordinates: getStateCoordinates('Guanajuato') },
    { id: 'A-GTO-3', year: 2023, location: 'Guanajuato', municipality: 'Leon', name: 'Auditorio Mateo Herrera', amount: 950000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-02-15', coordinates: getStateCoordinates('Guanajuato') },
    
    { id: 'A-CDMX-1', year: 2023, location: 'Ciudad de México', municipality: 'Cuauhtemoc', name: 'Auditorio Nacional (Anexo)', amount: 2500000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-11-20', coordinates: getStateCoordinates('Ciudad de México') },
    { id: 'A-CDMX-2', year: 2023, location: 'Ciudad de México', municipality: 'Coyoacan', name: 'Auditorio Blas Galindo', amount: 1800000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-12-05', coordinates: getStateCoordinates('Ciudad de México') },
    { id: 'A-CDMX-3', year: 2024, location: 'Ciudad de México', municipality: 'Miguel Hidalgo', name: 'Auditorio de la Reforma', amount: 1400000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2024-02-14', coordinates: getStateCoordinates('Ciudad de México') },

    { id: 'A-JAL-1', year: 2023, location: 'Jalisco', municipality: 'Guadalajara', name: 'Auditorio Telmex - Equipamiento', amount: 2100000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-08-12', coordinates: getStateCoordinates('Jalisco') },
    { id: 'A-JAL-2', year: 2023, location: 'Jalisco', municipality: 'Zapopan', name: 'Palacio de la Cultura y la Comunicación', amount: 1650000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-09-01', coordinates: getStateCoordinates('Jalisco') },
    { id: 'A-JAL-3', year: 2024, location: 'Jalisco', municipality: 'Guadalajara', name: 'Teatro Degollado - Modernización Acústica', amount: 1900000, type: 'Auditorio', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2024-01-10', coordinates: getStateCoordinates('Jalisco') },

    // --- MUSEO (Hidalgo, Oaxaca, Yucatán) ---
    { id: 'M-HGO-1', year: 2021, location: 'Hidalgo', municipality: 'Pachuca', name: 'Museo de la Minería de Pachuca', amount: 1200000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-20', coordinates: getStateCoordinates('Hidalgo') },
    { id: 'M-HGO-2', year: 2022, location: 'Hidalgo', municipality: 'Pachuca', name: 'Museo de Fotografía (SINAFO)', amount: 950000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-11-05', coordinates: getStateCoordinates('Hidalgo') },
    { id: 'M-HGO-3', year: 2022, location: 'Hidalgo', municipality: 'Real del Monte', name: 'Museo del Paste', amount: 450000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-12-12', coordinates: getStateCoordinates('Hidalgo') },

    { id: 'M-OAX-1', year: 2023, location: 'Oaxaca', municipality: 'Oaxaca de Juarez', name: 'Museo de los Pintores Oaxaqueños', amount: 1300000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-05-15', coordinates: getStateCoordinates('Oaxaca') },
    { id: 'M-OAX-2', year: 2023, location: 'Oaxaca', municipality: 'Oaxaca de Juarez', name: 'Museo Textil de Oaxaca', amount: 800000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-06-20', coordinates: getStateCoordinates('Oaxaca') },
    { id: 'M-OAX-3', year: 2023, location: 'Oaxaca', municipality: 'San Pablo Etla', name: 'Centro de las Artes de San Agustín', amount: 2200000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-07-10', coordinates: getStateCoordinates('Oaxaca') },

    { id: 'M-YUC-1', year: 2023, location: 'Yucatán', municipality: 'Merida', name: 'Gran Museo del Mundo Maya', amount: 2800000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-10-12', coordinates: getStateCoordinates('Yucatán') },
    { id: 'M-YUC-2', year: 2023, location: 'Yucatán', municipality: 'Merida', name: 'Museo de la Ciudad de Mérida', amount: 1100000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-11-01', coordinates: getStateCoordinates('Yucatán') },
    { id: 'M-YUC-3', year: 2024, location: 'Yucatán', municipality: 'Merida', name: 'Museo Regional de Antropología (Cantón)', amount: 1500000, type: 'Museo', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2024-01-20', coordinates: getStateCoordinates('Yucatán') },

    // --- CENTRO CULTURAL (Jalisco, Michoacán, Veracruz) ---
    { id: 'C-JAL-1', year: 2021, location: 'Jalisco', municipality: 'Puerto Vallarta', name: 'Centro Cultural El Pitillal', amount: 1200000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-30', coordinates: getStateCoordinates('Jalisco') },
    { id: 'C-JAL-2', year: 2022, location: 'Jalisco', municipality: 'Guadalajara', name: 'Centro Cultural Atlas', amount: 1300000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-09-18', coordinates: getStateCoordinates('Jalisco') },
    { id: 'C-JAL-3', year: 2022, location: 'Jalisco', municipality: 'Zapopan', name: 'Centro Cultural Constitución', amount: 1500000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-10-22', coordinates: getStateCoordinates('Jalisco') },

    { id: 'C-MIC-1', year: 2022, location: 'Michoacán', municipality: 'Morelia', name: 'Centro Cultural Clavijero', amount: 1700000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-12-05', coordinates: getStateCoordinates('Michoacán') },
    { id: 'C-MIC-2', year: 2023, location: 'Michoacán', municipality: 'Patzcuaro', name: 'Centro Cultural Antiguo Colegio de San Nicolás', amount: 900000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-04-12', coordinates: getStateCoordinates('Michoacán') },
    { id: 'C-MIC-3', year: 2023, location: 'Michoacán', municipality: 'Morelia', name: 'Casa Natal de Morelos - Espacio Cultural', amount: 1100000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-05-18', coordinates: getStateCoordinates('Michoacán') },

    { id: 'C-VER-1', year: 2023, location: 'Veracruz', municipality: 'Xalapa', name: 'Centro Cultural Atarazanas', amount: 1250000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-08-25', coordinates: getStateCoordinates('Veracruz') },
    { id: 'C-VER-2', year: 2023, location: 'Veracruz', municipality: 'Veracruz', name: 'IVEC Centro Cultural', amount: 1400000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-09-15', coordinates: getStateCoordinates('Veracruz') },
    { id: 'C-VER-3', year: 2024, location: 'Veracruz', municipality: 'Orizaba', name: 'Centro Cultural Poliforum Mier y Pesado', amount: 1600000, type: 'Centro Cultural', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2024-02-10', coordinates: getStateCoordinates('Veracruz') },

    // --- ESCUELA (Quintana Roo, Chiapas, Sonora) ---
    { id: 'E-QRO-1', year: 2021, location: 'Quintana Roo', municipality: 'Cozumel', name: 'Escuela Municipal de Artes', amount: 500179, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-20', coordinates: getStateCoordinates('Quintana Roo') },
    { id: 'E-QRO-2', year: 2022, location: 'Quintana Roo', municipality: 'Cancun', name: 'Escuela de Iniciacion Artistica G3', amount: 600000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-05-15', coordinates: getStateCoordinates('Quintana Roo') },
    { id: 'E-QRO-3', year: 2022, location: 'Quintana Roo', municipality: 'Playa del Carmen', name: 'Escuela de Musica de Playa del Carmen', amount: 750000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2022-08-11', coordinates: getStateCoordinates('Quintana Roo') },

    { id: 'E-CHIS-1', year: 2023, location: 'Chiapas', municipality: 'Tuxtla Gutierrez', name: 'Escuela de Música del Estado de Chiapas', amount: 980000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-04-05', coordinates: getStateCoordinates('Chiapas') },
    { id: 'E-CHIS-2', year: 2023, location: 'Chiapas', municipality: 'San Cristobal', name: 'Escuela de Artes Plásticas de los Altos', amount: 850000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-05-12', coordinates: getStateCoordinates('Chiapas') },
    { id: 'E-CHIS-3', year: 2023, location: 'Chiapas', municipality: 'Comitan', name: 'Escuela de Danza Folklórica Chiapaneca', amount: 700000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-06-18', coordinates: getStateCoordinates('Chiapas') },

    { id: 'E-SON-1', year: 2023, location: 'Sonora', municipality: 'Hermosillo', name: 'Escuela de Artes Escénicas de Sonora', amount: 1100000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-09-20', coordinates: getStateCoordinates('Sonora') },
    { id: 'E-SON-2', year: 2023, location: 'Sonora', municipality: 'Ciudad Obregon', name: 'Centro de Iniciación Artística del Yaqui', amount: 650000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-10-15', coordinates: getStateCoordinates('Sonora') },
    { id: 'E-SON-3', year: 2024, location: 'Sonora', municipality: 'Navojoa', name: 'Escuela de Canto de la Región Mayo', amount: 800000, type: 'Escuela', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2024-02-01', coordinates: getStateCoordinates('Sonora') },

    // --- CASA DE CULTURA (Michoacán, Morelos, Oaxaca) ---
    { id: 'CC-MIC-1', year: 2021, location: 'Michoacán', municipality: 'Charapan', name: 'Casa de Cultura de Charapan', amount: 299889, type: 'Casa de Cultura', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-22', coordinates: getStateCoordinates('Michoacán') },
    { id: 'CC-MOR-1', year: 2021, location: 'Morelos', municipality: 'Coatlan del Rio', name: 'Casa de la Cultura Coatlan', amount: 1200000, type: 'Casa de Cultura', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-20', coordinates: getStateCoordinates('Morelos') },
    { id: 'CC-OAX-1', year: 2021, location: 'Oaxaca', municipality: 'San Andres Cabecera Nueva', name: 'Casa de Cultura Mixteca', amount: 4663200, type: 'Casa de Cultura', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2021-07-22', coordinates: getStateCoordinates('Oaxaca') },

    // --- FARO (Ciudad de México, Hidalgo, Puebla) ---
    { id: 'F-CDMX-1', year: 2022, location: 'Ciudad de México', municipality: 'Iztapalapa', name: 'Fábrica de Artes y Oficios FARO Oriente', amount: 1191413, type: 'FARO', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: 'Completado', actionsInProgress: [], actionsNext: [], lastInspection: '2022-06-13', coordinates: getStateCoordinates('Ciudad de México') },
    { id: 'F-CDMX-2', year: 2023, location: 'Ciudad de México', municipality: 'Tlahuac', name: 'FARO Tláhuac - Espacio de Artes', amount: 1050000, type: 'FARO', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-02-14', coordinates: getStateCoordinates('Ciudad de México') },
    { id: 'F-CDMX-3', year: 2023, location: 'Ciudad de México', municipality: 'Milpa Alta', name: 'FARO Milpa Alta Miacatlán', amount: 950000, type: 'FARO', state: 'Operational', ticketsOpen: 0, visitors: 0, statusSummary: '', actionsInProgress: [], actionsNext: [], lastInspection: '2023-03-21', coordinates: getStateCoordinates('Ciudad de México') }
];

export const KPIS_DATA: KPI[] = [
  { name: 'Beneficiarios Directos', value: 12500, target: 15000, unit: 'personas', trend: 'up' },
  { name: 'Eventos Realizados', value: 340, target: 300, unit: 'eventos', trend: 'up' },
  { name: 'Presupuesto Ejercido', value: 45, target: 50, unit: '%', trend: 'neutral' },
  { name: 'Tickets Resueltos', value: 88, target: 95, unit: '%', trend: 'down' },
];

export const CHART_DATA = [
  { name: 'Ene', ejercido: 4000, programado: 4200, tendencia: 4100 },
  { name: 'Feb', ejercido: 3000, programado: 3200, tendencia: 3100 },
  { name: 'Mar', ejercido: 2000, programado: 2500, tendencia: 2200 },
  { name: 'Abr', ejercido: 2780, programado: 3000, tendencia: 2900 },
  { name: 'May', ejercido: 1890, programado: 2200, tendencia: 2000 },
  { name: 'Jun', ejercido: 2390, programado: 2600, tendencia: 2500 },
  { name: 'Jul', ejercido: 3490, programado: 3600, tendencia: 3550 },
];

export const HERITAGE_SITES: HeritageSite[] = [
  { 
    id: 1, 
    title: "Chichén Itzá", 
    location: "Yucatán", 
    period: "Maya (525 d.C.)", 
    image: "/images/Chichen Itza/600.jpg", 
    gallery: ["/images/Chichen Itza/700.jpg", "/images/Chichen Itza/800.jpg"], 
    description: "Chichén Itzá es uno de los principales sitios arqueológicos de la península de Yucatán, en México. Fue uno de los asentamientos más importantes de la civilización maya y un centro ceremonial de gran relevancia durante el periodo Posclásico. Su nombre significa 'Boca del pozo de los itzaes', haciendo referencia al Cenote Sagrado. \n\nEl sitio es famoso por estructuras como la Pirámide de Kukulcán (El Castillo), reconocida como una de las Siete Maravillas del Mundo Moderno. Durante los equinoccios de primavera y otoño, se puede observar el efecto de luz y sombra que simula el descenso de una serpiente emplumada por las escalinatas de la pirámide. Además del Castillo, destacan el Juego de Pelota más grande de Mesoamérica, el Templo de los Guerreros y el Observatorio astronómico conocido como 'El Caracol'.", 
    coordinates: { top: 65, left: 92 } 
  },
  { 
    id: 2, 
    title: "Centro Histórico CDMX", 
    location: "CDMX", 
    period: "Virreinal", 
    image: "/images/Centro Historico/600.jpg", 
    gallery: ["/images/Centro Historico/800.jpg", "/images/Centro Historico/900.jpg"], 
    description: "El Centro Histórico de la Ciudad de México es el núcleo original alrededor del cual creció la actual capital mexicana. Es un mosaico vivo de historia donde convergen las épocas prehispánica, colonial y moderna. Declarado Patrimonio de la Humanidad por la UNESCO en 1987, alberga tesoros invaluables como el Templo Mayor, vestigio de la antigua Tenochtitlan, y la majestuosa Catedral Metropolitana, una de las obras máximas del arte hispanoamericano. \n\nCaminar por sus calles es recorrer siglos de arquitectura: desde los palacios novohispanos conocidos como la 'Ciudad de los Palacios', hasta edificios porfirianos como el Palacio de Bellas Artes. El Zócalo, o Plaza de la Constitución, es el corazón político y cultural del país, escenario de las celebraciones nacionales más importantes. Este espacio no solo es un catálogo arquitectónico, sino un centro de actividad económica y social vibrante que define la identidad de México.", 
    coordinates: { top: 71, left: 59 } 
  },
  { 
    id: 3, 
    title: "Monte Albán", 
    location: "Oaxaca", 
    period: "Zapoteca", 
    image: "/images/MONTE ALBAN/600.jpg", 
    gallery: ["/images/MONTE ALBAN/800.jpg", "/images/MONTE ALBAN/900.jpg"], 
    description: "Monte Albán fue la antigua capital ceremonial y militar de los zapotecos, establecida alrededor del 500 a.C. sobre un cerro cuya cima fue nivelada artificialmente para albergar una de las plazas más impresionantes de Mesoamérica. Situada en los Valles Centrales de Oaxaca, esta zona arqueológica destaca por su urbanismo avanzado y sus estrechos vínculos con la astronomía y la observación del cielo. \n\nEntre sus edificios principales se encuentran la Gran Plaza, los Edificios J y L (con los famosos relieves de 'Los Danzantes') y las plataformas norte y sur. El sitio también es célebre por su complejo sistema de tumbas, especialmente la Tumba 7, donde se encontró uno de los tesoros de orfebrería más ricos del continente. Como centro de poder durante más de mil años, Monte Albán es un testimonio excepcional de la sofisticación técnica y espiritual de las culturas del México antiguo.", 
    coordinates: { top: 84, left: 66 } 
  },
];
