package com.crowdshield.incident;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.incident.dto.IncidentCreateDto;
import com.crowdshield.incident.dto.IncidentDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Tag(name = "Incidents", description = "Manage crowd incidents")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<IncidentDto>>> getAllIncidents(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getAllIncidents(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentDto>> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getIncidentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentDto>> reportIncident(@Valid @RequestBody IncidentCreateDto createDto) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.reportIncident(createDto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentDto>> updateIncident(@PathVariable Long id, @Valid @RequestBody IncidentCreateDto updateDto) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.updateIncident(id, updateDto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Incident deleted successfully"));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<IncidentDto>> resolveIncident(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.resolveIncident(id)));
    }
}
