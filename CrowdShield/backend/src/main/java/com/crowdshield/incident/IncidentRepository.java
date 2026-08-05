package com.crowdshield.incident;

import com.crowdshield.incident.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}

