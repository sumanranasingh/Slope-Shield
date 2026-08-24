export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  frequency: string;
  lastGenerated: string;
  format: string;
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-risk',
    title: 'Daily Risk Report',
    description: 'Comprehensive daily summary of landslide risk levels across all monitored locations in Northeast India, including weather forecasts and recommended actions.',
    icon: 'FileText',
    frequency: 'Daily',
    lastGenerated: '2026-08-24T06:00:00',
    format: 'PDF',
  },
  {
    id: 'district-risk',
    title: 'District Risk Report',
    description: 'Detailed district-level risk assessment covering terrain analysis, historical events, infrastructure vulnerability, and mitigation recommendations.',
    icon: 'Map',
    frequency: 'Weekly',
    lastGenerated: '2026-08-19T08:00:00',
    format: 'PDF',
  },
  {
    id: 'highway-risk',
    title: 'Highway Risk Report',
    description: 'Risk assessment for national and state highways passing through landslide-prone areas, with section-wise analysis and traffic advisory recommendations.',
    icon: 'Route',
    frequency: 'Weekly',
    lastGenerated: '2026-08-19T08:00:00',
    format: 'PDF',
  },
  {
    id: 'incident-report',
    title: 'Incident Report',
    description: 'Post-event incident documentation including timeline, impact assessment, response actions taken, and lessons learned for future preparedness.',
    icon: 'AlertTriangle',
    frequency: 'On-Demand',
    lastGenerated: '2026-08-15T14:00:00',
    format: 'PDF',
  },
];

export interface MockReport {
  title: string;
  generatedAt: string;
  period: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    data?: { label: string; value: string }[];
  }[];
}

export const generateMockReport = (templateId: string): MockReport => {
  const reports: Record<string, MockReport> = {
    'daily-risk': {
      title: 'Daily Landslide Risk Assessment Report',
      generatedAt: new Date().toISOString(),
      period: 'August 24, 2026 — 06:00 IST to 06:00 IST',
      summary: 'Overall risk levels remain elevated across Northeast India due to continued monsoon rainfall. Three locations have crossed critical thresholds, requiring immediate attention. Seven locations are under active warning status.',
      sections: [
        {
          title: 'Executive Summary',
          content: 'Monsoon activity continues to intensify across Northeast India. The past 24 hours have seen significant rainfall accumulation, particularly in Meghalaya, Arunachal Pradesh, and Manipur. AI models predict elevated risk levels will persist for the next 48–72 hours.',
          data: [
            { label: 'Total Monitored Locations', value: '247' },
            { label: 'High/Critical Risk Locations', value: '18' },
            { label: 'Active Warnings', value: '7' },
            { label: 'New Warnings (24h)', value: '2' },
            { label: 'Resolved Warnings (24h)', value: '1' },
            { label: 'Average Risk Score', value: '62.4 / 100' },
          ],
        },
        {
          title: 'Critical Alerts',
          content: 'Three locations have been flagged as CRITICAL:\n\n1. Dibang Valley, Arunachal Pradesh (Risk Score: 91) — Heavy rainfall combined with steep terrain and historical landslide activity. Immediate field assessment required.\n\n2. Cherrapunji Escarpment, Meghalaya (Risk Score: 88) — Extreme rainfall exceeding 300mm in 24 hours. Limestone karst showing signs of saturation.\n\n3. Noney Corridor, Manipur (Risk Score: 85) — Active construction zone instability. Previous catastrophic event site showing renewed patterns.',
        },
        {
          title: 'Rainfall Analysis',
          content: 'IMD reports active monsoon conditions across the region. Key observations:\n\n• Cherrapunji: 320mm (24h) — Extreme\n• Mawsynram: 298mm (24h) — Extreme\n• Dibang Valley: 245mm (24h) — Very Heavy\n• Noney: 210mm (24h) — Very Heavy\n• Tawang: 187mm (24h) — Heavy\n\nForecasts indicate continued heavy to very heavy rainfall for the next 48 hours, with gradual reduction expected by August 27.',
        },
        {
          title: 'Infrastructure Impact',
          content: 'The following critical infrastructure is at risk:\n\n• NH-13 (Tawang-Bomdila): High risk of blockage near Sela Pass\n• NH-37 (Noney section): Construction zone vulnerability\n• Lumding-Badarpur Railway: History of repeated disruption\n• NH-40 (Guwahati-Shillong): Rockfall risk at Umiam section\n\nBRO and NHIDCL have been alerted for standby maintenance operations.',
        },
        {
          title: 'Recommendations',
          content: '1. Deploy additional monitoring equipment at Dibang Valley and Noney\n2. Issue district-level public advisories for Cherrapunji, Mawsynram areas\n3. Coordinate with NF Railway for Lumding-Badarpur track monitoring\n4. Pre-position disaster response teams in East Khasi Hills\n5. Activate emergency communication channels with district administrations\n6. Schedule aerial reconnaissance for remote high-risk zones',
        },
      ],
    },
    'district-risk': {
      title: 'District-Level Risk Assessment Report',
      generatedAt: new Date().toISOString(),
      period: 'Week of August 18–24, 2026',
      summary: 'Weekly district-level analysis covering 45 districts across 8 Northeast Indian states. 12 districts show elevated risk requiring enhanced monitoring.',
      sections: [
        {
          title: 'District Risk Summary',
          content: 'Assessment covers all landslide-prone districts in the Northeast region.',
          data: [
            { label: 'Districts Assessed', value: '45' },
            { label: 'Critical Risk Districts', value: '3' },
            { label: 'High Risk Districts', value: '9' },
            { label: 'Moderate Risk Districts', value: '18' },
            { label: 'Low Risk Districts', value: '15' },
          ],
        },
        {
          title: 'High Risk Districts',
          content: 'Critical: Dibang Valley (AR), East Khasi Hills (ML), Noney (MN)\nHigh: Tawang (AR), West Kameng (AR), Dima Hasao (AS), Senapati (MN), East Sikkim (SK), North Sikkim (SK), West Sikkim (SK), Ri-Bhoi (ML), Lunglei (MZ)',
        },
      ],
    },
    'highway-risk': {
      title: 'Highway Risk Assessment Report',
      generatedAt: new Date().toISOString(),
      period: 'Week of August 18–24, 2026',
      summary: 'Risk assessment for 12 major highways and 8 national highways in the Northeast region. Three highway sections flagged as high risk for landslide-related disruptions.',
      sections: [
        {
          title: 'Highway Risk Overview',
          content: 'Covers all critical road corridors in the region.',
          data: [
            { label: 'Highways Assessed', value: '20' },
            { label: 'High Risk Sections', value: '8' },
            { label: 'Moderate Risk Sections', value: '15' },
            { label: 'Estimated Vulnerable Length', value: '342 km' },
          ],
        },
        {
          title: 'Critical Highway Sections',
          content: 'The following highway sections require priority attention:\n\n1. NH-13 (Tawang-Bomdila): Km 45-78, Sela Pass area — Risk Score 82\n2. NH-37 (Jiribam-Imphal): Km 20-55, Noney section — Risk Score 85\n3. NH-40 (Guwahati-Shillong): Km 65-82, Umiam section — Risk Score 60',
        },
      ],
    },
    'incident-report': {
      title: 'Incident Report',
      generatedAt: new Date().toISOString(),
      period: 'August 22, 2026 — Dibang Valley Slope Movement',
      summary: 'Documentation of detected slope movement event in Dibang Valley, Arunachal Pradesh. Satellite change detection identified terrain displacement on August 22.',
      sections: [
        {
          title: 'Incident Details',
          content: 'A slope movement event was detected via satellite change detection.',
          data: [
            { label: 'Location', value: 'Dibang Valley, Arunachal Pradesh' },
            { label: 'Detection Time', value: 'August 22, 2026, 14:30 IST' },
            { label: 'Detection Method', value: 'Satellite Change Detection (SAR)' },
            { label: 'Confidence', value: '87%' },
            { label: 'Estimated Area Affected', value: '2.3 hectares' },
            { label: 'Nearest Settlement', value: '4.2 km (Anini approach road)' },
          ],
        },
        {
          title: 'Impact Assessment',
          content: 'Preliminary assessment indicates the slope movement occurred in an uninhabited forested area approximately 4.2 km from the nearest settlement. No immediate threat to life or property. However, continued movement could potentially affect the Anini approach road if the landslide propagates downslope.\n\nField verification team has been dispatched and is expected to reach the site by August 25.',
        },
      ],
    },
  };

  return reports[templateId] || reports['daily-risk'];
};
