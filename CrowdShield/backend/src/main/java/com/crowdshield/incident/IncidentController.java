package com.crowdshield.incident;

import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents() {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getAllIncidents()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Incident>> reportIncident(@RequestBody Incident incident) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.reportIncident(incident)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Incident>> updateIncidentStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.updateStatus(id, status)));
    }
}
