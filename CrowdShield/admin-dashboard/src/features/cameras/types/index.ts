export type CameraStatus = 'online' | 'offline' | 'warning' | 'maintenance';

export interface CameraStream {
  id: string;
  name: string;
  zone: string;
  ipAddress: string;
  status: CameraStatus;
  resolution: string;
  fps: number;
  streamUrl: string;
  detectionActive: boolean;
  type: 'Optical PTZ' | 'Thermal AI' | 'Fixed Wide-Angle';
}
