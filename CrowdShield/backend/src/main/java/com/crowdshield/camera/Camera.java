package com.crowdshield.camera;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cameras")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private String zone;

    @Enumerated(EnumType.STRING)
    private CameraStatus status;

    private LocalDateTime lastSeen;

    private Double healthPercentage;
    
    private String resolution;
    
    private Integer fps;

    private String videoUrl;

    private String analysisId;
}
