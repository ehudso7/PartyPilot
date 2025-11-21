# Privacy Policy for PartyPilot

**Last Updated:** November 21, 2025  
**Effective Date:** November 21, 2025

---

## 1. Introduction

Welcome to PartyPilot ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.

**PartyPilot** is an AI-powered event planning platform that helps you create, organize, and manage social outings including bachelor parties, birthdays, bar crawls, and group events.

### Contact Information

**Data Controller:** PartyPilot, Inc.  
**Email:** privacy@partypilot.app  
**Address:** [Company Address]

For GDPR-related inquiries, contact our Data Protection Officer at: dpo@partypilot.app

---

## 2. Information We Collect

### 2.1 Information You Provide

**Account Information:**
- Email address
- Password (encrypted)
- Name
- Phone number (optional)

**Trip Planning Information:**
- Natural language prompts describing your event
- Event details (city, dates, group size, occasion, budget)
- Venue preferences and exclusions
- Guest names and contact information (when provided)

**Reservation Information:**
- Names on reservations
- Party sizes
- Preferred times
- Special requests

### 2.2 Automatically Collected Information

**Usage Data:**
- IP address
- Browser type and version
- Device information
- Pages visited and time spent
- Referring URL
- Operating system

**Location Data:**
- City/region (inferred from trip planning prompts)
- GPS coordinates (only if you enable location services)

**Cookies and Tracking:**
- Session cookies (required for functionality)
- Analytics cookies (with your consent)
- Preference cookies (to remember your settings)

### 2.3 Information from Third Parties

**AI Processing:**
- We use OpenAI's GPT-4 to process your event planning prompts. OpenAI may temporarily process your prompts according to their privacy policy (https://openai.com/privacy).

**Booking Partners:**
- When you make reservations through third-party providers (OpenTable, Resy, etc.), they collect data according to their privacy policies.

**Payment Processors:**
- If we process payments in the future, payment information will be handled by PCI-DSS compliant third parties (e.g., Stripe).

---

## 3. How We Use Your Information

We use your personal data for the following purposes:

### 3.1 Service Provision

- **Event Planning:** Process your prompts to generate personalized itineraries
- **Reservations:** Facilitate bookings at venues on your behalf
- **Notifications:** Send reminders about weather, headcount, dress codes, and timing
- **Calendar & PDFs:** Generate downloadable itineraries
- **Share Links:** Create public links for group sharing

### 3.2 Service Improvement

- Analyze usage patterns to improve our AI recommendations
- Fix bugs and technical issues
- Develop new features based on user feedback
- Conduct A/B testing (anonymized data only)

### 3.3 Communication

- Send transactional emails (confirmations, updates, notifications)
- Respond to customer support inquiries
- Send service announcements (with opt-out option)
- Marketing communications (only with explicit consent, opt-out available)

### 3.4 Legal Compliance

- Comply with legal obligations
- Enforce our Terms of Service
- Protect against fraud and abuse
- Respond to lawful requests from authorities

**Legal Basis (GDPR):**
- **Contract Performance:** Processing necessary to provide our services
- **Legitimate Interests:** Service improvement, fraud prevention, security
- **Consent:** Marketing communications, non-essential cookies
- **Legal Obligation:** Compliance with laws and regulations

---

## 4. How We Share Your Information

We **do not sell** your personal data. We share data only in the following circumstances:

### 4.1 Service Providers

We work with third-party providers who process data on our behalf:

**Infrastructure:**
- **Railway/Render:** Hosting and database services (US)
- **Vercel:** Frontend hosting (US)
- **AWS/GCP:** Cloud storage (US/EU regions)

**AI Services:**
- **OpenAI:** Trip planning AI processing (US) - See OpenAI Privacy Policy

**Communications:**
- **SendGrid/AWS SES:** Email delivery (US)
- **Twilio:** SMS notifications (US) (if enabled)
- **Expo/Firebase:** Push notifications (US)

**Monitoring:**
- **Sentry:** Error tracking (anonymized, US)
- **LogDNA/Papertrail:** Log aggregation (anonymized, US)

**Booking Partners:**
- **OpenTable, Resy, Seven Rooms:** Reservation platforms (US)

All service providers are contractually obligated to protect your data and use it only for specified purposes.

### 4.2 Legal Requirements

We may disclose your information if required by law or in good faith belief that such action is necessary to:
- Comply with legal obligations (subpoenas, court orders)
- Protect and defend our rights or property
- Prevent fraud or abuse
- Protect user safety

### 4.3 Business Transfers

If PartyPilot is acquired, merged, or sells assets, your information may be transferred to the new owner. We will notify you via email and/or prominent notice on our website.

### 4.4 With Your Consent

We may share information with third parties when you explicitly consent (e.g., sharing trip details via public link).

---

## 5. Data Retention

### 5.1 Active Accounts

- **Account Data:** Retained while your account is active
- **Trip Data:** Retained for 2 years after trip completion
- **Reservation Data:** Retained for 3 years (for dispute resolution)
- **Notification Data:** Deleted 90 days after sending

### 5.2 Deleted Accounts

When you delete your account:
- Personal identifiers are anonymized within 30 days
- Email addresses are replaced with "deleted-[random]@partypilot.app"
- Trip data is retained in anonymized form for analytics
- Reservation records are retained for legal compliance (anonymized)

### 5.3 Backup Retention

Backups containing your data may be retained for up to 90 days for disaster recovery purposes.

---

## 6. Your Rights (GDPR & CCPA)

### 6.1 Access & Portability

**Right to Access:** Request a copy of your personal data  
**Right to Data Portability:** Receive your data in machine-readable format (JSON)

To request: Email privacy@partypilot.app or use `/api/users/me/export` endpoint

### 6.2 Correction & Deletion

**Right to Rectification:** Update inaccurate information  
**Right to Erasure ("Right to be Forgotten"):** Request account deletion

To request: Email privacy@partypilot.app or use account settings

### 6.3 Restriction & Objection

**Right to Restrict Processing:** Limit how we use your data  
**Right to Object:** Object to processing based on legitimate interests

### 6.4 Withdraw Consent

You may withdraw consent at any time for:
- Marketing communications (unsubscribe link or account settings)
- Non-essential cookies (cookie settings)
- Data processing (close account)

### 6.5 Lodge a Complaint

If you're in the EU/EEA, you may file a complaint with your local data protection authority:
- EU: https://edpb.europa.eu/about-edpb/board/members_en
- UK: Information Commissioner's Office (ICO) - https://ico.org.uk

For US users (CCPA), contact the California Attorney General's Office.

### 6.6 Response Time

We will respond to rights requests within:
- **30 days** (GDPR standard)
- **45 days** (CCPA standard)

---

## 7. Data Security

### 7.1 Technical Measures

- **Encryption in Transit:** All data transmitted via TLS 1.3+ (HTTPS)
- **Encryption at Rest:** Database encryption enabled
- **Password Storage:** Bcrypt hashing with salt (cost factor 12)
- **Access Control:** Role-based permissions, least-privilege principle
- **Rate Limiting:** Protection against brute-force attacks
- **Regular Updates:** Security patches applied within 48 hours

### 7.2 Organizational Measures

- **Employee Training:** Annual data protection training
- **Access Audits:** Quarterly reviews of data access logs
- **Vendor Assessments:** Annual security audits of third-party providers
- **Incident Response Plan:** Documented breach notification procedures

### 7.3 Breach Notification

In the event of a data breach:
- Authorities notified within **72 hours** (GDPR requirement)
- Affected users notified via email within **72 hours**
- Breach details posted on website and social media

---

## 8. International Data Transfers

### 8.1 Data Location

- **Primary Servers:** United States (AWS US-East-1, Railway US)
- **EU Users:** Data may be transferred to the US for processing

### 8.2 Transfer Safeguards (GDPR Article 46)

We rely on:
- **Standard Contractual Clauses (SCCs):** Approved by the European Commission
- **Adequacy Decisions:** For transfers to countries with adequate protection
- **Your Explicit Consent:** When required by law

### 8.3 Your Rights Regarding Transfers

You may object to data transfers or request that your data be stored only in the EU/EEA (may limit service features).

---

## 9. Children's Privacy

PartyPilot is **not intended for users under 16 years old**. We do not knowingly collect data from children under 16.

If you believe a child has provided us with personal data:
- Contact us immediately at privacy@partypilot.app
- We will delete the data within 7 days

Parental consent is required for users aged 13-16 in the EU/EEA.

---

## 10. Cookies & Tracking Technologies

### 10.1 Types of Cookies

**Essential Cookies (Required):**
- Session management (authentication)
- Security (CSRF protection)
- Load balancing

**Functional Cookies (Optional):**
- Language preferences
- Theme preferences
- Collapsed menu states

**Analytics Cookies (Optional, Requires Consent):**
- Google Analytics (anonymized IP)
- Usage heatmaps
- Error tracking (Sentry)

### 10.2 Managing Cookies

- **Browser Settings:** Block cookies via browser preferences
- **Opt-Out Tools:** NAI opt-out (http://optout.networkadvertising.org)
- **Our Cookie Banner:** Manage preferences on first visit

### 10.3 Do Not Track

We honor "Do Not Track" (DNT) browser signals for analytics cookies.

---

## 11. Third-Party Links

Our service may contain links to third-party websites (venues, booking platforms). We are **not responsible** for their privacy practices. Please review their privacy policies before providing data.

---

## 12. California Privacy Rights (CCPA/CPRA)

If you're a California resident, you have additional rights:

### 12.1 Right to Know

Request disclosure of:
- Categories of personal data collected
- Sources of personal data
- Business purposes for collection
- Third parties with whom we share data

### 12.2 Right to Delete

Request deletion of your personal data (with exceptions for legal compliance).

### 12.3 Right to Opt-Out of Sale

We **do not sell personal data**, but you may opt out of future sales if our practices change.

### 12.4 Non-Discrimination

We will not discriminate against you for exercising your CCPA rights.

### 12.5 Authorized Agent

You may designate an authorized agent to make requests on your behalf (requires written authorization).

**To exercise CCPA rights:** Email privacy@partypilot.app with subject "CCPA Request"

---

## 13. Changes to This Privacy Policy

We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.

**Material Changes:**
- Email notification to registered users
- 30-day notice before taking effect
- Opt-out option for significant changes

**Checking for Updates:**
- Review this page regularly
- Subscribe to our privacy policy RSS feed (https://partypilot.app/privacy.xml)

---

## 14. Contact Us

**General Privacy Questions:** privacy@partypilot.app  
**Data Protection Officer (GDPR):** dpo@partypilot.app  
**Security Issues:** security@partypilot.app  
**Postal Address:** [Company Address]

**Response Time:** 5 business days for general inquiries, 30 days for rights requests.

---

## 15. Legal Disclaimer

This Privacy Policy is governed by the laws of the State of [Your State] and applicable federal laws. Any disputes will be resolved in the courts of [Your Jurisdiction].

---

**© 2025 PartyPilot, Inc. All rights reserved.**

