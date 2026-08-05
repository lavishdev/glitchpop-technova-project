package com.crowdshield.recommendation;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    public List<String> getRecommendationsForDensity(int density) {
        List<String> recommendations = new ArrayList<>();
        
        if (density > 150) {
            recommendations.add("Deploy additional security personnel to the area.");
            recommendations.add("Open secondary exit gates to facilitate crowd flow.");
            recommendations.add("Broadcast a multilingual announcement to guide visitors.");
        } else if (density > 100) {
            recommendations.add("Monitor the area closely for sudden density spikes.");
        } else {
            recommendations.add("Crowd levels are normal. No action required.");
        }
        
        return recommendations;
    }
}
