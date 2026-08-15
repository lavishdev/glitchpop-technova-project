package com.crowdshield.config;

import com.crowdshield.alert.Alert;
import com.crowdshield.alert.AlertRepository;
import com.crowdshield.alert.AlertSeverity;
import com.crowdshield.camera.Camera;
import com.crowdshield.camera.CameraRepository;
import com.crowdshield.camera.CameraStatus;
import com.crowdshield.crowd.CrowdHistory;
import com.crowdshield.crowd.CrowdHistoryRepository;
import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentRepository;
import com.crowdshield.incident.IncidentSeverity;
import com.crowdshield.incident.IncidentStatus;
import com.crowdshield.user.User;
import com.crowdshield.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CameraRepository cameraRepository;
    private final IncidentRepository incidentRepository;
    private final AlertRepository alertRepository;
    private final CrowdHistoryRepository crowdHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    
    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        // 1. Seed Users
        userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .role("ROLE_ADMIN")
                .build());
        
        userRepository.save(User.builder()
                .username("security1")
                .password(passwordEncoder.encode("sec123"))
                .role("ROLE_SECURITY")
                .build());

        userRepository.save(User.builder()
                .username("security2")
                .password(passwordEncoder.encode("sec123"))
                .role("ROLE_SECURITY")
                .build());

        // 2. Mock cameras removed - Cameras are now created dynamically when video is uploaded

        // 3. Seed Incidents
        incidentRepository.save(Incident.builder()
                .title("Suspicious Bag")
                .description("Unattended backpack near North Gate")
                .location("North Gate")
                .severity(IncidentSeverity.MEDIUM)
                .status(IncidentStatus.OPEN)
                .createdAt(LocalDateTime.now().minusHours(1))
                .build());

        incidentRepository.save(Incident.builder()
                .title("Minor Altercation")
                .description("Two individuals arguing near East Wing")
                .location("East Wing")
                .severity(IncidentSeverity.LOW)
                .status(IncidentStatus.RESOLVED)
                .createdAt(LocalDateTime.now().minusHours(2))
                .build());

        incidentRepository.save(Incident.builder()
                .title("Overcrowding at Exit")
                .description("Crowd density critical at Main Square")
                .location("Main Square")
                .severity(IncidentSeverity.HIGH)
                .status(IncidentStatus.OPEN)
                .createdAt(LocalDateTime.now().minusMinutes(15))
                .build());

        incidentRepository.save(Incident.builder()
                .title("Medical Emergency")
                .description("Visitor fainted near food court")
                .location("Main Square")
                .severity(IncidentSeverity.HIGH)
                .status(IncidentStatus.OPEN)
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .build());

        incidentRepository.save(Incident.builder()
                .title("Lost Child")
                .description("Found a lost child near North Gate")
                .location("North Gate")
                .severity(IncidentSeverity.LOW)
                .status(IncidentStatus.RESOLVED)
                .createdAt(LocalDateTime.now().minusHours(5))
                .build());

        // 4. Seed Alerts
        for (int i = 1; i <= 10; i++) {
            alertRepository.save(Alert.builder()
                    .type(i % 3 == 0 ? "FIRE_DETECTED" : "OVERCROWDING")
                    .location(i % 2 == 0 ? "Main Square" : "North Gate")
                    .message("Auto-generated alert " + i)
                    .severity(i % 3 == 0 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH)
                    .createdAt(LocalDateTime.now().minusMinutes(i * 10L))
                    .isRead(i % 2 == 0)
                    .build());
        }

        // 5. Seed CrowdHistory (100 records)
        List<CrowdHistory> historyList = new ArrayList<>();
        LocalDateTime startTime = LocalDateTime.now().minusHours(2);
        
        for (int i = 0; i < 100; i++) {
            int density = 50 + random.nextInt(200);
            double riskScore = Math.min(100.0, (density / 300.0) * 100.0 + random.nextDouble() * 5);
            
            historyList.add(CrowdHistory.builder()
                    .cameraId(i % 2 == 0 ? "Main Square Cam" : "North Gate Cam")
                    .zone(i % 2 == 0 ? "Main Square" : "North Gate")
                    .location(i % 2 == 0 ? "Main Square" : "North Gate")
                    .density(density)
                    .riskScore(riskScore)
                    .timestamp(startTime.plusMinutes(i))
                    .build());
        }
        crowdHistoryRepository.saveAll(historyList);
    }
}
