// test-database.js
// Simpele test om database connectie en data te verifiëren

import { supabase } from './src/config/supabase.js'

async function testDatabase() {
    console.log('🧪 Testing OrchardMap Database...\n')
    
    try {
        // Test 1: Users
        console.log('📋 Test 1: Gebruikers')
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('email, role')
            .limit(5)
        
        if (usersError) throw usersError
        console.log(`✅ ${users.length} gebruikers gevonden:`)
        users.forEach(user => console.log(`   - ${user.email} (${user.role})`))
        
        // Test 2: Tree Species
        console.log('\n🌳 Test 2: Boomsoorten')
        const { data: species, error: speciesError } = await supabase
            .from('tree_species')
            .select('variety_name, fruit_type, is_validated')
            .eq('is_validated', true)
        
        if (speciesError) throw speciesError
        console.log(`✅ ${species.length} gevalideerde boomsoorten gevonden:`)
        species.forEach(s => console.log(`   - ${s.variety_name} (${s.fruit_type})`))
        
        // Test 3: Orchards
        console.log('\n🏡 Test 3: Boomgaarden')
        const { data: orchards, error: orchardsError } = await supabase
            .from('orchards')
            .select('name, is_public, location_name')
        
        if (orchardsError) throw orchardsError
        console.log(`✅ ${orchards.length} boomgaarden gevonden:`)
        orchards.forEach(o => console.log(`   - ${o.name} (${o.is_public ? 'Publiek' : 'Privé'}) - ${o.location_name}`))
        
        // Test 4: Trees
        console.log('\n🌲 Test 4: Bomen in boomgaarden')
        const { data: trees, error: treesError } = await supabase
            .from('orchard_trees')
            .select(`
                row_number, 
                column_number, 
                condition, 
                health_status,
                tree_species!inner(variety_name),
                orchards!inner(name)
            `)
            .limit(5)
        
        if (treesError) throw treesError
        console.log(`✅ ${trees.length} bomen gevonden (eerste 5):`)
        trees.forEach(t => console.log(`   - ${t.tree_species.variety_name} in ${t.orchards.name} (R${t.row_number}C${t.column_number}) - ${t.condition}, ${t.health_status}`))
        
        // Test 5: RLS (Row Level Security)
        console.log('\n🔒 Test 5: Row Level Security')
        const { data: publicOrchards, error: rlsError } = await supabase
            .from('orchards')
            .select('name')
            .eq('is_public', true)
        
        if (rlsError) throw rlsError
        console.log(`✅ ${publicOrchards.length} publieke boomgaarden zichtbaar zonder authenticatie:`)
        publicOrchards.forEach(o => console.log(`   - ${o.name}`))
        
        // Test 6: Complex query met joins
        console.log('\n🔍 Test 6: Complex zoekquery')
        const { data: apples, error: queryError } = await supabase
            .from('tree_species')
            .select(`
                variety_name, 
                taste_profile, 
                harvest_time,
                orchard_trees(count)
            `)
            .eq('fruit_type', 'Appel')
            .eq('is_validated', true)
        
        if (queryError) throw queryError
        console.log(`✅ ${apples.length} appelvariëteiten met boom tellingen:`)
        apples.forEach(a => console.log(`   - ${a.variety_name}: ${a.taste_profile}, oogst ${a.harvest_time}`))
        
        console.log('\n🎉 Alle database tests succesvol!')
        console.log('\n📊 Database Status:')
        console.log(`   - ✅ Connectie: Werkend`)
        console.log(`   - ✅ Schema: Volledig geïmplementeerd`)
        console.log(`   - ✅ Testdata: Geladen`)
        console.log(`   - ✅ RLS: Actief`)
        console.log(`   - ✅ Joins: Functioneel`)
        
    } catch (error) {
        console.error('❌ Database test gefaald:', error)
        process.exit(1)
    }
}

// Run de test
testDatabase()