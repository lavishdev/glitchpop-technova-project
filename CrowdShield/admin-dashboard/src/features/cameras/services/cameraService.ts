import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { CameraStream } from '../types';
import { MOCK_CAMERAS } from '../mock';

export const cameraService = {
  getCameras: async (): Promise<CameraStream[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.CAMERAS);
    const cameras = response.data.data.content || [];
    return cameras.map((cam: any) => ({
      id: String(cam.id),
      name: cam.name,
      zone: cam.zone,
      status: cam.status === 'ONLINE' ? 'active' : cam.status === 'OFFLINE' ? 'error' : 'inactive',
      streamUrl: `https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&q=80`,
      fps: cam.fps || 30,
      type: cam.resolution || "1080p Optical",
      lastPing: cam.lastSeen ? new Date(cam.lastSeen).toLocaleTimeString() : "Unknown"
    }));
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
