import { SystemConfigSettings } from '../types';
import { MOCK_SYSTEM_CONFIG } from '../mock';

export const settingsService = {
  getSystemConfig: async (): Promise<SystemConfigSettings> => {
    return Promise.resolve(MOCK_SYSTEM_CONFIG);
  }
};
