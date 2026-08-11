package com.crowdshield.recommendation;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    public List<String> getRecommendationsForDensity(int density) {
        return getRecommendationsForRisk(density, 0.0, 0.0, 0.0);
    }

    public List<String> getRecommendationsForRisk(int density, double violenceScore, double fireScore, double smokeScore) {
        List<String> recommendations = new ArrayList<>();

        if (fireScore > 0.8 || smokeScore > 0.8) {
            recommendations.add("Evacuate Area Immediately");
            recommendations.add("Notify Fire Team");
            recommendations.add("Block Entry to Zone");
        }

        if (violenceScore > 0.75) {
            recommendations.add("Dispatch Police to Zone");
            recommendations.add("Lock Nearby Gates");
        }

        if (density > 250) {
            recommendations.add("Open Gate A to Relieve Pressure");
            recommendations.add("Redirect Crowd to Alternative Exits");
            recommendations.add("Deploy Security for Crowd Control");
        } else if (density > 150) {
            recommendations.add("Monitor Area Closely");
            recommendations.add("Prepare to Open Overflow Gates");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("No immediate action required. Operations normal.");
        }

        return recommendations;
    }
}
