export enum SignalSource {
  Outlook = 'Outlook',
  Teams = 'Teams',
  GLPI = 'GLPI',
  SharePoint = 'SharePoint',
  System = 'System'
}

export enum Severity {
  P1 = 'P1', // Critical
  P2 = 'P2', // High
  P3 = 'P3', // Moderate
  P4 = 'P4', // Low
  P5 = 'P5'  // Info
}

export enum FocusMode {
  Off = 'Off',
  Normal = 'Normal',
  DeepFocus = 'DeepFocus'
}

export interface Signal {
  id: string;
  source: SignalSource;
  timestamp: string;
  subject: string;
  body: string;
  rawSeverity: string; // The original severity from source
  calculatedSeverity: Severity;
  isRead: boolean;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Suppressed';
  tags: string[];
}

export interface AIAnalysis {
  summary: string;
  rootCauseHypothesis: string;
  recommendedActions: string[];
  itilClassification: 'Incident' | 'Problem' | 'Change' | 'Request' | 'Security';
  confidenceScore: number;
}
