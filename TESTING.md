# Testing Guide - OrchardMap Authentication System

## Prerequisites

1. Supabase CLI installed and running
2. Node.js and npm installed
3. Dependencies installed (`npm install`)

## Testing Steps

### 1. Start Supabase

```bash
supabase start
```

This should output something like:
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Run Auth Test Script

```bash
node test-auth.js
```

Expected output:
```
🧪 OrchardMap Authentication Test

1️⃣ Testing Supabase connection...
✅ Supabase is running

2️⃣ Testing anonymous access (RLS)...
✅ RLS working - Anonymous users only see public orchards
   Found X public orchards

3️⃣ Testing user registration...
✅ User registration working
   Created test user: test-xxxxx@orchardmap.test

4️⃣ Testing login...
✅ Login successful
   User ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   Email: test-xxxxx@orchardmap.test
   Role: registered_user

5️⃣ Testing logout...
✅ Logout successful

🎉 All authentication tests passed!
```

### 3. Start Development Server

```bash
npm run dev
```

The app should start at http://localhost:3000

### 4. Manual UI Testing

#### Test Scenario 1: Guest User Access

1. Open http://localhost:3000
2. You should be redirected to `/public-orchards`
3. You should see a list of public orchards (no login required)
4. Click "Inloggen" button to go to login page

**Expected Result:** 
- ✅ Can view public orchards without authentication
- ✅ Navigation shows login/register options
- ✅ No access to protected routes

#### Test Scenario 2: User Registration

1. Navigate to `/register` or click "Registreren"
2. Fill in the registration form:
   - Voornaam: Test
   - Achternaam: User
   - Email: testuser@example.com
   - Wachtwoord: testpass123
   - Bevestig wachtwoord: testpass123
3. Click "Registreren"

**Expected Result:**
- ✅ Success message appears
- ✅ Automatic login after registration
- ✅ Redirect to dashboard
- ✅ User info displayed in navigation

#### Test Scenario 3: User Login

1. Navigate to `/login`
2. Enter credentials from a test user (check `supabase/seed.sql`)
3. Click "Inloggen"

**Expected Result:**
- ✅ Success notification
- ✅ Redirect to dashboard (or requested page)
- ✅ Navigation shows user menu
- ✅ User name and role displayed

#### Test Scenario 4: Dashboard Access

1. While logged in, navigate to `/dashboard`
2. Observe the dashboard content

**Expected Result:**
- ✅ Welcome message with user name
- ✅ User role displayed
- ✅ Statistics cards visible
- ✅ Quick action buttons available
- ✅ Navigation drawer accessible

#### Test Scenario 5: Role-Based Access (Orchard Manager)

1. Login as user with `orchard_manager` or `admin` role
2. Navigate to `/orchards`

**Expected Result:**
- ✅ Access granted to orchards page
- ✅ Can see "Mijn Boomgaarden" in navigation
- ✅ List of accessible orchards displayed

#### Test Scenario 6: Role-Based Access Denied

1. Login as user with `registered_user` role
2. Try to navigate to `/orchards`

**Expected Result:**
- ✅ Access denied
- ✅ Redirect to dashboard
- ✅ Error message about insufficient permissions
- ✅ "Mijn Boomgaarden" not visible in navigation

#### Test Scenario 7: Session Persistence

1. Login successfully
2. Refresh the page (F5)

**Expected Result:**
- ✅ User remains logged in
- ✅ No redirect to login page
- ✅ User state preserved

#### Test Scenario 8: Protected Route Guard

1. While logged out, try to access `/dashboard` directly
2. Try to access `/orchards` directly

**Expected Result:**
- ✅ Redirect to login page
- ✅ Query parameter includes original destination
- ✅ After login, redirect to original destination

#### Test Scenario 9: Logout

1. While logged in, click on menu
2. Click "Uitloggen"
3. Confirm logout in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirmation, user is logged out
- ✅ Redirect to login page
- ✅ Success notification shown
- ✅ Cannot access protected routes

#### Test Scenario 10: Error Handling

1. Try to login with invalid credentials
2. Try to register with existing email
3. Try to register with mismatched passwords

**Expected Result:**
- ✅ Error messages displayed clearly
- ✅ No crashes or console errors
- ✅ Form validation works
- ✅ User can correct and retry

### 5. Check Supabase Studio

1. Open http://localhost:54323
2. Navigate to "Authentication" section
3. View registered users

**Expected Result:**
- ✅ Test users visible in database
- ✅ User metadata (first_name, last_name, role) stored correctly
- ✅ Email confirmation status visible

### 6. Verify RLS Policies

1. In Supabase Studio, go to "SQL Editor"
2. Run queries to test RLS:

```sql
-- As anonymous user (should only see public orchards)
SELECT * FROM orchards;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Expected Result:**
- ✅ Anonymous users only see `is_public = true` orchards
- ✅ RLS enabled on all tables
- ✅ Policies correctly filter data

### 7. Test Different User Roles

Test with users from `supabase/seed.sql`:

1. **Admin User**
   - Can access all routes
   - Sees all orchards

2. **Orchard Manager**
   - Can access `/orchards`
   - Sees own orchards + assigned orchards

3. **Orchard Worker**
   - Can access `/orchards`
   - Sees assigned orchards only

4. **Species Manager**
   - Basic access
   - (Species management to be implemented)

5. **Registered User**
   - Cannot access `/orchards`
   - Can see dashboard
   - Can see public orchards

### 8. Browser DevTools Check

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check Application > Local Storage

**Expected Result:**
- ✅ No console errors
- ✅ Successful API calls to Supabase
- ✅ Auth token stored in localStorage as `orchardmap-auth-token`
- ✅ Token refreshes automatically

## Common Issues and Solutions

### Issue: "Cannot connect to Supabase"
**Solution:** Make sure Supabase is running with `supabase start`

### Issue: "User not authenticated" on page refresh
**Solution:** Check localStorage has the auth token. Clear storage and re-login if needed.

### Issue: "Access denied" for routes user should access
**Solution:** 
- Check user role in Supabase Studio
- Verify router meta configuration in `router/index.js`
- Check auth store `hasRole` and `hasAnyRole` logic

### Issue: Registration doesn't work
**Solution:**
- Check if email confirmation is required in Supabase settings
- Verify Supabase auth is enabled
- Check console for error messages

### Issue: Blank page or white screen
**Solution:**
- Check browser console for errors
- Verify Vite dev server is running
- Check that all imports are correct

## Performance Testing

### Load Time
- Initial page load should be < 2s
- Route navigation should be < 500ms
- Auth state check should be instant (from cache)

### Network Requests
- Login: 1-2 requests to Supabase
- Page load with auth: 1 request to verify session
- Token refresh: Automatic, in background

## Security Testing

### ✅ Verify These Security Measures

1. **Passwords are not logged** - Check console, no passwords visible
2. **Tokens are stored securely** - Check localStorage encryption
3. **RLS prevents unauthorized access** - Try SQL queries as different users
4. **Client-side validation** - Form validation before submission
5. **Server-side validation** - Supabase handles auth validation
6. **No sensitive data in URLs** - Check URL bar for tokens/passwords
7. **HTTPS in production** - Ensure production uses HTTPS

## Acceptance Criteria

All tests pass when:

- ✅ Users can register with email/password
- ✅ Users can login with correct credentials
- ✅ Login fails with incorrect credentials
- ✅ Users can logout successfully
- ✅ Session persists across page refreshes
- ✅ Protected routes require authentication
- ✅ Role-based routes respect user roles
- ✅ Guest users can view public content
- ✅ RLS policies enforce data access rules
- ✅ No console errors during normal operation
- ✅ UI is responsive on mobile/tablet/desktop
- ✅ Error messages are clear and helpful
- ✅ Loading states provide feedback
- ✅ Navigation is intuitive and correct

## Next Steps After Testing

Once all tests pass:

1. ✅ Authentication system is production-ready
2. 🔄 Implement CRUD operations for orchards
3. 🔄 Add tree management features
4. 🔄 Implement GPS/map functionality
5. 🔄 Add species management interface
6. 🔄 Deploy to production with real Supabase instance
