export interface StatMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  description?: string;
}

export interface ZoneAnalytics {
  zoneId: string;
  zoneName: string;
  capacityPercentage: number;
  currentDensity: number;
  maxCapacity: number;
  dwellTimeMinutes: number;
  flowRateIn: number;
  flowRateOut: number;
  status: 'normal' | 'moderate' | 'congested' | 'critical';
}
