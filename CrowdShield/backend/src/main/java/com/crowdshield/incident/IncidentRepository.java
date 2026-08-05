package com.crowdshield.incident;

import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    long countByStatus(IncidentStatus status);
    long countByCreatedAtAfter(LocalDateTime date);
    long countByResolvedAtAfterAndStatus(LocalDateTime date, IncidentStatus status);
    List<Incident> findTop5ByOrderByCreatedAtDesc();
}
