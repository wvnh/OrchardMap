# 📊 OrchardMap Monitoring & Operations Guide

## 🎯 Overview

This guide covers monitoring, alerting, and operational procedures for OrchardMap in production.

---

## 📈 Performance Monitoring

### Supabase Metrics

**Database Performance:**
- Dashboard → Database → Performance
- Key metrics:
  - Query execution time
  - Connection pool usage
  - Cache hit rate
  - Database size

**API Performance:**
- Dashboard → API → Usage
- Metrics:
  - Request rate
  - Response time
  - Error rate
  - Rate limit hits

**Real-time Monitoring:**
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Slow queries (> 1 second)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Frontend Monitoring

**Web Vitals:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

**Browser DevTools:**
```javascript
// Performance monitoring in production
if (import.meta.env.PROD) {
  // Log Core Web Vitals
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry.name, entry.value);
    }
  }).observe({ entryTypes: ['web-vital'] });
}
```

---

## 🚨 Error Tracking

### Sentry Integration (Optional)

**Setup:**
```javascript
// src/main.js
import * as Sentry from "@sentry/vue";

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  tracesSampleRate: 1.0,
});
```

**Error Handling:**
```javascript
// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  Sentry.captureException(err, {
    contexts: {
      vue: {
        componentName: instance?.$options.name,
        info
      }
    }
  });
};
```

### Supabase Error Logs

**Access Logs:**
- Dashboard → Logs → API
- Filter by:
  - Status code
  - HTTP method
  - Time range
  - User ID

**Database Logs:**
- Dashboard → Logs → Database
- Monitor:
  - Connection errors
  - Query errors
  - Permission denied errors
  - Slow queries

---

## ⚙️ Health Checks

### API Health Check

**Endpoint:**
```javascript
// src/utils/healthcheck.js
export async function checkHealth() {
  const results = {
    database: false,
    auth: false,
    storage: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Check database connection
    const { data, error } = await supabase
      .from('orchards')
      .select('id')
      .limit(1);
    
    results.database = !error;
  } catch (e) {
    console.error('Database check failed:', e);
  }

  try {
    // Check auth service
    const { data } = await supabase.auth.getSession();
    results.auth = true;
  } catch (e) {
    console.error('Auth check failed:', e);
  }

  return results;
}
```

### Automated Health Monitoring

**GitHub Actions (Uptime Monitor):**
```yaml
# .github/workflows/uptime.yml
name: Uptime Check

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Health
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${{ secrets.VITE_APP_URL }})
          if [ $RESPONSE -ne 200 ]; then
            echo "⚠️ Health check failed: HTTP $RESPONSE"
            exit 1
          fi
          echo "✅ Health check passed"
```

---

## 📊 Database Monitoring

### Key Queries

**User Activity:**
```sql
-- Active users in last 24 hours
SELECT COUNT(DISTINCT user_id) as active_users
FROM orchard_access_log
WHERE accessed_at > NOW() - INTERVAL '24 hours';

-- Most active orchards
SELECT 
  o.name,
  COUNT(*) as access_count
FROM orchard_access_log l
JOIN orchards o ON o.id = l.orchard_id
WHERE l.accessed_at > NOW() - INTERVAL '7 days'
GROUP BY o.id, o.name
ORDER BY access_count DESC
LIMIT 10;
```

**Data Growth:**
```sql
-- Record counts
SELECT 
  'orchards' as table_name, COUNT(*) as count FROM orchards
UNION ALL
SELECT 'orchard_trees', COUNT(*) FROM orchard_trees
UNION ALL
SELECT 'tree_species', COUNT(*) FROM tree_species
UNION ALL
SELECT 'users', COUNT(*) FROM auth.users;

-- Growth over time
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_orchards
FROM orchards
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date;
```

**Performance Issues:**
```sql
-- Orphaned records (trees without species)
SELECT COUNT(*) FROM orchard_trees
WHERE species_id IS NULL;

-- Large orchards (might need optimization)
SELECT 
  o.name,
  COUNT(t.id) as tree_count
FROM orchards o
LEFT JOIN orchard_trees t ON t.orchard_id = o.id
GROUP BY o.id, o.name
HAVING COUNT(t.id) > 1000
ORDER BY tree_count DESC;
```

### Database Maintenance

**Vacuum and Analyze:**
```sql
-- Run weekly
VACUUM ANALYZE;

-- Check bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Index Maintenance:**
```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE '%_pkey';

-- Rebuild indexes if needed
REINDEX TABLE table_name;
```

---

## 🔐 Security Monitoring

### Failed Authentication Attempts

```sql
-- Check auth logs in Supabase dashboard
-- Dashboard → Authentication → Logs

-- Monitor for:
-- - Multiple failed login attempts
-- - Unusual geographic access
-- - API rate limit hits
-- - RLS policy violations
```

### Access Audit Log

```sql
-- Create audit table if not exists
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Query recent actions
SELECT 
  u.email,
  a.action,
  a.table_name,
  a.created_at
FROM audit_log a
LEFT JOIN auth.users u ON u.id = a.user_id
ORDER BY a.created_at DESC
LIMIT 100;
```

### Security Checklist

- [ ] All secrets stored securely (GitHub Secrets, env vars)
- [ ] RLS policies active on all tables
- [ ] No exposed service role keys
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Regular dependency audits (`npm audit`)
- [ ] Database backups verified

---

## 📧 Alerting Setup

### Critical Alerts

**1. Database Down:**
- Monitor: Connection errors in Supabase logs
- Action: Check Supabase status, escalate if needed
- SLA: < 5 minutes response time

**2. High Error Rate:**
- Monitor: API error rate > 5%
- Action: Check recent deployments, review error logs
- SLA: < 15 minutes response time

**3. Performance Degradation:**
- Monitor: API response time > 2s
- Action: Check slow queries, database load
- SLA: < 30 minutes response time

**4. Deployment Failure:**
- Monitor: GitHub Actions workflow failures
- Action: Review logs, rollback if needed
- SLA: < 10 minutes response time

### Warning Alerts

- Database storage > 80% capacity
- Connection pool > 80% utilized
- API rate limit hits increasing
- Unusual traffic patterns

### Alert Channels

**Email Notifications:**
- Supabase Dashboard → Project Settings → Alerts
- Configure email recipients
- Set thresholds for alerts

**Slack Integration (Optional):**
```javascript
// Webhook notification
async function sendSlackAlert(message) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });
}
```

---

## 📋 Operational Runbooks

### Incident Response

**1. Service Degradation:**
```bash
# Check service status
curl -I https://your-app.com

# Check Supabase status
https://status.supabase.com

# Review recent changes
git log --oneline -10

# Check error logs
# Supabase Dashboard → Logs
```

**2. Database Issues:**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
AND query_start < NOW() - INTERVAL '5 minutes';

-- Check disk usage
SELECT pg_size_pretty(pg_database_size(current_database()));
```

**3. Rollback Procedure:**
```bash
# Frontend rollback
# Netlify: Dashboard → Deploys → Previous Deploy → Publish
# Vercel: Dashboard → Deployments → Previous → Promote

# Database rollback
supabase db reset --db-url "connection-string"
# Then restore from backup
```

### Planned Maintenance

**Database Maintenance Window:**
1. Announce maintenance (email/banner)
2. Create database backup
3. Enable maintenance mode
4. Apply changes
5. Verify functionality
6. Disable maintenance mode
7. Monitor for issues

**Deployment Window:**
1. Review changes in staging
2. Run pre-deployment checks
3. Deploy during low-traffic period
4. Monitor error rates
5. Verify critical paths
6. Document any issues

---

## 📊 Reporting

### Daily Report

**Automated Daily Stats:**
```sql
-- Generate daily report
SELECT
  DATE(NOW()) as report_date,
  (SELECT COUNT(*) FROM orchards WHERE created_at::date = CURRENT_DATE) as new_orchards,
  (SELECT COUNT(*) FROM orchard_trees WHERE created_at::date = CURRENT_DATE) as new_trees,
  (SELECT COUNT(DISTINCT user_id) FROM orchard_access_log WHERE accessed_at::date = CURRENT_DATE) as active_users,
  (SELECT COUNT(*) FROM auth.users WHERE created_at::date = CURRENT_DATE) as new_users;
```

### Weekly Report

- Total users (active vs inactive)
- Growth metrics (orchards, trees, species)
- Performance trends
- Error rate
- Top issues/bugs
- Deployment summary

### Monthly Report

- User retention
- Feature usage statistics
- Performance benchmarks
- Security incidents
- Cost analysis
- Capacity planning

---

## 💰 Cost Monitoring

### Supabase Usage

**Monitor:**
- Dashboard → Billing → Usage
- Database storage
- Bandwidth usage
- API requests
- Auth requests

**Optimization Tips:**
- Enable caching where possible
- Optimize queries (indexes, limit results)
- Use connection pooling
- Compress images/assets
- Archive old data

**Hosting Costs:**
- Netlify/Vercel usage
- CDN bandwidth
- Custom domain
- SSL certificates

---

## 🔄 Backup & Recovery

### Backup Schedule

**Automated (Supabase):**
- Daily backups (last 7 days)
- Point-in-time recovery
- Geographic redundancy

**Manual Backups:**
```bash
# Weekly full backup
./scripts/backup-database.sh

# Before major changes
supabase db dump -f backup-$(date +%Y%m%d).sql
```

### Recovery Procedures

**Database Recovery:**
```bash
# Restore from Supabase backup
# Dashboard → Database → Backups → Restore

# Restore from manual backup
psql "connection-string" < backup.sql
```

**Test Recovery Quarterly:**
1. Create test environment
2. Restore backup
3. Verify data integrity
4. Test application functionality
5. Document any issues

---

## 📱 On-Call Procedures

### On-Call Rotation

**Responsibilities:**
- Respond to critical alerts (< 5 min)
- Monitor system health
- Coordinate incident response
- Document incidents

**Contact Information:**
- Primary: [Phone/Email]
- Secondary: [Phone/Email]
- Escalation: [Phone/Email]

### Escalation Matrix

**Level 1: Warning**
- Response: Within 1 hour
- Handler: On-call engineer
- Examples: High resource usage, slow queries

**Level 2: Urgent**
- Response: Within 15 minutes
- Handler: On-call + Tech lead
- Examples: Partial outage, high error rate

**Level 3: Critical**
- Response: Immediate
- Handler: All hands
- Examples: Complete outage, data loss, security breach

---

## 📚 Resources

**Documentation:**
- [Supabase Monitoring](https://supabase.com/docs/guides/platform/metrics)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/monitoring.html)
- [Vue Performance](https://vuejs.org/guide/best-practices/performance.html)

**Tools:**
- Supabase Dashboard
- GitHub Actions
- Browser DevTools
- PostgreSQL queries

**Support:**
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/wvnh/OrchardMap/issues

---

*Last updated: January 2025*
