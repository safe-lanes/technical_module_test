// Feature configuration for maritime PMS system

export const FEATURES = {
  IHM_MANAGEMENT: true,
  BULK_OPERATIONS: true,
  ADVANCED_REPORTING: true,
} as const;

export const IHM_PRESENCE = ['Yes', 'No', 'Unknown', 'Partial'] as const;

export const IHM_EVIDENCE_TYPES = [
  'None',
  'Certificate',
  'Declaration',
  'Test Report',
  'Visual Inspection',
  'Documentation',
  'Other',
] as const;

export type IHMPresence = (typeof IHM_PRESENCE)[number];
export type IHMEvidenceType = (typeof IHM_EVIDENCE_TYPES)[number];
