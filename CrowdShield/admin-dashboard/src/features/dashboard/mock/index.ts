import { StatMetric, ZoneAnalytics } from '../types';

export const MOCK_OVERVIEW_METRICS: StatMetric[] = [
  {
    title: "Total Capacity",
    value: "42,850",
    change: "+12.4%",
    isPositive: true,
    icon: "groups",
    description: "vs last hour",
  },
  {
    title: "Active Alerts",
    value: "24",
    change: "-5.2%",
    isPositive: true,
    icon: "warning",
    description: "4 critical",
  },
  {
    title: "Avg Dwell Time",
    value: "45m",
    change: "+2m",
    isPositive: false,
    icon: "timer",
    description: "Across all zones",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "Optimal",
    isPositive: true,
    icon: "monitor_heart",
    description: "All sensors online",
  },
];

export const MOCK_ZONE_ANALYTICS: ZoneAnalytics[] = [
  {
    zoneId: "Z-01",
    zoneName: "North Concourse",
    capacityPercentage: 92,
    currentDensity: 4500,
    maxCapacity: 5000,
    dwellTimeMinutes: 12,
    flowRateIn: 350,
    flowRateOut: 200,
    status: "critical",
  },
  {
    zoneId: "Z-02",
    zoneName: "East Promenade",
    capacityPercentage: 65,
    currentDensity: 3250,
    maxCapacity: 5000,
    dwellTimeMinutes: 45,
    flowRateIn: 120,
    flowRateOut: 150,
    status: "moderate",
  },
  {
    zoneId: "Z-03",
    zoneName: "South Gate",
    capacityPercentage: 35,
    currentDensity: 1750,
    maxCapacity: 5000,
    dwellTimeMinutes: 5,
    flowRateIn: 400,
    flowRateOut: 450,
    status: "normal",
  },
];
