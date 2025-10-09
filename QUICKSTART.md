# OrchardMap - Quick Start Guide

## Installatie

### 1. Installeer dependencies

```bash
npm install
```

### 2. Configureer environment variables

Kopieer `.env.example` naar `.env`:

```bash
cp .env.example .env
```

Voor lokale ontwikkeling zijn de default waarden al correct ingesteld. Voor productie, pas de waarden aan:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Start Supabase (lokaal)

```bash
supabase start
```

### 4. Start development server

```bash
npm run dev
```

De applicatie draait nu op: http://localhost:3000

## Beschikbare Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview production build

## Authenticatie Testen

### Test Accounts

De database seed bevat test gebruikers. Check `supabase/seed.sql` voor credentials.

### Test Flows

1. **Als Guest**
   - Ga naar http://localhost:3000
   - Je wordt doorgestuurd naar `/public-orchards`
   - Bekijk publieke boomgaarden zonder in te loggen

2. **Registreren**
   - Klik op "Registreren" 
   - Vul het formulier in
   - Je wordt automatisch ingelogd en doorgestuurd naar dashboard

3. **Inloggen**
   - Ga naar login pagina
   - Vul credentials in
   - Word doorgestuurd naar dashboard

4. **Role-based Access**
   - Login met verschillende rollen
   - Bekijk welke menu items beschikbaar zijn
   - Probeer toegang tot protected routes

## Project Structuur

```
src/
├── composables/          # Vue composables
│   └── useAuth.js       # Auth logica
├── config/              # Configuratie
│   └── supabase.js      # Supabase client
├── router/              # Vue Router
│   └── index.js         # Routes + guards
├── stores/              # Pinia stores
│   └── auth.js          # Auth store
├── views/               # Page components
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── OrchardsView.vue
│   └── PublicOrchardsView.vue
├── App.vue              # Root component
└── main.js              # Entry point
```

## Troubleshooting

### "Cannot connect to Supabase"

- Check of Supabase draait: `supabase status`
- Restart Supabase: `supabase stop && supabase start`

### "Module not found" errors

- Controleer of alle dependencies zijn geïnstalleerd: `npm install`
- Clear node_modules en reinstall: `rm -rf node_modules && npm install`

### Routes werken niet

- Check of Vue Router correct is geconfigureerd
- Bekijk browser console voor errors
- Controleer navigation guards in `router/index.js`

## Documentatie

- [Authentication System](docs/authentication.md) - Complete auth documentatie
- [Database Schema](docs/database-schema.md) - Database structuur
- [User Stories](docs/user-stories.md) - User requirements

## Volgende Stappen

Na succesvolle installatie:

1. ✅ Authenticatie systeem werkend
2. 🔄 Implementeer CRUD operaties voor boomgaarden
3. 🔄 Voeg GPS/Map functionaliteit toe
4. 🔄 Implementeer tree management
5. 🔄 Voeg species management toe

Zie [PROJECT-STATUS.md](PROJECT-STATUS.md) voor complete roadmap.
