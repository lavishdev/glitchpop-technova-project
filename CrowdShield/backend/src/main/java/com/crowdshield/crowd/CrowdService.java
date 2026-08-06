package com.crowdshield.crowd;

import com.crowdshield.crowd.dto.CrowdHistoryDto;
import com.crowdshield.crowd.mapper.CrowdHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CrowdService {

    private final CrowdHistoryRepository crowdHistoryRepository;
    private final CrowdHistoryMapper crowdHistoryMapper;

    public Page<CrowdHistoryDto> getHistory(String zone, Pageable pageable) {
        if (zone != null && !zone.isEmpty()) {
            return crowdHistoryRepository.findByZone(zone, pageable).map(crowdHistoryMapper::toDto);
        }
        return crowdHistoryRepository.findAll(pageable).map(crowdHistoryMapper::toDto);
    }

    public Page<CrowdHistoryDto> getHistoryToday(Pageable pageable) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        return crowdHistoryRepository.findByTimestampAfter(today, pageable).map(crowdHistoryMapper::toDto);
    }

    public Page<CrowdHistoryDto> getHistoryLastHour(Pageable pageable) {
        LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
        return crowdHistoryRepository.findByTimestampAfter(lastHour, pageable).map(crowdHistoryMapper::toDto);
    }
}
