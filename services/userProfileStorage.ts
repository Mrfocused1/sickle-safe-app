import AsyncStorage from '@react-native-async-storage/async-storage';
import { SickleCellType } from '../constants/medicationDefaults';

const STORAGE_KEYS = {
  SICKLE_CELL_TYPES: '@sickle_safe_sickle_cell_types',
  CUSTOM_TYPES: '@sickle_safe_custom_sickle_cell_types',
  MEDICATIONS_INITIALIZED: '@sickle_safe_medications_initialized',
  ONBOARDING_COMPLETED: '@sickle_safe_onboarding_completed',
};

export interface CustomSickleCellType {
  value: string;
  label: string;
  description: string;
}

export const userProfileStorage = {
  /**
   * Save selected sickle cell types from onboarding
   */
  async saveSickleCellTypes(
    types: SickleCellType[],
    customTypes?: CustomSickleCellType[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SICKLE_CELL_TYPES, JSON.stringify(types));
      if (customTypes && customTypes.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_TYPES, JSON.stringify(customTypes));
      }
    } catch (error) {
      console.error('Error saving sickle cell types:', error);
      throw error;
    }
  },

  /**
   * Get saved sickle cell types
   */
  async getSickleCellTypes(): Promise<SickleCellType[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SICKLE_CELL_TYPES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sickle cell types:', error);
      return [];
    }
  },

  /**
   * Get custom sickle cell types
   */
  async getCustomSickleCellTypes(): Promise<CustomSickleCellType[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_TYPES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting custom sickle cell types:', error);
      return [];
    }
  },

  /**
   * Check if medications have been auto-populated
   */
  async isMedicationsInitialized(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS_INITIALIZED);
      return data === 'true';
    } catch (error) {
      console.error('Error checking medications initialized:', error);
      return false;
    }
  },

  /**
   * Mark medications as initialized (prevent re-population)
   */
  async setMedicationsInitialized(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICATIONS_INITIALIZED, 'true');
    } catch (error) {
      console.error('Error setting medications initialized:', error);
    }
  },

  /**
   * Reset medications initialized flag (for testing or re-onboarding)
   */
  async resetMedicationsInitialized(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.MEDICATIONS_INITIALIZED);
    } catch (error) {
      console.error('Error resetting medications initialized:', error);
    }
  },

  /**
   * Check if onboarding has been completed
   */
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding completed:', error);
      return false;
    }
  },

  /**
   * Mark onboarding as completed
   */
  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  },

  /**
   * Clear all user profile data (for logout/reset)
   */
  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  },
};
