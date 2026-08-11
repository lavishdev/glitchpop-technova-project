package com.crowdshield.alert;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    @Column(length = 1000)
    private String message;

    private String location;

    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;

    private LocalDateTime createdAt;
    
    private boolean isRead;
}
