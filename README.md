# 🌳 OrchardMap

Een Vue.js 3 applicatie voor het beheren van meerdere boomgaarden met gedetailleerde boomsoorten informatie, GPS navigatie en gebruikersrollen.

## 🚀 Quick Start

```bash
# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env

# Start Supabase database
supabase start

# Start development server
npm run dev
```

Open http://localhost:3000 in je browser.

👉 **Zie [`QUICKSTART.md`](./QUICKSTART.md) voor gedetailleerde installatie instructies**

## 📋 Project Status

✅ **Database & Security**: Production-ready met RLS  
✅ **Documentatie**: Complete user stories en schema  
✅ **Authentication**: Complete auth systeem met role-based access control  
🔄 **Frontend**: CRUD operaties en advanced features  

👉 **Zie [GitHub Issues](https://github.com/wvnh/OrchardMap/issues) voor development roadmap**  
👉 **Zie [`GITHUB-WORKFLOW.md`](./GITHUB-WORKFLOW.md) voor branch workflow**  
👉 **Zie [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) voor volledige details**

## 🔐 Authentication Features

- ✅ Login/Logout met Supabase Auth
- ✅ User Registration met email verificatie
- ✅ Role-based access control (6 gebruikersrollen)
- ✅ Protected routes met Vue Router guards
- ✅ Session persistence en auto-refresh
- ✅ Pinia store voor centralized state management
- ✅ Quasar UI components voor responsive design

## 🗄️ Database

- **8 hoofdtabellen** met volledige relaties
- **27 enum types** voor data consistency  
- **RLS Security** voor alle gebruikersrollen
- **Test data** geladen en geverifieerd

## 📚 Documentatie

- [`QUICKSTART.md`](./QUICKSTART.md) - Snelle installatie gids
- [`docs/authentication.md`](./docs/authentication.md) - Complete auth documentatie
- [`docs/user-stories.md`](./docs/user-stories.md) - 6 rollen, 50+ user stories
- [`docs/database-schema.md`](./docs/database-schema.md) - Complete schema
- [`docs/project-overview.md`](./docs/project-overview.md) - Technische architectuur
