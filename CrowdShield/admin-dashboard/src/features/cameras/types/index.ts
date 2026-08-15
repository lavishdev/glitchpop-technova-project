export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';

export interface CameraStream {
  id: number;
  name: string;
  location: string;
  zone: string;
  status: CameraStatus;
  lastSeen: string;
  healthPercentage: number;
  resolution: string;
  fps: number;
  videoUrl?: string;
  analysisId?: string;
}
