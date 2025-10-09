# 🚀 OrchardMap Production Deployment Guide

## 📋 Overview

This guide covers the complete production deployment process for OrchardMap, including Supabase backend setup, database migrations, and frontend hosting.

---

## ☁️ Cloud Infrastructure

### Supabase Backend

**Setup Instructions:**

1. **Create Production Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization and region (recommend: eu-west-1 for Europe)
   - Set database password (store securely!)
   - Wait for project initialization (~2 minutes)

2. **Get Project Credentials**
   - Go to Project Settings → API
   - Copy these values:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - `anon` public key
     - `service_role` key (keep secure!)
   - Go to Project Settings → Database
     - Copy Connection String

3. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and fill in your Supabase credentials
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Frontend Hosting

**Option 1: Netlify (Recommended)**

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `wvnh/OrchardMap`

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 20
   ```

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_APP_URL`

4. **Deploy**
   - Click "Deploy site"
   - Configure custom domain (optional)

**Option 2: Vercel**

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import from GitHub: `wvnh/OrchardMap`

2. **Configure**
   - Framework: Vue.js
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - Add the same variables as Netlify

---

## 🗄️ Database Migration

### Initial Production Setup

**Using Supabase CLI:**

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your production project
supabase link --project-ref your-project-ref

# 4. Apply all migrations
supabase db push

# 5. Verify migrations
supabase db remote commit
```

**Manual Setup (Alternative):**

1. Go to Supabase Dashboard → SQL Editor
2. Execute migrations in order:
   - `supabase/migrations/20251008130810_create_orchard_schema.sql`
   - `supabase/migrations/20251008150000_clean_rls_final.sql`
3. Optionally load seed data: `supabase/seed.sql`

### Future Migrations

**Automated via GitHub Actions:**
- Migrations run automatically on push to `main` branch
- See `.github/workflows/deploy.yml`

**Manual Migration:**
```bash
# Create new migration
supabase db diff -f new_migration_name

# Apply to production
supabase link --project-ref your-project-ref
supabase db push
```

---

## 🔐 Environment Variables & Secrets

### Required Secrets

**GitHub Secrets (for CI/CD):**
Go to Repository → Settings → Secrets and variables → Actions

Add these secrets:

```
# Supabase
SUPABASE_ACCESS_TOKEN       # Get from: supabase.com/dashboard/account/tokens
SUPABASE_PROJECT_REF        # Your project reference (from project URL)
VITE_SUPABASE_URL          # Public API URL
VITE_SUPABASE_ANON_KEY     # Public anon key
VITE_APP_URL               # Your production URL

# Hosting (choose one)
NETLIFY_AUTH_TOKEN         # Get from: netlify.com/user/tokens
NETLIFY_SITE_ID           # From site settings

# Or
VERCEL_TOKEN              # Get from: vercel.com/account/tokens
VERCEL_ORG_ID            # Organization ID
VERCEL_PROJECT_ID        # Project ID
```

### Local Development

```bash
# Use local Supabase instance
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

---

## 🔄 CI/CD Pipeline

### Automated Workflows

**Continuous Integration (`.github/workflows/ci.yml`)**
- Triggers on: Pull requests, pushes to `main`/`develop`
- Jobs:
  - Lint and test code
  - Verify database migrations
  - Security audit

**Deployment (`.github/workflows/deploy.yml`)**
- Triggers on: Push to `main`, manual workflow dispatch
- Jobs:
  1. Deploy database migrations
  2. Build and deploy frontend
  3. Notify deployment status

### Manual Deployment

Trigger manual deployment:
1. Go to Actions → Deploy to Production
2. Click "Run workflow"
3. Select environment (production/staging)
4. Click "Run workflow"

---

## 📊 Monitoring & Logging

### Supabase Dashboard

**Database Monitoring:**
- Dashboard → Database → Logs
- Monitor queries, connections, and performance
- Set up alerts for critical issues

**API Monitoring:**
- Dashboard → API → Logs
- Track API usage, errors, and latency
- Monitor RLS policy violations

### Application Monitoring (Optional)

**Sentry Integration:**

```bash
# Install Sentry
npm install @sentry/vue @sentry/vite-plugin

# Configure in vite.config.js
import * as Sentry from "@sentry/vite-plugin";

export default {
  plugins: [
    Sentry.sentryVitePlugin({
      org: "your-org",
      project: "orchardmap",
    }),
  ],
};
```

Add to environment variables:
```
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token
```

---

## 🔒 Security Checklist

- [ ] All secrets stored in GitHub Secrets (not in code)
- [ ] `.env` file added to `.gitignore`
- [ ] RLS policies enabled on all tables
- [ ] Service role key never exposed to frontend
- [ ] HTTPS/SSL enabled on production domain
- [ ] CORS configured properly in Supabase
- [ ] Rate limiting enabled
- [ ] Regular security audits via GitHub Actions

---

## 💾 Backup Strategy

### Automated Backups (Supabase)

**Daily Backups:**
- Supabase Pro plan: Automatic daily backups
- Retention: 7 days (Pro), 30 days (Team)
- Access: Dashboard → Database → Backups

**Point-in-Time Recovery:**
- Available on Pro plan and above
- Restore to any point in last 7 days

### Manual Backups

```bash
# Export database
supabase db dump -f backup.sql

# Restore database
supabase db reset --db-url "your-connection-string" --local-dir ./supabase/migrations
```

**Recommended Schedule:**
- Weekly manual backups before major changes
- Store backups in secure cloud storage (encrypted)
- Test restore process quarterly

---

## 🌐 Domain & SSL Configuration

### Custom Domain Setup

**Netlify:**
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate auto-generated

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records
4. SSL auto-configured

**Supabase Custom Domain:**
1. Supabase Pro plan required
2. Dashboard → Settings → Custom Domains
3. Add CNAME record to DNS
4. SSL auto-configured

---

## 🧪 Testing Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Test migrations locally
supabase db reset
node test-setup.js

# 2. Build frontend
npm run build

# 3. Test production build locally
npm run preview

# 4. Run security audit
npm audit

# 5. Check environment variables
cat .env.example
```

### Post-Deployment Verification

- [ ] Access production URL
- [ ] Test user authentication
- [ ] Verify database connectivity
- [ ] Check API endpoints
- [ ] Test CRUD operations
- [ ] Verify RLS policies working
- [ ] Check error logging
- [ ] Test mobile responsiveness

---

## 🐛 Troubleshooting

### Common Issues

**1. Migration Failures**
```bash
# Check migration status
supabase migration list

# Repair migrations
supabase db repair
```

**2. Environment Variable Issues**
- Verify all secrets are set in GitHub/hosting platform
- Check for typos in variable names
- Ensure `VITE_` prefix for frontend variables

**3. CORS Errors**
- Configure allowed origins in Supabase Dashboard
- Settings → API → CORS Origins
- Add your production domain

**4. RLS Policy Errors**
- Check policies in Supabase Dashboard → Authentication → Policies
- Verify JWT tokens are valid
- Test with different user roles

---

## 📞 Support & Resources

**Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)

**Community:**
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/wvnh/OrchardMap/issues)

**Emergency Contacts:**
- Database issues: Check Supabase status page
- Hosting issues: Check Netlify/Vercel status
- Code issues: Create GitHub issue

---

## 🔄 Update Process

### Rolling Updates

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop and test locally**
   ```bash
   supabase start
   npm run dev
   ```

3. **Create pull request**
   - CI pipeline runs automatically
   - Review changes
   - Merge to `main`

4. **Automatic deployment**
   - GitHub Actions deploys to production
   - Monitor deployment logs

### Rollback Procedure

**Frontend Rollback:**
- Netlify: Deployments → Select previous deploy → Publish
- Vercel: Deployments → Click previous → Promote to Production

**Database Rollback:**
```bash
# Restore from backup
supabase db reset --db-url "your-db-url" --local-dir ./backup
```

---

## 📈 Performance Optimization

### Production Checklist

- [ ] Enable caching in Supabase (PostgREST)
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Use connection pooling
- [ ] Monitor query performance
- [ ] Set up database indexes
- [ ] Enable Redis caching (optional)

### Monitoring Metrics

**Key Performance Indicators:**
- Response time < 200ms
- Database query time < 50ms
- API success rate > 99.9%
- Frontend load time < 2s
- Database connections < 50

---

## 🎯 Next Steps

After initial deployment:

1. [ ] Set up custom domain
2. [ ] Configure email templates (Supabase)
3. [ ] Enable database backups
4. [ ] Set up monitoring alerts
5. [ ] Configure rate limiting
6. [ ] Test disaster recovery
7. [ ] Document runbooks
8. [ ] Train team on deployment process

---

*Last updated: January 2025*
