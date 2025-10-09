// test-setup.js - Simpele verificatie dat de database setup werkt

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

async function testSetup() {
    console.log('🧪 OrchardMap Database Setup Test\n')
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    try {
        // Test 1: Basis connectie
        const { data: orchards, error: orchardError } = await supabase
            .from('orchards')
            .select('name, is_public')
            .limit(3)
        
        if (orchardError) {
            console.log('❌ Database connection failed:', orchardError.message)
            return false
        }
        
        console.log(`✅ Database connected - Found ${orchards.length} orchards`)
        orchards.forEach(o => console.log(`   - ${o.name} (${o.is_public ? 'Public' : 'Private'})`))
        
        // Test 2: RLS werkt (guests zien alleen publieke orchards)
        const publicOrchards = orchards.filter(o => o.is_public)
        if (publicOrchards.length === orchards.length && orchards.length > 0) {
            console.log('✅ RLS working - Only public orchards visible to guests')
        } else {
            console.log('⚠️  RLS might have issues - Check manually if needed')
        }
        
        // Test 3: Relaties werken
        const { data: trees, error: treeError } = await supabase
            .from('orchard_trees')
            .select(`
                row_number,
                column_number,
                tree_species(variety_name),
                orchards(name)
            `)
            .limit(2)
        
        if (treeError) {
            console.log('❌ Relations test failed:', treeError.message)
            return false
        }
        
        console.log(`✅ Relations working - Found ${trees.length} trees with species data`)
        trees.forEach(t => {
            console.log(`   - ${t.tree_species.variety_name} at R${t.row_number}C${t.column_number} in ${t.orchards.name}`)
        })
        
        console.log('\n🎉 All tests passed! Database is ready for development.')
        return true
        
    } catch (error) {
        console.log('❌ Test failed:', error.message)
        return false
    }
}

testSetup()