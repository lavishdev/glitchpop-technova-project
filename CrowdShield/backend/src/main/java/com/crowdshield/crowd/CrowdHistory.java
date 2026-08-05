package com.crowdshield.crowd;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "crowd_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrowdHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cameraId;
    
    private String zone;
    
    private String location; // kept for legacy webhook compatibility

    private int density;

    private double riskScore;

    private LocalDateTime timestamp;
}
