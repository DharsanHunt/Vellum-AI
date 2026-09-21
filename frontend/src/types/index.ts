export type Severity = 'AUTHENTIC' | 'EVALUATION' | 'SUSPICIOUS' | 'CRITICAL_FRAUD';

export type Verdict = 'APPROVED' | 'ESCALATED' | 'REJECTED' | 'PENDING';

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  confidence?: number;
}

export interface ExtractedEntity {
  field: string;
  value: string;
  confidence: number;
  status: 'VERIFIED' | 'ACCREDITED' | 'MATCH' | 'SUSPICIOUS' | 'CONFLICT';
  bbox?: BoundingBox;
}

export interface ForensicSignals {
  tamperingProbability: number;
  signatureSimilarity: number;
  stampPresent: boolean;
  stampColor: string;
  ocrConfidence: number;
  issuerMatch: boolean;
  crossDocConsistency: number;
}

export interface VerificationEvidence {
  signalName: string;
  weight: number;
  riskContribution: number;
  description: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export interface Dossier {
  id: string;
  caseNumber: string;
  candidateName: string;
  institution: string;
  degree: string;
  dateOfIssue: string;
  certificateNumber: string;
  registrationNumber: string;
  documentType: string;
  imageUrl: string;
  resolution: string;
  sha256: string;
  riskScore: number;
  verdictLabel: Severity;
  criticalAnomalies: string[];
  entities: ExtractedEntity[];
  signals: ForensicSignals;
  evidenceList: VerificationEvidence[];
  suspiciousBboxes: BoundingBox[];
  ocrBboxes: BoundingBox[];
  sealBbox?: BoundingBox;
  status: Verdict;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewTimestamp?: string;
  reasonCode?: string;
}

export interface AuditBlock {
  blockId: string;
  eventType: string;
  timestamp: string;
  actor: string;
  details: string;
  prevHash: string;
  currHash: string;
  status: 'VALID' | 'TAMPERED';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admissions Reviewer' | 'Senior Fraud Investigator' | 'Platform Admin' | 'Compliance Auditor';
  department: string;
  avatar: string;
}
