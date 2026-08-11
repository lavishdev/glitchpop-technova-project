package com.crowdshield.incident.mapper;

import com.crowdshield.incident.Incident;
import com.crowdshield.incident.dto.IncidentCreateDto;
import com.crowdshield.incident.dto.IncidentDto;
import org.springframework.stereotype.Component;

@Component
public class IncidentMapper {

    public IncidentDto toDto(Incident incident) {
        if (incident == null) {
            return null;
        }
        return IncidentDto.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .location(incident.getLocation())
                .imageUrl(incident.getImageUrl())
                .createdAt(incident.getCreatedAt())
                .resolvedAt(incident.getResolvedAt())
                .build();
    }

    public Incident toEntity(IncidentCreateDto dto) {
        if (dto == null) {
            return null;
        }
        return Incident.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .build();
    }
}
