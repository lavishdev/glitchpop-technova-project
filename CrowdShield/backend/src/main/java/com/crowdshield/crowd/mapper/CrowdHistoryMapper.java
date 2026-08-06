package com.crowdshield.crowd.mapper;

import com.crowdshield.crowd.CrowdHistory;
import com.crowdshield.crowd.dto.CrowdHistoryDto;
import org.springframework.stereotype.Component;

@Component
public class CrowdHistoryMapper {

    public CrowdHistoryDto toDto(CrowdHistory history) {
        if (history == null) {
            return null;
        }
        return CrowdHistoryDto.builder()
                .id(history.getId())
                .cameraId(history.getCameraId())
                .zone(history.getZone())
                .density(history.getDensity())
                .riskScore(history.getRiskScore())
                .timestamp(history.getTimestamp())
                .build();
    }
}
