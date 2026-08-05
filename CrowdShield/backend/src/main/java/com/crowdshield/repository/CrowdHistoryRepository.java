package com.crowdshield.repository;

import com.crowdshield.model.CrowdHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrowdHistoryRepository extends JpaRepository<CrowdHistory, Long> {
}
