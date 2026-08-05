package com.crowdshield.alert;

import com.crowdshield.alert.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}

