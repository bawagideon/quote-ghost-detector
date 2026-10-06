# Integration & Deployment Guide: Quote Ghost Detector

## 1. Ingress & Egress Architecture
* **Ingress:** Webhooks from e-signature and billing platforms (PandaDoc, Proposify, DocuSign, Stripe Invoicing, QuickBooks).
* **Aging Engine:** Evaluates timestamp differences against configurable SLA threshold (`SLA_HOURS=48`).
* **Egress Actions:**
  - Slack / Teams alerts to deal owners.
  - HubSpot / Salesforce task creation for sales reps.
  - Automated friendly touchpoint email dispatch via SendGrid or Postmark.

## 2. Environment Configuration
```env
PORT=3005
SLA_HOURS=48
CRITICAL_SLA_HOURS=120
PANDADOC_WEBHOOK_SECRET=sec_xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
CRM_API_KEY=live_hubspot_xxx
```

## 3. Resilience & Invariants
* **Idempotency:** Quote event updates are deduplicated by quote UUID.
* **Status Handling:** Automatically suppresses reminders if quote is marked `Accepted`, `Declined`, or `Cancelled`.
