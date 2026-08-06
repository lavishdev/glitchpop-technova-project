import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { UserAccount } from '../types';

export const userService = {
  getUsers: async (): Promise<UserAccount[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS);
    return response.data.data.content;
  },

  getUserById: async (id: number): Promise<UserAccount> => {
    const response = await axiosClient.get(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data.data;
  }
};
