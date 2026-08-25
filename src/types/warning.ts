import type { RiskLevel, DataSourceMeta } from './risk';

// ---------------------------------------------------------------------------
// Warning lifecycle
// ---------------------------------------------------------------------------

export type WarningSeverity = 'Critical' | 'High' | 'Moderate' | 'Low';
export type WarningStatus = 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved' | 'Expired';

// ---------------------------------------------------------------------------
// Warning
// ---------------------------------------------------------------------------

export interface Warning {
  id: string;
  locationId: string;
  location: string;
  state: string;
  severity: WarningSeverity;
  riskScore: number;
  riskProbability: number;
  trigger: string;
  triggeringFactors?: string[];
  message: string;
  recommendedAction: string;
  timestamp: string;
  expiryTime?: string;
  status: WarningStatus;
  affectedArea: string;
  affectedPopulation: number;
  affectedInfrastructure?: string[];
  issuedBy: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalatedBy?: string;
  escalatedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  responseTeam?: string;
  dataSource: DataSourceMeta;
}

// ---------------------------------------------------------------------------
// Create / update / escalate
// ---------------------------------------------------------------------------

export interface CreateWarningRequest {
  locationId: string;
  severity: WarningSeverity;
  message: string;
  recommendedAction: string;
  affectedArea?: string;
  affectedPopulation?: number;
  responseTeam?: string;
}

export interface UpdateWarningRequest {
  status?: WarningStatus;
  severity?: WarningSeverity;
  recommendedAction?: string;
  responseTeam?: string;
  resolvedBy?: string;
}

export interface EscalateWarningRequest {
  targetSeverity: WarningSeverity;
  escalationReason: string;
  dispatchedTeam?: string;
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

export function severityBadgeClass(severity: WarningSeverity): string {
  switch (severity) {
    case 'Critical': return 'bg-red-500/15 text-red-400 border border-red-500/30';
    case 'High':     return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    case 'Moderate': return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
    case 'Low':      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  }
}

export function severityDotClass(severity: WarningSeverity): string {
  switch (severity) {
    case 'Critical': return 'bg-red-500';
    case 'High':     return 'bg-orange-500';
    case 'Moderate': return 'bg-yellow-500';
    case 'Low':      return 'bg-emerald-500';
  }
}
