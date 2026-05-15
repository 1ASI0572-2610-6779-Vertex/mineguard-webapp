# MineGuard Web Application User Stories

## Overview
This document presents the user stories for the MineGuard web application. The roles involved include Drivers, Supervisors, Administrators (Platform Owner), CRM Staff and Visitors. The application supports functionalities such as identity and access management, intelligent operational alerts, real-time fleet monitoring, alert management and classification, vehicle and driver administration, reporting and analytics, dashboards, audit logging and platform configuration.

## US001: Driver Sign-In
**Title:** Driver Sign-In Before Operation
**Description:**
_As a driver, I want to sign in before driving so that I can access my information._

**Acceptance Criteria:**
- Given a driver with a valid registered ID, when the driver enters their identification, then the system validates the identity and grants access.
- Given a driver enters an unregistered ID, when the driver attempts to sign in, then the system rejects the access and notifies that the identifier is invalid.

---

## US002: Vehicle Selection
**Title:** Vehicle Selection at Operation Start
**Description:**
_As a driver, I want to select my assigned vehicle before starting operation so that I am correctly associated with the system._

**Acceptance Criteria:**
- Given a vehicle is available in the system, when the driver selects it, then the system links the vehicle to the driver.
- Given a vehicle is already assigned to another driver, when a selection is attempted, then the system blocks the assignment.

---

## US003: Restricted Zones Consultation
**Title:** Consult Restricted Zones Before Driving
**Description:**
_As a driver, I want to consult restricted zones before driving so that I can avoid entering risk areas._

**Acceptance Criteria:**
- Given there are defined restricted zones, when the driver consults the information, then the system displays the zones where they must not circulate.

---

## US004: Driver Performance Consultation
**Title:** Consult Historical Driver Performance
**Description:**
_As a driver, I want to view my historical performance so that I can understand my behavior in the operation._

**Acceptance Criteria:**
- Given there are records associated with the driver, when the driver accesses their operational history, then the system displays metrics related to alerts, incidents and compliance with actions.
- Given the driver participates in a new operation, when events associated with their driving are generated, then the system automatically updates their performance history.

---

## US005: Proximity Alert
**Title:** Automatic Proximity Alert During Driving
**Description:**
_As a driver, I want to receive automatic proximity alerts so that I can prevent risks while driving._

**Acceptance Criteria:**
- Given a heavy vehicle is within the configured proximity range, when the system processes sensor information, then it generates a preventive in-cab alert and shows a caution notification to the driver.
- Given a heavy vehicle continues approaching the driver's vehicle, when the system detects that the distance has dropped to a critical level, then it raises the priority of the alert and records the event as elevated proximity risk.

---

## US006: Collision Alert
**Title:** Automatic Critical Collision Alert
**Description:**
_As a driver, I want to receive automatic critical alerts so that I can avoid collisions._

**Acceptance Criteria:**
- Given a light vehicle and a heavy vehicle coincide on the same segment, when the system identifies the risk, then it activates a critical audible in-cab alert and displays a collision warning on the visualization device.
- Given the vehicles stop coinciding on the segment, when the system updates the information, then it deactivates the audible alert and clears the message from the device.

---

## US007: Fatigue Alert via Pulse Sensor
**Title:** Automatic Fatigue Detection
**Description:**
_As a driver, I want the system to detect signs of fatigue automatically so that accidents can be prevented._

**Acceptance Criteria:**
- Given the pulse sensor records values associated with drowsiness or fatigue, when the system analyzes the biometric information, then it generates a preventive audible alert for the driver and notifies the monitoring center.
- Given anomalous values persist over a continuous period, when the system reprocesses sensor information, then it raises the alert severity and records the incident for operational follow-up.

---

## US008: Zone Monitoring
**Title:** Real-Time Operational Zone Monitoring
**Description:**
_As a supervisor, I want to view zone status so that I can identify operational risks in real time._

**Acceptance Criteria:**
- Given there is no coincidence between light vehicles and trucks in a zone, when the system processes sensor data, then it classifies the zone as safe and records the state without conflict.
- Given a light vehicle and a heavy vehicle coincide on the same or adjacent segments, when the system detects this condition, then it classifies the zone as critical, generates an alert associated with the involved vehicles, and updates the zone state in real time.

---

## US009: Vehicles by Zone Visualization
**Title:** Visualize Vehicles in Each Zone
**Description:**
_As a supervisor, I want to see vehicles in each zone so that I can supervise their location and behavior._

**Acceptance Criteria:**
- Given sensors detect vehicles in an operational zone, when the system updates monitoring information, then it shows the vehicles associated with the zone and records each unit's entry time.
- Given a vehicle moves to another operational segment, when the system receives the new location reading, then it updates the zone associated with the vehicle.

---

## US010: Alert Management
**Title:** Manage Generated Operational Alerts
**Description:**
_As a supervisor, I want to manage generated alerts so that I can make timely operational decisions._

**Acceptance Criteria:**
- Given there is an active alert classified as critical, when the supervisor evaluates it, then the system allows marking it as attended and records the action with timestamp and response type.
- Given an alert does not correspond to a real risk, when the supervisor reviews it, then the system allows classifying it as false alarm and excludes it from risk indicators.

---

## US011: Driver Communication
**Title:** Communicate With Driver After an Alert
**Description:**
_As a supervisor, I want to communicate with the driver after an alert so that I can coordinate immediate actions._

**Acceptance Criteria:**
- Given there is an alert associated with an identified driver, when the supervisor starts communication, then the system sends the notification or call to the driver's device and records the contact attempt with a timestamp.
- Given there are network connectivity issues, when the supervisor attempts to communicate, then the system notifies the failure and allows retrying the communication.

---

## US012: Heavy Vehicle Route Configuration
**Title:** Define Heavy Vehicle Operational Routes
**Description:**
_As a supervisor, I want to define heavy vehicle routes so that conflicts with light vehicles can be avoided._

**Acceptance Criteria:**
- Given the supervisor defines a route composed of specific segments, when they save the configuration, then the system records the route assigned to the heavy vehicle and uses it as reference for conflict detection.
- Given the route presents invalid or inconsistent segments, when a save is attempted, then the system rejects the configuration and notifies the error to the supervisor.

---

## US013: Supervisor Mobile Alert Reception
**Title:** Receive Critical Alerts on Mobile Device
**Description:**
_As a supervisor, I want to receive alerts on my mobile phone so that I am informed in real time._

**Acceptance Criteria:**
- Given a critical alert is generated in the system, when the notification is sent, then the supervisor receives it on their mobile device and views information such as alert type, zone and involved vehicles.

---

## US014: Driver Registration
**Title:** Register Drivers in the System
**Description:**
_As a supervisor, I want to register drivers so that I can manage their participation in the operation._

**Acceptance Criteria:**
- Given the supervisor enters complete driver information including ID, name and status, when they save the registration, then the system creates the driver and makes them available for future operations.
- Given the supervisor omits mandatory information or enters incorrect data, when a save is attempted, then the system rejects the registration and shows the fields that require correction.

---

## US015: Vehicle Registration
**Title:** Register Vehicles in the System
**Description:**
_As a supervisor, I want to register vehicles so that I can control the operational units._

**Acceptance Criteria:**
- Given the supervisor enters a unique identifier and vehicle type, when they save the registration, then the system registers the vehicle and enables it to be selected by drivers.
- Given the vehicle identifier already exists in the system, when re-registration is attempted, then the system rejects the operation and notifies that the vehicle is already registered.

---

## US016: Sensor Monitoring
**Title:** Visualize Sensor Operational Status
**Description:**
_As a supervisor, I want to view sensor status so that I can ensure their correct operation._

**Acceptance Criteria:**
- Given the sensor is sending data correctly, when the system updates its status, then it shows as active and records its last communication.
- Given the sensor stops sending information, when the system detects absence of data over a defined period, then it marks it as inactive and generates a possible failure notification.

---

## US017: Information Update
**Title:** Update Driver and Vehicle Information
**Description:**
_As a supervisor, I want to update driver and vehicle data so that the information stays correct._

**Acceptance Criteria:**
- Given the supervisor modifies data with correct format, when they save the changes, then the system updates the information and records the modification date.
- Given the entered data does not comply with system rules, when an update is attempted, then the system rejects the update and requests data correction.

---

## US018: History Consultation
**Title:** Consult Operational Event History
**Description:**
_As a supervisor, I want to view the event history so that I can analyze incidents in the operation._

**Acceptance Criteria:**
- Given there are events recorded in the system, when the supervisor performs a search by date range, then the system shows the found events and presents information related to the alert type, zone and incident time.
- Given the supervisor needs to analyze specific events, when they apply filters by alert type or risk level, then the system updates the displayed results and keeps only the records matching the selected criteria.

---

## US019: Alert Reporting
**Title:** Generate Operational Alert Reports
**Description:**
_As a supervisor, I want to generate alert reports so that I can evaluate operational risks._

**Acceptance Criteria:**
- Given there are alerts recorded in the system, when the supervisor requests an operational report, then the system groups the information by type and severity and generates metrics related to frequency and criticality.
- Given the report was generated correctly, when the supervisor requests to download it, then the system exports the document in a compatible format and preserves the integrity of the displayed information.

---

## US020: Fatigue Analysis
**Title:** Analyze Driver Fatigue Events
**Description:**
_As a supervisor, I want to analyze fatigue events so that risks associated with the driver state can be prevented._

**Acceptance Criteria:**
- Given there are records associated with fatigue alerts, when the supervisor accesses operational analysis, then the system shows statistics by driver and period and allows identifying recurring patterns.
- Given a driver presents multiple fatigue events in a short period, when the system processes historical records, then it classifies them as a priority attention case and highlights them for preventive evaluation.

---

## US021: Driver Action Recommendation
**Title:** In-Cab Driver Action Recommendations
**Description:**
_As a driver, I want to receive clear indications when alerts arise so that I can react correctly while driving._

**Acceptance Criteria:**
- Given the system detects coincidence on the same segment with a truck, when a critical alert is generated, then the in-cab device shows a message to stop immediately and activates an audible alert.
- Given a truck is in a nearby segment, when the system detects proximity, then the device shows a caution warning and recommends reducing speed.

---

## US022: Driver Action Confirmation
**Title:** Verify Driver Response to Alerts
**Description:**
_As a supervisor, I want to verify if the driver responds to alerts so that I can validate safety compliance._

**Acceptance Criteria:**
- Given a critical alert is generated, when the vehicle reduces speed or stops as expected, then the system records compliance and associates the action with the event.
- Given a critical alert is generated, when the vehicle maintains risky behavior, then the system keeps the alert active.

---

## US023: Driver Behavior Tracking
**Title:** Evaluate Driver Behavior Conduct
**Description:**
_As a supervisor, I want to evaluate driver behavior so that I can identify risk conduct._

**Acceptance Criteria:**
- Given the driver responds correctly to alerts, when the system analyzes their history, then it classifies them as safe behavior.
- Given the driver ignores alerts or presents frequent events, when their records are evaluated, then the system classifies them as a risk driver and highlights them for follow-up.

---

## US024: Alert Prioritization
**Title:** Automatic Alert Prioritization by Severity
**Description:**
_As a supervisor, I want alerts to be prioritized automatically so that the most critical ones are attended first._

**Acceptance Criteria:**
- Given an alert for possible collision is generated, when the system organizes alerts, then it places it at high level and displays it as immediate priority.
- Given a proximity alert without immediate risk is generated, when the system classifies it, then it assigns medium or low priority and keeps it visible for follow-up.

---

## US031: Supervisor Sign-In
**Title:** Supervisor Sign-In to Control Center
**Description:**
_As a supervisor, I want to sign in to the system so that I can access the control center and manage the operation in real time._

**Acceptance Criteria:**
- Given the supervisor has valid credentials registered in the system, when they enter their username and password correctly, then the system validates the identity and allows access to the control panel.
- Given the supervisor enters incorrect or unregistered credentials, when they attempt to sign in, then the system rejects the access and shows a message indicating authentication error.

---

## US032: Trends Visualization
**Title:** Visualize Alert Trends Over Time
**Description:**
_As a supervisor, I want to see alert trends over time so that I can identify risk patterns._

**Acceptance Criteria:**
- Given there is historical data, when the supervisor accesses the trends view, then they see graphs of alert evolution over time.
- Given there is insufficient data, when the supervisor accesses the view, then the system shows an insufficient data message.

---

## US033: Driver Risk Ranking
**Title:** Ranking of Drivers by Risk Level
**Description:**
_As a supervisor, I want to see a driver ranking by risk level so that I can make preventive decisions._

**Acceptance Criteria:**
- Given there are behavior records, when the supervisor accesses the ranking, then the system shows drivers ordered by risk level.
- Given there is insufficient data, when the supervisor accesses the ranking, then the system shows an empty list or informational message.

---

## US034: Critical Zones Identification
**Title:** Identify Zones With Highest Incident Count
**Description:**
_As a supervisor, I want to identify zones with the highest number of incidents so that actions can be prioritized._

**Acceptance Criteria:**
- Given there are incident records by zone, when the supervisor accesses the analysis, then the system shows a map or list of critical zones.
- Given there are no incidents, when the supervisor accesses the analysis, then the system indicates that there are no critical zones.

---

## US035: Real-Time Dashboard
**Title:** Automatic Live Dashboard Updates
**Description:**
_As a supervisor, I want the dashboard to update automatically so that I can monitor the operation live._

**Acceptance Criteria:**
- Given the system receives new events, when changes in the operation are generated, then the dashboard updates in real time.
- Given there is a connection problem, when the system attempts to update, then it shows a state of outdated data.

---

## US036: Data Export
**Title:** Export Dashboard Data for External Analysis
**Description:**
_As a supervisor, I want to export dashboard data so that I can perform external analysis._

**Acceptance Criteria:**
- Given there is data in the system, when the supervisor requests to export, then an Excel or CSV file is generated.
- Given a system failure occurs, when an export is attempted, then an error message is shown.

---

## US040: Driver Registration by Supervisor
**Title:** Register New Drivers for Daily Operations
**Description:**
_As a supervisor, I want to register new drivers so that I can enable their participation in daily operations._

**Acceptance Criteria:**
- Given the supervisor enters complete operator information, when they confirm the registration, then the system generates the profile and notifies the driver of their initial credentials.
- Given the supervisor omits mandatory fields, when a save is attempted, then the system highlights the missing fields and does not allow user creation.

---

## US041: Mandatory Password Change
**Title:** Force Password Change at First Login
**Description:**
_As a user, I want to update my temporary password at first login so that I can secure my account privacy._

**Acceptance Criteria:**
- Given the user signs in with temporary credentials for the first time, when they access the system, then a mandatory password change form is displayed.
- Given the user enters a new password, when they confirm it, then the system validates that it meets security requirements and allows access to operational functions.

---

## US042: Sign-Out and Vehicle Disassociation
**Title:** Close Session and Release Assigned Vehicle
**Description:**
_As a driver, I want to close my session at the end of my shift so that I can legally disassociate from the assigned vehicle._

**Acceptance Criteria:**
- Given the driver has an active session and the vehicle is stopped, when they select Sign Out, then the system records the end time and releases the vehicle so that it becomes available for other drivers.
- Given the vehicle still reports movement, when the driver attempts to sign out, then the system blocks the action and requests stopping the vehicle for safety.

---

## US043: Panic Button for Critical Emergencies
**Title:** Emergency Panic Button on Driver Device
**Description:**
_As a driver, I want an easily accessible emergency button so that I can notify an immediate danger without needing radio communication._

**Acceptance Criteria:**
- Given the driver identifies an imminent risk such as a collapse, when they press the panic button on the device, then the system generates a critical audible and visual alert at the Control Center.
- Given a panic button has been activated, when the system processes the alert, then it sends a priority notification to the supervisor's mobile phone with the exact location.

---

## US044: Security Lockout After Failed Attempts
**Title:** Automatic Account Lockout for Failed Sign-Ins
**Description:**
_As the system, I want to block accounts after multiple failed attempts so that unauthorized access attacks can be prevented._

**Acceptance Criteria:**
- Given a user enters incorrect credentials three consecutive times, when the third attempt occurs, then the system changes the account status to Locked.
- Given an account is locked, when a supervisor or administrator validates the user's identity, then the system allows manual reactivation of the access.

---

## US045: Vehicle Maintenance Status Management
**Title:** Mark Vehicles in Maintenance to Restrict Use
**Description:**
_As a supervisor, I want to mark vehicles in maintenance so that they are not operated in poor mechanical conditions._

**Acceptance Criteria:**
- Given a vehicle requires repairs, when the supervisor changes its status to Maintenance, then the system excludes it from the vehicle selection list.
- Given the vehicle has been repaired, when the supervisor updates its status to Active, then it becomes available again for driver sign-in.

---

## US046: Sensor Connection Loss Alert
**Title:** Watchdog Alert for Sensor Disconnection
**Description:**
_As a supervisor, I want to receive technical disconnection alerts so that I can identify failures in safety monitoring._

**Acceptance Criteria:**
- Given the fatigue or proximity sensor stops sending data for more than ten seconds, when the system detects the signal absence, then it generates a technical failure alert on the dashboard.
- Given there is an active disconnection alert, when the sensor resumes transmitting telemetry, then the system closes the alert automatically.

---

## US047: Logical Off-boarding of Personnel and Assets
**Title:** Deactivate Users and Resources Without Losing History
**Description:**
_As an administrator, I want to deactivate users or resources so that the operational database stays clean without losing history._

**Acceptance Criteria:**
- Given a supervisor leaves the company, when the administrator selects Deactivate, then the system marks the profile as Inactive and prevents permanent sign-in.
- Given a resource is inactive, when reports are queried, then the system still shows their historical data for audits.

---
