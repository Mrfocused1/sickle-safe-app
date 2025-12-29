import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyHealthLog, DailyLogSummary, DateKey, MoodLevel } from '../types/healthLog';
import {
  Medication,
  migrateLegacyMedication,
  createMedication,
} from '../types/medication';
import { getDefaultMedicationsForTypes, SickleCellType } from '../constants/medicationDefaults';

const STORAGE_KEY_PREFIX = '@sickle_safe_health_log_';
const MEDICATIONS_DEFAULT_KEY = '@sickle_safe_default_medications';
const MEDICATIONS_V2_KEY = '@sickle_safe_default_medications_v2';

// Utility to format Date to YYYY-MM-DD
export const formatDateKey = (date: Date): DateKey => {
  return date.toISOString().split('T')[0];
};

// Parse hydration amount to ml
const parseHydrationToMl = (amount: string): number => {
  const map: Record<string, number> = {
    '250ml': 250,
    '500ml': 500,
    '750ml': 750,
    '1L': 1000,
  };
  return map[amount] || 0;
};

// Create empty daily log
const createEmptyDailyLog = (date: DateKey): DailyHealthLog => ({
  date,
  pain: [],
  hydration: [],
  medications: { list: [], checked: [] },
  mood: [],
  triggers: [],
  crisisEpisodes: [],
  notes: '',
  lastUpdated: new Date().toISOString(),
});

export const healthLogStorage = {
  /**
   * Get daily log for a specific date
   */
  async getDailyLog(date: Date): Promise<DailyHealthLog> {
    try {
      const key = `${STORAGE_KEY_PREFIX}${formatDateKey(date)}`;
      const data = await AsyncStorage.getItem(key);

      if (data) {
        return JSON.parse(data);
      }

      // Return empty log with default medications
      const emptyLog = createEmptyDailyLog(formatDateKey(date));
      const defaultMeds = await this.getDefaultMedications();
      emptyLog.medications.list = defaultMeds;

      return emptyLog;
    } catch (error) {
      console.error('Error loading daily log:', error);
      return createEmptyDailyLog(formatDateKey(date));
    }
  },

  /**
   * Save daily log for a specific date
   */
  async saveDailyLog(log: DailyHealthLog): Promise<void> {
    try {
      const key = `${STORAGE_KEY_PREFIX}${log.date}`;
      log.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem(key, JSON.stringify(log));
    } catch (error) {
      console.error('Error saving daily log:', error);
      throw error;
    }
  },

  /**
   * Get default medications list (persists across days)
   */
  async getDefaultMedications(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(MEDICATIONS_DEFAULT_KEY);
      return data
        ? JSON.parse(data)
        : ['Hydroxyurea (8:00 AM)', 'Folic Acid (8:00 AM)', 'Pain Relief (As needed)'];
    } catch {
      return ['Hydroxyurea (8:00 AM)', 'Folic Acid (8:00 AM)', 'Pain Relief (As needed)'];
    }
  },

  /**
   * Save default medications list (legacy string format)
   */
  async saveDefaultMedications(meds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MEDICATIONS_DEFAULT_KEY, JSON.stringify(meds));
    } catch (error) {
      console.error('Error saving default medications:', error);
    }
  },

  /**
   * Get default medications as structured objects (V2)
   */
  async getDefaultMedicationsV2(): Promise<Medication[]> {
    try {
      // First try to get V2 format
      const v2Data = await AsyncStorage.getItem(MEDICATIONS_V2_KEY);
      if (v2Data) {
        return JSON.parse(v2Data);
      }

      // Fall back to legacy format and migrate
      const legacyData = await AsyncStorage.getItem(MEDICATIONS_DEFAULT_KEY);
      if (legacyData) {
        const legacyMeds: string[] = JSON.parse(legacyData);
        const migratedMeds = legacyMeds.map(migrateLegacyMedication);
        // Save migrated data to V2 key
        await this.saveDefaultMedicationsV2(migratedMeds);
        return migratedMeds;
      }

      // Return default medications
      const defaults: Medication[] = [
        createMedication('Hydroxyurea', { times: ['8:00 AM'] }),
        createMedication('Folic Acid', { times: ['8:00 AM'] }),
        createMedication('Pain Relief', { frequency: 'as_needed', times: [] }),
      ];
      return defaults;
    } catch (error) {
      console.error('Error getting default medications V2:', error);
      return [];
    }
  },

  /**
   * Save default medications as structured objects (V2)
   */
  async saveDefaultMedicationsV2(meds: Medication[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MEDICATIONS_V2_KEY, JSON.stringify(meds));
    } catch (error) {
      console.error('Error saving default medications V2:', error);
    }
  },

  /**
   * Initialize medications based on sickle cell type from onboarding
   */
  async initializeMedicationsForSickleCellType(types: SickleCellType[]): Promise<Medication[]> {
    try {
      // Get default medications based on sickle cell types
      const medications = getDefaultMedicationsForTypes(types);

      // Save to V2 storage
      await this.saveDefaultMedicationsV2(medications);

      // Also save legacy format for backward compatibility
      const legacyFormat = medications.map((med) => {
        if (med.frequency === 'as_needed') {
          return `${med.name} (As needed)`;
        }
        return `${med.name} (${med.times[0] || '8:00 AM'})`;
      });
      await this.saveDefaultMedications(legacyFormat);

      return medications;
    } catch (error) {
      console.error('Error initializing medications:', error);
      return [];
    }
  },

  /**
   * Add a new medication to defaults
   */
  async addMedication(med: Medication): Promise<void> {
    try {
      const currentMeds = await this.getDefaultMedicationsV2();
      currentMeds.push(med);
      await this.saveDefaultMedicationsV2(currentMeds);

      // Update legacy format
      const legacyMeds = await this.getDefaultMedications();
      const legacyFormat =
        med.frequency === 'as_needed'
          ? `${med.name} (As needed)`
          : `${med.name} (${med.times[0] || '8:00 AM'})`;
      legacyMeds.push(legacyFormat);
      await this.saveDefaultMedications(legacyMeds);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  },

  /**
   * Update an existing medication
   */
  async updateMedication(updatedMed: Medication): Promise<void> {
    try {
      const currentMeds = await this.getDefaultMedicationsV2();
      const index = currentMeds.findIndex((m) => m.id === updatedMed.id);
      if (index !== -1) {
        updatedMed.updatedAt = new Date().toISOString();
        currentMeds[index] = updatedMed;
        await this.saveDefaultMedicationsV2(currentMeds);

        // Update legacy format
        const legacyMeds = currentMeds.map((med) => {
          if (med.frequency === 'as_needed') {
            return `${med.name} (As needed)`;
          }
          return `${med.name} (${med.times[0] || '8:00 AM'})`;
        });
        await this.saveDefaultMedications(legacyMeds);
      }
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  },

  /**
   * Delete a medication by ID
   */
  async deleteMedication(medId: string): Promise<void> {
    try {
      const currentMeds = await this.getDefaultMedicationsV2();
      const filteredMeds = currentMeds.filter((m) => m.id !== medId);
      await this.saveDefaultMedicationsV2(filteredMeds);

      // Update legacy format
      const legacyMeds = filteredMeds.map((med) => {
        if (med.frequency === 'as_needed') {
          return `${med.name} (As needed)`;
        }
        return `${med.name} (${med.times[0] || '8:00 AM'})`;
      });
      await this.saveDefaultMedications(legacyMeds);
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  },

  /**
   * Compute summary from daily log for display
   */
  computeSummary(log: DailyHealthLog): DailyLogSummary {
    const avgPain =
      log.pain.length > 0
        ? log.pain.reduce((sum, p) => sum + p.level, 0) / log.pain.length
        : null;

    const totalHydration = log.hydration.reduce((sum, h) => sum + parseHydrationToMl(h.amount), 0);

    const latestMood: MoodLevel | null =
      log.mood.length > 0 ? log.mood[log.mood.length - 1].level : null;

    return {
      avgPain,
      totalHydration,
      hydrationGoal: 2500,
      medsCount: log.medications.list.length,
      medsTaken: log.medications.checked.length,
      latestMood,
      triggerCount: log.triggers.reduce((sum, t) => sum + t.triggers.length, 0),
      crisisCount: log.crisisEpisodes.length,
    };
  },

  /**
   * Clear all health log data (for testing/reset)
   */
  async clearAllLogs(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const healthLogKeys = keys.filter((k) => k.startsWith(STORAGE_KEY_PREFIX));
      await AsyncStorage.multiRemove(healthLogKeys);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  },
};
