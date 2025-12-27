// Date key format: YYYY-MM-DD
export type DateKey = string;

// Pain entry (1-10 scale)
export interface PainEntry {
  level: number;
  timestamp: string;
  notes?: string;
}

// Hydration entry
export interface HydrationEntry {
  amount: string; // '250ml' | '500ml' | '750ml' | '1L'
  timestamp: string;
  notes?: string;
}

// Medication data
export interface MedicationData {
  list: string[];
  checked: string[];
}

// Mood levels
export type MoodLevel = 'Awful' | 'Not Good' | 'Okay' | 'Good' | 'Great';

export interface MoodEntry {
  level: MoodLevel;
  timestamp: string;
  notes?: string;
}

// Trigger types
export type TriggerType = 'Cold Weather' | 'Dehydration' | 'Stress' | 'High Altitude' | 'Infection' | 'Physical Fatigue';

export interface TriggerEntry {
  triggers: string[];
  timestamp: string;
  notes?: string;
}

// Crisis episode
export interface CrisisEpisode {
  id: string;
  painLevel: number;
  startTime: string;
  triggers: string[];
  notes?: string;
  timestamp: string;
}

// Daily health log - aggregates all entries for a single day
export interface DailyHealthLog {
  date: DateKey;
  pain: PainEntry[];
  hydration: HydrationEntry[];
  medications: MedicationData;
  mood: MoodEntry[];
  triggers: TriggerEntry[];
  crisisEpisodes: CrisisEpisode[];
  notes: string;
  lastUpdated: string;
}

// Computed summary for display
export interface DailyLogSummary {
  avgPain: number | null;
  totalHydration: number;
  hydrationGoal: number;
  medsCount: number;
  medsTaken: number;
  latestMood: MoodLevel | null;
  triggerCount: number;
  crisisCount: number;
}
