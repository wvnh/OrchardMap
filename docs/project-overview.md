# OrchardMap - Project Overview

## Projectdoel
OrchardMap is een webapplicatie voor het beheren van meerdere boomgaarden en het helpen van gebruikers bij het vinden van specifieke bomen gebaseerd op hun eigenschappen.

## Hoofdfunctionaliteiten

### Boomgaardbeheer (Orchard Management)
- **Orchard**: Bevat naam, locatie, omschrijving en GPS-coördinaten
- **Zichtbaarheid**: Publiek of privé (beslissing van Orchard Manager)
- **Toegangsbeheer**: Orchard Workers kunnen worden toegevoegd voor beheerondersteuning

### Boombeheer (OrchardTree Management)
- **Locatie**: Specifieke positionering via rij/kolom + GPS-coördinaten
- **Plantinformatie**: Plantdatum en lifecycle status
- **Status tracking**:
  - **Toestand**: Geplant, Nog niet productief, Vruchtdragend, Slapend
  - **Gezondheid**: Gezond, Minder gezond, Ziek, Quarantaine
  - **Onderhoud**: Gepland voor snoei, Gepland voor verwijdering
  - **Bloei**: In bloei, Vruchtdragend, Plukrijp, etc.
- **Lifecycle**: Optionele einddatum voor verwijdering uit boomgaard
- **Interactie**: Favorieten markeren, opmerkingen toevoegen

### Boomsoortenbeheer (TreeSpecies Management)
- **Centraal beheer**: Species Manager beheert alle boomsoorten
- **Validatie**: Alleen gevalideerde soorten beschikbaar voor boomgaarden
- **Herbruikbaarheid**: Soorten kunnen in meerdere boomgaarden voorkomen
- **Eigenschappen**: Fruittype, smaak, en andere karakteristieken

### Zoek- en Navigatiefunctionaliteit
**Primair doel**: Gebruikers kunnen eenvoudig bomen vinden op basis van eigenschappen zoals:
- Fruitsoort
- Smaak
- Bloeistatus
- Andere boom/soort-eigenschappen

**Toegang**:
- **Publieke boomgaarden**: Toegankelijk voor alle gebruikers
- **Private boomgaarden**: Alleen voor gebruikers met specifieke rechten
- **Cross-orchard zoeken**: Zoeken over meerdere boomgaarden tegelijk

**GPS-navigatie**: Route naar specifieke boom voor optimale bereikbaarheid

## Rollenbeheer
- **Admin**: Systeembeheer
- **Orchard Manager**: Beheert eigen boomgaard(en)
- **Orchard Worker**: Ondersteunt bij boomgaardbeheer
- **Species Manager**: Beheert boomsoorten centraal
- **Registered User**: Toegang tot toegestane boomgaarden
- **Guest**: Alleen publieke boomgaarden

## Toekomstige Uitbreidingen
- **Onderhoudsbeheer**: Planning en tracking van onderhoudstaken
- **Aanvullende features**: Naar behoefte van gebruikers

## Technische Architectuur
- **Frontend**: Vue.js 3 (Composition API) + Quasar + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + RLS)
- **Data-organisatie**: Composables voor gescheiden datalogica