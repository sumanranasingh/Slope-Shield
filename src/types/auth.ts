/**
 * Authentication & authorization types.
 *
 * The platform supports four roles scoped to an organization.
 * Actual enforcement happens server-side; the frontend uses these
 * types to show/hide UI elements and prepare for future integration.
 */

export type UserRole = 'admin' | 'district_officer' | 'field_officer' | 'analyst';

export interface Organization {
  id: string;
  name: string;
  type: string;          // e.g. "SDMA", "BRO", "NHIDCL", "District Admin"
  region: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: Organization;
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':            return 'Administrator';
    case 'district_officer': return 'District Officer';
    case 'field_officer':    return 'Field Officer';
    case 'analyst':          return 'Analyst';
  }
}

export function canManageWarnings(role: UserRole): boolean {
  return role === 'admin' || role === 'district_officer';
}

export function canManageReports(role: UserRole): boolean {
  return role !== 'analyst';
}
