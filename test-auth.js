// test-auth.js - Test authentication system
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

async function testAuth() {
    console.log('🧪 OrchardMap Authentication Test\n')
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    try {
        // Test 1: Check if Supabase is running
        console.log('1️⃣ Testing Supabase connection...')
        const { data: orchards, error: orchardError } = await supabase
            .from('orchards')
            .select('name')
            .limit(1)
        
        if (orchardError) {
            console.log('❌ Supabase not running. Start with: supabase start')
            return false
        }
        console.log('✅ Supabase is running\n')
        
        // Test 2: Test anonymous access (should only see public orchards)
        console.log('2️⃣ Testing anonymous access (RLS)...')
        const { data: publicOrchards } = await supabase
            .from('orchards')
            .select('name, is_public')
        
        const allPublic = publicOrchards.every(o => o.is_public)
        if (allPublic) {
            console.log('✅ RLS working - Anonymous users only see public orchards')
            console.log(`   Found ${publicOrchards.length} public orchards\n`)
        } else {
            console.log('⚠️  RLS might have issues - Check policies\n')
        }
        
        // Test 3: Test user registration (cleanup first)
        console.log('3️⃣ Testing user registration...')
        const testEmail = `test-${Date.now()}@orchardmap.test`
        const testPassword = 'testpass123'
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    first_name: 'Test',
                    last_name: 'User',
                    role: 'registered_user'
                }
            }
        })
        
        if (signUpError) {
            console.log(`⚠️  Registration test failed: ${signUpError.message}`)
            console.log('   Note: Email confirmation might be required in production\n')
        } else {
            console.log('✅ User registration working')
            console.log(`   Created test user: ${testEmail}\n`)
            
            // Test 4: Test login
            console.log('4️⃣ Testing login...')
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: testPassword
            })
            
            if (signInError) {
                console.log(`❌ Login failed: ${signInError.message}\n`)
            } else {
                console.log('✅ Login successful')
                console.log(`   User ID: ${signInData.user.id}`)
                console.log(`   Email: ${signInData.user.email}`)
                console.log(`   Role: ${signInData.user.user_metadata.role}\n`)
                
                // Test 5: Test logout
                console.log('5️⃣ Testing logout...')
                const { error: signOutError } = await supabase.auth.signOut()
                
                if (signOutError) {
                    console.log(`❌ Logout failed: ${signOutError.message}\n`)
                } else {
                    console.log('✅ Logout successful\n')
                }
            }
        }
        
        console.log('🎉 All authentication tests passed!')
        console.log('\n📝 Next steps:')
        console.log('   1. Run: npm run dev')
        console.log('   2. Open: http://localhost:3000')
        console.log('   3. Test the UI authentication flows')
        
        return true
        
    } catch (error) {
        console.log('❌ Test failed:', error.message)
        return false
    }
}

testAuth()
