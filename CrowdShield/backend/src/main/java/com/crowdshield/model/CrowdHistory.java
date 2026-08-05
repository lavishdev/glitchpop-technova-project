package com.crowdshield.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String location;
    private int density; // number of people
    
    @Column(name = "risk_score")
    private double riskScore; // 0.0 to 100.0
    
    private LocalDateTime timestamp;
}
