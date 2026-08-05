package com.crowdshield.incident;

import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentRepository incidentRepository;

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Incident> reportIncident(@RequestBody Incident incident) {
        incident.setReportedAt(LocalDateTime.now());
        if (incident.getStatus() == null) {
            incident.setStatus("OPEN");
        }
        return ResponseEntity.ok(incidentRepository.save(incident));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateIncidentStatus(@PathVariable Long id, @RequestParam String status) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatus(status);
                    return ResponseEntity.ok(incidentRepository.save(incident));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

