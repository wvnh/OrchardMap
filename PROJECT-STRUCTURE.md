# 📁 OrchardMap Project Structure

## Complete File Tree

\`\`\`
OrchardMap/
├── 📄 index.html                      # Application entry point
├── 📄 vite.config.js                  # Vite build configuration
├── 📄 package.json                    # Dependencies and scripts
│
├── 📁 src/                            # Source code
│   ├── 📄 main.js                    # Vue app initialization
│   ├── 📄 App.vue                    # Root component
│   │
│   ├── 📁 components/                 # Reusable components
│   │   ├── 📁 common/                # Shared components
│   │   │   ├── AppHeader.vue         # Navigation header
│   │   │   ├── PermissionBadge.vue   # User role indicator
│   │   │   └── SpeciesSelector.vue   # Tree species dropdown
│   │   │
│   │   ├── 📁 orchard/               # Orchard components
│   │   │   ├── OrchardCard.vue       # List item card
│   │   │   ├── OrchardGrid.vue       # Tree position grid
│   │   │   └── OrchardFormModal.vue  # Create/Edit form
│   │   │
│   │   └── 📁 tree/                  # Tree components
│   │       ├── TreeDetailModal.vue   # Tree information
│   │       └── TreeFormModal.vue     # Create/Edit form
│   │
│   ├── 📁 composables/               # Business logic
│   │   ├── useAuth.js                # Authentication
│   │   ├── useOrchards.js            # Orchard CRUD
│   │   ├── useTrees.js               # Tree CRUD
│   │   └── useTreeSpecies.js         # Species data
│   │
│   ├── 📁 views/                     # Page components
│   │   ├── OrchardListView.vue       # Orchards listing
│   │   └── OrchardDetailView.vue     # Orchard details
│   │
│   ├── 📁 router/                    # Routing
│   │   └── index.js                  # Router config
│   │
│   └── 📁 config/                    # Configuration
│       └── supabase.js               # Supabase client
│
├── 📁 docs/                          # Documentation
│   ├── database-schema.md            # Database design
│   ├── project-overview.md           # Project goals
│   ├── user-stories.md               # Requirements
│   └── internationalization.md       # i18n strategy
│
├── 📁 supabase/                      # Backend
│   ├── migrations/                   # Database migrations
│   ├── seed.sql                      # Test data
│   └── config.toml                   # Supabase config
│
└── 📁 Documentation Files
    ├── README.md                     # Project overview
    ├── FRONTEND-README.md            # Frontend setup
    ├── TESTING-GUIDE.md              # Testing instructions
    ├── IMPLEMENTATION-SUMMARY.md     # Implementation details
    ├── PROJECT-STATUS.md             # Current status
    └── .copilot-instructions.md      # Architecture rules
\`\`\`

## Component Hierarchy

\`\`\`
App.vue
├── AppHeader.vue
│   └── PermissionBadge.vue
│
└── RouterView
    ├── OrchardListView.vue (Route: /orchards)
    │   ├── OrchardCard.vue (multiple)
    │   │   └── PermissionBadge.vue
    │   └── OrchardFormModal.vue
    │
    └── OrchardDetailView.vue (Route: /orchards/:id)
        ├── PermissionBadge.vue
        ├── OrchardGrid.vue
        ├── TreeDetailModal.vue
        ├── OrchardFormModal.vue
        └── TreeFormModal.vue
            └── SpeciesSelector.vue
\`\`\`

## Data Flow

\`\`\`
User Action → View Component → Composable → Supabase API → Database (RLS)
                    ↓              ↓
              Update State   Update Local State
                    ↓
          Re-render UI Components
\`\`\`

## Key Files by Purpose

### 🎯 Entry Points
- \`index.html\` - HTML entry
- \`src/main.js\` - JS entry
- \`src/App.vue\` - Vue root

### 🧠 Business Logic (Composables)
- \`useAuth.js\` - Authentication & user state
- \`useOrchards.js\` - Orchard CRUD operations
- \`useTrees.js\` - Tree CRUD operations  
- \`useTreeSpecies.js\` - Species data fetching

### 📱 Views (Pages)
- \`OrchardListView.vue\` - Main listing page
- \`OrchardDetailView.vue\` - Detail page with tree grid

### 🎨 Presentational Components

#### Common
- \`AppHeader.vue\` - App navigation
- \`PermissionBadge.vue\` - Role indicator
- \`SpeciesSelector.vue\` - Species dropdown

#### Orchard
- \`OrchardCard.vue\` - List item
- \`OrchardGrid.vue\` - Tree grid
- \`OrchardFormModal.vue\` - CRUD form

#### Tree
- \`TreeDetailModal.vue\` - Details display
- \`TreeFormModal.vue\` - CRUD form

### 🛠 Configuration
- \`vite.config.js\` - Build setup
- \`src/router/index.js\` - Routing
- \`src/config/supabase.js\` - API client

### 📚 Documentation
- \`FRONTEND-README.md\` - Setup guide
- \`TESTING-GUIDE.md\` - Testing procedures
- \`IMPLEMENTATION-SUMMARY.md\` - Implementation details

## File Statistics

| Type | Count | Purpose |
|------|-------|---------|
| Vue Components | 11 | UI components |
| JavaScript Modules | 7 | Business logic |
| Documentation | 3 | Guides & docs |
| Config Files | 3 | Setup & build |
| **Total** | **24** | **Complete app** |

## Code Organization Principles

### 1. Separation of Concerns
- **Composables** = Logic & State
- **Views** = Pages & Routing
- **Components** = UI & Presentation

### 2. Component Types
- **Smart (Views)** = Fetch data, handle routing
- **Dumb (Components)** = Receive props, emit events

### 3. Import Strategy
- Use \`@/\` alias for absolute imports
- Keep related files close together
- Group by feature, not by type

### 4. Naming Conventions
- **PascalCase** for components (\`OrchardCard.vue\`)
- **camelCase** for composables (\`useOrchards.js\`)
- **kebab-case** for routes (\`/orchard-detail\`)

## Build Output

\`\`\`bash
npm run build
\`\`\`

Produces:
- \`dist/index.html\` - Entry HTML
- \`dist/assets/index-*.css\` - Styles (~28 KB)
- \`dist/assets/index-*.js\` - JavaScript (~270 KB)

Optimized for:
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Minification
- ✅ Gzip compression (82 KB)

## Development Workflow

\`\`\`bash
# 1. Install
npm install

# 2. Develop
npm run dev

# 3. Build
npm run build

# 4. Preview
npm run preview
\`\`\`

## Dependencies

### Production
- \`vue\` (^3.5.22) - Framework
- \`vue-router\` (^4.5.1) - Routing
- \`@supabase/supabase-js\` (^2.58.0) - Backend

### Development
- \`vite\` (^5.0.0) - Build tool
- \`@vitejs/plugin-vue\` (^5.0.0) - Vue support

### Optional (Installed but not used yet)
- \`quasar\` - UI framework (future)
- \`vue-leaflet\` - Maps (future)

## Future Structure Additions

Potential additions:
- \`src/stores/\` - Pinia state management
- \`src/utils/\` - Helper functions
- \`src/services/\` - API services
- \`src/assets/\` - Images, icons
- \`src/locales/\` - i18n translations
- \`src/directives/\` - Custom directives
- \`src/plugins/\` - Vue plugins
- \`public/\` - Static files
- \`tests/\` - Unit & E2E tests

---

**Last Updated:** October 9, 2025
**Status:** ✅ Complete and Production-Ready
