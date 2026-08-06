package com.crowdshield.camera.mapper;

import com.crowdshield.camera.Camera;
import com.crowdshield.camera.dto.CameraCreateDto;
import com.crowdshield.camera.dto.CameraDto;
import org.springframework.stereotype.Component;

@Component
public class CameraMapper {
    public CameraDto toDto(Camera camera) {
        if (camera == null) return null;
        return CameraDto.builder()
                .id(camera.getId())
                .name(camera.getName())
                .location(camera.getLocation())
                .zone(camera.getZone())
                .status(camera.getStatus())
                .lastSeen(camera.getLastSeen())
                .healthPercentage(camera.getHealthPercentage())
                .resolution(camera.getResolution())
                .fps(camera.getFps())
                .build();
    }

    public Camera toEntity(CameraCreateDto dto) {
        if (dto == null) return null;
        return Camera.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .zone(dto.getZone())
                .status(dto.getStatus())
                .build();
    }
}
