package com.crowdshield.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT a FROM ActivityLog a WHERE " +
           "(:user IS NULL OR a.user = :user) AND " +
           "(:action IS NULL OR a.action = :action)")
    Page<ActivityLog> findFilteredLogs(@Param("user") String user, 
                                       @Param("action") ActivityAction action, 
                                       Pageable pageable);
}
