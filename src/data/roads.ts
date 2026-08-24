export interface RoadSegment {
  id: string;
  highwayCode: string;
  name: string;
  state: string;
  startPoint: string;
  endPoint: string;
  lengthKm: number;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  landslideProbability: number; // percentage 0-100
  heavyRainfallForecast: boolean;
  expectedRainfallMm: number;
  nearbyHistoricalEvents: number;
  status: 'Open' | 'Restricted' | 'Closed' | 'Under Inspection';
  recommendedAction: string;
  vulnerablePoints: string[];
  lastInspected: string;
  authority: 'BRO' | 'NHIDCL' | 'State PWD' | 'NHAI' | 'NFR Railway';
  coordinates: [number, number][];
}

export interface HighwayData {
  id: string;
  code: string;
  name: string;
  totalLengthKm: number;
  highRiskSectionsCount: number;
  segments: RoadSegment[];
}

export const highways: HighwayData[] = [
  {
    id: 'hw-01',
    code: 'NH-13',
    name: 'Trans-Arunachal Highway (Tawang - Bomdila - Pasighat)',
    totalLengthKm: 420,
    highRiskSectionsCount: 4,
    segments: [
      {
        id: 'seg-13-1',
        highwayCode: 'NH-13',
        name: 'Sela Pass Approach (Km 42 - 78)',
        state: 'Arunachal Pradesh',
        startPoint: 'Baisakhi (Km 42)',
        endPoint: 'Sela Top (Km 78)',
        lengthKm: 36,
        riskScore: 84,
        riskLevel: 'Critical',
        landslideProbability: 79,
        heavyRainfallForecast: true,
        expectedRainfallMm: 215,
        nearbyHistoricalEvents: 6,
        status: 'Restricted',
        recommendedAction: 'Immediate field inspection. Restrict night vehicular traffic. Deploy bulldozer at Km 54 bottleneck.',
        vulnerablePoints: ['Km 48.2 Rock cut', 'Km 56.4 Culvert area', 'Km 68.1 Sela hairpin bend'],
        lastInspected: '2026-08-24T09:30:00',
        authority: 'BRO',
        coordinates: [
          [27.502, 92.105],
          [27.534, 92.122],
          [27.586, 91.859],
        ],
      },
      {
        id: 'seg-13-2',
        highwayCode: 'NH-13',
        name: 'Bomdila - Rupa Section (Km 92 - 124)',
        state: 'Arunachal Pradesh',
        startPoint: 'Bomdila Town (Km 92)',
        endPoint: 'Rupa Junction (Km 124)',
        lengthKm: 32,
        riskScore: 78,
        riskLevel: 'High',
        landslideProbability: 73,
        heavyRainfallForecast: true,
        expectedRainfallMm: 165,
        nearbyHistoricalEvents: 4,
        status: 'Open',
        recommendedAction: 'Field inspection recommended within 12 hours. Continuous drone surveillance for debris movement.',
        vulnerablePoints: ['Km 104.5 Slope toe', 'Km 118.0 River embankment'],
        lastInspected: '2026-08-23T16:00:00',
        authority: 'BRO',
        coordinates: [
          [27.264, 92.423],
          [27.201, 92.401],
        ],
      },
      {
        id: 'seg-13-3',
        highwayCode: 'NH-13',
        name: 'Dirang River Valley Section (Km 135 - 170)',
        state: 'Arunachal Pradesh',
        startPoint: 'Dirang (Km 135)',
        endPoint: 'Munna Camp (Km 170)',
        lengthKm: 35,
        riskScore: 68,
        riskLevel: 'High',
        landslideProbability: 62,
        heavyRainfallForecast: false,
        expectedRainfallMm: 95,
        nearbyHistoricalEvents: 3,
        status: 'Open',
        recommendedAction: 'Maintain routine patrol. Monitor slope stabilization mesh near Km 152.',
        vulnerablePoints: ['Km 152.3 Wiremesh cliff', 'Km 164.8 Bridge approach'],
        lastInspected: '2026-08-24T11:00:00',
        authority: 'BRO',
        coordinates: [
          [27.356, 92.235],
          [27.398, 92.189],
        ],
      },
    ],
  },
  {
    id: 'hw-02',
    code: 'NH-37',
    name: 'Jiribam - Imphal Highway (Noney Corridor)',
    totalLengthKm: 220,
    highRiskSectionsCount: 3,
    segments: [
      {
        id: 'seg-37-1',
        highwayCode: 'NH-37',
        name: 'Noney Railway Bridge & Highway Stretch (Km 28 - 56)',
        state: 'Manipur',
        startPoint: 'Noney Bridge (Km 28)',
        endPoint: 'Tupul Valley (Km 56)',
        lengthKm: 28,
        riskScore: 89,
        riskLevel: 'Critical',
        landslideProbability: 86,
        heavyRainfallForecast: true,
        expectedRainfallMm: 240,
        nearbyHistoricalEvents: 8,
        status: 'Under Inspection',
        recommendedAction: 'HALT heavy freight. Immediate geotechnical scan of excavated cut slopes. Alert disaster relief teams.',
        vulnerablePoints: ['Km 32.4 Tupul yard slope', 'Km 44.1 Ijai river crossing', 'Km 51.8 Cutting #7'],
        lastInspected: '2026-08-24T13:00:00',
        authority: 'NHIDCL',
        coordinates: [
          [24.795, 93.598],
          [24.812, 93.645],
        ],
      },
      {
        id: 'seg-37-2',
        highwayCode: 'NH-37',
        name: 'Awangkhul - Khongsang Section (Km 60 - 88)',
        state: 'Manipur',
        startPoint: 'Awangkhul (Km 60)',
        endPoint: 'Khongsang (Km 88)',
        lengthKm: 28,
        riskScore: 74,
        riskLevel: 'High',
        landslideProbability: 69,
        heavyRainfallForecast: true,
        expectedRainfallMm: 175,
        nearbyHistoricalEvents: 5,
        status: 'Open',
        recommendedAction: 'Pre-position earthmoving machinery. Restrict single-lane traffic in subsidence sections.',
        vulnerablePoints: ['Km 72.1 Ridge dip', 'Km 81.3 Culvert #12'],
        lastInspected: '2026-08-23T15:30:00',
        authority: 'NHIDCL',
        coordinates: [
          [24.856, 93.689],
          [24.892, 93.742],
        ],
      },
    ],
  },
  {
    id: 'hw-03',
    code: 'NH-40',
    name: 'Guwahati - Shillong - Dawki Corridor',
    totalLengthKm: 165,
    highRiskSectionsCount: 2,
    segments: [
      {
        id: 'seg-40-1',
        highwayCode: 'NH-40',
        name: 'Umiam Lake - Mawlai Escarpment (Km 65 - 84)',
        state: 'Meghalaya',
        startPoint: 'Umiam Overlook (Km 65)',
        endPoint: 'Mawlai Gate (Km 84)',
        lengthKm: 19,
        riskScore: 72,
        riskLevel: 'High',
        landslideProbability: 67,
        heavyRainfallForecast: true,
        expectedRainfallMm: 190,
        nearbyHistoricalEvents: 4,
        status: 'Open',
        recommendedAction: 'Inspect rock-catch nets. Clear blocked drainage chutes before next downpour.',
        vulnerablePoints: ['Km 71.4 Umiam high cut', 'Km 79.2 Mawlai bypass'],
        lastInspected: '2026-08-24T10:15:00',
        authority: 'NHAI',
        coordinates: [
          [25.654, 91.892],
          [25.602, 91.884],
        ],
      },
      {
        id: 'seg-40-2',
        highwayCode: 'NH-40',
        name: 'Shillong - Pynursla - Dawki Section (Km 95 - 132)',
        state: 'Meghalaya',
        startPoint: 'Pynursla Ridge (Km 95)',
        endPoint: 'Dawki Border (Km 132)',
        lengthKm: 37,
        riskScore: 82,
        riskLevel: 'High',
        landslideProbability: 76,
        heavyRainfallForecast: true,
        expectedRainfallMm: 280,
        nearbyHistoricalEvents: 7,
        status: 'Restricted',
        recommendedAction: 'Deploy speed restrictions. Alert SDRF team at Pynursla base.',
        vulnerablePoints: ['Km 108.3 Wah Umngot gorge', 'Km 122.5 Dawki drop'],
        lastInspected: '2026-08-24T08:00:00',
        authority: 'State PWD',
        coordinates: [
          [25.308, 91.905],
          [25.184, 92.012],
        ],
      },
    ],
  },
  {
    id: 'hw-04',
    code: 'NH-10',
    name: 'Siliguri - Sevoke - Gangtok Highway',
    totalLengthKm: 114,
    highRiskSectionsCount: 3,
    segments: [
      {
        id: 'seg-10-1',
        highwayCode: 'NH-10',
        name: 'Birik Dara - 29th Mile Section (Km 24 - 48)',
        state: 'Sikkim',
        startPoint: 'Coronation Bridge (Km 24)',
        endPoint: 'Teesta Bazaar (Km 48)',
        lengthKm: 24,
        riskScore: 87,
        riskLevel: 'Critical',
        landslideProbability: 82,
        heavyRainfallForecast: true,
        expectedRainfallMm: 210,
        nearbyHistoricalEvents: 11,
        status: 'Restricted',
        recommendedAction: 'Single lane convoy only. Continuous river level and debris flow monitoring.',
        vulnerablePoints: ['Km 29.5 Birik Dara slip', 'Km 38.2 Likhuvir rockface'],
        lastInspected: '2026-08-24T12:30:00',
        authority: 'NHIDCL',
        coordinates: [
          [26.885, 88.435],
          [27.054, 88.498],
        ],
      },
      {
        id: 'seg-10-2',
        highwayCode: 'NH-10',
        name: 'Singtam - Ranipool Section (Km 78 - 98)',
        state: 'Sikkim',
        startPoint: 'Singtam (Km 78)',
        endPoint: 'Ranipool (Km 98)',
        lengthKm: 20,
        riskScore: 71,
        riskLevel: 'High',
        landslideProbability: 66,
        heavyRainfallForecast: false,
        expectedRainfallMm: 115,
        nearbyHistoricalEvents: 5,
        status: 'Open',
        recommendedAction: 'Inspect toe protection walls along Teesta tributary.',
        vulnerablePoints: ['Km 86.4 32nd Mile curve', 'Km 93.1 Martam slope'],
        lastInspected: '2026-08-23T17:00:00',
        authority: 'BRO',
        coordinates: [
          [27.234, 88.502],
          [27.298, 88.586],
        ],
      },
    ],
  },
  {
    id: 'hw-05',
    code: 'NFR-LB',
    name: 'Lumding - Badarpur Hill Railway Corridor',
    totalLengthKm: 185,
    highRiskSectionsCount: 4,
    segments: [
      {
        id: 'seg-lb-1',
        highwayCode: 'NFR-LB',
        name: 'Jatinga - Harangajao Section (Km 84 - 118)',
        state: 'Assam',
        startPoint: 'Jatinga Lampu (Km 84)',
        endPoint: 'Harangajao (Km 118)',
        lengthKm: 34,
        riskScore: 91,
        riskLevel: 'Critical',
        landslideProbability: 88,
        heavyRainfallForecast: true,
        expectedRainfallMm: 260,
        nearbyHistoricalEvents: 14,
        status: 'Under Inspection',
        recommendedAction: 'CRITICAL ALERT: Impose 20 km/h speed limit. Keep disaster train stationed at Lumding. Geotech patrol on track 2.',
        vulnerablePoints: ['Km 92.4 New Haflong track cut', 'Km 105.8 Tunnel #7 portal', 'Km 114.2 Jatinga bridge pier'],
        lastInspected: '2026-08-24T14:00:00',
        authority: 'NFR Railway',
        coordinates: [
          [25.132, 93.034],
          [25.048, 92.956],
        ],
      },
    ],
  },
];

export const getAllRoadSegments = (): RoadSegment[] => {
  return highways.flatMap(h => h.segments);
};

export const getSegmentById = (id: string): RoadSegment | undefined => {
  return getAllRoadSegments().find(s => s.id === id);
};
