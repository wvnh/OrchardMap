# Meertaligheid Strategie - OrchardMap

## Overzicht
Voor een schaalbare meertalige applicatie houden we de database volledig in het Engels en beheren vertalingen in de frontend.

## Database Strategie
- **Alle enum waarden**: Engels (bijv. `early`, `medium`, `high`)
- **Alle kolomnamen**: Engels (bijv. `variety_name`, `fruit_type`)
- **Alle tabelnamen**: Engels (bijv. `tree_species`, `orchards`)

## Frontend Vertalingen

### 1. Vue i18n Setup
```javascript
// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import nl from './locales/nl.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'nl', // Standaard Nederlands
  fallbackLocale: 'en',
  messages: { nl, en }
})

export default i18n
```

### 2. Enum Vertalingen
```json
// src/i18n/locales/nl.json
{
  "enums": {
    "productivity_period": {
      "early": "Vroeg",
      "late": "Laat"
    },
    "productivity_amount": {
      "low": "Laag",
      "medium": "Gemiddeld", 
      "high": "Hoog"
    },
    "bloom_period": {
      "early": "Vroeg",
      "mid": "Middentijds",
      "late": "Laat"
    },
    "fruit_size": {
      "very_small": "Zeer klein",
      "small": "Klein",
      "medium": "Middelgroot",
      "large": "Groot",
      "very_large": "Zeer groot"
    },
    "fruit_shape": {
      "round": "Bol",
      "flattened": "Afgeplat",
      "conical": "Conisch",
      "oval": "Ovaal",
      "cylindrical": "Cilindrisch"
    },
    "disease_resistance": {
      "plus": "Goed resistent",
      "neutral": "Gemiddeld resistent",
      "minus": "Weinig resistent"
    },
    "taste_profile": {
      "sweet": "Zoet",
      "sweet_tart": "Zuurzoet",
      "tart": "Zuur",
      "bitter": "Bitter",
      "bitter_sweet": "Bitterzoet"
    }
  },
  "fields": {
    "variety_name": "Variëteitsnaam",
    "fruit_type": "Fruitsoort",
    "synonyms": "Synoniemen",
    "origin_country": "Land van herkomst",
    "bloom_period": "Bloeiperiode",
    "productivity_amount": "Productiviteit",
    "taste_profile": "Smaakprofiel",
    "harvest_time": "Oogsttijd"
  }
}
```

### 3. Composable voor Vertalingen
```javascript
// src/composables/useTranslations.js
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useEnumTranslation() {
  const { t } = useI18n()
  
  const translateEnum = (enumType, value) => {
    if (!value) return ''
    return t(`enums.${enumType}.${value}`, value)
  }
  
  const translateField = (fieldName) => {
    return t(`fields.${fieldName}`, fieldName)
  }
  
  // Specifieke helpers
  const translateProductivityPeriod = (value) => translateEnum('productivity_period', value)
  const translateBloomPeriod = (value) => translateEnum('bloom_period', value)
  const translateTasteProfile = (value) => translateEnum('taste_profile', value)
  const translateFruitSize = (value) => translateEnum('fruit_size', value)
  
  return {
    translateEnum,
    translateField,
    translateProductivityPeriod,
    translateBloomPeriod,
    translateTasteProfile,
    translateFruitSize
  }
}
```

### 4. Gebruik in Components
```vue
<!-- TreeSpeciesCard.vue -->
<template>
  <div class="tree-species-card">
    <h3>{{ species.variety_name }}</h3>
    <p>{{ translateField('fruit_type') }}: {{ species.fruit_type }}</p>
    <p>{{ translateField('bloom_period') }}: {{ translateBloomPeriod(species.bloom_period) }}</p>
    <p>{{ translateField('taste_profile') }}: {{ translateTasteProfile(species.taste_profile) }}</p>
  </div>
</template>

<script setup>
import { useEnumTranslation } from '@/composables/useTranslations'

const props = defineProps(['species'])
const { translateField, translateBloomPeriod, translateTasteProfile } = useEnumTranslation()
</script>
```

### 5. Filter/Search Components
```vue
<!-- TreeSpeciesFilter.vue -->
<template>
  <div class="filter-form">
    <QSelect
      v-model="filters.bloom_period"
      :options="bloomPeriodOptions"
      :label="translateField('bloom_period')"
      emit-value
      map-options
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEnumTranslation } from '@/composables/useTranslations'

const { translateField, translateEnum } = useEnumTranslation()

const bloomPeriodOptions = computed(() => [
  { label: translateEnum('bloom_period', 'early'), value: 'early' },
  { label: translateEnum('bloom_period', 'mid'), value: 'mid' },
  { label: translateEnum('bloom_period', 'late'), value: 'late' }
])
</script>
```

## Voordelen van deze Aanpak

### ✅ **Database**
- **Schaalbaar**: Nieuwe talen toevoegen zonder database wijzigingen
- **Performance**: Geen extra joins voor vertalingen
- **Consistent**: Alle enum waarden gestandaardiseerd in Engels

### ✅ **Frontend**
- **Flexibel**: Eenvoudig talen toevoegen/wijzigen
- **Performance**: Vertalingen geladen bij app start
- **Onderhoudbaar**: Vertalingen gescheiden van logica

### ✅ **Development**
- **Internationaal team**: Iedereen kan database schema begrijpen
- **APIs**: Consistent Engels voor externe integraties
- **Documentation**: Universeel begrijpbaar

## Implementatie Stappen

1. **Database schema** volledig in Engels (✅ gedaan)
2. **i18n setup** in Vue project
3. **Translation files** aanmaken (nl.json, en.json)
4. **useTranslations composable** implementeren
5. **Components** updaten met vertalingen
6. **Enum helper functions** voor filters/forms

## Toekomstige Uitbreidingen
- **Taaldetectie** op basis van browser/user preference
- **Admin interface** voor vertalingen beheer
- **Fallback logica** voor ontbrekende vertalingen
- **Pluralization** voor tellingen