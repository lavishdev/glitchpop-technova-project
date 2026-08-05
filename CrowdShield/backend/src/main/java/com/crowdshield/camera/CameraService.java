package com.crowdshield.camera;

import com.crowdshield.camera.dto.CameraCreateDto;
import com.crowdshield.camera.dto.CameraDto;
import com.crowdshield.camera.mapper.CameraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CameraService {
    
    private final CameraRepository cameraRepository;
    private final CameraMapper cameraMapper;

    public Page<CameraDto> getAllCameras(Pageable pageable) {
        return cameraRepository.findAll(pageable).map(cameraMapper::toDto);
    }

    public CameraDto createCamera(CameraCreateDto dto) {
        Camera camera = cameraMapper.toEntity(dto);
        if (camera.getStatus() == CameraStatus.ONLINE) {
            camera.setLastSeen(LocalDateTime.now());
        }
        return cameraMapper.toDto(cameraRepository.save(camera));
    }

    public CameraDto updateCamera(Long id, CameraCreateDto dto) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Camera not found"));
        camera.setName(dto.getName());
        camera.setLocation(dto.getLocation());
        camera.setZone(dto.getZone());
        camera.setStatus(dto.getStatus());
        if (camera.getStatus() == CameraStatus.ONLINE) {
            camera.setLastSeen(LocalDateTime.now());
        }
        return cameraMapper.toDto(cameraRepository.save(camera));
    }

    public void deleteCamera(Long id) {
        if (!cameraRepository.existsById(id)) {
            throw new IllegalArgumentException("Camera not found");
        }
        cameraRepository.deleteById(id);
    }
}
