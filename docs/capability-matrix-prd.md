# Capability Matrix App PRD

## Product overview
The Capability Matrix App is a self-service workforce capability platform that helps employees maintain their profiles, enables managers to trigger monthly updates, and gives leadership a reliable view of skills, certifications, and readiness.

## Problem statement
Capability updates are often handled through fragmented emails, spreadsheets, and one-to-one messages. This creates delays, inconsistent data, and weak auditability. The app centralizes profile updates, approvals, and reporting in one place.

## MVP goals
- Let employees maintain and submit their capability profile.
- Enable managers to trigger monthly update requests for direct reports.
- Support manager review and approval workflows.
- Provide reporting and export capabilities for leadership.
- Establish the foundation for secure, role-based automation and notifications.

## Core user roles
- Admin: manages roles, teams, templates, and schedules.
- Manager: triggers updates, reviews submissions, and approves changes.
- Employee: updates profile information and submits monthly snapshots.
- Auditor: reviews history, approvals, and audit logs.

## MVP feature set
### Profile management
Employees can update:
- Primary role
- Primary skill set
- Overall IT experience
- Optional secondary skills
- Certifications
- Notes

### Workflow automation
- Manager-triggered monthly updates from the app or structured email.
- Email-triggered workflow to create or refresh update tasks for direct reports.
- Automated reminders for incomplete submissions.
- Approval and revision requests from managers.

### Governance and reporting
- Audit trail and monthly version snapshots.
- CSV and Excel export support.
- Dashboard views for current state and pending updates.

### Security and access
- Azure AD SSO with MFA for managers and admins.
- Role-based access control.
- Signed, time-limited secure links for notifications.
- Encryption in transit and at rest.

## Recommended technical direction
- Frontend: React + Next.js + Tailwind
- Backend: Node.js or Azure Functions
- Database: PostgreSQL or Azure SQL
- Authentication: Azure AD / Entra ID
- Notifications: Microsoft Teams, email, and optional WhatsApp

## Core data model
- Users
- Profiles
- ProfileSnapshots
- UpdateTasks
- AuditLog
- ManagersNotifications

## Example API surface
- POST /api/trigger-update
- POST /api/email-webhook
- GET /api/users/{id}/profile
- POST /api/users/{id}/profile
- GET /api/snapshots/{month}/{year}
- POST /api/tasks/{id}/complete
- POST /api/tasks/{id}/approve
- GET /api/reports/capability-matrix

## Delivery roadmap
### Phase 1 — Foundation
- Finalize requirements, data model, and architecture.
- Implement authentication and role-based access.
- Stand up the core profile experience.

### Phase 2 — Workflow automation
- Build manager-triggered monthly update flows.
- Add task creation, reminder scheduling, and submissions.
- Support approvals and rejection feedback.

### Phase 3 — Governance and reporting
- Add version snapshots and audit history.
- Enable export and dashboard reporting.
- Add monitoring, logging, and resilience.

### Phase 4 — Expansion
- Add Teams adaptive cards, richer email parsing, and optional WhatsApp.
- Extend admin controls for templates, schedules, and team management.

## MVP timeline
- Weeks 1–2: requirements, architecture, and schema.
- Weeks 3–5: backend APIs and profile management UI.
- Weeks 6–7: review workflow and notifications.
- Weeks 8–10: reporting, testing, security review, and launch.
