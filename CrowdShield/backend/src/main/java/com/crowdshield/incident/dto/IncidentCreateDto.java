package com.crowdshield.incident.dto;

import com.crowdshield.incident.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentCreateDto {

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotNull(message = "Severity is mandatory")
    private IncidentSeverity severity;

    @NotBlank(message = "Location is mandatory")
    private String location;

    private String imageUrl;
}
