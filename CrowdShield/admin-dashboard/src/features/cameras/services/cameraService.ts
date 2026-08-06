import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { CameraStream } from '../types';
import { MOCK_CAMERAS } from '../mock';

export const cameraService = {
  getCameras: async (): Promise<CameraStream[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.CAMERAS);
    return response.data;
    */
    return Promise.resolve(MOCK_CAMERAS);
  },
  
  getCameraById: async (id: string): Promise<CameraStream> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.CAMERA_BY_ID(id));
    return response.data;
    */
    return Promise.resolve(MOCK_CAMERAS.find(c => c.id === id)!);
  }
};
