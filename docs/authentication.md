# Authentication System - OrchardMap

## Overzicht

Het OrchardMap authenticatiesysteem biedt een complete oplossing voor gebruikersbeheer met role-based access control (RBAC), gebouwd op Supabase Auth.

## Architectuur

### Componenten

1. **Supabase Config** (`src/config/supabase.js`)
   - Geconfigureerde Supabase client
   - Support voor environment variables
   - Auto token refresh en session persistence

2. **useAuth Composable** (`src/composables/useAuth.js`)
   - Core authenticatie logica
   - Singleton pattern voor state sharing
   - Login, register, logout functionaliteit
   - Reactive user en role state

3. **Auth Store** (`src/stores/auth.js`)
   - Pinia store voor centralized state management
   - Loading en error state handling
   - Role-based helper functies

4. **Router Guards** (`src/router/index.js`)
   - Protected routes configuratie
   - Role-based access control
   - Automatic redirects

5. **UI Components** (`src/views/`)
   - LoginView.vue - Login formulier
   - RegisterView.vue - Registratie formulier
   - DashboardView.vue - Gebruiker dashboard
   - OrchardsView.vue - Boomgaarden beheer (role-protected)
   - PublicOrchardsView.vue - Publieke boomgaarden (geen auth vereist)

## Gebruikersrollen

Het systeem ondersteunt de volgende rollen uit de database:

| Rol | Beschrijving | Toegang |
|-----|--------------|---------|
| `admin` | Systeem beheerder | Volledige toegang |
| `orchard_manager` | Boomgaardbeheerder | Eigen boomgaarden beheren |
| `orchard_worker` | Medewerker | Toegewezen boomgaarden bewerken |
| `species_manager` | Soortenbeheerder | Boomsoorten database beheren |
| `registered_user` | Geregistreerde gebruiker | Basis toegang + permissions |
| Guest (niet ingelogd) | Gastgebruiker | Alleen publieke content |

## Features

### ✅ Geïmplementeerd

- **Login/Logout**: Email/wachtwoord authenticatie
- **Registratie**: Nieuwe gebruikers kunnen accounts aanmaken
- **Session Management**: Auto refresh en persistence
- **Protected Routes**: Routes beschermd op basis van auth state
- **Role-Based Access**: Routes beschermd op basis van gebruikersrol
- **Error Handling**: Gebruiksvriendelijke foutmeldingen
- **Loading States**: Visual feedback tijdens async operaties
- **Responsive UI**: Quasar components voor mobile-first design
- **Navigation Guards**: Automatische redirects voor auth/unauth gebruikers

### 🔐 Security Features

- **RLS Integration**: Werkt samen met Supabase Row Level Security
- **Token Storage**: Veilige opslag in localStorage
- **Auto Token Refresh**: Automatische token vernieuwing
- **Session Recovery**: Sessie herstellen na page refresh
- **CSRF Protection**: Via Supabase client

## Gebruik

### Installatie

```bash
# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Maak een `.env` bestand aan in de root:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Basis Gebruik

#### In een Component

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check auth status
console.log(authStore.isAuthenticated)
console.log(authStore.user)
console.log(authStore.userRole)

// Login
const handleLogin = async () => {
  const success = await authStore.handleLogin(email, password)
  if (success) {
    // Login successful
  }
}

// Check role
if (authStore.hasRole('admin')) {
  // Admin specific logic
}

if (authStore.hasAnyRole(['orchard_manager', 'admin'])) {
  // Manager or admin logic
}
</script>
```

#### Protected Route

```javascript
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    roles: ['admin']
  }
}
```

### Auth Store API

#### State

- `user` - Current user object (reactive)
- `userRole` - Current user role (computed)
- `isAuthenticated` - Boolean auth status (computed)
- `loading` - Loading state voor async operations
- `error` - Error message (null if no error)

#### Actions

- `handleLogin(email, password)` - Login gebruiker
- `handleRegister(email, password, metadata)` - Registreer nieuwe gebruiker
- `handleLogout()` - Logout gebruiker
- `clearError()` - Clear error message

#### Helpers

- `hasRole(role)` - Check single role
- `hasAnyRole(roles)` - Check multiple roles

## Routes

### Publieke Routes

- `/` - Home (redirect naar public-orchards)
- `/public-orchards` - Publieke boomgaarden (geen auth)
- `/login` - Login pagina
- `/register` - Registratie pagina

### Protected Routes

- `/dashboard` - Gebruiker dashboard (auth vereist)
- `/orchards` - Mijn boomgaarden (auth + role vereist)

## Testing

### Test Gebruikers (uit database seed)

De database bevat test gebruikers met verschillende rollen. Check `supabase/seed.sql` voor details.

### Test Scenario's

1. **Guest User Flow**
   - Bezoek `/public-orchards`
   - Zie alleen publieke boomgaarden
   - Kan niet naar `/orchards` of `/dashboard`

2. **Registration Flow**
   - Ga naar `/register`
   - Vul formulier in
   - Auto-login na registratie
   - Redirect naar dashboard

3. **Login Flow**
   - Ga naar `/login`
   - Login met credentials
   - Redirect naar dashboard of gevraagde pagina

4. **Role-Based Access**
   - Login als orchard_manager
   - Toegang tot `/orchards`
   - Login als registered_user
   - Geen toegang tot `/orchards`

5. **Session Persistence**
   - Login
   - Refresh pagina
   - User blijft ingelogd

## Integratie met RLS

Het authenticatiesysteem werkt naadloos samen met Supabase Row Level Security:

```javascript
// Supabase queries gebruiken automatisch de auth context
const { data } = await supabase
  .from('orchards')
  .select('*')
// RLS zorgt ervoor dat alleen toegankelijke boomgaarden worden geretourneerd
```

## Troubleshooting

### "User not authenticated" errors

- Check of Supabase lokaal draait: `supabase status`
- Controleer `.env` configuratie
- Check browser console voor auth errors

### Routes redirect niet correct

- Check `router/index.js` route meta configuratie
- Valideer dat auth state correct wordt geïnitialiseerd
- Check browser console voor navigation guard errors

### Sessie blijft niet behouden

- Controleer localStorage in browser DevTools
- Valideer `supabase.js` storage configuratie
- Check voor conflicterende auth keys in localStorage

## Volgende Stappen

Potentiële uitbreidingen:

- [ ] Password reset functionaliteit
- [ ] Email verificatie
- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Admin user management interface
- [ ] Role assignment UI
- [ ] Permission delegation
- [ ] Audit logging
- [ ] Session management (active sessions overzicht)

## Referenties

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Vue Router Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Quasar Components](https://quasar.dev/vue-components/)
