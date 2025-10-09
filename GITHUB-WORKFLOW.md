# 🔄 GitHub Workflow Guide - OrchardMap

*Guide voor het werken met issues en branches in OrchardMap project*

## 📋 **GITHUB ISSUES OVERZICHT**

### 🎯 **Main Epic Issue**
- **#17** - 🌳 OrchardMap Frontend Development - Epic Tracking Issue
  - *Central tracking voor alle frontend ontwikkeling*

### 🔥 **Fase 1: Foundation (Hoge Prioriteit)**
- **#10** - 🎨 Frontend Project Setup - Vue.js 3 + Quasar Framework
- **#11** - 🔐 Authentication & Authorization System  
- **#12** - 🌳 Orchard Management Interface - CRUD Operations

### 🚀 **Fase 2: Core Features (Medium Prioriteit)**
- **#13** - 🗺️ GPS Integration & Mapping System
- **#14** - 👥 User Management & Permission System

### 📊 **Fase 3: Advanced Features (Lage Prioriteit)**
- **#15** - 📊 Analytics Dashboard & Data Visualization
- **#16** - 🚀 Production Deployment & DevOps Setup

---

## 🌿 **BRANCH WORKFLOW**

### **Main Branches**
```
main       ← Production ready code (beschermd)
develop    ← Integration branch voor features
```

### **Feature Branches**
```
feature/issue-10-frontend-setup
feature/issue-11-authentication  
feature/issue-12-orchard-management
feature/issue-13-gps-integration
feature/issue-14-user-management
feature/issue-15-analytics-dashboard
feature/issue-16-production-deployment
```

### **Hotfix Branches**
```
hotfix/critical-security-fix
hotfix/database-migration-fix
```

---

## 🔄 **DEVELOPMENT WORKFLOW**

### **1. Start New Feature**
```bash
# Sync met main
git checkout main
git pull origin main

# Maak feature branch voor issue
git checkout -b feature/issue-10-frontend-setup

# Push branch naar GitHub
git push -u origin feature/issue-10-frontend-setup
```

### **2. Development Process**
```bash
# Maak wijzigingen
# Test lokaal met: npm run dev

# Commit regelmatig
git add .
git commit -m "feat: add Vue.js project setup

- Installed Vue 3 with Composition API
- Added Quasar Framework components
- Configured Tailwind CSS
- Set up basic routing structure

Closes #10"

# Push naar feature branch
git push origin feature/issue-10-frontend-setup
```

### **3. Pull Request Process**
1. **Maak PR** van feature branch naar `develop`
2. **Link issue** in PR description met "Closes #10"
3. **Request review** (optioneel voor solo project)
4. **Merge** naar develop na tests
5. **Delete** feature branch na merge

### **4. Release Process**
```bash
# Test develop branch thoroughly
# Merge develop naar main voor release
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

---

## 🧪 **TESTING STRATEGY**

### **Per Feature Branch**
```bash
# Start database
supabase start

# Test database setup
node test-setup.js

# Run frontend tests
npm run test

# Test build process
npm run build
```

### **Voor Pull Request**
- [ ] Database migraties werken
- [ ] RLS policies blijven intact
- [ ] Frontend build succesvol
- [ ] No console errors
- [ ] Mobile responsive check

---

## 📝 **COMMIT MESSAGE CONVENTIONS**

```bash
# Feature additions
feat: add user authentication system

# Bug fixes
fix: resolve GPS accuracy issues on mobile

# Documentation updates
docs: update API documentation for tree endpoints

# Code refactoring
refactor: optimize database queries for orchard list

# Testing
test: add unit tests for authentication flow

# Build/deployment
build: configure production environment variables
```

---

## 🔗 **GITHUB LABELS GEBRUIKT**

- `enhancement` - New features
- `bug` - Bug fixes
- `documentation` - Documentation updates
- `frontend` - Frontend related work
- `authentication` - Auth system work
- `ui` - User interface improvements
- `gps` - GPS/mapping features
- `maps` - Mapping system
- `user-management` - User/permission features
- `analytics` - Dashboard/visualization
- `deployment` - Production/DevOps
- `devops` - CI/CD pipeline work
- `epic` - Major tracking issues
- `priority:high` - Must do first
- `priority:medium` - Important features
- `priority:low` - Nice to have

---

## 🚀 **NEXT STEPS**

### **Direct te doen:**
1. **Start met Issue #10** - Frontend Setup
   ```bash
   git checkout -b feature/issue-10-frontend-setup
   ```

2. **Volg de taken** in de issue description

3. **Test regelmatig** met database setup

4. **Maak PR** wanneer klaar

### **Voor elk issue:**
- Lees issue description volledig
- Maak feature branch
- Volg acceptatie criteria
- Test grondig voor PR
- Update epic issue #17 bij voltooiing

---

**🎯 Happy coding! De database foundation is rock-solid, nu de frontend magie beginnen! 🌳✨**