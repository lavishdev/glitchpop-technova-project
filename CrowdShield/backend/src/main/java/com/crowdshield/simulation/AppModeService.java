package com.crowdshield.simulation;

import org.springframework.stereotype.Service;

@Service
public class AppModeService {
    private boolean simulatorEnabled = true;

    public boolean isSimulatorEnabled() {
        return simulatorEnabled;
    }

    public void setSimulatorEnabled(boolean enabled) {
        this.simulatorEnabled = enabled;
    }
}
