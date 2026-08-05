package com.crowdshield.crowd;

import com.crowdshield.crowd.CrowdHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CrowdHistoryRepository extends JpaRepository<CrowdHistory, Long> {

    @Query("SELECT AVG(c.density) FROM CrowdHistory c")
    Double getAverageDensity();

    Page<CrowdHistory> findByZone(String zone, Pageable pageable);

    Page<CrowdHistory> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);
}
