export interface PerformanceMetric {
  id: number;
  id_driver: number;
  id_trip: number;
  id_vehicle: number;
  fatigue_events: number;
  alerts_count: number;
  average_heart_rate: number;
  risk_score: number;
  calculated_at: string;
}

export interface Report {
  id: number;
  id_incident: number;
  id_alert: number;
  id_user: number;
  id_metric: number;
  report_type: string;
  created_at: string;
  description: string;
}

export interface DashboardSummary {
  id: number;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  fatigueEvents: number;
  activeVehicles: number;
  totalDrivers: number;
}

export interface DashboardTrend {
  id: number;
  hour: string;
  alerts: number;
  incidents: number;
}

export interface DashboardRiskDriver {
  id: number;
  driverId: number;
  driverName: string;
  vehicleType: string;
  riskScore: number;
}

export interface DashboardRecentAlert {
  id: number;
  alertCode: string;
  severity: string;
  category: string;
  driverName: string;
  vehicleCode: string;
  vehicleType: string;
  route: string;
  time: string;
  status: string;
}

export interface AnalyticsFatigueBar {
  id: number;
  driverId: number;
  driverName: string;
  fatigueEvents: number;
  width: number;
}

export interface AnalyticsIncidentDistribution {
  id: number;
  label: string;
  count: number;
  percent: number;
  className: string;
}

export interface AnalyticsHistoryRow {
  id: number;
  date: string;
  time: string;
  criticality: string;
  criticalityLabel: string;
  incidentType: string;
  involved: string;
  location: string;
}

export interface AnalyticsInsight {
  id: number;
  title: string;
  description: string;
  className: string;
}
