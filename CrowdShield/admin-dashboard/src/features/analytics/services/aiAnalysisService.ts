import axios from 'axios';

// Fastapi responses will be returned by Spring Boot
export interface AIAnalysisResult {
  message: string;
  upload: any;
  frame_extraction: any;
  person_detection: any;
  tracking: any;
  crowd_density: any;
  heatmaps: any;
  behaviour_analysis: any;
  risk_assessment: any;
  alerts: any[];
  incident_report: any;
  pdf_report: string;
  gemini_analysis: any;
}

export const aiAnalysisService = {
  async uploadVideo(file: File): Promise<AIAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    
    const response = await axios.post<any>(
      'http://localhost:8080/api/analysis/upload-video',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );
    
    return response.data.data;
  }
};
