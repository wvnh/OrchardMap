// test-database-no-rls.js
// Test zonder RLS om de data te verifiëren

import { createClient } from '@supabase/supabase-js'

// Service role key voor admin toegang (gebruikt nooit in productie frontend!)
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testDatabaseAdmin() {
    console.log('🧪 Testing OrchardMap Database (Admin Mode)...\n')
    
    try {
        // Test 1: Users
        console.log('📋 Test 1: Gebruikers')
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('email, role, first_name, last_name')
        
        if (usersError) throw usersError
        console.log(`✅ ${users.length} gebruikers gevonden:`)
        users.forEach(user => console.log(`   - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`))
        
        // Test 2: Tree Species
        console.log('\n🌳 Test 2: Boomsoorten')
        const { data: species, error: speciesError } = await supabaseAdmin
            .from('tree_species')
            .select('variety_name, fruit_type, origin_country, harvest_time')
        
        if (speciesError) throw speciesError
        console.log(`✅ ${species.length} boomsoorten gevonden:`)
        species.forEach(s => console.log(`   - ${s.variety_name} (${s.fruit_type}) uit ${s.origin_country}, oogst: ${s.harvest_time}`))
        
        // Test 3: Orchards
        console.log('\n🏡 Test 3: Boomgaarden')
        const { data: orchards, error: orchardsError } = await supabaseAdmin
            .from('orchards')
            .select('name, is_public, location_name, users(first_name, last_name)')
        
        if (orchardsError) throw orchardsError
        console.log(`✅ ${orchards.length} boomgaarden gevonden:`)
        orchards.forEach(o => console.log(`   - ${o.name} (${o.is_public ? 'Publiek' : 'Privé'}) - ${o.location_name} - Eigenaar: ${o.users.first_name} ${o.users.last_name}`))
        
        // Test 4: Trees with relations
        console.log('\n🌲 Test 4: Bomen in boomgaarden')
        const { data: trees, error: treesError } = await supabaseAdmin
            .from('orchard_trees')
            .select(`
                row_number, 
                column_number, 
                condition, 
                health_status,
                notes,
                tree_species(variety_name, fruit_type),
                orchards(name)
            `)
        
        if (treesError) throw treesError
        console.log(`✅ ${trees.length} bomen gevonden:`)
        trees.forEach(t => console.log(`   - ${t.tree_species.variety_name} (${t.tree_species.fruit_type}) in "${t.orchards.name}" [R${t.row_number}C${t.column_number}] - ${t.condition}/${t.health_status}`))
        
        // Test 5: Permissions
        console.log('\n🔑 Test 5: Toegangsrechten')
        const { data: permissions, error: permError } = await supabaseAdmin
            .from('orchard_permissions')
            .select(`
                permission_type,
                users!orchard_permissions_user_id_fkey(first_name, last_name, email),
                orchards(name)
            `)
        
        if (permError) throw permError
        console.log(`✅ ${permissions.length} toegangsrechten gevonden:`)
        permissions.forEach(p => console.log(`   - ${p.users.first_name} ${p.users.last_name} heeft ${p.permission_type} toegang tot "${p.orchards.name}"`))
        
        // Test 6: Favorites
        console.log('\n⭐ Test 6: Favoriete bomen')
        const { data: favorites, error: favError } = await supabaseAdmin
            .from('favorite_trees')
            .select(`
                users(first_name, last_name),
                orchard_trees(
                    row_number, 
                    column_number,
                    tree_species(variety_name),
                    orchards(name)
                )
            `)
        
        if (favError) throw favError
        console.log(`✅ ${favorites.length} favorieten gevonden:`)
        favorites.forEach(f => console.log(`   - ${f.users.first_name} ${f.users.last_name} heeft ${f.orchard_trees.tree_species.variety_name} (R${f.orchard_trees.row_number}C${f.orchard_trees.column_number}) in "${f.orchard_trees.orchards.name}" als favoriet`))
        
        // Test 7: Notifications
        console.log('\n🔔 Test 7: Notificaties')
        const { data: notifications, error: notifError } = await supabaseAdmin
            .from('notifications')
            .select(`
                title,
                type,
                is_read,
                users(first_name, last_name)
            `)
        
        if (notifError) throw notifError
        console.log(`✅ ${notifications.length} notificaties gevonden:`)
        notifications.forEach(n => console.log(`   - ${n.users.first_name} ${n.users.last_name}: "${n.title}" (${n.type}) - ${n.is_read ? 'Gelezen' : 'Ongelezen'}`))
        
        // Summary statistics
        console.log('\n📊 Database Statistieken:')
        console.log(`   - 👥 Gebruikers: ${users.length}`)
        console.log(`   - 🌳 Boomsoorten: ${species.length}`)
        console.log(`   - 🏡 Boomgaarden: ${orchards.length}`)
        console.log(`   - 🌲 Bomen: ${trees.length}`)
        console.log(`   - 🔑 Toegangsrechten: ${permissions.length}`)
        console.log(`   - ⭐ Favorieten: ${favorites.length}`)
        console.log(`   - 🔔 Notificaties: ${notifications.length}`)
        
        console.log('\n🎉 Alle database tests succesvol!')
        console.log('\n✅ Database Status: VOLLEDIG OPERATIONEEL')
        
    } catch (error) {
        console.error('❌ Database test gefaald:', error)
        process.exit(1)
    }
}

testDatabaseAdmin()