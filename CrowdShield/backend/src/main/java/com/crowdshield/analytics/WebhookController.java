package com.crowdshield.analytics;

import com.crowdshield.alert.dto.AlertDto;
import com.crowdshield.analytics.dto.PredictionRequestDto;
import com.crowdshield.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class WebhookController {

    private final AnalyticsService analyticsService;

    @PostMapping("/predict")
    public ResponseEntity<ApiResponse<AlertDto>> handlePrediction(@Valid @RequestBody PredictionRequestDto request) {
        AlertDto generatedAlert = analyticsService.processPrediction(request);
        return ResponseEntity.ok(ApiResponse.success(generatedAlert, "Prediction processed successfully"));
    }
}
