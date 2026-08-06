import { EmergencyProtocol } from '../types';

export const MOCK_EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: "EP-RED-01",
    name: "FULL FACILITY EVACUATION",
    code: "CODE RED ALPHA",
    activeState: false,
    description: "Immediately triggers all emergency exits, broadcasts loud public address alert, and notifies central emergency dispatchers.",
    requiredClearance: "SUPER_ADMIN",
    steps: [
      "Automated siren activation & PA vocal announcement.",
      "All turnstiles & fire exits automatically unlatched.",
      "Elevator systems locked to Ground Return Mode.",
      "Local Fire Department & Municipal Police telemetry stream initialized."
    ],
    affectedZones: ["All Zones (1 through 8)"],
  },
  {
    id: "EP-ORANGE-02",
    name: "PERIMETER SECTOR LOCKOUT",
    code: "CODE ORANGE BRAVO",
    activeState: false,
    description: "Isolates outer perimeter security gates while retaining normal egress inside main stadium halls.",
    requiredClearance: "SECURITY_OPERATOR",
    steps: [
      "Outer turnstile entry gates lock to incoming traffic.",
      "Outer fence cameras switched to continuous 60fps tracking mode.",
      "Rapid Response Tactical Squad dispatched to perimeter outer bounds."
    ],
    affectedZones: ["Zone 01", "Zone 04"],
  },
];
