# Composables Documentation

Dit document beschrijft alle beschikbare composables in de OrchardMap applicatie.

---

## useAuth Composable

### Overzicht

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

## useAnalytics Composable

### Overzicht

De `useAnalytics` composable biedt uitgebreide analytics en statistieken voor het OrchardMap dashboard. Het haalt data op van Supabase, berekent key metrics en biedt export functionaliteit.

### Locatie

```
src/composables/useAnalytics.js
```

### Gebruik

#### Importeren

```javascript
import { useAnalytics } from '@/composables/useAnalytics'
```

#### In een View Component

```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'
import { onMounted } from 'vue'

const {
  loading,
  error,
  keyMetrics,
  speciesDistribution,
  healthDistribution,
  plantingTrends,
  loadAnalyticsData,
  downloadCSV
} = useAnalytics()

// Load data on mount
onMounted(async () => {
  await loadAnalyticsData()
})

// Export data
const handleExport = () => {
  downloadCSV('species', 'species-data.csv')
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <h2>Total Trees: {{ keyMetrics.totalTrees }}</h2>
    <!-- Display charts and metrics -->
  </div>
</template>
```

### API

#### Exposed Properties

##### `loading` (ref)
- **Type:** `Ref<Boolean>`
- **Beschrijving:** Geeft aan of data wordt geladen

##### `error` (ref)
- **Type:** `Ref<String | null>`
- **Beschrijving:** Error bericht indien data laden mislukt

##### `orchards` (ref)
- **Type:** `Ref<Array>`
- **Beschrijving:** Array met alle toegankelijke boomgaarden

##### `trees` (ref)
- **Type:** `Ref<Array>`
- **Beschrijving:** Array met alle bomen

##### `species` (ref)
- **Type:** `Ref<Array>`
- **Beschrijving:** Array met alle gevalideerde boomsoorten

##### `keyMetrics` (computed)
- **Type:** `ComputedRef<Object>`
- **Beschrijving:** Berekende key metrics
- **Properties:**
  - `totalOrchards`: Totaal aantal boomgaarden
  - `totalTrees`: Totaal aantal bomen
  - `totalSpecies`: Aantal verschillende soorten
  - `publicOrchards`: Aantal publieke boomgaarden
  - `healthyTrees`: Aantal gezonde bomen
  - `avgTreesPerOrchard`: Gemiddeld aantal bomen per boomgaard

##### `speciesDistribution` (computed)
- **Type:** `ComputedRef<Array>`
- **Beschrijving:** Species distributie data voor charts
- **Format:** `[{ name: String, count: Number, fruitType: String }]`

##### `healthDistribution` (computed)
- **Type:** `ComputedRef<Array>`
- **Beschrijving:** Gezondheids status distributie
- **Format:** `[{ status: String, count: Number }]`

##### `plantingTrends` (computed)
- **Type:** `ComputedRef<Array>`
- **Beschrijving:** Planting trends per jaar
- **Format:** `[{ year: Number, count: Number }]`

##### `fruitTypeDistribution` (computed)
- **Type:** `ComputedRef<Array>`
- **Beschrijving:** Distributie per fruit type
- **Format:** `[{ type: String, count: Number }]`

#### Functies

##### `loadAnalyticsData()`
- **Returns:** `Promise<void>`
- **Beschrijving:** Laadt alle analytics data (orchards, trees, species)
- **Voorbeeld:**
```javascript
await loadAnalyticsData()
```

##### `fetchOrchards()`
- **Returns:** `Promise<void>`
- **Beschrijving:** Haalt alleen boomgaard data op

##### `fetchTrees()`
- **Returns:** `Promise<void>`
- **Beschrijving:** Haalt alleen boom data op

##### `fetchSpecies()`
- **Returns:** `Promise<void>`
- **Beschrijving:** Haalt alleen species data op

##### `exportToCSV(dataType)`
- **Parameters:** 
  - `dataType`: String - Type data ('species', 'health', 'trends', of 'metrics')
- **Returns:** `String` - CSV formatted string
- **Beschrijving:** Genereert CSV string van specifiek data type

##### `downloadCSV(dataType, filename)`
- **Parameters:** 
  - `dataType`: String - Type data om te exporteren
  - `filename`: String - Bestandsnaam voor download
- **Returns:** `void`
- **Beschrijving:** Triggert browser download van CSV bestand
- **Voorbeeld:**
```javascript
downloadCSV('species', 'my-species-data.csv')
```

### Features

- ✅ Parallel data fetching voor performance
- ✅ Reactive computed properties voor real-time updates
- ✅ CSV export functionaliteit
- ✅ Error handling met user-friendly berichten
- ✅ RLS compliant (respecteert user permissions)

### Vereisten

- Vue 3 met Composition API
- Supabase client geconfigureerd
- Toegang tot orchards, orchard_trees en tree_species tabellen

### Architectuur Conformiteit

Deze composable volgt de architectuurrichtlijnen:
- ✅ Gebruikt ES6+ syntax (arrow functions, const/let)
- ✅ Nederlandse opmerkingen en documentatie
- ✅ Try-catch blokken voor foutafhandeling
- ✅ Gebruikt Supabase JavaScript Client SDK
- ✅ Geïsoleerde logica in een Composable
- ✅ Computed properties voor reactive calculations
