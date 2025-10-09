// debug-policies.js - Bekijk welke policies er actief zijn

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const serviceKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'

async function debugPolicies() {
    console.log('🔍 DEBUG: Actieve RLS Policies\n')
    
    const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
    
    try {
        // Bekijk alle RLS policies
        const { data: policies, error } = await adminClient
            .from('pg_policies')
            .select('tablename, policyname, permissive, roles, cmd, qual, with_check')
            .in('tablename', ['orchards', 'orchard_trees', 'tree_species', 'favorite_trees', 'orchard_permissions'])
            .order('tablename, policyname')
        
        if (error) {
            console.log('❌ Error fetching policies:', error)
            return
        }
        
        policies.forEach(policy => {
            console.log(`📋 Tabel: ${policy.tablename}`)
            console.log(`   Policy: ${policy.policyname}`)
            console.log(`   Command: ${policy.cmd}`)
            console.log(`   Roles: ${policy.roles ? policy.roles.join(', ') : 'ALL'}`)
            console.log(`   Condition: ${policy.qual || 'None'}`)
            console.log(`   Check: ${policy.with_check || 'None'}`)
            console.log('')
        })
        
        // Test een simpele query als anonymous
        console.log('🔬 TEST: Eenvoudige anonymous query')
        const anonClient = createClient(supabaseUrl, 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH')
        
        const { data: orchardCount, error: countError } = await anonClient
            .from('orchards')
            .select('id', { count: 'exact', head: true })
        
        if (countError) {
            console.log('❌ Anonymous count error:', countError.message)
        } else {
            console.log(`✅ Anonymous kan ${orchardCount} boomgaarden tellen`)
        }
        
    } catch (error) {
        console.log('❌ Debug error:', error.message)
    }
}

debugPolicies()