# 🧪 GPS & Mapping Testing Guide

## Overzicht

Dit document beschrijft hoe je de GPS en mapping functionaliteit kunt testen.

## 🚀 Quick Start - Demo

De snelste manier om de GPS en mapping features te testen is via de standalone demo:

```bash
# Open de demo in een browser
npm run demo

# Of open het bestand direct
open demo-gps-map.html
```

De demo opent automatisch op `http://localhost:8080/demo-gps-map.html` en toont:
- GPS tracking met real-time updates
- Interactive Leaflet map
- Trail recording
- GeoJSON/GPX export
- Accuracy indicators

## 📱 Testing Requirements

### Browser Requirements
- **Chrome/Edge**: ✅ Volledig ondersteund
- **Firefox**: ✅ Volledig ondersteund  
- **Safari**: ✅ Volledig ondersteund (iOS 14+)
- **Opera**: ✅ Volledig ondersteund

### Security Requirements
- **HTTPS**: Geolocation API vereist HTTPS (behalve localhost)
- **Permissions**: Browser vraagt om locatie toestemming
- **Privacy**: Gebruiker kan toestemming altijd intrekken

### Device Requirements
Voor volledige GPS functionaliteit:
- 📱 Mobiel apparaat met GPS hardware (aanbevolen)
- 💻 Laptop/desktop met Wi-Fi positionering (basis functionaliteit)

## 🧪 Test Scenarios

### 1. GPS Tracking

#### Test: Start GPS Tracking
1. Open demo pagina
2. Klik op "Start GPS Tracking"
3. Geef toestemming voor locatie toegang
4. **Verwacht resultaat**: 
   - GPS status box wordt getoond
   - Latitude/longitude worden weergegeven
   - Nauwkeurigheid wordt getoond met badge
   - Blauwe marker verschijnt op kaart
   - Nauwkeurigheids cirkel wordt getekend

#### Test: Accuracy Indicator
1. Start GPS tracking
2. Observeer de accuracy badge kleur
3. **Verwacht resultaat**:
   - 🟢 **Excellent** (<5m): Beste GPS signaal
   - 🟢 **Good** (<10m): Goed GPS signaal
   - 🟡 **Fair** (<20m): Redelijk GPS signaal
   - 🔴 **Poor** (>20m): Zwak GPS signaal

#### Test: Stop GPS Tracking
1. Start GPS tracking
2. Klik op "Stop Tracking"
3. **Verwacht resultaat**:
   - Updates stoppen
   - Status toont "Stopped"
   - Laatste positie blijft zichtbaar

### 2. Trail Recording

#### Test: Record GPS Trail
1. Ga naar buiten (betere GPS ontvangst)
2. Klik op "Start Recording"
3. Loop een route (bijv. rondje om gebouw)
4. Klik op "Stop Recording"
5. **Verwacht resultaat**:
   - Point count incrementeert
   - Blauwe lijn volgt je route op kaart
   - Distance wordt berekend
   - Duration wordt bijgehouden

#### Test: Trail Statistics
1. Start trail recording
2. Loop een bekende afstand
3. Stop recording
4. **Verwacht resultaat**:
   - Points: Aantal GPS metingen
   - Distance: Geschatte afstand in km
   - Duration: Totale tijd van recording

#### Test: Clear Trail
1. Record een trail
2. Klik op "Clear Trail"
3. **Verwacht resultaat**:
   - Trail lijn verdwijnt van kaart
   - Statistics reset naar 0
   - Export buttons worden disabled

### 3. Data Export

#### Test: GeoJSON Export
1. Record een trail met minimaal 10 punten
2. Stop recording
3. Klik op "Export GeoJSON"
4. **Verwacht resultaat**:
   - Bestand downloadt als `trail-[timestamp].geojson`
   - Bevat LineString geometry
   - Bevat timestamps en accuracies in properties
   - Kan geopend worden in GIS software

#### Test: GPX Export
1. Record een trail met minimaal 10 punten
2. Stop recording
3. Klik op "Export GPX"
4. **Verwacht resultaat**:
   - Bestand downloadt als `trail-[timestamp].gpx`
   - Bevat track points met time en hdop
   - Kan geopend worden in Garmin/Strava/etc

### 4. Map Interaction

#### Test: Map Pan & Zoom
1. Open demo
2. Gebruik mouse/touch om kaart te verplaatsen
3. Gebruik zoom controls (+/-)
4. **Verwacht resultaat**:
   - Soepele pan beweging
   - Zoom werkt correct
   - Tiles laden correct

#### Test: Auto-center on Position
1. Start GPS tracking
2. Observeer kaart beweging
3. **Verwacht resultaat**:
   - Kaart centreert op huidige positie
   - Zoom level past aan naar 15

### 5. Mobile Testing

#### Test: Touch Controls
1. Open demo op mobiel apparaat
2. Test pinch-to-zoom
3. Test swipe-to-pan
4. **Verwacht resultaat**:
   - Touch gestes werken smooth
   - Geen conflicten met page scroll
   - Buttons zijn touch-friendly

#### Test: Battery Usage
1. Start GPS tracking in high accuracy mode
2. Monitor batterij gebruik (30 min)
3. Switch naar low accuracy mode
4. Monitor batterij gebruik (30 min)
5. **Verwacht resultaat**:
   - High accuracy: Hoger batterij verbruik
   - Low accuracy: Lager batterij verbruik
   - Caching minimaliseert verbruik

## 🔧 Vue Component Testing

Voor testing in een Vue applicatie:

```vue
<template>
  <div id="app">
    <OrchardMapView
      :orchards="testOrchards"
      :trees="testTrees"
      :initial-center="[52.1326, 5.2913]"
      :initial-zoom="13"
      @tree-selected="handleTreeSelected"
      @orchard-selected="handleOrchardSelected"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrchardMapView from './src/components/OrchardMapView.vue'

// Test data
const testOrchards = ref([
  {
    id: 1,
    name: 'Test Orchard',
    boundary: {
      type: 'Polygon',
      coordinates: [[[5.2913, 52.1326], [5.2920, 52.1326], [5.2920, 52.1330], [5.2913, 52.1330], [5.2913, 52.1326]]]
    }
  }
])

const testTrees = ref([
  {
    id: 1,
    tree_code: 'T001',
    latitude: 52.1326,
    longitude: 5.2913,
    species: { variety_name: 'Elstar' }
  }
])

const handleTreeSelected = (tree) => {
  console.log('Tree selected:', tree)
}

const handleOrchardSelected = (orchard) => {
  console.log('Orchard selected:', orchard)
}
</script>
```

## 📊 Performance Testing

### Test: Large Dataset
1. Load 100+ tree markers
2. Test map performance
3. **Verwacht resultaat**:
   - Map blijft responsive
   - Zoom/pan werkt smooth
   - Consider clustering voor 500+ markers

### Test: Offline Caching
1. Cache een orchard gebied
2. Disable internet
3. Pan en zoom in cached gebied
4. **Verwacht resultaat**:
   - Cached tiles laden instant
   - Geen laadtijd voor cached gebied
   - Uncached gebieden tonen placeholder

## 🐛 Common Issues & Solutions

### GPS Permission Denied
**Symptoom**: Error message "GPS toegang geweigerd"
**Oplossing**: 
1. Check browser settings
2. Herlaad pagina
3. Klik op lock icon in address bar
4. Reset locatie permissions

### GPS Timeout
**Symptoom**: Error message "GPS request timeout"
**Oplossing**:
1. Ga naar buiten (betere ontvangst)
2. Check of GPS is enabled op apparaat
3. Wacht op GPS fix (kan 30-60 sec duren)

### Poor Accuracy
**Symptoom**: Accuracy >50m
**Oplossing**:
1. Ga naar buiten
2. Wacht op meer satellieten
3. Check of high accuracy mode is enabled
4. Verwijder obstakels (gebouwen, bomen)

### Map Tiles Not Loading
**Symptoom**: Grijze vlakken op kaart
**Oplossing**:
1. Check internet connectie
2. Check browser console voor errors
3. Try different tile provider
4. Clear browser cache

## ✅ Test Checklist

Gebruik deze checklist om volledige test coverage te garanderen:

- [ ] GPS tracking start succesvol
- [ ] GPS tracking stop werkt
- [ ] Accuracy indicator toont correct level
- [ ] Current position wordt getoond op kaart
- [ ] Accuracy circle wordt getekend
- [ ] Trail recording werkt
- [ ] Trail lijn wordt getekend op kaart
- [ ] Trail statistics zijn correct
- [ ] GeoJSON export werkt
- [ ] GPX export werkt
- [ ] Exported files zijn valid
- [ ] Clear trail werkt
- [ ] Map pan werkt
- [ ] Map zoom werkt
- [ ] Auto-center werkt bij GPS start
- [ ] Touch controls werken op mobile
- [ ] Permission dialoog wordt getoond
- [ ] Error handling werkt correct
- [ ] Battery usage is acceptabel
- [ ] Works in alle browsers

## 📝 Test Report Template

```markdown
## GPS & Mapping Test Report

**Date**: [datum]
**Tester**: [naam]
**Browser**: [Chrome/Firefox/Safari] [versie]
**Device**: [iPhone/Android/Desktop]
**Location**: [binnen/buiten]

### GPS Tracking
- Start/Stop: ✅ / ❌
- Accuracy: [X]m
- Update frequency: [X] updates/min
- Issues: [beschrijving]

### Trail Recording
- Recording works: ✅ / ❌
- Trail displayed correctly: ✅ / ❌
- Statistics correct: ✅ / ❌
- Issues: [beschrijving]

### Data Export
- GeoJSON: ✅ / ❌
- GPX: ✅ / ❌
- Files valid: ✅ / ❌
- Issues: [beschrijving]

### Map Performance
- Pan/zoom smooth: ✅ / ❌
- Tiles load fast: ✅ / ❌
- Markers display correctly: ✅ / ❌
- Issues: [beschrijving]

### Overall Rating
[1-5 stars]

### Notes
[Additional observations]
```

## 🔮 Future Testing Needs

Wanneer nieuwe features worden toegevoegd:

- [ ] Offline caching testing
- [ ] Multiple orchard boundaries testing
- [ ] Tree clustering testing
- [ ] Real-time sync testing
- [ ] Collaborative editing testing
- [ ] Route planning testing
- [ ] AR navigation testing

## 📚 Resources

- [Geolocation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Leaflet Documentation](https://leafletjs.com/)
- [GeoJSON Specification](https://geojson.org/)
- [GPX Format](https://www.topografix.com/gpx.asp)
