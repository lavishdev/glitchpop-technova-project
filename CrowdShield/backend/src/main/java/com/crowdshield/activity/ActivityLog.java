package com.crowdshield.activity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String user;

    @Enumerated(EnumType.STRING)
    private ActivityAction action;
    
    private String details;

    private LocalDateTime timestamp;
}
