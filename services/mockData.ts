import { Signal, SignalSource, Severity } from '../types';

export const MOCK_SIGNALS: Signal[] = [
  {
    id: 'sig-001',
    source: SignalSource.GLPI,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    subject: '[Ticket #9822] CRITICAL: DB-PROD-01 High Latency',
    body: 'Alert from Nagios: 98% CPU usage on DB-PROD-01 for > 5 minutes. Application response time degradation detected.',
    rawSeverity: 'High',
    calculatedSeverity: Severity.P1,
    isRead: false,
    status: 'Open',
    tags: ['Database', 'Production', 'Latency']
  },
  {
    id: 'sig-002',
    source: SignalSource.Teams,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    subject: 'Chat in #sre-warroom',
    body: 'User reports 500 errors on the payment gateway. Can someone check the load balancer logs?',
    rawSeverity: 'Unknown',
    calculatedSeverity: Severity.P2,
    isRead: false,
    status: 'Open',
    tags: ['Payment', 'User Report']
  },
  {
    id: 'sig-003',
    source: SignalSource.Outlook,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    subject: 'Planned Maintenance: Network Switch Upgrade',
    body: 'Reminder: The core switch upgrade is scheduled for tonight at 02:00 UTC. No impact expected for HA clusters.',
    rawSeverity: 'Info',
    calculatedSeverity: Severity.P4,
    isRead: true,
    status: 'Suppressed',
    tags: ['Maintenance', 'Network']
  },
  {
    id: 'sig-004',
    source: SignalSource.SharePoint,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    subject: 'Change Request Approved: CR-2024-001',
    body: 'The change request to update the frontend CDN config has been approved by CAB.',
    rawSeverity: 'Info',
    calculatedSeverity: Severity.P5,
    isRead: true,
    status: 'Resolved',
    tags: ['Change Management']
  },
  {
    id: 'sig-005',
    source: SignalSource.Teams,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    subject: 'Security Alert: Multiple Failed Logins',
    body: 'SIEM Alert: 50+ failed login attempts detected from IP 192.168.1.105 targeting Service Account svc_backup.',
    rawSeverity: 'Critical',
    calculatedSeverity: Severity.P1,
    isRead: false,
    status: 'Open',
    tags: ['Security', 'Auth']
  }
];

export const MOCK_ANALYSIS_RESPONSE = {
  summary: "High CPU utilization on production database server indicating potential resource exhaustion or runaway query.",
  rootCauseHypothesis: "Likely caused by unoptimized query introduced in recent deployment or backup process stuck in loop.",
  recommendedActions: [
    "Check active queries on DB-PROD-01 using pg_stat_activity or equivalent.",
    "Verify if any backup jobs are currently running outside maintenance window.",
    "Scale up read replicas if load is read-heavy (Auto-remediation available)."
  ],
  itilClassification: "Incident",
  confidenceScore: 0.92
};
