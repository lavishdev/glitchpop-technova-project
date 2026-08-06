package com.crowdshield.emergency.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class EmergencyProtocolDto {
    private String id;
    private String name;
    private String code;
    private boolean activeState;
    private String description;
    private String requiredClearance;
    private List<String> steps;
    private List<String> affectedZones;
}
