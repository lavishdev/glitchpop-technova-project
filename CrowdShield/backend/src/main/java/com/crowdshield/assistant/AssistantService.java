package com.crowdshield.assistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssistantService {

    public String askAssistant(String query) {
        // Mock Gemini LLM integration
        if (query.toLowerCase().contains("crowd") || query.toLowerCase().contains("density")) {
            return "Based on the latest data, the main square is currently experiencing high density. I recommend opening the North gates to alleviate pressure.";
        } else if (query.toLowerCase().contains("incident")) {
            return "There are currently 2 open incidents being handled by the security team. No critical SOS alerts are active.";
        }
        return "I am the CrowdShield AI Assistant. I can analyze crowd density and incidents. How can I help you today?";
    }
}
