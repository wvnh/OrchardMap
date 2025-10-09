# 🚀 OrchardMap DevOps Quick Start

This guide helps you quickly set up and deploy OrchardMap to production.

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] GitHub account with repo access
- [ ] Supabase account (free tier works for getting started)

---

## 🏃 Quick Setup (15 minutes)

### 1. Local Development Setup (5 min)

```bash
# Clone the repository
git clone https://github.com/wvnh/OrchardMap.git
cd OrchardMap

# Install dependencies
npm install

# Start local Supabase
npm run db:start

# Test database setup
npm test

# Access Supabase Studio
open http://127.0.0.1:54325
```

**Verify**: You should see test data and no errors.

---

### 2. Production Supabase Setup (5 min)

1. **Create Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose region closest to users
   - Set strong password (save it!)
   - Wait ~2 minutes for initialization

2. **Get Credentials**
   - Dashboard → Settings → API
   - Copy:
     - Project URL
     - `anon` public key
     - `service_role` secret key (keep secure!)

3. **Deploy Database**
   ```bash
   # Login to Supabase
   supabase login
   
   # Link your project (replace with your project ref)
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Push migrations
   supabase db push
   ```

**Verify**: Check Supabase Dashboard → Database → Tables exist

---

### 3. GitHub Secrets Setup (2 min)

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
SUPABASE_ACCESS_TOKEN     # From: supabase.com/dashboard/account/tokens
SUPABASE_PROJECT_REF      # From your project URL
VITE_SUPABASE_URL        # Your full Supabase URL
VITE_SUPABASE_ANON_KEY   # Your anon key
VITE_APP_URL             # Your production domain (or temporary .netlify.app URL)
```

**For Netlify hosting, also add:**
```bash
NETLIFY_AUTH_TOKEN       # From: app.netlify.com/user/applications
NETLIFY_SITE_ID         # From: Site settings → General
```

---

### 4. Deploy to Production (3 min)

**Option A: Automatic (GitHub Actions)**

```bash
# Push to main branch triggers deployment
git push origin main

# Or manually trigger
# GitHub → Actions → Deploy to Production → Run workflow
```

**Option B: Manual Deployment**

```bash
# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Deploy
npm run deploy
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Production site loads: https://your-domain.com
- [ ] No console errors in browser
- [ ] Can access login page
- [ ] Database queries work
- [ ] HTTPS is enabled
- [ ] GitHub Actions workflows completed successfully

---

## 📚 Next Steps

### Essential

1. **Custom Domain** (Optional but recommended)
   - Netlify → Domain settings → Add custom domain
   - Configure DNS records
   - Wait for SSL certificate

2. **Monitoring Setup**
   - Supabase → Settings → Enable alerts
   - Add your email for critical alerts
   - Optional: Set up Sentry for error tracking

3. **Backup Verification**
   - Supabase → Database → Backups
   - Verify automatic backups enabled
   - Test restore procedure

### Recommended

- [ ] Set up staging environment
- [ ] Configure email provider (Supabase Auth)
- [ ] Add team members to Supabase project
- [ ] Document your deployment process
- [ ] Set up monitoring alerts

---

## 🆘 Troubleshooting

### Database Migration Fails

```bash
# Check migration status
supabase migration list

# Repair migrations if needed
supabase db repair

# Force reset (CAUTION: destructive)
supabase db reset
```

### Deployment Fails

1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure migrations applied successfully
4. Check Supabase Dashboard for errors

### Build Fails

```bash
# Check Node version
node --version  # Should be 20+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

### Can't Access Production Site

1. Check hosting platform status
2. Verify DNS records configured
3. Check SSL certificate status
4. Review deployment logs

---

## 📊 Useful Commands

```bash
# Development
npm run db:start          # Start local Supabase
npm run db:stop           # Stop local Supabase
npm run db:reset          # Reset database
npm test                  # Run tests

# Deployment
npm run deploy            # Deploy to production
npm run migrate:prod      # Run production migrations
npm run build             # Build frontend

# Debugging
npm run db:status         # Check Supabase status
supabase logs            # View Supabase logs
```

---

## 🔗 Important Links

- **Documentation**: [docs/deployment.md](./docs/deployment.md)
- **Production Checklist**: [docs/production-checklist.md](./docs/production-checklist.md)
- **Monitoring Guide**: [docs/monitoring.md](./docs/monitoring.md)
- **Security Policy**: [SECURITY.md](./SECURITY.md)

---

## 💬 Getting Help

- **GitHub Issues**: https://github.com/wvnh/OrchardMap/issues
- **Supabase Discord**: https://discord.supabase.com
- **Netlify Support**: https://answers.netlify.com

---

## 🎉 Success!

If you've completed all steps above, congratulations! Your OrchardMap instance is now deployed and ready to use.

**Next**: Start building features or invite your team to test the application.

---

*Estimated total time: 15-20 minutes*
