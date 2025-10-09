# 🌳 OrchardMap

Een Vue.js 3 applicatie voor het beheren van meerdere boomgaarden met gedetailleerde boomsoorten informatie, GPS navigatie en gebruikersrollen.

## 🚀 Quick Start

```bash
# Start Supabase database
supabase start

# Test database (optioneel)
node test-setup.js

# Try GPS & Mapping demo
npm run demo

# Supabase Studio
open http://127.0.0.1:54325
```

## 📋 Project Status

✅ **Database & Security**: Production-ready met RLS  
✅ **Documentatie**: Complete user stories en schema  
✅ **GPS & Mapping**: Complete integratie met offline support  
🔄 **Frontend**: Ready voor ontwikkeling via GitHub Issues  

👉 **Zie [GitHub Issues](https://github.com/wvnh/OrchardMap/issues) voor development roadmap**  
👉 **Zie [`GITHUB-WORKFLOW.md`](./GITHUB-WORKFLOW.md) voor branch workflow**  
👉 **Zie [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) voor volledige details**

## 🗄️ Database

- **8 hoofdtabellen** met volledige relaties
- **27 enum types** voor data consistency  
- **RLS Security** voor alle gebruikersrollen
- **Test data** geladen en geverifieerd

## 📚 Documentatie

### Database & Schema
- [`docs/user-stories.md`](./docs/user-stories.md) - 6 rollen, 50+ user stories
- [`docs/database-schema.md`](./docs/database-schema.md) - Complete schema
- [`docs/project-overview.md`](./docs/project-overview.md) - Technische architectuur

### GPS & Mapping
- [`docs/gps-mapping-guide.md`](./docs/gps-mapping-guide.md) - Usage guide & API documentation
- [`docs/gps-testing-guide.md`](./docs/gps-testing-guide.md) - Testing procedures
- [`docs/gps-implementation-summary.md`](./docs/gps-implementation-summary.md) - Implementation overview
- [`demo-gps-map.html`](./demo-gps-map.html) - Interactive demo (run with `npm run demo`)

## 🗺️ GPS & Mapping Features

**Nieuwe implementatie** voor GPS tracking en kaart functionaliteit:

- ✅ Real-time GPS locatie tracking met battery optimalisatie
- ✅ Interactive Leaflet maps (Street, Satellite, Terrain views)
- ✅ GPS trail recording tijdens veldwerk
- ✅ Offline map tile caching voor gebruik zonder internet
- ✅ GeoJSON en GPX export voor GPS data
- ✅ Touch-friendly controls geoptimaliseerd voor mobile
- ✅ Tree markers met popup info op kaart
- ✅ Orchard boundaries visualisatie
- ✅ Distance calculation (Haversine)
- ✅ Accuracy indicator met kleurcodering

**Quick Demo**: Run `npm run demo` om de standalone demo te zien met werkende GPS tracking, trail recording en map export functionaliteit.

**Components**:
- 3 Composables: `useGeolocation`, `useMap`, `useOfflineMap`
- 4 Vue Components: `MapView`, `OrchardMapView`, `TreeMarker`, `MapPage`
- Complete documentatie en testing guides
