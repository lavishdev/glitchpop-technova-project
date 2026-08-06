import axiosClient from './axiosClient';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
    */
    
    // Placeholder/mock (Derived from Stitch Project UI)
    return Promise.resolve({ token: "mock-jwt-token-from-stitch" });
  },
};
