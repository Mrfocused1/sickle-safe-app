import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyHealthLog, DailyLogSummary, DateKey, MoodLevel } from '../types/healthLog';

const STORAGE_KEY_PREFIX = '@sickle_safe_health_log_';
const MEDICATIONS_DEFAULT_KEY = '@sickle_safe_default_medications';

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
   * Save default medications list
   */
  async saveDefaultMedications(meds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MEDICATIONS_DEFAULT_KEY, JSON.stringify(meds));
    } catch (error) {
      console.error('Error saving default medications:', error);
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
