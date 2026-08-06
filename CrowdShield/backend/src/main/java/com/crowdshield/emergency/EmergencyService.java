package com.crowdshield.emergency;

import com.crowdshield.activity.ActivityAction;
import com.crowdshield.activity.ActivityLogService;
import com.crowdshield.emergency.dto.EmergencyDispatchDto;
import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final IncidentRepository incidentRepository;
    private final ActivityLogService activityLogService;

    public void dispatchResponse(EmergencyDispatchDto dto) {
        Incident incident = incidentRepository.findById(dto.getIncidentId())
                .orElseThrow(() -> new IllegalArgumentException("Incident not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        String details = String.format("Dispatched %s to incident %d (%s)", 
                dto.getResponseType().name(), incident.getId(), incident.getLocation());
                
        activityLogService.logActivity(username, ActivityAction.EMERGENCY_DISPATCHED, details);
        
        // In a real app, this would integrate with external dispatch APIs.
    }
}
