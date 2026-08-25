import type { DataSourceMeta } from './risk';

// ---------------------------------------------------------------------------
// Report lifecycle
// ---------------------------------------------------------------------------

export type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'ACTIONED' | 'RESOLVED';
export type ReportCategory =
  | 'landslide'
  | 'rockfall'
  | 'mudslide'
  | 'road_blockage'
  | 'crack_observed'
  | 'water_seepage'
  | 'subsidence'
  | 'other';

export type ReportSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';

// ---------------------------------------------------------------------------
// Citizen / field report
// ---------------------------------------------------------------------------

export interface CitizenReport {
  id: string;
  category: ReportCategory;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  state?: string;
  district?: string;
  photoUrls: string[];
  videoUrls: string[];
  photoCount?: number;
  videoCount?: number;
  timestamp: string;
  reporterName: string;
  reporterPhone?: string;
  reporterRole?: string;
  status: ReportStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  actionTaken?: string;
  resolvedAt?: string;
  aiClassification?: string;   // future CV classification result
  aiConfidence?: number;       // 0–1
  dataSource: DataSourceMeta;
}

// ---------------------------------------------------------------------------
// Create report request
// ---------------------------------------------------------------------------

export interface CreateReportRequest {
  category: ReportCategory;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  reporterName: string;
  reporterPhone?: string;
  // photo/video handled via multipart form
}

// ---------------------------------------------------------------------------
// Report template (existing functionality)
// ---------------------------------------------------------------------------

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  frequency: string;
  lastGenerated: string;
  format: string;
}

export interface GeneratedReport {
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
