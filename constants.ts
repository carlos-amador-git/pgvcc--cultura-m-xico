import { Asset, KPI, Semillero, HeritageSite } from './types';

export const HERO_IMAGES = [
  "https://picsum.photos/id/1015/1600/900", // Landscapes
  "https://picsum.photos/id/1047/1600/900", // Urban
  "https://picsum.photos/id/1016/1600/900", // Nature
];

export const SEMILLEROS_DATA: Semillero[] = [
  { id: '1', name: 'Semillero de Artes Vivas', discipline: 'Teatro y Danza', location: 'Oaxaca, Oax.', participants: 45, image: 'https://picsum.photos/id/1005/400/300', status: 'active', coordinates: { top: 76, left: 66 } },
  { id: '2', name: 'Orquesta Comunitaria', discipline: 'Música', location: 'Tlalnepantla, Edo. Méx', participants: 120, image: 'https://picsum.photos/id/1082/400/300', status: 'active', coordinates: { top: 70, left: 59 } },
  { id: '3', name: 'Taller de Gráfica', discipline: 'Artes Visuales', location: 'Morelia, Mich.', participants: 30, image: 'https://picsum.photos/id/1025/400/300', status: 'active', coordinates: { top: 71, left: 53 } },
  { id: '4', name: 'Voces de la Sierra', discipline: 'Lenguas Indígenas', location: 'Chiapas', participants: 25, image: 'https://picsum.photos/id/1011/400/300', status: 'active', coordinates: { top: 70, left: 69 } },
  { id: '5', name: 'Circo Social del Sur', discipline: 'Artes Escénicas', location: 'Guerrero', participants: 60, image: 'https://picsum.photos/id/158/400/300', status: 'active', coordinates: { top: 78, left: 60 } },
  // New Semilleros
  { id: '6', name: 'Coro Comunitario', discipline: 'Música', location: 'Veracruz, Ver.', participants: 85, image: 'https://picsum.photos/id/1020/400/300', status: 'active', coordinates: { top: 68, left: 66 } },
  { id: '7', name: 'Fotografía Documental', discipline: 'Artes Visuales', location: 'Tijuana, BC', participants: 20, image: 'https://picsum.photos/id/1021/400/300', status: 'active', coordinates: { top: 16, left: 16 } },
  { id: '8', name: 'Teatro de Títeres', discipline: 'Teatro', location: 'Tlaxcala', participants: 35, image: 'https://picsum.photos/id/1022/400/300', status: 'active', coordinates: { top: 71, left: 62 } },
  { id: '9', name: 'Danza Folklórica', discipline: 'Danza', location: 'Jalisco', participants: 50, image: 'https://picsum.photos/id/1023/400/300', status: 'active', coordinates: { top: 65, left: 48 } },
  { id: '10', name: 'Cine Comunitario', discipline: 'Cine', location: 'Sonora', participants: 15, image: 'https://picsum.photos/id/1024/400/300', status: 'active', coordinates: { top: 28, left: 28 } },
  { id: '11', name: 'Escritura Creativa', discipline: 'Literatura', location: 'Nuevo León', participants: 40, image: 'https://picsum.photos/id/1026/400/300', status: 'active', coordinates: { top: 35, left: 55 } },
  { id: '12', name: 'Banda de Viento', discipline: 'Música', location: 'Oaxaca, Oax.', participants: 60, image: 'https://picsum.photos/id/1027/400/300', status: 'active', coordinates: { top: 78, left: 67 } },
  { id: '13', name: 'Telar de Cintura', discipline: 'Textiles', location: 'Chiapas', participants: 28, image: 'https://picsum.photos/id/1028/400/300', status: 'active', coordinates: { top: 72, left: 70 } },
];

export const ASSETS_DATA: Asset[] = [
  { 
    id: 'A1', 
    name: 'Palacio de Bellas Artes', 
    type: 'Theater', 
    state: 'Operational', 
    ticketsOpen: 2, 
    visitors: 45200,
    statusSummary: 'Operación normal con alta afluencia por temporada de ópera. Mantenimiento rutinario en áreas comunes sin afectación al público.',
    actionsInProgress: ['Mantenimiento preventivo de telón principal', 'Limpieza profunda de fachada'],
    actionsNext: ['Auditoría de seguridad estructural', 'Renovación de iluminación en vestíbulo'],
    lastInspection: '2025-04-15', 
    location: 'Ciudad de México',
    coordinates: { top: 72, left: 59.5 } 
  },
  { 
    id: 'A2', 
    name: 'Museo Nacional de Antropología', 
    type: 'Museum', 
    state: 'Maintenance Required', 
    ticketsOpen: 5, 
    visitors: 82150,
    statusSummary: 'Se requiere intervención en el sistema de climatización de la Sala Maya. El resto del recinto opera con normalidad.',
    actionsInProgress: ['Reparación de ductos en Sala 4', 'Control y monitoreo de humedad relativa'],
    actionsNext: ['Sustitución de filtros HEPA', 'Calibración de sensores ambientales'],
    lastInspection: '2025-04-10', 
    location: 'Ciudad de México',
    coordinates: { top: 72.2, left: 59.2 } 
  },
  { 
    id: 'A3', 
    name: 'Biblioteca Vasconcelos', 
    type: 'Library', 
    state: 'Operational', 
    ticketsOpen: 0, 
    visitors: 38400,
    statusSummary: 'Infraestructura en óptimas condiciones. Todos los servicios bibliotecarios y digitales funcionan al 100%.',
    actionsInProgress: ['Actualización de catálogo digital', 'Inventario trimestral de acervo'],
    actionsNext: ['Ampliación de ancho de banda', 'Mantenimiento de jardines colgantes'],
    lastInspection: '2025-05-01', 
    location: 'Ciudad de México',
    coordinates: { top: 71.8, left: 59.3 } 
  },
  { 
    id: 'A4', 
    name: 'Centro Cultural Helénico', 
    type: 'Center', 
    state: 'Critical', 
    ticketsOpen: 8, 
    visitors: 12300,
    statusSummary: 'Falla crítica en suministro eléctrico del foro principal. Actividades suspendidas temporalmente en esa área.',
    actionsInProgress: ['Diagnóstico de subestación eléctrica', 'Instalación de planta de emergencia temporal'],
    actionsNext: ['Reemplazo de cableado principal', 'Certificación de seguridad eléctrica'],
    lastInspection: '2025-04-20', 
    location: 'Ciudad de México',
    coordinates: { top: 73, left: 59 } 
  },
  { 
    id: 'A5', 
    name: 'Museo de Arte Moderno', 
    type: 'Museum', 
    state: 'Operational', 
    ticketsOpen: 1, 
    visitors: 18900,
    statusSummary: 'Operativo. Incidencia menor reportada en sanitarios planta baja, atención en proceso.',
    actionsInProgress: ['Reparación de fontanería menor'],
    actionsNext: ['Pintura en áreas de exposición temporal', 'Cambio de señalética desgastada'],
    lastInspection: '2025-04-28', 
    location: 'Ciudad de México',
    coordinates: { top: 72.1, left: 59.1 } 
  },
  { 
    id: 'A6', 
    name: 'Teatro Degollado', 
    type: 'Theater', 
    state: 'Operational', 
    ticketsOpen: 1, 
    visitors: 9500,
    statusSummary: 'Funcionamiento adecuado. Preparativos en curso para el festival de danza regional.',
    actionsInProgress: ['Afinación de piano de concierto', 'Ajuste de tramoya'],
    actionsNext: ['Limpieza de candil principal', 'Fumigación programada'],
    lastInspection: '2025-04-25', 
    location: 'Guadalajara, Jalisco',
    coordinates: { top: 66, left: 48 } 
  },
  { 
    id: 'A7', 
    name: 'Cabañas Cultural Institute', 
    type: 'Center', 
    state: 'Operational', 
    ticketsOpen: 0, 
    visitors: 15600,
    statusSummary: 'Patrimonio en excelente estado de conservación. Murales de Orozco sin novedades.',
    actionsInProgress: ['Limpieza de patios', 'Revisión de iluminación arquitectónica'],
    actionsNext: ['Mantenimiento de cubiertas', 'Actualización de guías de audio'],
    lastInspection: '2025-05-02', 
    location: 'Guadalajara, Jalisco',
    coordinates: { top: 66.2, left: 48.2 } 
  },
  { 
    id: 'A8', 
    name: 'Museo Arocena', 
    type: 'Museum', 
    state: 'Maintenance Required', 
    ticketsOpen: 3, 
    visitors: 5400,
    statusSummary: 'Filtraciones detectadas en bodega de tránsito. Acervo resguardado, reparación en curso.',
    actionsInProgress: ['Impermeabilización focalizada', 'Evaluación de daños en acabados'],
    actionsNext: ['Impermeabilización general de azotea', 'Revisión de protocolos de lluvia'],
    lastInspection: '2025-04-18', 
    location: 'Torreón, Coahuila',
    coordinates: { top: 40, left: 48 } 
  },
  { 
    id: 'A9', 
    name: 'Centro Cultural Tijuana', 
    type: 'Center', 
    state: 'Operational', 
    ticketsOpen: 2, 
    visitors: 28100,
    statusSummary: 'El Domo IMAX opera con normalidad. Mantenimiento menor en explanada.',
    actionsInProgress: ['Reparación de losetas en explanada'],
    actionsNext: ['Mantenimiento preventivo de proyector', 'Poda de áreas verdes'],
    lastInspection: '2025-04-30', 
    location: 'Tijuana, BC',
    coordinates: { top: 16, left: 16 } 
  },
  { 
    id: 'A10', 
    name: 'Museo Amparo', 
    type: 'Museum', 
    state: 'Operational', 
    ticketsOpen: 0, 
    visitors: 11200,
    statusSummary: 'Instalaciones operando al 100%. Terraza abierta al público sin restricciones.',
    actionsInProgress: ['Monitoreo de vitrinas'],
    actionsNext: ['Mantenimiento de elevadores', 'Limpieza de cristales de fachada'],
    lastInspection: '2025-05-01', 
    location: 'Puebla, Puebla',
    coordinates: { top: 74, left: 61 } 
  },
  { 
    id: 'A11', 
    name: 'Teatro de la Paz', 
    type: 'Theater', 
    state: 'Critical', 
    ticketsOpen: 5, 
    visitors: 3200,
    statusSummary: 'Daño estructural en balcón derecho. Acceso restringido a esa zona por precaución.',
    actionsInProgress: ['Apuntalamiento preventivo', 'Estudio de mecánica de suelos'],
    actionsNext: ['Proyecto ejecutivo de reforzamiento', 'Solicitud de recursos extraordinarios'],
    lastInspection: '2025-04-12', 
    location: 'San Luis Potosí, SLP',
    coordinates: { top: 58, left: 53 } 
  },
  { 
    id: 'A12', 
    name: 'Biblioteca Palafoxiana', 
    type: 'Library', 
    state: 'Operational', 
    ticketsOpen: 1, 
    visitors: 8900,
    statusSummary: 'Conservación estable. Control estricto de temperatura y humedad funcionando.',
    actionsInProgress: ['Restauración de mobiliario siglo XVIII (programada)'],
    actionsNext: ['Fumigación especializada en madera', 'Digitalización de incunables'],
    lastInspection: '2025-04-29', 
    location: 'Puebla, Puebla',
    coordinates: { top: 74.2, left: 61.2 } 
  },
];

export const KPIS_DATA: KPI[] = [
  { name: 'Beneficiarios Directos', value: 12500, target: 15000, unit: 'personas', trend: 'up' },
  { name: 'Eventos Realizados', value: 340, target: 300, unit: 'eventos', trend: 'up' },
  { name: 'Presupuesto Ejercido', value: 45, target: 50, unit: '%', trend: 'neutral' },
  { name: 'Tickets Resueltos', value: 88, target: 95, unit: '%', trend: 'down' },
];

export const CHART_DATA = [
  { name: 'Ene', asistencia: 4000, eventos: 240 },
  { name: 'Feb', asistencia: 3000, eventos: 139 },
  { name: 'Mar', asistencia: 2000, eventos: 980 },
  { name: 'Abr', asistencia: 2780, eventos: 390 },
  { name: 'May', asistencia: 1890, eventos: 480 },
  { name: 'Jun', asistencia: 2390, eventos: 380 },
  { name: 'Jul', asistencia: 3490, eventos: 430 },
];

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 1,
    title: "Chichén Itzá",
    location: "Yucatán",
    period: "Maya (525 d.C.)",
    image: "https://picsum.photos/id/1036/800/600",
    gallery: [
      "https://picsum.photos/id/1036/1200/800",
      "https://picsum.photos/id/1040/1200/800",
      "https://picsum.photos/id/1039/1200/800",
      "https://picsum.photos/id/1038/1200/800"
    ],
    description: "Ciudad sagrada y uno de los principales sitios arqueológicos de la península de Yucatán.",
    coordinates: { top: 56, left: 76 }
  },
  {
    id: 2,
    title: "Centro Histórico de México",
    location: "Ciudad de México",
    period: "Virreinal",
    image: "https://picsum.photos/id/1040/800/600",
    gallery: [
      "https://picsum.photos/id/1040/1200/800",
      "https://picsum.photos/id/1035/1200/800",
      "https://picsum.photos/id/1033/1200/800",
      "https://picsum.photos/id/1031/1200/800"
    ],
    description: "El corazón de la capital, donde conviven el Templo Mayor y la arquitectura colonial.",
    coordinates: { top: 72, left: 59 }
  },
  {
    id: 3,
    title: "Monte Albán",
    location: "Oaxaca",
    period: "Zapoteca",
    image: "https://picsum.photos/id/1047/800/600",
    gallery: [
      "https://picsum.photos/id/1047/1200/800",
      "https://picsum.photos/id/1044/1200/800",
      "https://picsum.photos/id/1043/1200/800",
      "https://picsum.photos/id/1042/1200/800"
    ],
    description: "Antigua capital de los zapotecos, situada sobre un cerro aplanado en los Valles Centrales.",
    coordinates: { top: 77, left: 66 }
  },
  {
    id: 4,
    title: "Tajín",
    location: "Veracruz",
    period: "Totonaca",
    image: "https://picsum.photos/id/1015/800/600",
    gallery: [
      "https://picsum.photos/id/1015/1200/800",
      "https://picsum.photos/id/1016/1200/800",
      "https://picsum.photos/id/1018/1200/800",
      "https://picsum.photos/id/1019/1200/800"
    ],
    description: "La ciudad del trueno, famosa por la Pirámide de los Nichos.",
    coordinates: { top: 58, left: 64 }
  },
  {
    id: 5,
    title: "Paquimé",
    location: "Chihuahua",
    period: "Mogollón",
    image: "https://picsum.photos/id/1043/800/600",
    gallery: [
      "https://picsum.photos/id/1043/1200/800",
      "https://picsum.photos/id/1044/1200/800"
    ],
    description: "Zona arqueológica de la Cultura de Paquimé, famosa por sus construcciones de adobe y su sistema hidráulico.",
    coordinates: { top: 22, left: 34 }
  },
  {
    id: 6,
    title: "Tulum",
    location: "Quintana Roo",
    period: "Maya (1200 d.C.)",
    image: "https://picsum.photos/id/1039/800/600",
    gallery: [
      "https://picsum.photos/id/1039/1200/800",
      "https://picsum.photos/id/1040/1200/800"
    ],
    description: "Muralla frente al mar Caribe, fue un importante puerto comercial maya.",
    coordinates: { top: 58, left: 78 }
  },
  {
    id: 7,
    title: "Teotihuacán",
    location: "Estado de México",
    period: "Clásico",
    image: "https://picsum.photos/id/1038/800/600",
    gallery: [
      "https://picsum.photos/id/1038/1200/800",
      "https://picsum.photos/id/1035/1200/800"
    ],
    description: "La ciudad de los dioses, una de las mayores urbes de Mesoamérica.",
    coordinates: { top: 71, left: 60 }
  },
  {
    id: 8,
    title: "Calakmul",
    location: "Campeche",
    period: "Maya",
    image: "https://picsum.photos/id/1048/800/600",
    gallery: ["https://picsum.photos/id/1048/1200/800"],
    description: "Antigua ciudad maya ubicada en la reserva de la biósfera.",
    coordinates: { top: 67, left: 74 }
  },
  {
    id: 9,
    title: "Palenque",
    location: "Chiapas",
    period: "Maya",
    image: "https://picsum.photos/id/1050/800/600",
    gallery: ["https://picsum.photos/id/1050/1200/800"],
    description: "Destacada por su acervo arquitectónico y escultórico.",
    coordinates: { top: 69, left: 69 }
  },
  {
    id: 10,
    title: "Uxmal",
    location: "Yucatán",
    period: "Maya",
    image: "https://picsum.photos/id/1051/800/600",
    gallery: ["https://picsum.photos/id/1051/1200/800"],
    description: "Uno de los más importantes yacimientos arqueológicos de la cultura maya.",
    coordinates: { top: 57, left: 75 }
  }
];