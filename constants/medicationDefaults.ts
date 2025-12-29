import { Medication, createMedication } from '../types/medication';

// Sickle cell type definitions (matches onboarding options)
export type SickleCellType =
  | 'hbss'
  | 'hbsc'
  | 'hbs-beta-plus'
  | 'hbs-beta-zero'
  | string; // Allow custom types

// Severity categories
export type SeverityCategory = 'severe' | 'moderate' | 'mild';

// Get severity category for a sickle cell type
export const getSeverityForType = (type: SickleCellType): SeverityCategory => {
  switch (type) {
    case 'hbss':
    case 'hbs-beta-zero':
      return 'severe';
    case 'hbsc':
    case 'hbs-beta-plus':
      return 'moderate';
    default:
      return 'mild'; // Custom types default to mild
  }
};

// Default medications by severity
const SEVERE_MEDICATIONS: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Hydroxyurea',
    dosage: '500mg',
    frequency: 'once_daily',
    times: ['8:00 AM'],
    notes: 'Take with water. Reduces frequency of pain crises.',
    isDefault: true,
  },
  {
    name: 'Folic Acid',
    dosage: '1mg',
    frequency: 'once_daily',
    times: ['8:00 AM'],
    notes: 'Supports red blood cell production.',
    isDefault: true,
  },
  {
    name: 'Penicillin VK',
    dosage: '250mg',
    frequency: 'twice_daily',
    times: ['8:00 AM', '8:00 PM'],
    notes: 'Prevents infections. Essential for sickle cell patients.',
    isDefault: true,
  },
  {
    name: 'Pain Relief',
    frequency: 'as_needed',
    times: [],
    notes: 'For breakthrough pain. Consult doctor for severe episodes.',
    isDefault: true,
  },
];

const MODERATE_MEDICATIONS: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Folic Acid',
    dosage: '1mg',
    frequency: 'once_daily',
    times: ['8:00 AM'],
    notes: 'Supports red blood cell production.',
    isDefault: true,
  },
  {
    name: 'Pain Relief',
    frequency: 'as_needed',
    times: [],
    notes: 'For breakthrough pain. Consult doctor for severe episodes.',
    isDefault: true,
  },
];

// Get default medications for sickle cell types
export const getDefaultMedicationsForTypes = (types: SickleCellType[]): Medication[] => {
  // Determine the highest severity among selected types
  let highestSeverity: SeverityCategory = 'mild';

  for (const type of types) {
    const severity = getSeverityForType(type);
    if (severity === 'severe') {
      highestSeverity = 'severe';
      break;
    }
    if (severity === 'moderate' && highestSeverity === 'mild') {
      highestSeverity = 'moderate';
    }
  }

  // Get medications based on severity
  let medicationTemplates: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>[];

  switch (highestSeverity) {
    case 'severe':
      medicationTemplates = SEVERE_MEDICATIONS;
      break;
    case 'moderate':
      medicationTemplates = MODERATE_MEDICATIONS;
      break;
    default:
      medicationTemplates = MODERATE_MEDICATIONS; // Default to moderate for safety
  }

  // Convert templates to full Medication objects
  return medicationTemplates.map((template) =>
    createMedication(template.name, {
      dosage: template.dosage,
      frequency: template.frequency,
      times: template.times,
      notes: template.notes,
      isDefault: true,
    })
  );
};

// Sickle cell type display labels
export const SICKLE_CELL_TYPE_LABELS: Record<string, string> = {
  hbss: 'HbSS (Sickle Cell Anemia)',
  hbsc: 'HbSC Disease',
  'hbs-beta-plus': 'HbS Beta+ Thalassemia',
  'hbs-beta-zero': 'HbS Beta0 Thalassemia',
};
