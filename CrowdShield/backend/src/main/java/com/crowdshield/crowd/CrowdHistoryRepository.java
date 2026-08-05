package com.crowdshield.crowd;

import com.crowdshield.crowd.CrowdHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrowdHistoryRepository extends JpaRepository<CrowdHistory, Long> {
}

