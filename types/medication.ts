// Medication frequency options
export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'as_needed'
  | 'weekly'
  | 'custom';

// Frequency display labels
export const FREQUENCY_LABELS: Record<MedicationFrequency, string> = {
  once_daily: 'Once daily',
  twice_daily: 'Twice daily',
  three_times_daily: '3x daily',
  four_times_daily: '4x daily',
  as_needed: 'As needed',
  weekly: 'Weekly',
  custom: 'Custom',
};

// Structured medication object
export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency: MedicationFrequency;
  times: string[];
  notes?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Extended medication data with structured medications
export interface MedicationDataV2 {
  list: Medication[];
  checked: string[]; // Array of medication IDs that have been taken
}

// Legacy format (for migration)
export interface LegacyMedicationData {
  list: string[];
  checked: string[];
}

// Helper to generate unique IDs
export const generateMedicationId = (): string => {
  return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to create a new medication
export const createMedication = (
  name: string,
  options?: {
    dosage?: string;
    frequency?: MedicationFrequency;
    times?: string[];
    notes?: string;
    isDefault?: boolean;
  }
): Medication => {
  const now = new Date().toISOString();
  return {
    id: generateMedicationId(),
    name,
    dosage: options?.dosage,
    frequency: options?.frequency || 'once_daily',
    times: options?.times || ['8:00 AM'],
    notes: options?.notes,
    isDefault: options?.isDefault || false,
    createdAt: now,
    updatedAt: now,
  };
};

// Helper to convert legacy string to Medication object
export const migrateLegacyMedication = (legacyMed: string): Medication => {
  // Parse format like "Hydroxyurea (8:00 AM)" or "Pain Relief (As needed)"
  const match = legacyMed.match(/^(.+?)\s*\((.+?)\)$/);

  if (match) {
    const name = match[1].trim();
    const timeOrFreq = match[2].trim();

    // Check if it's "As needed"
    if (timeOrFreq.toLowerCase() === 'as needed') {
      return createMedication(name, { frequency: 'as_needed', times: [] });
    }

    // Otherwise treat as a time
    return createMedication(name, { times: [timeOrFreq] });
  }

  // If no match, just use the string as the name
  return createMedication(legacyMed);
};

// Helper to format medication for display
export const formatMedicationDisplay = (med: Medication): string => {
  const parts = [med.name];
  if (med.dosage) {
    parts[0] = `${med.name} ${med.dosage}`;
  }
  return parts[0];
};

// Helper to get subtext (time/frequency)
export const getMedicationSubtext = (med: Medication): string => {
  if (med.frequency === 'as_needed') {
    return 'As needed';
  }
  if (med.times.length > 0) {
    return med.times.join(', ');
  }
  return FREQUENCY_LABELS[med.frequency];
};
