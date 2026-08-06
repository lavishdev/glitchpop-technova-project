package com.crowdshield.system;

import com.crowdshield.camera.CameraRepository;
import com.crowdshield.camera.CameraStatus;
import com.crowdshield.system.dto.SystemHealthDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemHealthService {

    private final CameraRepository cameraRepository;

    public SystemHealthDto getSystemHealth() {
        long totalCameras = cameraRepository.count();
        long onlineCameras = cameraRepository.countByStatus(CameraStatus.ONLINE);

        return SystemHealthDto.builder()
                .apiStatus("OPERATIONAL")
                .dbStatus("OPERATIONAL")
                .aiServiceStatus("OPERATIONAL")
                .cameraServiceStatus("OPERATIONAL")
                .onlineCameras((int) onlineCameras)
                .totalCameras((int) totalCameras)
                .build();
    }
}
