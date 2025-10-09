// test-rls.js
// Specifieke test voor Row Level Security

import { supabase } from './src/config/supabase.js'

async function testRLS() {
    console.log('🔒 Testing Row Level Security...\n')
    
    try {
        console.log('1️⃣ Test zonder authenticatie (Guest gebruiker)')
        
        // Test: Publieke boomgaarden moeten zichtbaar zijn
        const { data: publicOrchards, error: publicError } = await supabase
            .from('orchards')
            .select('name, is_public')
            .eq('is_public', true)
        
        if (publicError) {
            console.log('❌ Publieke boomgaarden: GEFAALD', publicError.message)
        } else {
            console.log(`✅ Publieke boomgaarden: ${publicOrchards.length} gevonden`)
            publicOrchards.forEach(o => console.log(`   - ${o.name}`))
        }
        
        // Test: Private boomgaarden moeten NIET zichtbaar zijn
        const { data: privateOrchards, error: privateError } = await supabase
            .from('orchards')
            .select('name, is_public')
            .eq('is_public', false)
        
        if (privateError) {
            console.log('❌ Private boomgaarden test: GEFAALD', privateError.message)
        } else {
            console.log(`✅ Private boomgaarden: ${privateOrchards.length} gevonden (zou 0 moeten zijn voor guest)`)
            privateOrchards.forEach(o => console.log(`   - ${o.name} (OEPS! Deze zou niet zichtbaar moeten zijn)`))
        }
        
        // Test: Alle boomgaarden (moet alleen publieke tonen)
        const { data: allOrchards, error: allError } = await supabase
            .from('orchards')
            .select('name, is_public')
        
        if (allError) {
            console.log('❌ Alle boomgaarden: GEFAALD', allError.message)
        } else {
            console.log(`✅ Alle boomgaarden voor guest: ${allOrchards.length} gevonden`)
            allOrchards.forEach(o => console.log(`   - ${o.name} (${o.is_public ? 'Publiek ✅' : 'Privé ❌ PROBLEEM!'})`))
        }
        
        // Test: Bomen in publieke boomgaarden
        const { data: publicTrees, error: treesError } = await supabase
            .from('orchard_trees')
            .select(`
                row_number,
                column_number,
                tree_species(variety_name),
                orchards(name, is_public)
            `)
        
        if (treesError) {
            console.log('❌ Bomen in publieke boomgaarden: GEFAALD', treesError.message)
        } else {
            console.log(`✅ Bomen zichtbaar voor guest: ${publicTrees.length} gevonden`)
            publicTrees.forEach(t => {
                const isPublic = t.orchards.is_public
                console.log(`   - ${t.tree_species.variety_name} in ${t.orchards.name} (${isPublic ? 'Publiek ✅' : 'Privé ❌ PROBLEEM!'})`)
            })
        }
        
        // Test: Tree species (moeten allemaal zichtbaar zijn als ze gevalideerd zijn)
        const { data: species, error: speciesError } = await supabase
            .from('tree_species')
            .select('variety_name, is_validated')
        
        if (speciesError) {
            console.log('❌ Boomsoorten: GEFAALD', speciesError.message)
        } else {
            console.log(`✅ Boomsoorten zichtbaar: ${species.length} gevonden`)
            species.forEach(s => console.log(`   - ${s.variety_name} (${s.is_validated ? 'Gevalideerd ✅' : 'Niet gevalideerd ❌'})`))
        }
        
        console.log('\n📊 RLS Test Samenvatting:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        const publicCount = publicOrchards?.length || 0
        const privateCount = privateOrchards?.length || 0
        const totalCount = allOrchards?.length || 0
        const treeCount = publicTrees?.length || 0
        const speciesCount = species?.length || 0
        
        if (privateCount === 0 && publicCount > 0) {
            console.log('✅ RLS voor boomgaarden: WERKT CORRECT')
        } else {
            console.log('❌ RLS voor boomgaarden: PROBLEEM')
        }
        
        if (treeCount > 0) {
            console.log('✅ RLS voor bomen: Getest (details hierboven)')
        } else {
            console.log('❌ RLS voor bomen: GEEN BOMEN ZICHTBAAR')
        }
        
        if (speciesCount > 0) {
            console.log('✅ Boomsoorten: Zichtbaar voor iedereen')
        } else {
            console.log('❌ Boomsoorten: NIET ZICHTBAAR')
        }
        
        console.log(`\n📈 Getallen:`)
        console.log(`   - Publieke boomgaarden: ${publicCount}`)
        console.log(`   - Private boomgaarden: ${privateCount} (moet 0 zijn)`)
        console.log(`   - Totaal zichtbaar: ${totalCount}`)
        console.log(`   - Bomen zichtbaar: ${treeCount}`)
        console.log(`   - Boomsoorten: ${speciesCount}`)
        
    } catch (error) {
        console.error('❌ RLS test gefaald:', error)
    }
}

testRLS()