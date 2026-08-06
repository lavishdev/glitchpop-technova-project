package com.crowdshield.alert;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    @Query("SELECT a FROM Alert a WHERE " +
           "(:type IS NULL OR a.type = :type) AND " +
           "(:severity IS NULL OR a.severity = :severity) AND " +
           "(:startDate IS NULL OR a.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR a.createdAt <= :endDate)")
    Page<Alert> findFilteredAlerts(@Param("type") String type, 
                                   @Param("severity") AlertSeverity severity, 
                                   @Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate, 
                                   Pageable pageable);

    Page<Alert> findByIsReadFalse(Pageable pageable);

    long countBySeverity(AlertSeverity severity);
    
    java.util.List<Alert> findTop5ByOrderByCreatedAtDesc();
}
