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
        return incidentMapper.toDto(incidentRepository.save(incident));
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
        
        return incidentMapper.toDto(incidentRepository.save(incident));
    }
}
