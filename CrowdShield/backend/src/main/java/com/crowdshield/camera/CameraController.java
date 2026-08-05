package com.crowdshield.camera;

import com.crowdshield.camera.dto.CameraCreateDto;
import com.crowdshield.camera.dto.CameraDto;
import com.crowdshield.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class CameraController {

    private final CameraService cameraService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CameraDto>>> getAllCameras(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(cameraService.getAllCameras(pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CameraDto>> createCamera(@Valid @RequestBody CameraCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(cameraService.createCamera(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CameraDto>> updateCamera(@PathVariable Long id, @Valid @RequestBody CameraCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(cameraService.updateCamera(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCamera(@PathVariable Long id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Camera deleted successfully"));
    }
}
