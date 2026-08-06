import { IncidentRecord } from '../types';

export const MOCK_INCIDENTS: IncidentRecord[] = [
  {
    id: "INC-2026-0891",
    title: "Turnstile 4 Crowd Bottleneck Surge",
    category: "Crowd Control",
    zone: "North Concourse",
    reportedAt: "10:14:22 AM",
    severity: "critical",
    status: "dispatched",
    assignedTo: "Capt. Marcus Vance",
    responseUnits: ["Tactical Squad Alpha", "Medical Unit 2"],
    notes: [
      "Deploying secondary barriers to reroute foot traffic.",
      "Turnstiles 5 & 6 opened manually.",
    ],
  },
  {
    id: "INC-2026-0890",
    title: "Unattended Luggage Inspection",
    category: "Perimeter Security",
    zone: "East Promenade",
    reportedAt: "09:48:10 AM",
    severity: "high",
    status: "investigating",
    assignedTo: "Officer Sarah Chen",
    responseUnits: ["K9 Unit 4"],
    notes: ["Scanner anomaly flagged by AI vision pipeline."],
  },
];
