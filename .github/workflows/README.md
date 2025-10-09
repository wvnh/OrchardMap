# GitHub Actions Workflows

This directory contains automated workflows for OrchardMap's CI/CD pipeline.

## 📋 Available Workflows

### 1. CI - Continuous Integration (`ci.yml`)

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Jobs:**
1. **Lint and Test**
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies
   - Runs linter (if configured)
   - Runs tests

2. **Database Migration Check**
   - Sets up Supabase CLI
   - Starts local Supabase instance
   - Applies all migrations
   - Verifies database setup with tests

3. **Security Audit**
   - Runs npm security audit
   - Scans for secrets in code (TruffleHog)

**Purpose:** Ensures code quality and security before merging.

---

### 2. Deploy to Production (`deploy.yml`)

**Triggers:**
- Push to `main` branch (automatic)
- Manual workflow dispatch

**Jobs:**
1. **Deploy Database Migrations**
   - Links to production Supabase project
   - Applies pending migrations
   - Verifies success

2. **Deploy Frontend**
   - Builds frontend with production environment variables
   - Deploys to Netlify or Vercel (based on configured secrets)
   - Depends on successful database deployment

3. **Notify Deployment Status**
   - Reports success or failure
   - Runs regardless of previous job status

**Required Secrets:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`
- `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` (or)
- `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID`

**Purpose:** Automated production deployment on merge to main.

---

### 3. Deploy to Staging (`staging.yml`)

**Triggers:**
- Push to `develop` or `staging` branches
- Pull requests with `deploy-staging` label
- Manual workflow dispatch

**Jobs:**
1. **Deploy to Staging Environment**
   - Deploys database migrations to staging
   - Builds frontend with staging environment variables
   - Deploys to staging hosting environment
   - Comments on PR with staging URL
   - Runs smoke tests (ready for implementation)

**Required Secrets:**
- Same as production, but with `_STAGING_` variants:
  - `SUPABASE_STAGING_PROJECT_REF`
  - `VITE_STAGING_SUPABASE_URL`
  - `VITE_STAGING_SUPABASE_ANON_KEY`
  - `VITE_STAGING_APP_URL`
  - `NETLIFY_STAGING_SITE_ID`

**Purpose:** Test changes in staging before production deployment.

**Usage:**
```bash
# Deploy current branch to staging
# Add label "deploy-staging" to PR

# Or push to develop/staging branch
git push origin develop
```

---

### 4. Environment Check (`environment-check.yml`)

**Triggers:**
- Daily schedule (9 AM UTC)
- Manual workflow dispatch

**Jobs:**
1. **Check Secrets**
   - Verifies all required secrets are configured
   - Reports missing secrets
   - Checks hosting platform credentials

2. **Check Supabase Health**
   - Tests connection to Supabase project
   - Verifies access token validity

3. **Check Dependencies**
   - Checks for outdated packages
   - Runs security audit
   - Identifies deprecated packages

4. **Summary**
   - Generates configuration summary
   - Reports overall health status

**Purpose:** Daily verification that the deployment configuration is healthy.

**Manual Trigger:**
```bash
# Go to: Actions → Environment Check → Run workflow
```

---

## 🔧 Configuration

### GitHub Secrets

Set these in: Repository → Settings → Secrets and variables → Actions

**Production:**
```
SUPABASE_ACCESS_TOKEN       # From supabase.com/dashboard/account/tokens
SUPABASE_PROJECT_REF        # Your project reference
VITE_SUPABASE_URL          # Production Supabase URL
VITE_SUPABASE_ANON_KEY     # Production anon key
VITE_APP_URL               # Production domain

# Hosting (choose one or both)
NETLIFY_AUTH_TOKEN         # Netlify deployment
NETLIFY_SITE_ID
# Or
VERCEL_TOKEN              # Vercel deployment
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**Staging (optional):**
```
SUPABASE_STAGING_PROJECT_REF
VITE_STAGING_SUPABASE_URL
VITE_STAGING_SUPABASE_ANON_KEY
VITE_STAGING_APP_URL
NETLIFY_STAGING_SITE_ID
```

### GitHub Environments

Configure in: Repository → Settings → Environments

1. **production**
   - Protection rules: Require approval for deployments
   - Environment secrets (if needed)

2. **staging**
   - No protection rules needed
   - Environment secrets (if different from repository secrets)

---

## 🚀 Workflow Usage

### Automatic Deployments

**Production:**
```bash
# Merge PR to main
git checkout main
git merge feature-branch
git push origin main
# → Triggers deploy.yml automatically
```

**Staging:**
```bash
# Push to develop
git push origin develop
# → Triggers staging.yml automatically
```

### Manual Deployments

**Production:**
1. Go to Actions → Deploy to Production
2. Click "Run workflow"
3. Select branch (usually `main`)
4. Select environment (production or staging)
5. Click "Run workflow"

**Staging:**
1. Go to Actions → Deploy to Staging
2. Click "Run workflow"
3. Select branch to deploy
4. Click "Run workflow"

### Deployment from PR

Add the label `deploy-staging` to any PR to trigger a staging deployment:

1. Open PR
2. Labels → Add `deploy-staging`
3. Workflow runs automatically
4. Comment appears with staging URL

---

## 📊 Monitoring Workflows

### View Workflow Runs

1. Go to repository → Actions tab
2. Select workflow from sidebar
3. View run history
4. Click on run for details

### Check Logs

1. Click on workflow run
2. Click on job name
3. Expand step to view logs
4. Download logs if needed

### Debugging Failed Workflows

1. Check error message in logs
2. Verify secrets are configured
3. Check Supabase project status
4. Review recent code changes
5. Re-run workflow if transient failure

---

## 🔐 Security Notes

- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate access tokens regularly
- Review workflow logs for sensitive data
- Use environment protection rules for production

---

## 🧪 Testing Workflows

### Test Locally with act

Install [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test workflow
act -j lint-and-test  # Test CI workflow
act -j check-secrets  # Test environment check
```

### Test in Fork

1. Fork repository
2. Configure secrets in fork
3. Push changes to fork
4. Verify workflows run correctly
5. Create PR to main repository

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)

---

## 🆘 Troubleshooting

### Workflow Not Triggering

- Check trigger conditions in workflow file
- Verify branch name matches trigger
- Check repository permissions

### Secrets Not Found

- Verify secret names match exactly (case-sensitive)
- Check secret is set in correct scope (repository vs environment)
- Verify workflow has access to environment

### Deployment Fails

- Check Supabase project status
- Verify hosting platform credentials
- Review migration logs
- Check build output for errors

### Database Migration Fails

- Test migrations locally first
- Check for breaking changes
- Verify RLS policies
- Review Supabase logs

---

*For detailed deployment information, see [docs/deployment.md](../docs/deployment.md)*
