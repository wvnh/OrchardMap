# OrchardMap Frontend - Orchard Management Interface

This directory contains the Vue.js 3 frontend for OrchardMap's Orchard Management Interface with CRUD operations.

## 🚀 Features

### Implemented Components

#### Composables (Business Logic)
- **useOrchards.js** - Orchard data management and CRUD operations
- **useTrees.js** - Tree data management within orchards
- **useTreeSpecies.js** - Species data for tree selection
- **useAuth.js** - Authentication and user management (existing)

#### Presentational Components
- **OrchardCard.vue** - Grid view card for orchards
- **OrchardGrid.vue** - Visual tree grid layout
- **TreeDetailModal.vue** - Detailed tree information modal
- **SpeciesSelector.vue** - Dropdown for selecting tree species
- **PermissionBadge.vue** - Visual indicator for user permissions
- **OrchardFormModal.vue** - Create/Edit orchard form
- **TreeFormModal.vue** - Create/Edit tree form
- **AppHeader.vue** - Application header with navigation

#### View Components
- **OrchardListView.vue** - Main orchards listing page
- **OrchardDetailView.vue** - Individual orchard detail page with tree grid

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase instance running (local or remote)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase connection:
Edit `src/config/supabase.js` with your Supabase URL and anon key:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Architecture

### Component Structure
```
src/
├── components/
│   ├── common/           # Shared components
│   │   ├── AppHeader.vue
│   │   ├── PermissionBadge.vue
│   │   └── SpeciesSelector.vue
│   ├── orchard/          # Orchard-specific components
│   │   ├── OrchardCard.vue
│   │   ├── OrchardGrid.vue
│   │   └── OrchardFormModal.vue
│   └── tree/             # Tree-specific components
│       ├── TreeDetailModal.vue
│       └── TreeFormModal.vue
├── composables/          # Business logic & state
│   ├── useAuth.js
│   ├── useOrchards.js
│   ├── useTrees.js
│   └── useTreeSpecies.js
├── views/                # Page components
│   ├── OrchardListView.vue
│   └── OrchardDetailView.vue
├── router/               # Vue Router configuration
│   └── index.js
├── config/               # Configuration files
│   └── supabase.js
├── App.vue               # Root component
└── main.js               # App entry point
```

### Design Patterns

1. **Container/Presenter Pattern**
   - View components handle data and logic
   - Presentational components are "dumb" and receive all data via props

2. **Composables for State Management**
   - Business logic isolated in composables
   - Reusable across components
   - Direct Supabase integration

3. **Permission-Based UI**
   - Components check user permissions
   - Actions shown/hidden based on role
   - RLS policies enforced at database level

## 🔐 User Roles & Permissions

The interface adapts based on user role:

- **Guest** - View public orchards only
- **Registered User** - View orchards with granted permissions
- **Orchard Worker** - View and edit assigned orchards
- **Orchard Manager** - Full CRUD on owned orchards
- **Admin** - Full access to all orchards

## 📱 Mobile Support

The interface is fully responsive with:
- Touch-friendly grid interactions
- Mobile-optimized layouts
- Geolocation support for GPS coordinates
- Offline-ready architecture (PWA ready)

## 🎯 Key Features

### Orchard Management
- ✅ List view with search and filters
- ✅ Create, edit, delete orchards
- ✅ Public/private visibility toggle
- ✅ GPS location with "Use My Location"
- ✅ Permission-based action visibility

### Tree Management
- ✅ Visual grid layout showing tree positions
- ✅ Color-coded health status indicators
- ✅ Add, edit, remove trees
- ✅ Detailed tree information modal
- ✅ Species selection with search
- ✅ Status tracking (condition, health, bloom, maintenance)

### Search & Filtering
- ✅ Search orchards by name/location
- ✅ Filter by visibility (public/private)
- ✅ Search trees by species
- ✅ Filter trees by condition/health/bloom

## 🧪 Testing

To test the interface:

1. Start Supabase (if local):
```bash
supabase start
```

2. Run the development server:
```bash
npm run dev
```

3. Test different user scenarios:
   - Guest access (no login)
   - Orchard Manager (create/edit orchards)
   - Worker (edit trees in assigned orchards)

## 🐛 Troubleshooting

### Common Issues

**Issue:** Components not loading
- Check that all dependencies are installed: `npm install`
- Verify Vite dev server is running: `npm run dev`

**Issue:** Supabase connection errors
- Verify Supabase URL and anon key in `src/config/supabase.js`
- Check that Supabase instance is running
- Verify RLS policies are properly set up

**Issue:** Permission errors
- Ensure user is authenticated
- Check RLS policies in database
- Verify user role is correctly set

## 📝 Next Steps

Potential enhancements:
- [ ] Add map view using vue-leaflet
- [ ] Implement offline caching with service workers
- [ ] Add bulk tree import/export
- [ ] Integrate photo uploads for trees
- [ ] Add notification system
- [ ] Implement real-time updates with Supabase subscriptions

## 📚 Documentation

For more details, see:
- [Project Overview](../docs/project-overview.md)
- [Database Schema](../docs/database-schema.md)
- [User Stories](../docs/user-stories.md)
- [Copilot Instructions](../.copilot-instructions.md)
