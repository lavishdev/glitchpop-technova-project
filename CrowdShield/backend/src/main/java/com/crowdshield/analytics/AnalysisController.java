package com.crowdshield.analytics;

import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/upload-video")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadVideo(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = analysisService.processVideoUpload(file);
        return ResponseEntity.ok(ApiResponse.success(result, "Video analyzed successfully"));
    }

    @org.springframework.web.bind.annotation.GetMapping("/latest")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLatestAnalysis() {
        Map<String, Object> latest = analysisService.getLatestAnalysis();
        if (latest == null) {
            return ResponseEntity.ok(ApiResponse.success(new java.util.HashMap<>(), "No analysis available"));
        }
        return ResponseEntity.ok(ApiResponse.success(latest, "Latest analysis retrieved"));
    }
}
