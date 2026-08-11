package com.crowdshield.mobile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportIncidentDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private String imageUrl;
}
