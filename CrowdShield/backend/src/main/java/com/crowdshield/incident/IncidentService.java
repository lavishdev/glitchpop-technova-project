package com.crowdshield.incident;

import com.crowdshield.incident.dto.IncidentCreateDto;
import com.crowdshield.incident.dto.IncidentDto;
import com.crowdshield.incident.mapper.IncidentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;
    private final com.crowdshield.activity.ActivityLogService activityLogService;

    public Page<IncidentDto> getAllIncidents(Pageable pageable) {
        return incidentRepository.findAll(pageable).map(incidentMapper::toDto);
    }

    public IncidentDto getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .map(incidentMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + id));
    }

    public IncidentDto reportIncident(IncidentCreateDto createDto) {
        Incident incident = incidentMapper.toEntity(createDto);
        incident.setCreatedAt(LocalDateTime.now());
        incident.setStatus(IncidentStatus.OPEN);
        Incident saved = incidentRepository.save(incident);
        
        String username = getUsername();
        activityLogService.logActivity(username, com.crowdshield.activity.ActivityAction.INCIDENT_CREATED, "Created incident: " + saved.getTitle());
        
        return incidentMapper.toDto(saved);
    }

    public IncidentDto updateIncident(Long id, IncidentCreateDto updateDto) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + id));
        
        incident.setTitle(updateDto.getTitle());
        incident.setDescription(updateDto.getDescription());
        incident.setSeverity(updateDto.getSeverity());
        incident.setLocation(updateDto.getLocation());
        incident.setImageUrl(updateDto.getImageUrl());
        
        return incidentMapper.toDto(incidentRepository.save(incident));
    }

    public void deleteIncident(Long id) {
        if (!incidentRepository.existsById(id)) {
            throw new IllegalArgumentException("Incident not found with id: " + id);
        }
        incidentRepository.deleteById(id);
    }

    public IncidentDto resolveIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + id));
        
        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setResolvedAt(LocalDateTime.now());
        
        Incident saved = incidentRepository.save(incident);
        
        String username = getUsername();
        activityLogService.logActivity(username, com.crowdshield.activity.ActivityAction.INCIDENT_RESOLVED, "Resolved incident: " + saved.getTitle());
        
        return incidentMapper.toDto(saved);
    }
    
    private String getUsername() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
