export const environment = {
  production: true,

  platformProviderApiBaseUrl: 'https://mineguard-webservice.onrender.com/api/v1',

  // IAM
  platformProviderSignInEndpointPath:          '/sessions',
  platformProviderSignUpEndpointPath:           '/users',
  platformProviderChangePasswordEndpointPath:   '/users/me/password',
  platformProviderForgotPasswordEndpointPath:   '/password-resets',
  platformProviderSupervisorsEndpointPath:      '/supervisors',
  platformProviderCompaniesEndpointPath:        '/companies',

  // Companies & Analytics — suffixes appended to /companies/{companyId}
  platformProviderCompanyKpisEndpointPath:            '/kpis',
  platformProviderCompanyAlertsTrendEndpointPath:     '/metrics/alerts-trend',
  platformProviderCompanyFatigueEndpointPath:         '/metrics/fatigue',
  platformProviderCompanyIncidentsEndpointPath:       '/metrics/incidents',
  platformProviderCompanyHistoryEndpointPath:         '/history',
  platformProviderCompanyInsightsEndpointPath:        '/insights',
  platformProviderCompanyNoticesEndpointPath:         '/notices',

  // Platform (cross-tenant, ADMIN)
  platformProviderPlatformMetricsEndpointPath:        '/platform/metrics',

  // Drivers-scoped analytics — endpoint appends /{driverId}/metrics or /{driverId}/reports/{reportId}
  platformProviderPerformanceMetricsEndpointPath:     '/drivers',
  platformProviderReportsEndpointPath:                '/reports',
  // Dashboard risk drivers → GET /drivers?sort=-riskScore&limit
  // Dashboard recent alerts → GET /alerts?view=operational&sort=-occurredAt&limit
  // (both reuse the drivers/alerts endpoints above — no dedicated path)

  // Assets — endpoint appends ?view=inventory or ?view=directory
  platformProviderVehiclesInventoryEndpointPath: '/vehicles',
  platformProviderDriversDirectoryEndpointPath:  '/drivers',
  platformProviderDriversEndpointPath:           '/drivers',
  // Catalog summary is derived from GET /companies/{companyId}/kpis (no dedicated path)

  // Monitoring — endpoint appends ?view=operational
  platformProviderOperationalAlertsEndpointPath: '/alerts',
  platformProviderAuditLogEndpointPath:          '/audit-logs',
  platformProviderLiveMapVehiclesEndpointPath:   '/vehicles/positions',
  // Fleet summary is derived from GET /companies/{companyId}/kpis (no dedicated path)
  // Base path only — endpoint appends /{sessionId}/cardiac-readings
  platformProviderCardiacReadingsEndpointPath:   '/driving-sessions',

  // Devices (MineGuard edge units) — one device per vehicle, registered by admin.
  // Backend models a device as a "sensor" resource (GET/POST /api/v1/sensors).
  platformProviderSensorsEndpointPath:           '/sensors',
};
