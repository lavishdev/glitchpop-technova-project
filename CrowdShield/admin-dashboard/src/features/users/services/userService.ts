import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { UserAccount } from '../types';
import { MOCK_USERS } from '../mock';

export const userService = {
  getUsers: async (): Promise<UserAccount[]> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USERS);
      const users = response.data.data.content || [];
      return users.map((u: any) => ({
        id: String(u.id),
        name: u.username,
        email: `${u.username}@crowdshield.com`,
        role: u.role === 'ROLE_ADMIN' ? 'Super Admin' : u.role === 'ROLE_SECURITY' ? 'Security Officer' : 'Data Auditor',
        department: 'Security',
        status: 'active',
        lastActive: new Date().toLocaleTimeString()
      }));
    } catch (e) {
      console.warn("Using mock users due to backend error or missing endpoint", e);
      return Promise.resolve(MOCK_USERS);
    }
  },
  
  getUserById: async (id: string): Promise<UserAccount> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_BY_ID(id));
      const u = response.data.data;
      return {
        id: String(u.id),
        name: u.username,
        email: `${u.username}@crowdshield.com`,
        role: u.role === 'ROLE_ADMIN' ? 'Super Admin' : u.role === 'ROLE_SECURITY' ? 'Security Officer' : 'Data Auditor',
        department: 'Security',
        status: 'active',
        lastActive: new Date().toLocaleTimeString()
      };
    } catch (e) {
      console.warn("Using mock user by id due to backend error or missing endpoint", e);
      return Promise.resolve(MOCK_USERS.find(u => u.id === id)!);
    }
  }
};
