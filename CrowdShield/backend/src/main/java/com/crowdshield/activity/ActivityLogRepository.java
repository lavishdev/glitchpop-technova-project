package com.crowdshield.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT a FROM ActivityLog a WHERE " +
           "(:username IS NULL OR a.user = :username) AND " +
           "(:action IS NULL OR a.action = :action)")
    Page<ActivityLog> findFilteredLogs(@Param("username") String username, 
                                       @Param("action") ActivityAction action, 
                                       Pageable pageable);

    List<ActivityLog> findTop10ByOrderByTimestampDesc();
}
