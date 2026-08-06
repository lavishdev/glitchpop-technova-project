import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AuthRequest, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    // The backend returns an ApiResponse<AuthResponse> so the data payload is response.data.data
    return response.data.data;
  },
};
