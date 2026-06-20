export const environment = {
  production: true,
  platformProviderApiBaseUrl: 'https://mineguard-webservice.onrender.com/api/v1',

  // IAM
  platformProviderSignInEndpointPath:          '/sessions',
  platformProviderSignUpEndpointPath:           '/users',
  platformProviderChangePasswordEndpointPath:   '/users/me/password',
  platformProviderForgotPasswordEndpointPath:   '/users/password-resets',
  platformProviderSupervisorsEndpointPath:      '/supervisors',

  // Dashboard
  platformProviderDashboardSummaryEndpointPath:      '/dashboard/summary',
  platformProviderDashboardTrendEndpointPath:         '/dashboard/trend',
  platformProviderDashboardRiskDriversEndpointPath:   '/dashboard/risk-drivers',
  platformProviderDashboardRecentAlertsEndpointPath:  '/dashboard/recent-alerts',

  // Analytics
  platformProviderAnalyticsFatigueBarsEndpointPath:           '/analytics/fatigue-levels',
  platformProviderAnalyticsIncidentDistributionEndpointPath:  '/analytics/incident-distribution',
  platformProviderAnalyticsHistoryRowsEndpointPath:           '/analytics/history',
  platformProviderAnalyticsInsightsEndpointPath:              '/analytics/insights',
  // Base path only — endpoint appends /{driverId}/performance-metrics
  platformProviderPerformanceMetricsEndpointPath: '/drivers',

  // Reports
  platformProviderReportsEndpointPath: '/reports',

  // Admin
  platformProviderAdminSummaryEndpointPath: '/admin/summary',
  platformProviderAdminNoticesEndpointPath: '/admin/notices',

  // Assets — endpoint appends ?view=inventory or ?view=directory
  platformProviderVehiclesInventoryEndpointPath: '/vehicles',
  platformProviderDriversDirectoryEndpointPath:  '/drivers',
  platformProviderDriversEndpointPath:           '/drivers',
  platformProviderCatalogSummaryEndpointPath:    '/catalog/summary',

  // Monitoring — endpoint appends ?view=operational
  platformProviderOperationalAlertsEndpointPath: '/alerts',
  platformProviderAuditLogEndpointPath:          '/audit-logs',
  platformProviderLiveMapVehiclesEndpointPath:   '/vehicles/live-positions',
  platformProviderFleetSummaryEndpointPath:      '/fleet/summary',
  // Base path only — endpoint appends /{tripId}/cardiac-readings
  platformProviderCardiacReadingsEndpointPath:   '/trips',

  // Service Design (no v2 API counterpart yet)
  platformProviderRoutesEndpointPath: '/routes',
  platformProviderShiftsEndpointPath: '/shifts',
};
