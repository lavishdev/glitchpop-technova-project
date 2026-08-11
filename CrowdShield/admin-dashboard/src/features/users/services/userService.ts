import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { UserAccount } from '../types';
import { MOCK_USERS } from '../mock';

export const userService = {
  getUsers: async (): Promise<UserAccount[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.USERS);
    return response.data;
    */
    return Promise.resolve(MOCK_USERS);
  },
  
  getUserById: async (id: string): Promise<UserAccount> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
    */
    return Promise.resolve(MOCK_USERS.find(u => u.id === id)!);
  }
};
