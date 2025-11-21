# Backup and Disaster Recovery Strategy - PartyPilot

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Owner:** DevOps Team  
**Review Frequency:** Quarterly

---

## 1. Executive Summary

This document outlines PartyPilot's backup and disaster recovery (DR) strategy to ensure business continuity and data protection in case of:
- Hardware failures
- Software bugs or data corruption
- Security breaches or ransomware
- Natural disasters or regional outages
- Human error (accidental deletion)

### Key Metrics

- **RPO (Recovery Point Objective):** 1 hour (maximum data loss)
- **RTO (Recovery Time Objective):** 4 hours (maximum downtime)
- **Backup Frequency:** Continuous (streaming) + Daily snapshots
- **Retention Period:** 30 daily, 12 monthly, 7 yearly backups

---

## 2. Backup Strategy

### 2.1 Database Backups (PostgreSQL)

#### Continuous Backup (Write-Ahead Logging)

**Provider:** Railway / Render / Supabase (depending on deployment)

**Configuration:**
```yaml
# PostgreSQL configuration
wal_level: replica
archive_mode: on
archive_command: 'aws s3 cp %p s3://partypilot-wal-backups/%f'
```

**Benefits:**
- Point-in-time recovery (PITR) to any second
- Minimal performance impact
- Automatic failover support

#### Daily Full Backups

**Schedule:** Every day at 2:00 AM UTC (low-traffic period)

**Method:**
```bash
#!/bin/bash
# /opt/scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="partypilot-db-${DATE}.sql.gz"

# Create backup
pg_dump $DATABASE_URL | gzip > /tmp/${BACKUP_FILE}

# Upload to S3 with encryption
aws s3 cp /tmp/${BACKUP_FILE} \
  s3://partypilot-backups/daily/${BACKUP_FILE} \
  --server-side-encryption AES256

# Upload to secondary region (disaster recovery)
aws s3 cp /tmp/${BACKUP_FILE} \
  s3://partypilot-backups-eu/daily/${BACKUP_FILE} \
  --region eu-west-1 \
  --server-side-encryption AES256

# Cleanup local file
rm /tmp/${BACKUP_FILE}

# Log success
echo "$(date): Backup ${BACKUP_FILE} completed successfully" >> /var/log/partypilot-backup.log
```

**Cron Configuration:**
```cron
# Railway/Render cron job
0 2 * * * /opt/scripts/backup-database.sh
```

**Monitoring:**
- Slack alert if backup fails
- Email to ops@partypilot.app
- PagerDuty escalation if 2 consecutive failures

#### Weekly Full Backups (Additional)

**Schedule:** Every Sunday at 3:00 AM UTC

**Retention:**
- Keep all weekly backups for 12 weeks
- Move to Glacier storage after 12 weeks for cost optimization

### 2.2 Application Code & Configuration

**Git Repository Backups:**
- **Primary:** GitHub (US-East)
- **Mirror:** GitLab (EU-West) - Daily sync
- **Local Archive:** Weekly tarball to S3

**Docker Images:**
- **Primary Registry:** Docker Hub / GitHub Container Registry
- **Backup Registry:** AWS ECR (private)
- **Retention:** Keep last 20 production images

**Environment Variables:**
- **Encrypted Storage:** AWS Secrets Manager / Vault
- **Backup:** Weekly export to encrypted S3 bucket
- **Access Control:** Only DevOps team has read access

### 2.3 User-Generated Content

**Uploaded Files (if applicable):**
- **Primary Storage:** S3 US-East-1
- **Replication:** S3 Cross-Region Replication to EU-West-1
- **Versioning:** Enabled (retain 30 versions)
- **Lifecycle:** Delete versions older than 90 days

**Generated PDFs & ICS Files:**
- Stored in database (as BLOBs) or S3
- Included in database backups
- Regenerated on-demand if lost

---

## 3. Backup Testing & Verification

### 3.1 Automated Verification

**Daily Backup Integrity Check:**
```bash
#!/bin/bash
# Verify backup is not corrupted

LATEST_BACKUP=$(aws s3 ls s3://partypilot-backups/daily/ | sort | tail -n 1 | awk '{print $4}')

# Download and test restore to staging DB
aws s3 cp s3://partypilot-backups/daily/${LATEST_BACKUP} /tmp/test-backup.sql.gz
gunzip /tmp/test-backup.sql.gz

# Attempt restore to test database
psql $TEST_DATABASE_URL < /tmp/test-backup.sql

if [ $? -eq 0 ]; then
  echo "$(date): Backup verification successful" >> /var/log/partypilot-backup.log
else
  echo "$(date): BACKUP VERIFICATION FAILED!" >> /var/log/partypilot-backup.log
  # Trigger alert
  curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"🚨 BACKUP VERIFICATION FAILED!"}'
fi
```

### 3.2 Monthly Restore Drills

**Schedule:** First Tuesday of every month

**Procedure:**
1. Select a random backup from the past month
2. Restore to isolated staging environment
3. Run smoke tests:
   - User authentication
   - Trip creation
   - Reservation booking
   - PDF/ICS generation
4. Measure restore time (should be < 4 hours RTO)
5. Document results in ops runbook

### 3.3 Quarterly Full DR Test

**Schedule:** March, June, September, December

**Procedure:**
1. Simulate complete regional outage
2. Restore from secondary region (EU backup)
3. Failover DNS to secondary deployment
4. Test all critical user journeys
5. Measure total recovery time
6. Document lessons learned

---

## 4. Disaster Recovery Procedures

### 4.1 Scenario 1: Database Corruption

**Detection:**
- Application errors indicating data inconsistency
- Checksum failures in backup verification

**Recovery Steps:**
1. **Isolate:** Stop application servers to prevent further corruption
2. **Assess:** Determine scope of corruption (single table vs. entire DB)
3. **Restore:**
   ```bash
   # Stop API
   railway down

   # Restore from most recent clean backup
   aws s3 cp s3://partypilot-backups/daily/partypilot-db-20251120.sql.gz /tmp/
   gunzip /tmp/partypilot-db-20251120.sql.gz
   psql $DATABASE_URL < /tmp/partypilot-db-20251120.sql

   # Verify data integrity
   npm run test:integration

   # Restart API
   railway up
   ```
4. **Verify:** Run smoke tests
5. **Notify:** Email users about potential data loss (if any)

**Estimated RTO:** 2-4 hours

### 4.2 Scenario 2: Complete Regional Outage (AWS US-East-1 Down)

**Detection:**
- AWS Status Dashboard shows regional outage
- Application unreachable for 15+ minutes
- Multiple monitoring alerts

**Recovery Steps:**
1. **Activate DR Plan:**
   - Notify incident commander
   - Assemble on-call team
   - Update status page (https://status.partypilot.app)

2. **Failover to EU Region:**
   ```bash
   # Switch DNS to EU deployment
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z123456789ABC \
     --change-batch file://dns-failover-eu.json

   # Deploy to EU servers
   cd /opt/partypilot
   git pull origin main
   railway deploy --region eu-west-1

   # Restore from EU backup if needed
   aws s3 cp s3://partypilot-backups-eu/daily/latest.sql.gz /tmp/
   psql $EU_DATABASE_URL < /tmp/latest.sql
   ```

3. **Verify EU Deployment:**
   - Test authentication
   - Create test trip
   - Monitor error rates

4. **Communicate:**
   - Post status update: "Service restored on EU servers"
   - Email customers with explanation
   - Update Twitter/social media

**Estimated RTO:** 3-6 hours (DNS propagation delay)

### 4.3 Scenario 3: Ransomware Attack

**Detection:**
- Unusual file encryption activity
- Ransom note or locked accounts
- Security alerts from Sentry/Cloudflare

**Recovery Steps:**
1. **Immediate Isolation:**
   - Disconnect compromised servers from network
   - Revoke all API keys and tokens
   - Reset all passwords

2. **Forensic Analysis:**
   - Determine infection vector
   - Identify scope of compromise
   - Preserve evidence for law enforcement

3. **Clean Restore:**
   - Provision fresh servers in isolated VPC
   - Restore from backup **before** infection timestamp
   - Scan all backups for malware before restore

4. **Security Hardening:**
   - Patch vulnerabilities exploited by attacker
   - Enable additional security controls (WAF, 2FA)
   - Rotate all secrets

5. **Communication:**
   - Notify affected users within 72 hours (GDPR)
   - Report breach to authorities
   - Offer credit monitoring (if PII exposed)

**Estimated RTO:** 8-24 hours (includes security assessment)

### 4.4 Scenario 4: Accidental Data Deletion

**Detection:**
- User reports missing trips or reservations
- Admin accidentally deletes production data

**Recovery Steps:**
1. **Point-in-Time Recovery (if < 24 hours):**
   ```bash
   # Restore database to specific timestamp
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier partypilot-prod \
     --target-db-instance-identifier partypilot-restore-temp \
     --restore-time 2025-11-21T10:30:00Z

   # Export specific deleted records
   psql -h partypilot-restore-temp.xxxx.rds.amazonaws.com \
     -c "COPY (SELECT * FROM trips WHERE user_id = 'user-123') TO STDOUT" \
     > /tmp/deleted-trips.csv

   # Import into production
   psql $DATABASE_URL \
     -c "COPY trips FROM '/tmp/deleted-trips.csv' CSV"
   ```

2. **Verify Recovery:**
   - Contact affected user
   - Confirm data is restored
   - Run integrity checks

**Estimated RTO:** 30 minutes - 2 hours

---

## 5. Backup Retention Policy

### 5.1 Retention Schedule

| Backup Type | Frequency | Retention | Storage Tier |
|-------------|-----------|-----------|--------------|
| WAL Archives | Continuous | 7 days | S3 Standard |
| Daily Snapshots | Daily | 30 days | S3 Standard |
| Weekly Snapshots | Weekly | 12 weeks | S3 IA (Infrequent Access) |
| Monthly Snapshots | Monthly | 12 months | S3 IA |
| Yearly Snapshots | Yearly | 7 years | S3 Glacier |

### 5.2 Lifecycle Policy

**Automated S3 Lifecycle Rules:**
```json
{
  "Rules": [
    {
      "Id": "DailyBackupLifecycle",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "daily/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    },
    {
      "Id": "YearlyBackupLifecycle",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "yearly/"
      },
      "Transitions": [
        {
          "Days": 7,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
```

### 5.3 Compliance Requirements

**GDPR Article 17 (Right to Erasure):**
- Deleted user data removed from backups after **90 days**
- Backups containing deleted user PII are excluded from long-term retention
- Exception: Anonymized data retained for legal compliance

**Financial Records (if payments added):**
- Transaction records retained for **7 years** (IRS requirement)
- Stored in separate compliance bucket

---

## 6. Monitoring & Alerting

### 6.1 Backup Success Monitoring

**Metrics Tracked:**
- Backup duration
- Backup size
- Number of failed backups
- Time since last successful backup

**Alerts:**
- **Warning:** Backup duration > 30 minutes
- **Critical:** Backup failed
- **Critical:** No successful backup in 25 hours

**Notification Channels:**
- Slack #devops-alerts
- Email: ops@partypilot.app
- PagerDuty (for critical alerts)

### 6.2 Storage Usage Monitoring

**CloudWatch Metrics:**
- S3 bucket size
- S3 request count
- Cost per month

**Alerts:**
- **Warning:** Backup storage > 80% of budget
- **Critical:** Unexpected 2x growth in 24 hours (possible runaway backups)

---

## 7. Roles & Responsibilities

| Role | Responsibility | Contact |
|------|----------------|---------|
| **Incident Commander** | Declare disaster, coordinate recovery | ops@partypilot.app |
| **Database Admin** | Execute database restores | dba@partypilot.app |
| **DevOps Engineer** | Infrastructure provisioning, DNS failover | devops@partypilot.app |
| **Security Lead** | Forensic analysis (breach scenarios) | security@partypilot.app |
| **Customer Support** | User communication, status updates | support@partypilot.app |

**On-Call Rotation:**
- Primary: Weekly rotation among DevOps team
- Secondary: Database Admin
- Escalation: CTO

---

## 8. Cost Estimation

### 8.1 Monthly Backup Costs

| Item | Storage | Monthly Cost (USD) |
|------|---------|-------------------|
| Daily Backups (30 days @ 5GB each) | 150 GB | $3.45 (S3 Standard) |
| Weekly Backups (12 weeks @ 5GB each) | 60 GB | $0.78 (S3 IA) |
| Monthly Backups (12 months @ 5GB each) | 60 GB | $0.78 (S3 IA) |
| Yearly Backups (7 years @ 5GB each) | 35 GB | $0.14 (S3 Glacier) |
| WAL Archives (7 days @ 500MB/day) | 3.5 GB | $0.08 (S3 Standard) |
| Cross-Region Replication (EU) | 305 GB | $7.32 (S3 Standard EU) |
| Data Transfer (uploads) | ~ | $1.00 |
| **Total** | **614 GB** | **$13.55/month** |

### 8.2 DR Infrastructure Costs

| Item | Monthly Cost (USD) |
|------|-------------------|
| EU Standby Database (Railway) | $20 (scaled down) |
| EU API Server (dormant) | $0 (only during failover) |
| Route53 Health Checks | $0.50 |
| **Total** | **$20.50/month** |

**Total Monthly DR Budget:** ~$35/month (~$420/year)

---

## 9. Continuous Improvement

### 9.1 Quarterly Review

**Agenda:**
- Review RTO/RPO targets (are they still appropriate?)
- Analyze DR drill results
- Update runbooks based on lessons learned
- Optimize backup storage costs

### 9.2 Annual Audit

**External Audit (recommended):**
- SOC 2 Type II certification
- Penetration testing of DR procedures
- Compliance review (GDPR, CCPA)

---

## 10. Quick Reference Cheat Sheet

### Emergency Contacts

```
Incident Hotline: +1 (XXX) XXX-XXXX
Slack: #incident-response
PagerDuty: https://partypilot.pagerduty.com
Status Page: https://status.partypilot.app
```

### Common Commands

```bash
# List recent backups
aws s3 ls s3://partypilot-backups/daily/ --recursive | tail -n 30

# Restore database (PostgreSQL)
gunzip -c backup.sql.gz | psql $DATABASE_URL

# Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier partypilot-prod \
  --target-db-instance-identifier partypilot-recovery \
  --restore-time 2025-11-21T10:30:00Z

# DNS failover to EU
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789ABC \
  --change-batch file://dns-failover-eu.json
```

---

**Document Control:**
- **Version:** 1.0
- **Last Tested:** November 2025
- **Next Review:** February 2026
- **Approved By:** CTO

**For questions or updates, contact:** ops@partypilot.app

