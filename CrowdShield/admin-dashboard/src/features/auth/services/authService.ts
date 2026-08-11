import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AuthRequest, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    return response.data;
    */
    
    // Placeholder/mock (Derived from Stitch Project UI)
    return Promise.resolve({ token: "mock-jwt-token-from-stitch" });
  },
};
