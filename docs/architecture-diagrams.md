# OrchardMap Authentication System - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser / Client                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────┼─────────────────────────────────────┐
│                    Vue.js Application                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     View Layer (UI)                            │ │
│  │                                                                │ │
│  │  ├── LoginView.vue           (Login form)                     │ │
│  │  ├── RegisterView.vue        (Registration form)              │ │
│  │  ├── DashboardView.vue       (User dashboard)                 │ │
│  │  ├── PublicOrchardsView.vue  (Public content)                 │ │
│  │  └── OrchardsView.vue        (Protected content)              │ │
│  │                                                                │ │
│  │         ▲                          ▲                           │ │
│  │         │                          │                           │ │
│  └─────────┼──────────────────────────┼───────────────────────────┘ │
│            │                          │                             │
│            │                          │                             │
│  ┌─────────┴──────────────┐  ┌───────┴──────────────┐             │
│  │   Vue Router           │  │  Pinia Store         │             │
│  │   (Navigation)         │  │  (State Management)  │             │
│  │                        │  │                      │             │
│  │  • Route Guards        │  │  • Auth Store        │             │
│  │  • Auth Checks         │  │  • User State        │             │
│  │  • Role Validation     │  │  • Loading State     │             │
│  │  • Redirects           │  │  • Error Handling    │             │
│  └────────────┬───────────┘  └──────────┬───────────┘             │
│               │                          │                          │
│               └──────────┬───────────────┘                          │
│                          │                                          │
│                          ▼                                          │
│               ┌──────────────────────┐                             │
│               │  useAuth Composable  │                             │
│               │  (Core Logic)        │                             │
│               │                      │                             │
│               │  • login()           │                             │
│               │  • register()        │                             │
│               │  • logout()          │                             │
│               │  • user (ref)        │                             │
│               │  • userRole          │                             │
│               │  • isAuthenticated   │                             │
│               └──────────┬───────────┘                             │
│                          │                                          │
│                          ▼                                          │
│               ┌──────────────────────┐                             │
│               │  Supabase Client     │                             │
│               │  (src/config/)       │                             │
│               │                      │                             │
│               │  • Auth Methods      │                             │
│               │  • Session Mgmt      │                             │
│               │  • Token Storage     │                             │
│               │  • API Calls         │                             │
│               └──────────┬───────────┘                             │
│                          │                                          │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           │ HTTPS
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                    Supabase Backend                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Supabase Auth                               │ │
│  │                                                                │ │
│  │  • User Registration                                           │ │
│  │  • Password Authentication                                     │ │
│  │  • Session Management                                          │ │
│  │  • Token Generation                                            │ │
│  │  • Email Verification (optional)                               │ │
│  └────────────────────────┬───────────────────────────────────────┘ │
│                           │                                          │
│                           ▼                                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    PostgreSQL Database                         │ │
│  │                                                                │ │
│  │  Tables:                                                       │ │
│  │  ├── auth.users              (Supabase managed)               │ │
│  │  ├── public.orchards         (App data)                       │ │
│  │  ├── public.orchard_trees    (App data)                       │ │
│  │  ├── public.tree_species     (App data)                       │ │
│  │  └── ...                     (Other tables)                   │ │
│  │                                                                │ │
│  │  RLS Policies:                                                 │ │
│  │  • Guest users: Public orchards only                          │ │
│  │  • Authenticated: Based on permissions                        │ │
│  │  • Role-based: Admin, Manager, Worker                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Login Flow

```
User                LoginView           AuthStore           useAuth         Supabase
 │                     │                    │                  │               │
 │  Enter credentials  │                    │                  │               │
 ├────────────────────>│                    │                  │               │
 │                     │                    │                  │               │
 │                     │  handleLogin()     │                  │               │
 │                     ├───────────────────>│                  │               │
 │                     │                    │   login()        │               │
 │                     │                    ├─────────────────>│               │
 │                     │                    │                  │ signInWith    │
 │                     │                    │                  │  Password()   │
 │                     │                    │                  ├──────────────>│
 │                     │                    │                  │               │
 │                     │                    │                  │  Auth Token   │
 │                     │                    │                  │<──────────────┤
 │                     │                    │  User Data       │               │
 │                     │                    │<─────────────────┤               │
 │                     │  Success/Error     │                  │               │
 │                     │<───────────────────┤                  │               │
 │  Redirect to        │                    │                  │               │
 │  Dashboard          │                    │                  │               │
 │<────────────────────┤                    │                  │               │
 │                     │                    │                  │               │
```

### 2. Protected Route Access Flow

```
User              Router Guard        useAuth          AuthStore        View
 │                     │                  │                │             │
 │  Navigate to        │                  │                │             │
 │  /orchards          │                  │                │             │
 ├────────────────────>│                  │                │             │
 │                     │                  │                │             │
 │                     │  Check auth      │                │             │
 │                     ├─────────────────>│                │             │
 │                     │                  │                │             │
 │                     │  user.value      │                │             │
 │                     │<─────────────────┤                │             │
 │                     │                  │                │             │
 │                     │  Check role      │                │             │
 │                     ├─────────────────────────────────>│             │
 │                     │                  │                │             │
 │                     │  hasAnyRole()    │                │             │
 │                     │<─────────────────────────────────┤             │
 │                     │                  │                │             │
 │                     │  ✅ Authorized   │                │             │
 │                     │                  │                │             │
 │                     │  Allow navigation                 │             │
 │                     ├──────────────────────────────────────────────>│
 │                     │                  │                │             │
 │  View OrchardsView  │                  │                │             │
 │<────────────────────────────────────────────────────────────────────┤
 │                     │                  │                │             │
```

### 3. Registration Flow

```
User            RegisterView        AuthStore         useAuth        Supabase
 │                   │                  │                 │              │
 │  Fill form        │                  │                 │              │
 ├──────────────────>│                  │                 │              │
 │                   │                  │                 │              │
 │                   │  Validate form   │                 │              │
 │                   │  (client-side)   │                 │              │
 │                   │                  │                 │              │
 │                   │  handleRegister()│                 │              │
 │                   ├─────────────────>│                 │              │
 │                   │                  │  register()     │              │
 │                   │                  ├────────────────>│              │
 │                   │                  │                 │  signUp()    │
 │                   │                  │                 ├─────────────>│
 │                   │                  │                 │              │
 │                   │                  │                 │  Create User │
 │                   │                  │                 │  + Session   │
 │                   │                  │                 │<─────────────┤
 │                   │                  │  User Data      │              │
 │                   │                  │<────────────────┤              │
 │                   │  Success         │                 │              │
 │                   │<─────────────────┤                 │              │
 │  Show success &   │                  │                 │              │
 │  redirect         │                  │                 │              │
 │<──────────────────┤                  │                 │              │
 │                   │                  │                 │              │
```

## Component Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      App.vue (Root)                              │
│                         │                                        │
│                         ├─ <router-view />                       │
│                         │                                        │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌──────────────┐ ┌─────────────────┐
│  LoginView    │ │ RegisterView │ │  DashboardView  │
│               │ │              │ │                 │
│ • Email input │ │ • Name input │ │ • Welcome msg   │
│ • Pass input  │ │ • Email      │ │ • Stats cards   │
│ • Submit btn  │ │ • Password   │ │ • Quick actions │
│ • Error msg   │ │ • Confirm    │ │ • Navigation    │
└───────┬───────┘ └──────┬───────┘ └────────┬────────┘
        │                │                  │
        │                │                  │
        └────────────────┼──────────────────┘
                         │
                         │ Uses
                         ▼
                ┌────────────────┐
                │  useAuthStore  │
                │   (Pinia)      │
                │                │
                │ • user         │
                │ • userRole     │
                │ • loading      │
                │ • error        │
                │ • login()      │
                │ • register()   │
                │ • logout()     │
                └────────┬───────┘
                         │
                         │ Uses
                         ▼
                ┌────────────────┐
                │   useAuth()    │
                │  (Composable)  │
                │                │
                │ • Singleton    │
                │ • Auth logic   │
                │ • State mgmt   │
                └────────┬───────┘
                         │
                         │ Uses
                         ▼
                ┌────────────────┐
                │    supabase    │
                │    (Client)    │
                │                │
                │ • auth.signIn  │
                │ • auth.signUp  │
                │ • auth.signOut │
                │ • from()       │
                └────────────────┘
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Application State                       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │            useAuth (Composable State)              │  │
│  │                                                    │  │
│  │  user: Ref<User | null>                           │  │
│  │    ↓                                               │  │
│  │    • Shared across all useAuth() calls            │  │
│  │    • Updated by onAuthStateChange                  │  │
│  │    • Source of truth for auth state                │  │
│  │                                                    │  │
│  │  userRole: ComputedRef<string | null>             │  │
│  │    ↓                                               │  │
│  │    • Computed from user.value                      │  │
│  │    • Checks metadata and app_metadata              │  │
│  │    • Returns role or null                          │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                              │
│                           │                              │
│  ┌────────────────────────┴────────────────────────────┐ │
│  │         useAuthStore (Pinia Wrapper)               │ │
│  │                                                    │ │
│  │  • Wraps useAuth() functionality                  │ │
│  │  • Adds loading and error state                   │ │
│  │  • Provides action methods                        │ │
│  │  • Exposes helper functions                       │ │
│  └────────────────────────────────────────────────────┘ │
│                           │                              │
│                           │                              │
│  ┌────────────────────────┴────────────────────────────┐ │
│  │              Component State                       │ │
│  │                                                    │ │
│  │  • Local reactive state (loading, errors, forms)  │ │
│  │  • Computed properties from store                 │ │
│  │  • Watchers for state changes                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
│                                                             │
│  Layer 1: Client-Side Validation                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Form validation (required, format, length)         │  │
│  │ • Password confirmation matching                     │  │
│  │ • Email format checking                              │  │
│  │ • Real-time feedback                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  Layer 2: Route Guards                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Authentication checking                            │  │
│  │ • Role-based authorization                           │  │
│  │ • Automatic redirects                                │  │
│  │ • Preserve destination                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  Layer 3: Supabase Client                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Token-based authentication                         │  │
│  │ • Automatic token refresh                            │  │
│  │ • Secure token storage                               │  │
│  │ • CSRF protection                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  Layer 4: Supabase Auth Service                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Password hashing (bcrypt)                          │  │
│  │ • JWT token generation                               │  │
│  │ • Session management                                 │  │
│  │ • Rate limiting                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  Layer 5: Row Level Security (RLS)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Database-level access control                      │  │
│  │ • Policy-based data filtering                        │  │
│  │ • Cannot be bypassed from client                     │  │
│  │ • Enforced on every query                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

*This diagram provides a visual representation of the authentication system architecture, data flows, and security layers implemented in OrchardMap.*
