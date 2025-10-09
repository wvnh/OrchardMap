# 🚀 Quick Start Guide - OrchardMap Frontend

## Prerequisites

- Node.js 20.19.0 or higher
- npm 10.8.2 or higher
- Supabase local instance running (optional for development)

## 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

## 2️⃣ Configure Environment

The frontend uses environment variables to connect to Supabase. A local configuration is already set up in `.env.local`:

```bash
# .env.local is already created with local Supabase settings
# VITE_SUPABASE_URL=http://127.0.0.1:54321
# VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

For production, create a new `.env.production.local` file with your production Supabase credentials.

## 3️⃣ Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

## 4️⃣ Verify Installation

Open your browser and navigate to http://localhost:5173. You should see:

- ✅ Home page with "Welkom bij OrchardMap" 
- ✅ Quasar components rendering correctly
- ✅ Navigation working (click "Ga aan de slag" to visit About page)
- ✅ Responsive design (try resizing your browser)

## 🏗️ Build for Production

```bash
npm run build
```

Build artifacts will be in the `dist/` directory. The build includes:
- Optimized and minified JavaScript/CSS
- Service worker for PWA functionality
- Web manifest for installability

## 📱 Test Production Build Locally

```bash
npm run preview
```

Preview server will start on http://localhost:4173

## 🔍 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run test:unit` - Run unit tests (when added)
- `npm run test:e2e` - Run E2E tests with Playwright (when configured)

## 🎨 Technologies Included

- **Vue.js 3.5.22** - Progressive JavaScript framework
- **Quasar 2.18.5** - Vue UI component framework
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **TypeScript 5.9.0** - Type-safe JavaScript
- **Vite 7.1.9** - Next-generation frontend tooling
- **Vue Router 4.5.1** - Official router for Vue.js
- **Pinia 3.0.3** - State management
- **Supabase Client 2.75.0** - Backend integration
- **VueUse Core 13.9.0** - Collection of Vue composition utilities
- **Vite PWA Plugin** - Progressive Web App support

## 📂 Project Structure

```
frontend/
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── assets/         # Images, styles, fonts
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Vue composables (useAuth, etc.)
│   ├── config/         # Configuration files (Supabase)
│   ├── plugins/        # Vue plugins (Quasar setup)
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores for state management
│   ├── styles/         # Global styles & Quasar variables
│   ├── views/          # Page-level components
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── .env.local          # Local environment variables (not in git)
├── .env.example        # Example environment file
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔐 Authentication

The `useAuth` composable is already integrated and ready to use:

```typescript
import { useAuth } from '@/composables/useAuth'

const { user, userRole, login, logout } = useAuth()

// Login
await login('user@example.com', 'password')

// Check auth state
if (user.value) {
  console.log('Logged in as:', user.value.email)
  console.log('Role:', userRole.value)
}

// Logout
await logout()
```

## 🎯 Next Steps

1. ✅ Frontend setup complete
2. 🔜 Implement authentication UI (login/register forms)
3. 🔜 Create orchard management interface
4. 🔜 Add GPS and mapping features
5. 🔜 Build user management system

## 🆘 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port.

### Build Errors
Run `npm install` again to ensure all dependencies are installed correctly.

### Type Errors
Run `npm run type-check` to see TypeScript errors. The build will still work even with type warnings.

### Quasar Components Not Rendering
Ensure the Quasar plugin is properly loaded in `src/main.ts` and imported in components.

## 📚 Documentation

- [Project Overview](../docs/project-overview.md)
- [Database Schema](../docs/database-schema.md)
- [User Stories](../docs/user-stories.md)
- [Frontend README](./frontend/README.md)
- [Vue.js Docs](https://vuejs.org/)
- [Quasar Docs](https://quasar.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 🎉 Success!

Your OrchardMap frontend is now running! The foundation is set for building the complete application.

For questions or issues, check the documentation or create an issue on GitHub.
