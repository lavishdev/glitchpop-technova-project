package com.crowdshield.crowd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrowdService {

    private final CrowdHistoryRepository crowdHistoryRepository;

    public List<CrowdHistory> getAllHistory() {
        return crowdHistoryRepository.findAll();
    }
}
