package com.crowdshield.incident;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident reportIncident(Incident incident) {
        incident.setReportedAt(LocalDateTime.now());
        if (incident.getStatus() == null || incident.getStatus().isEmpty()) {
            incident.setStatus("OPEN");
        }
        return incidentRepository.save(incident);
    }

    public Incident updateStatus(Long id, String status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + id));
        incident.setStatus(status);
        return incidentRepository.save(incident);
    }
}
