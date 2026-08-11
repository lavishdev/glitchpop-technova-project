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
           "(:endDate IS NULL OR a.createdAt <= :endDate) AND " +
           "(:location IS NULL OR a.location = :location) AND " +
           "(:isRead IS NULL OR a.isRead = :isRead) AND " +
           "(:search IS NULL OR LOWER(a.message) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.type) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Alert> findFilteredAlerts(@Param("type") String type, 
                                   @Param("severity") AlertSeverity severity, 
                                   @Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate, 
                                   @Param("location") String location,
                                   @Param("isRead") Boolean isRead,
                                   @Param("search") String search,
                                   Pageable pageable);

    Page<Alert> findByIsReadFalse(Pageable pageable);

    long countBySeverity(AlertSeverity severity);
    
    long countByIsReadFalse();
    
    java.util.List<Alert> findTop5ByOrderByCreatedAtDesc();
}
