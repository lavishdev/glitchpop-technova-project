package com.crowdshield.assistant;

import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody Map<String, Object> request) {
        String response = assistantService.askAssistant(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
