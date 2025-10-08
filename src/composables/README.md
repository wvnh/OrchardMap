# Composables Documentatie

Deze directory bevat de centrale composables voor de Orchard Manager App.

## Overzicht

- [useAuth Composable](#useauth-composable) - Authenticatie en gebruikersbeheer
- [useData Composable](#usedata-composable) - CRUD-operaties voor orchards en tree species

---

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

---

# useData Composable

## Overzicht

De `useData` composable is een centrale data-oplossing voor de Orchard Manager App. Het biedt CRUD-operaties voor de primaire tabellen (`orchards`, `trees`, `treeSpecies`) met volledige RLS-ondersteuning.

## Locatie

```
src/composables/useData.js
```

## Gebruik

### Importeren

```javascript
import { useData } from '@/composables/useData'
```

### In een View Component

```vue
<script setup>
import { useData } from '@/composables/useData'
import { onMounted } from 'vue'

const { 
  orchards, 
  treeSpecies, 
  loading, 
  error, 
  fetchOwnerOrchards, 
  fetchAllTreeSpecies,
  createOrchard 
} = useData()

// Haal data op bij mount
onMounted(async () => {
  await fetchOwnerOrchards()
  await fetchAllTreeSpecies()
})
</script>

<template>
  <div>
    <div v-if="loading.orchards">Laden...</div>
    <div v-else-if="error.orchards">Fout: {{ error.orchards }}</div>
    <div v-else>
      <h2>Mijn Boomgaarden</h2>
      <ul>
        <li v-for="orchard in orchards" :key="orchard.id">
          {{ orchard.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

### fetchOwnerOrchards Voorbeeld

```javascript
const { fetchOwnerOrchards, orchards, loading, error } = useData()

const loadOrchards = async () => {
  try {
    await fetchOwnerOrchards()
    console.log('Boomgaarden opgehaald:', orchards.value.length)
  } catch (error) {
    console.error('Fout bij ophalen boomgaarden:', error.message)
  }
}
```

### createOrchard Voorbeeld

```javascript
const { createOrchard, orchards } = useData()

const handleCreateOrchard = async () => {
  try {
    const newOrchard = await createOrchard({
      name: 'Mijn Nieuwe Boomgaard',
      location: 'Amsterdam',
      area_hectares: 2.5
    })
    console.log('Boomgaard aangemaakt:', newOrchard.id)
  } catch (error) {
    console.error('Fout bij aanmaken boomgaard:', error.message)
  }
}
```

### fetchAllTreeSpecies Voorbeeld

```javascript
const { fetchAllTreeSpecies, treeSpecies } = useData()

const loadSpecies = async () => {
  try {
    await fetchAllTreeSpecies()
    console.log('Boomsoorten opgehaald:', treeSpecies.value.length)
  } catch (error) {
    console.error('Fout bij ophalen boomsoorten:', error.message)
  }
}
```

## API

### Exposed Properties

#### `orchards` (ref)
- **Type:** `Ref<Array>`
- **Beschrijving:** Reactieve array met alle boomgaarden van de ingelogde gebruiker
- **Waarde:** `[]` standaard, gevuld na `fetchOwnerOrchards()`

#### `treeSpecies` (ref)
- **Type:** `Ref<Array>`
- **Beschrijving:** Reactieve array met alle beschikbare boomsoorten (publieke data)
- **Waarde:** `[]` standaard, gevuld na `fetchAllTreeSpecies()`

#### `loading` (reactive)
- **Type:** `Reactive<Object>`
- **Beschrijving:** Object met loading states voor verschillende data types
- **Properties:**
  - `loading.orchards` (boolean): Laadstatus voor orchards
  - `loading.treeSpecies` (boolean): Laadstatus voor tree species

#### `error` (reactive)
- **Type:** `Reactive<Object>`
- **Beschrijving:** Object met error states voor verschillende data types
- **Properties:**
  - `error.orchards` (string | null): Foutmelding voor orchards
  - `error.treeSpecies` (string | null): Foutmelding voor tree species

### Functies

#### `fetchOwnerOrchards()`
- **Parameters:** Geen
- **Returns:** `Promise<Array>` - Lijst met boomgaarden
- **Throws:** `Error` - Als fetch mislukt of gebruiker niet ingelogd is
- **Beschrijving:** Haalt alle boomgaarden van de ingelogde gebruiker op. Respecteert RLS-regels (alleen eigen data).
- **RLS:** Supabase filtert automatisch op `owner_id` via `auth.uid()`

#### `createOrchard(data)`
- **Parameters:**
  - `data` (Object): Boomgaard data
    - `name` (string, verplicht): Naam van de boomgaard
    - Andere velden volgens database schema
- **Returns:** `Promise<Object>` - Nieuw aangemaakte boomgaard
- **Throws:** `Error` - Als creatie mislukt, gebruiker niet ingelogd is, of validatie faalt
- **Beschrijving:** Voegt een nieuwe boomgaard toe. RLS zorgt ervoor dat `owner_id` automatisch wordt ingesteld.

#### `fetchAllTreeSpecies()`
- **Parameters:** Geen
- **Returns:** `Promise<Array>` - Lijst met boomsoorten
- **Throws:** `Error` - Als fetch mislukt
- **Beschrijving:** Haalt de volledige lijst met boomsoorten op. Dit is publieke data, beschikbaar voor iedereen.

## Kenmerken

### ✅ Reactiviteit
De `orchards` en `treeSpecies` worden automatisch bijgewerkt wanneer:
- Data wordt opgehaald via de fetch functies
- Een nieuwe orchard wordt aangemaakt via `createOrchard()`
- De state wordt aangepast door andere operaties

### ✅ Singleton Pattern
De composable wordt slechts één keer geïnitialiseerd:
- Gedeelde state tussen alle instanties van `useData()`
- Efficiënt geheugengebruik
- Consistente data in de hele applicatie

### ✅ RLS-Aware
Alle data-operaties respecteren Supabase Row Level Security:
- `fetchOwnerOrchards()` retourneert alleen data van de ingelogde gebruiker
- `createOrchard()` stelt automatisch de juiste `owner_id` in
- `fetchAllTreeSpecies()` respecteert publieke leesrechten

### ✅ Granulaire Loading/Error States
Separate loading en error states per data type:
- Betere gebruikerservaring met specifieke feedback
- Geen conflicterende laadstates tussen verschillende operaties

## Foutafhandeling

Alle asynchrone functies bevatten robuuste `try...catch` blokken:
- Fouten worden gelogd naar de console
- Fouten worden doorgegooid (re-thrown) zodat de aanroepende code ze kan afhandelen
- Error states worden automatisch bijgewerkt

```javascript
try {
  await fetchOwnerOrchards()
} catch (error) {
  // Handel specifieke fout af in je component
  alert('Fout bij ophalen boomgaarden: ' + error.message)
}
```

## Vereisten

- Vue 3 met Composition API
- Supabase client geconfigureerd in `src/config/supabase.js`
- `useAuth` composable voor authenticatie
- Database tabellen: `orchards`, `treeSpecies`
- RLS policies geconfigureerd in Supabase

## Architectuur Conformiteit

Deze composable volgt de architectuurrichtlijnen:
- ✅ Gebruikt ES6+ syntax (arrow functions, const/let)
- ✅ Nederlandse opmerkingen en documentatie
- ✅ Try-catch blokken voor foutafhandeling
- ✅ Consistent met terminologie woordenboek (Orchard, TreeSpecies)
- ✅ Gebruikt Supabase JavaScript Client SDK
- ✅ Geïsoleerde logica in een Composable
- ✅ Singleton pattern voor gedeelde state
- ✅ RLS-aware data operations

