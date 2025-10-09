# Testing Guide for Orchard Management Interface

## Testing the Frontend

### Quick Start

1. **Start Supabase** (if using local instance):
```bash
cd /home/runner/work/OrchardMap/OrchardMap
supabase start
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Test Scenarios

### 1. Guest User Access

**Expected Behavior:**
- Can view the orchard list
- Only sees public orchards
- Cannot create, edit, or delete orchards
- Cannot add or edit trees
- Sees "Guest Mode" badge in header

**Test Steps:**
1. Access the app without logging in
2. Navigate to `/orchards`
3. Verify only public orchards are shown
4. Try to click on an orchard - should see details
5. Verify no edit/delete buttons appear
6. Verify no "Add Tree" button appears

### 2. Orchard Manager Access

**Expected Behavior:**
- Can view all their own orchards
- Can create new orchards
- Can edit and delete their own orchards
- Can add, edit, and delete trees in their orchards
- Sees "Owner" badge on their orchards

**Test Steps:**
1. Log in as an orchard manager user
2. Click "New Orchard" button
3. Fill out the form:
   - Name: "Test Orchard"
   - Description: "Testing orchard management"
   - Location: "Test Location"
   - Use "Use My Location" for GPS (allow browser permission)
   - Toggle "Make public" checkbox
4. Submit form
5. Verify new orchard appears in list
6. Click on the orchard to view details
7. Click "Add Tree" button
8. Select a tree species
9. Enter row and column numbers
10. Submit form
11. Verify tree appears in grid
12. Click on tree in grid to view details
13. Try editing tree information
14. Try removing tree

### 3. Orchard Worker Access

**Expected Behavior:**
- Can view orchards they have permission to access
- Can add and edit trees in assigned orchards
- Cannot edit or delete the orchard itself
- Sees "Worker" badge on assigned orchards

**Test Steps:**
1. Log in as a worker user
2. View assigned orchards in list
3. Click on an assigned orchard
4. Verify can add trees
5. Verify can edit existing trees
6. Verify cannot edit orchard details
7. Verify cannot delete orchard

### 4. Search and Filter Features

**Test Steps:**
1. Create multiple orchards (or use test data)
2. Test search:
   - Enter orchard name in search box
   - Verify results filter correctly
   - Try partial name matches
   - Try location name searches
3. Test filters:
   - Click "Public" filter - only public orchards shown
   - Click "Private" filter - only private orchards shown
   - Click "All" - all accessible orchards shown

### 5. Tree Grid Functionality

**Test Steps:**
1. Create an orchard with multiple trees at different positions
2. Verify grid displays correctly
3. Verify trees are positioned at correct row/column
4. Test color coding:
   - Healthy trees (green border)
   - Less healthy trees (orange border)
   - Sick trees (red border)
5. Click on tree cell to view details
6. Click on empty cell (if allowed) to add tree at that position

### 6. Mobile Responsiveness

**Test Steps:**
1. Open app in mobile browser or resize browser window
2. Verify layout adapts to smaller screens
3. Test touch interactions:
   - Tap on orchard cards
   - Tap on tree grid cells
   - Use forms on mobile
4. Verify GPS location works on mobile device

## API Testing (Composables)

### useOrchards.js

Test CRUD operations:
```javascript
import { useOrchards } from '@/composables/useOrchards.js'

const { orchards, fetchOrchards, createOrchard, updateOrchard, deleteOrchard } = useOrchards()

// Test fetch
await fetchOrchards()
console.log('Orchards:', orchards.value)

// Test create
const newOrchard = await createOrchard({
  name: 'Test Orchard',
  description: 'Test',
  location_name: 'Test Location',
  latitude: 51.5074,
  longitude: -0.1278,
  is_public: true
})
console.log('Created:', newOrchard)

// Test update
await updateOrchard(newOrchard.id, { name: 'Updated Name' })

// Test delete
await deleteOrchard(newOrchard.id)
```

### useTrees.js

Test tree operations:
```javascript
import { useTrees } from '@/composables/useTrees.js'

const { trees, fetchTreesByOrchard, createTree, getTreeGrid } = useTrees()

// Test fetch
await fetchTreesByOrchard('orchard-id')
console.log('Trees:', trees.value)

// Test grid layout
const gridData = getTreeGrid()
console.log('Grid:', gridData)
```

## Permission Testing

### RLS Policy Verification

1. **Test unauthorized access:**
   - Log out
   - Try to access private orchard via direct URL
   - Should redirect or show error

2. **Test role-based access:**
   - Log in as different users
   - Verify each role sees appropriate actions
   - Try to perform unauthorized actions via API calls

## Performance Testing

1. **Test with many orchards:**
   - Create 50+ orchards
   - Verify list loads quickly
   - Test search performance

2. **Test large tree grids:**
   - Create orchard with 100+ trees
   - Verify grid renders efficiently
   - Test scroll performance

## Error Handling

1. **Test network errors:**
   - Disable network
   - Try to load orchards
   - Verify error message shows
   - Re-enable network
   - Try "Retry" button

2. **Test validation:**
   - Try to create orchard without name
   - Try invalid GPS coordinates
   - Try to create tree without species

## Browser Compatibility

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Android Chrome)

## Known Limitations

- Offline mode not yet implemented (PWA features)
- No real-time updates (would need Supabase subscriptions)
- No photo upload for trees
- No bulk import/export

## Reporting Issues

When reporting issues, include:
- Browser and version
- User role being tested
- Steps to reproduce
- Expected vs actual behavior
- Console errors (F12 Developer Tools)
- Screenshots if relevant
