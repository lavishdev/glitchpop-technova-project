import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { CameraStream } from '../types';

export const cameraService = {
  getCameras: async (): Promise<CameraStream[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.CAMERAS);
    return response.data.data.content;
  },
  
  getCameraById: async (id: number): Promise<CameraStream> => {
    const response = await axiosClient.get(`${API_ENDPOINTS.CAMERAS}/${id}`);
    return response.data.data;
  }
};
