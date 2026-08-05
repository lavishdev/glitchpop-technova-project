package com.crowdshield.incident;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    
    @Column(name = "reported_by")
    private String reportedBy;
    
    @Column(name = "reported_at")
    private LocalDateTime reportedAt;
    
    private String status; // OPEN, IN_PROGRESS, RESOLVED
}

