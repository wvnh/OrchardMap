# OrchardMap Frontend

Vue.js 3 + Quasar Framework frontend voor OrchardMap - Geografisch beheersysteem voor boomgaarden.

## 🚀 Tech Stack

- **Vue.js 3** - Progressive JavaScript Framework met Composition API
- **Quasar Framework** - High-performance Material Design component framework
- **Tailwind CSS** - Utility-first CSS framework voor custom styling
- **Vue Router** - Official router voor Vue.js applicaties
- **Pinia** - State management voor Vue 3
- **Supabase** - Backend-as-a-Service voor authenticatie en database
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type-safe JavaScript

## 📋 Prerequisites

- Node.js 20.19.0 of hoger
- npm 10.8.2 of hoger
- Supabase lokale instantie draaiend (zie root project README)

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local met je Supabase credentials
```

## 🏃 Development

```bash
# Start development server
npm run dev

# Development server draait op http://localhost:5173
```

## 🏗️ Build

```bash
# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## 📁 Project Structuur

```
frontend/
├── public/              # Statische assets
├── src/
│   ├── assets/         # Images, fonts, styles
│   ├── components/     # Vue componenten
│   ├── composables/    # Vue composables (useAuth, etc.)
│   ├── config/         # Configuratie bestanden (Supabase client)
│   ├── plugins/        # Vue plugins (Quasar)
│   ├── router/         # Vue Router configuratie
│   ├── stores/         # Pinia stores
│   ├── styles/         # Global styles en Quasar variables
│   ├── views/          # Page componenten
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── .env.local          # Lokale environment variabelen (niet in git)
├── .env.example        # Voorbeeld environment variabelen
├── index.html          # HTML entry point
├── package.json        # Dependencies en scripts
├── tailwind.config.js  # Tailwind CSS configuratie
├── tsconfig.json       # TypeScript configuratie
└── vite.config.ts      # Vite build configuratie
```

## 🎨 Features

✅ **Vue.js 3 Composition API** - Moderne, composable code structuur  
✅ **Quasar Components** - Material Design UI components  
✅ **Tailwind CSS** - Utility classes voor custom styling  
✅ **PWA Support** - Progressive Web App capabilities voor offline gebruik  
✅ **Responsive Design** - Werkt op desktop, tablet en mobiel  
✅ **TypeScript** - Type-safe ontwikkeling  
✅ **Supabase Integration** - Authenticatie en real-time database  
✅ **Hot Module Replacement** - Instant feedback tijdens development  

## 🔐 Authenticatie

Het project gebruikt Supabase voor authenticatie. De `useAuth` composable biedt:

```typescript
import { useAuth } from '@/composables/useAuth'

const { user, userRole, login, logout } = useAuth()

// Login
await login('email@example.com', 'password')

// Logout
await logout()

// Check user status
if (user.value) {
  console.log('Logged in as:', user.value.email)
  console.log('Role:', userRole.value)
}
```

## 🎯 Development Guidelines

Volg de architectuur richtlijnen in `.copilot-instructions.md` in de root van het project:

- **View Components** - Gebruik `<script setup>` en Composition API
- **Presentational Components** - Stateless, ontvang props via `defineProps`
- **Composables** - Herbruikbare logica isoleren
- **Styling** - Tailwind classes in templates, Quasar components voor UI elementen

## 📚 Documentatie

- [Vue.js 3 Docs](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/)

## 🤝 Contributing

Zie `GITHUB-WORKFLOW.md` in de root van het project voor development workflow.

## 📝 License

ISC
