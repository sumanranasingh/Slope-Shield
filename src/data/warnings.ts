export interface WarningData {
  id: string;
  locationId: string;
  location: string;
  state: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  riskScore: number;
  trigger: string;
  message: string;
  recommendedAction: string;
  timestamp: string;
  expiryTime: string;
  status: 'Active' | 'Resolved' | 'Expired';
  affectedArea: string;
  affectedPopulation: number;
  issuedBy: string;
}

export const warnings: WarningData[] = [
  {
    id: 'warn-001',
    locationId: 'loc-002',
    location: 'Dibang Valley',
    state: 'Arunachal Pradesh',
    severity: 'Critical',
    riskScore: 91,
    trigger: 'Heavy rainfall + steep slope + historical landslide susceptibility',
    message: 'Extremely high landslide risk detected in Dibang Valley sector. Multiple risk indicators have crossed critical thresholds.',
    recommendedAction: 'Immediate field assessment. Evacuate vulnerable settlements. Pre-position disaster response teams. Close vehicular traffic on affected routes.',
    timestamp: '2026-08-24T14:30:00',
    expiryTime: '2026-08-25T14:30:00',
    status: 'Active',
    affectedArea: '45 sq km',
    affectedPopulation: 12500,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-002',
    locationId: 'loc-004',
    location: 'Cherrapunji Escarpment',
    state: 'Meghalaya',
    severity: 'Critical',
    riskScore: 88,
    trigger: 'Extreme rainfall (320mm/24h) + limestone karst instability',
    message: 'Extreme rainfall exceeding 300mm recorded. Limestone escarpment showing signs of saturation. Risk of large-scale slope failure.',
    recommendedAction: 'Deploy emergency response teams. Issue public advisory for areas below escarpment. Restrict tourist movement. Activate emergency shelters.',
    timestamp: '2026-08-24T13:15:00',
    expiryTime: '2026-08-25T13:15:00',
    status: 'Active',
    affectedArea: '28 sq km',
    affectedPopulation: 8700,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-003',
    locationId: 'loc-011',
    location: 'Noney Corridor',
    state: 'Manipur',
    severity: 'Critical',
    riskScore: 85,
    trigger: 'Very heavy rainfall + steep terrain + active construction zone instability',
    message: 'Critical risk in Noney railway construction corridor. Previous catastrophic event site showing renewed instability patterns.',
    recommendedAction: 'IMMEDIATE ACTION: Evacuate workers from construction zones. Halt railway construction temporarily. Deploy monitoring drones.',
    timestamp: '2026-08-24T12:00:00',
    expiryTime: '2026-08-25T12:00:00',
    status: 'Active',
    affectedArea: '35 sq km',
    affectedPopulation: 5200,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-004',
    locationId: 'loc-001',
    location: 'Tawang Sector',
    state: 'Arunachal Pradesh',
    severity: 'High',
    riskScore: 82,
    trigger: 'Heavy rainfall + steep alpine terrain + historical landslide zone',
    message: 'High risk detected on Sela Pass approach road. Rainfall intensity increasing with more expected in the next 24 hours.',
    recommendedAction: 'Field inspection recommended within 24 hours. Deploy portable rain gauges at identified vulnerable points. Alert local administration.',
    timestamp: '2026-08-24T11:45:00',
    expiryTime: '2026-08-25T11:45:00',
    status: 'Active',
    affectedArea: '22 sq km',
    affectedPopulation: 3800,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-005',
    locationId: 'loc-013',
    location: 'Mawsynram Valley',
    state: 'Meghalaya',
    severity: 'High',
    riskScore: 84,
    trigger: 'Extreme rainfall zone + escarpment instability',
    message: 'Sustained heavy rainfall in the world\'s wettest region. Ground saturation levels approaching critical threshold.',
    recommendedAction: 'Issue village-level alerts. Deploy additional rain gauges. Monitor escarpment stability continuously. Pre-position evacuation resources.',
    timestamp: '2026-08-24T10:30:00',
    expiryTime: '2026-08-25T10:30:00',
    status: 'Active',
    affectedArea: '18 sq km',
    affectedPopulation: 6200,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-006',
    locationId: 'loc-010',
    location: 'Lumding-Badarpur Section',
    state: 'Assam',
    severity: 'High',
    riskScore: 79,
    trigger: 'Heavy rainfall + repeated landslide history on railway corridor',
    message: 'Critical railway infrastructure corridor showing elevated risk. Previous years have seen major disruptions in this section.',
    recommendedAction: 'Coordinate with NF Railway for continuous track monitoring. Deploy rapid response team at Jatinga. Prepare alternative transport arrangements.',
    timestamp: '2026-08-24T09:00:00',
    expiryTime: '2026-08-25T09:00:00',
    status: 'Active',
    affectedArea: '30 sq km',
    affectedPopulation: 15000,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-007',
    locationId: 'loc-019',
    location: 'Lachung Valley',
    state: 'Sikkim',
    severity: 'High',
    riskScore: 77,
    trigger: 'Heavy rainfall + GLOF risk + glacial terrain instability',
    message: 'Elevated risk in glacial valley. Monitoring South Lhonak Lake levels after 2024 GLOF event. Rainfall adding to instability.',
    recommendedAction: 'Monitor glacial lake levels via satellite. Maintain early warning sirens. Coordinate with SDMA. Prepare evacuation routes.',
    timestamp: '2026-08-24T08:30:00',
    expiryTime: '2026-08-25T08:30:00',
    status: 'Active',
    affectedArea: '40 sq km',
    affectedPopulation: 4500,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  // Resolved warnings
  {
    id: 'warn-008',
    locationId: 'loc-003',
    location: 'Haflong Ridge',
    state: 'Assam',
    severity: 'High',
    riskScore: 76,
    trigger: 'Heavy rainfall + railway infrastructure vulnerability',
    message: 'Risk level has decreased following rainfall reduction. Field teams confirm no new slope movements.',
    recommendedAction: 'Continue monitoring. Resume railway operations with speed restrictions.',
    timestamp: '2026-08-22T14:00:00',
    expiryTime: '2026-08-23T14:00:00',
    status: 'Resolved',
    affectedArea: '25 sq km',
    affectedPopulation: 9800,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-009',
    locationId: 'loc-005',
    location: 'Gangtok East',
    state: 'Sikkim',
    severity: 'Moderate',
    riskScore: 65,
    trigger: 'Moderate rainfall + urban hillslope instability',
    message: 'Warning resolved. Rainfall has subsided. No slope movements detected.',
    recommendedAction: 'Resume normal operations. Schedule post-event inspection.',
    timestamp: '2026-08-21T10:00:00',
    expiryTime: '2026-08-22T10:00:00',
    status: 'Resolved',
    affectedArea: '12 sq km',
    affectedPopulation: 22000,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-010',
    locationId: 'loc-012',
    location: 'Bomdila Pass',
    state: 'Arunachal Pradesh',
    severity: 'High',
    riskScore: 78,
    trigger: 'Heavy rainfall + steep road cuts along NH-13',
    message: 'Warning expired. Conditions improved. Road cleared and reopened.',
    recommendedAction: 'Post-event inspection completed. No further action required.',
    timestamp: '2026-08-20T16:00:00',
    expiryTime: '2026-08-21T16:00:00',
    status: 'Resolved',
    affectedArea: '15 sq km',
    affectedPopulation: 2800,
    issuedBy: 'SlopeShield AI (Auto)',
  },
  {
    id: 'warn-011',
    locationId: 'loc-006',
    location: 'Mao Gate',
    state: 'Manipur',
    severity: 'Moderate',
    riskScore: 60,
    trigger: 'Moderate rainfall + road cut vulnerability on NH-2',
    message: 'Warning resolved after rainfall reduction. Road remains open.',
    recommendedAction: 'Continue routine monitoring.',
    timestamp: '2026-08-19T12:00:00',
    expiryTime: '2026-08-20T12:00:00',
    status: 'Resolved',
    affectedArea: '10 sq km',
    affectedPopulation: 4200,
    issuedBy: 'SlopeShield AI (Auto)',
  },
];

export const getActiveWarnings = (): WarningData[] => {
  return warnings.filter(w => w.status === 'Active');
};

export const getResolvedWarnings = (): WarningData[] => {
  return warnings.filter(w => w.status === 'Resolved' || w.status === 'Expired');
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'Critical': return 'bg-red-500';
    case 'High': return 'bg-orange-500';
    case 'Moderate': return 'bg-yellow-500';
    case 'Low': return 'bg-emerald-500';
    default: return 'bg-slate-500';
  }
};

export const getSeverityBadge = (severity: string): string => {
  switch (severity) {
    case 'Critical': return 'bg-red-500/15 text-red-400 border border-red-500/30';
    case 'High': return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    case 'Moderate': return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
    case 'Low': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    default: return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  }
};
