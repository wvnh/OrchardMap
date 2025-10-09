# 🌳 OrchardMap

Een Vue.js 3 applicatie voor het beheren van meerdere boomgaarden met gedetailleerde boomsoorten informatie, GPS navigatie en gebruikersrollen.

## 🚀 Quick Start

### Development (Local)

```bash
# Start Supabase database
supabase start

# Test database (optional)
npm test

# Supabase Studio
open http://127.0.0.1:54325
```

### Production Deployment

```bash
# Configure environment
cp .env.example .env
# Edit .env with your production credentials

# Deploy to production
npm run deploy

# Or deploy manually
npm run build
# Upload dist/ to your hosting platform
```

📚 **Full deployment guide**: See [`docs/deployment.md`](./docs/deployment.md)

## 📋 Project Status

✅ **Database & Security**: Production-ready met RLS  
✅ **Documentatie**: Complete user stories en schema  
✅ **DevOps & CI/CD**: Automated deployment pipeline  
🔄 **Frontend**: Ready voor ontwikkeling via GitHub Issues  

👉 **See [GitHub Issues](https://github.com/wvnh/OrchardMap/issues) for development roadmap**  
👉 **See [`GITHUB-WORKFLOW.md`](./GITHUB-WORKFLOW.md) for branch workflow**  
👉 **See [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) for complete details**

## 🗄️ Database

- **8 hoofdtabellen** met volledige relaties
- **27 enum types** voor data consistency  
- **RLS Security** voor alle gebruikersrollen
- **Test data** geladen en geverifieerd

## 📚 Documentatie

### Core Documentation
- [`docs/user-stories.md`](./docs/user-stories.md) - 6 roles, 50+ user stories
- [`docs/database-schema.md`](./docs/database-schema.md) - Complete schema
- [`docs/project-overview.md`](./docs/project-overview.md) - Technical architecture

### Operations & Deployment
- [`docs/deployment.md`](./docs/deployment.md) - Production deployment guide
- [`docs/monitoring.md`](./docs/monitoring.md) - Monitoring & operations
- [`.env.example`](./.env.example) - Environment configuration

## 🔧 NPM Scripts

```bash
# Database
npm run db:start      # Start local Supabase
npm run db:stop       # Stop local Supabase
npm run db:reset      # Reset database with migrations
npm test              # Run database tests

# Deployment
npm run deploy        # Full production deployment
npm run migrate       # Run database migrations
npm run migrate:local # Migrate local database
npm run migrate:prod  # Migrate production database

# Frontend (after setup)
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚀 CI/CD Pipeline

Automated workflows via GitHub Actions:

- **CI Pipeline** (`.github/workflows/ci.yml`):
  - Runs on pull requests and pushes
  - Linting and testing
  - Database migration verification
  - Security audits

- **Deployment** (`.github/workflows/deploy.yml`):
  - Automatic deployment on push to `main`
  - Database migrations
  - Frontend build and deploy
  - Health checks

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Environment variables for secrets
- ✅ GitHub Actions secrets management
- ✅ Automated security audits
- ✅ HTTPS/SSL for production

## 🌐 Hosting Options

- **Backend**: Supabase Cloud
- **Frontend**: Netlify or Vercel (configured in CI/CD)
- **Domain**: Custom domain with auto SSL

## 📊 Monitoring

- Supabase Dashboard (database, API, auth)
- GitHub Actions logs
- Optional: Sentry for error tracking
- See [`docs/monitoring.md`](./docs/monitoring.md) for details
