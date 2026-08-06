package com.crowdshield.camera;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {
    Page<Camera> findByZone(String zone, Pageable pageable);
    
    long countByStatus(CameraStatus status);
}
