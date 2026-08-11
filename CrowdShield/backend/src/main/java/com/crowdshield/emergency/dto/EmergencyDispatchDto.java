package com.crowdshield.emergency.dto;

import com.crowdshield.emergency.ResponseType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmergencyDispatchDto {
    @NotNull(message = "Incident ID is mandatory")
    private Long incidentId;

    @NotNull(message = "Response type is mandatory")
    private ResponseType responseType;
}
