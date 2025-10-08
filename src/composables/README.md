# useAuth Composable

## Overzicht

De `useAuth` composable is een centrale authenticatie-oplossing voor de Orchard Manager App. Het biedt reactieve toegang tot de Supabase-gebruiker en authenticatiestatus in alle Vue components en composables.

## Locatie

```
src/composables/useAuth.js
```

## Gebruik

### Importeren

```javascript
import { useAuth } from '@/composables/useAuth'
```

### In een View Component

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, userRole, login, logout } = useAuth()

// Controleer of gebruiker is ingelogd
console.log('Ingelogd:', !!user.value)
console.log('Gebruikersrol:', userRole.value)
</script>

<template>
  <div v-if="user">
    <p>Welkom, {{ user.email }}</p>
    <p>Jouw rol: {{ userRole }}</p>
    <button @click="logout">Uitloggen</button>
  </div>
  <div v-else>
    <p>Je bent niet ingelogd</p>
  </div>
</template>
```

### Login Voorbeeld

```javascript
const { login } = useAuth()

const handleLogin = async () => {
  try {
    await login('user@example.com', 'password123')
    console.log('Login succesvol!')
  } catch (error) {
    console.error('Login mislukt:', error.message)
  }
}
```

### Logout Voorbeeld

```javascript
const { logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    console.log('Logout succesvol!')
  } catch (error) {
    console.error('Logout mislukt:', error.message)
  }
}
```

## API

### Exposed Properties

#### `user` (ref)
- **Type:** `Ref<User | null>`
- **Beschrijving:** Reactieve referentie naar de ingelogde Supabase-gebruiker
- **Waarde:** `null` wanneer geen gebruiker is ingelogd

#### `userRole` (computed)
- **Type:** `ComputedRef<string | null>`
- **Beschrijving:** Berekende eigenschap die de rol van de gebruiker retourneert
- **Prioriteit:**
  1. `user.user_metadata.role`
  2. `user.app_metadata.role`
  3. Standaard: `'Owner'` (voor ingelogde gebruikers zonder specifieke rol)
  4. `null` (wanneer geen gebruiker is ingelogd)

### Functies

#### `login(email, password)`
- **Parameters:**
  - `email` (string): Email van de gebruiker
  - `password` (string): Wachtwoord van de gebruiker
- **Returns:** `Promise<Object>` - Supabase auth response
- **Throws:** `Error` - Als login mislukt
- **Beschrijving:** Logt een gebruiker in met email en wachtwoord

#### `logout()`
- **Parameters:** Geen
- **Returns:** `Promise<void>`
- **Throws:** `Error` - Als logout mislukt
- **Beschrijving:** Logt de huidige gebruiker uit

## Kenmerken

### ✅ Reactiviteit
De `user` en `userRole` worden automatisch bijgewerkt wanneer:
- Een gebruiker inlogt via `login()`
- Een gebruiker uitlogt via `logout()`
- De authenticatiestatus wijzigt (via Supabase's `onAuthStateChange`)

### ✅ Singleton Pattern
De composable wordt slechts één keer geïnitialiseerd:
- Gedeelde state tussen alle instanties van `useAuth()`
- Auth state listener wordt slechts één keer opgezet
- Efficiënt geheugengebruik

### ✅ Automatische Sessie Recovery
Bij het laden van de applicatie wordt automatisch gecontroleerd of er een bestaande sessie is.

## Rollen

De composable ondersteunt de volgende rollen zoals gedefinieerd in de architectuur:

| Rol | Beschrijving |
|-----|--------------|
| `Owner` | Beheer van eigen Boomgaarden (standaard voor ingelogde gebruikers) |
| `SpeciesManager` | Beheer van de centrale Boomsoorten-tabel |
| `Public/Guest` | Leestoegang (null wanneer niet ingelogd) |

## Foutafhandeling

Alle asynchrone functies bevatten robuuste `try...catch` blokken:
- Fouten worden gelogd naar de console
- Fouten worden doorgegooid (re-thrown) zodat de aanroepende code ze kan afhandelen

```javascript
try {
  await login(email, password)
} catch (error) {
  // Handel specifieke fout af in je component
  alert('Login mislukt: ' + error.message)
}
```

## Vereisten

- Vue 3 met Composition API
- Supabase client geconfigureerd in `src/config/supabase.js`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Architectuur Conformiteit

Deze composable volgt de architectuurrichtlijnen:
- ✅ Gebruikt ES6+ syntax (arrow functions, const/let)
- ✅ Nederlandse opmerkingen en documentatie
- ✅ Try-catch blokken voor foutafhandeling
- ✅ Consistent met terminologie woordenboek
- ✅ Gebruikt Supabase JavaScript Client SDK
- ✅ Geïsoleerde logica in een Composable
