# Authentication System - Features Overview

## 🎨 User Interface Components

### 1. Login Page (`/login`)

**Features:**
- Clean, centered login form with gradient background
- Email and password inputs with icons
- Password visibility toggle
- "Remember me" functionality (automatic via session persistence)
- Error message display
- Link to registration page
- Link to public orchards (guest access)
- Responsive design (mobile-first)

**UI Elements:**
- Quasar QCard for the form container
- QInput with validation and error states
- QBtn with loading state during authentication
- QBanner for error messages
- QIcon for visual enhancement

**User Flow:**
1. User enters email and password
2. Client-side validation checks
3. Click "Inloggen" button
4. Loading state shows during auth
5. On success: redirect to dashboard (or requested page)
6. On error: display user-friendly error message

---

### 2. Registration Page (`/register`)

**Features:**
- Extended registration form with personal details
- First name and last name fields
- Email validation
- Password strength requirements (min 6 characters)
- Password confirmation matching
- Comprehensive client-side validation
- Success message before redirect
- Link back to login page
- Scrollable card for smaller screens

**Validation:**
- ✅ Required field checking
- ✅ Email format validation
- ✅ Password length validation (minimum 6 characters)
- ✅ Password match confirmation
- ✅ Real-time error feedback

**User Flow:**
1. User fills in all required fields
2. Real-time validation on each field
3. Click "Registreren" button
4. Loading state during account creation
5. On success: show success banner and auto-login
6. Automatic redirect to dashboard after 2 seconds
7. On error: display specific error message

---

### 3. Dashboard (`/dashboard`)

**Features:**
- Personalized welcome message with user's name
- User role display
- Statistics cards:
  - Accessible orchards count
  - Total trees count
  - Favorite trees count
- Quick action buttons
- Navigation drawer with menu
- Role-based navigation items
- Logout functionality with confirmation

**Role-Based Display:**
- All users see: Dashboard, Public Orchards
- Orchard Managers/Workers/Admins see: "Mijn Boomgaarden"
- User profile section shows email and role

**Navigation Drawer Includes:**
- Dashboard link
- Public Orchards link
- My Orchards link (role-based)
- User profile section
- Logout button

---

### 4. Public Orchards Page (`/public-orchards`)

**Features:**
- Accessible without authentication
- Grid layout of public orchard cards
- Loading state with spinner
- Empty state with helpful message
- Error handling with retry capability
- Login prompt for guests
- Integration with Supabase RLS (only shows public orchards)

**Orchard Cards Show:**
- Orchard name
- Location
- Description
- "Bekijken" (View) button

**States:**
- Loading: Shows spinner
- Empty: Shows empty state message
- Error: Shows error banner with message
- Success: Shows grid of orchards

---

### 5. My Orchards Page (`/orchards`)

**Features:**
- Protected route (authentication required)
- Role-based access (orchard_manager, orchard_worker, admin only)
- List of orchards user has access to
- Create new orchard button
- Public/Private badge on each card
- View and Edit actions per orchard
- Integration with Supabase RLS (shows only accessible orchards)

**Access Control:**
- ✅ Authenticated users only
- ✅ Specific roles required
- ✅ Automatic redirect if unauthorized
- ✅ Error message about insufficient permissions

---

## 🔒 Security Features

### 1. Route Protection

**Implementation:**
```javascript
// In router/index.js
{
  path: '/dashboard',
  meta: {
    requiresAuth: true  // Requires authentication
  }
}

{
  path: '/orchards',
  meta: {
    requiresAuth: true,
    roles: ['admin', 'orchard_manager', 'orchard_worker']  // Role-based
  }
}
```

**Navigation Guards:**
- Check authentication status before each route
- Verify user roles for protected routes
- Redirect unauthenticated users to login
- Redirect unauthorized users to dashboard
- Preserve original destination for redirect after login

### 2. Session Management

**Features:**
- Automatic session persistence in localStorage
- Auto token refresh before expiration
- Session recovery on page refresh
- Secure token storage with key: `orchardmap-auth-token`
- Session detection from URL for OAuth flows

**Configuration:**
```javascript
{
  auth: {
    autoRefreshToken: true,      // Auto refresh before expiry
    persistSession: true,         // Save to localStorage
    detectSessionInUrl: true,     // Handle OAuth redirects
    storageKey: 'orchardmap-auth-token'  // Custom key
  }
}
```

### 3. Row Level Security Integration

**How it works:**
- All Supabase queries automatically use authenticated user context
- RLS policies in database enforce access rules
- Frontend cannot bypass RLS (enforced at database level)
- Users only see data they have permission to access

**Example:**
```javascript
// This query automatically respects RLS
const { data } = await supabase
  .from('orchards')
  .select('*')
// Returns only orchards the user can access
```

---

## 📱 Responsive Design

### Mobile (< 600px)
- Full-width cards and forms
- Stacked navigation
- Touch-friendly buttons (minimum 44x44px)
- Optimized spacing and padding
- Bottom navigation option

### Tablet (600px - 1024px)
- 2-column grid layouts
- Drawer navigation
- Larger touch targets
- Optimized card sizes

### Desktop (> 1024px)
- 3-4 column grid layouts
- Persistent navigation drawer
- Hover effects on interactive elements
- Optimized information density

---

## 🎭 User Roles and Permissions

### Role Hierarchy

1. **Guest (Not Authenticated)**
   - ✅ View public orchards
   - ❌ Cannot access dashboard
   - ❌ Cannot access protected routes
   - ➡️ Redirected to login for protected content

2. **Registered User**
   - ✅ View public orchards
   - ✅ Access dashboard
   - ✅ View own favorites
   - ❌ Cannot access orchard management
   - ❌ Cannot manage trees

3. **Orchard Worker**
   - ✅ All registered user permissions
   - ✅ Access assigned orchards
   - ✅ View and edit trees in assigned orchards
   - ✅ Add maintenance notes
   - ❌ Cannot create new orchards
   - ❌ Cannot manage permissions

4. **Orchard Manager**
   - ✅ All worker permissions
   - ✅ Create new orchards
   - ✅ Edit orchard details
   - ✅ Manage orchard permissions
   - ✅ Assign workers to orchards
   - ✅ View orchard analytics

5. **Species Manager**
   - ✅ All registered user permissions
   - ✅ Manage tree species database
   - ✅ Add/edit/validate species
   - ✅ Manage species metadata
   - ❌ Cannot manage orchards (unless also orchard manager)

6. **Admin**
   - ✅ Full system access
   - ✅ All features available
   - ✅ User management
   - ✅ System configuration
   - ✅ Override permissions

### Role Checking in Components

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check single role
if (authStore.hasRole('admin')) {
  // Admin only logic
}

// Check multiple roles
if (authStore.hasAnyRole(['orchard_manager', 'admin'])) {
  // Manager or admin logic
}
</script>

<template>
  <!-- Conditional rendering based on role -->
  <q-btn 
    v-if="authStore.hasRole('orchard_manager')" 
    label="Create Orchard" 
  />
</template>
```

---

## 🔔 User Feedback and Notifications

### Quasar Notify Plugin

**Success Notifications:**
- ✅ Login successful
- ✅ Registration successful
- ✅ Logout successful
- ✅ Data saved successfully

**Error Notifications:**
- ❌ Login failed
- ❌ Invalid credentials
- ❌ Network error
- ❌ Insufficient permissions

**Info Notifications:**
- ℹ️ Feature coming soon
- ℹ️ Session expired
- ℹ️ Loading data

**Configuration:**
```javascript
$q.notify({
  type: 'positive',      // positive, negative, warning, info
  message: 'Success!',
  position: 'top',       // top, bottom, left, right
  timeout: 3000          // Auto-dismiss after 3s
})
```

### Dialog Confirmations

Used for destructive actions:
- Logout confirmation
- Delete confirmations
- Unsaved changes warnings

---

## 🎯 State Management with Pinia

### Auth Store Structure

```javascript
// State
{
  user: User | null,           // Current user object
  userRole: string | null,     // Computed role
  isAuthenticated: boolean,    // Computed auth status
  loading: boolean,            // Loading state for async ops
  error: string | null         // Error message
}

// Actions
{
  handleLogin(email, password),
  handleRegister(email, password, metadata),
  handleLogout(),
  clearError()
}

// Getters/Helpers
{
  hasRole(role),
  hasAnyRole(roles)
}
```

### Usage in Components

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Reactive state
console.log(authStore.user)
console.log(authStore.isAuthenticated)
console.log(authStore.loading)

// Actions
await authStore.handleLogin(email, password)
</script>
```

---

## 🚀 Performance Optimizations

### Lazy Loading
- Route components are lazy-loaded
- Reduces initial bundle size
- Faster initial page load

### Code Splitting
- Vite automatically splits code per route
- Vendor libraries bundled separately
- Optimal chunk sizes

### Caching
- Session cached in localStorage
- No unnecessary API calls
- Instant auth state on page load

---

## 🧪 Testing Capabilities

### Manual Testing
- All user flows documented in TESTING.md
- Test scenarios for each role
- Error scenario testing
- Security testing checklist

### Automated Testing (Future)
- Unit tests for composables
- Integration tests for auth flow
- E2E tests for user journeys
- Visual regression tests

---

## 📈 Future Enhancements

### Planned Features
- [ ] Password reset via email
- [ ] Email verification
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] User profile management
- [ ] Admin user management UI
- [ ] Role assignment interface
- [ ] Session management dashboard
- [ ] Activity logging
- [ ] Remember device option
- [ ] Biometric authentication (mobile)

### Nice to Have
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Offline mode support
- [ ] Progressive Web App (PWA)
- [ ] Push notifications

---

## 📚 Related Documentation

- [`docs/authentication.md`](authentication.md) - Technical documentation
- [`TESTING.md`](../TESTING.md) - Testing guide
- [`QUICKSTART.md`](../QUICKSTART.md) - Quick start guide
- [`README.md`](../README.md) - Project overview
