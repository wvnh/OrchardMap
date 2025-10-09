# OrchardMap Frontend

Vue.js 3 frontend application for OrchardMap boomgaardbeheer systeem.

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Quasar Framework** - Vue.js based framework with Material Design components
- **Tailwind CSS** - Utility-first CSS framework for custom styling
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Supabase** - Backend as a Service (BaaS) for authentication and database
- **PWA** - Progressive Web App capabilities for mobile use

## Project Structure

```
OrchardMap/
├── src/
│   ├── assets/           # Static assets (images, fonts)
│   ├── components/       # Reusable Vue components
│   ├── composables/      # Vue composition functions
│   │   └── useAuth.js    # Authentication composable
│   ├── config/           # Configuration files
│   │   └── supabase.js   # Supabase client configuration
│   ├── router/           # Vue Router configuration
│   │   └── index.js      # Route definitions
│   ├── styles/           # Global styles
│   │   ├── main.css      # Tailwind CSS imports
│   │   └── quasar-variables.sass  # Quasar theme variables
│   ├── views/            # Page components
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   └── DashboardView.vue
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── public/               # Static public files
│   ├── favicon.svg
│   └── manifest.json     # PWA manifest
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase local development environment (optional for development)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Running the Dev Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Authentication

The app uses Supabase for authentication. Test credentials (from seed data):

- Email: `admin@orchardmap.nl`
- Password: `securepassword`

### Available Routes

- `/` - Home page with feature overview
- `/login` - Login page
- `/dashboard` - Protected dashboard (requires authentication)

## Features

### Implemented

- ✅ Vue.js 3 with Composition API
- ✅ Quasar Framework integration
- ✅ Tailwind CSS for custom styling
- ✅ Vue Router with route guards
- ✅ Supabase authentication integration
- ✅ PWA configuration
- ✅ Responsive design for mobile and desktop
- ✅ Material Design icons

### Planned

- [ ] Orchard management CRUD operations
- [ ] Tree mapping with GPS coordinates
- [ ] Tree species management
- [ ] Map visualization with vue-leaflet
- [ ] User management interface
- [ ] Internationalization (i18n)

## Architecture

The frontend follows Vue.js best practices:

- **Composition API** - For reactive state management
- **Container/Presenter Pattern** - Separation of concerns
- **Composables** - Reusable logic extraction
- **Route Guards** - Authentication and authorization
- **Single File Components** - With scoped styles

## Configuration

### Supabase

Update `src/config/supabase.js` with your Supabase credentials:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

### Tailwind CSS

Customize Tailwind in `tailwind.config.js`

### Quasar Theme

Customize Quasar theme colors in `src/styles/quasar-variables.sass`

## PWA

The app is configured as a Progressive Web App with:

- Service worker for offline capability
- App manifest for installability
- Cache-first strategy for static assets
- Network-first strategy for API calls

## Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

ISC
