<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.push('/dashboard')" />
        <q-toolbar-title>
          🌳 Publieke Boomgaarden
        </q-toolbar-title>
        
        <q-btn 
          v-if="!authStore.isAuthenticated" 
          flat 
          label="Inloggen" 
          @click="$router.push('/login')" 
        />
        <q-btn 
          v-else
          flat 
          round 
          dense 
          icon="menu" 
          @click="drawer = !drawer" 
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="authStore.isAuthenticated" v-model="drawer" side="right" overlay bordered>
      <q-list>
        <q-item clickable v-ripple @click="$router.push('/dashboard')">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Uitloggen</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="text-h5 q-mb-md">Publieke Boomgaarden</div>
        <div class="text-subtitle2 text-grey-7 q-mb-lg">
          Verken publiek toegankelijke boomgaarden en hun bomen
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-center q-pa-lg">
          <q-spinner-dots color="primary" size="50px" />
        </div>

        <!-- Error State -->
        <q-banner v-else-if="error" class="bg-negative text-white q-mb-md" rounded>
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>

        <!-- Empty State -->
        <q-card v-else-if="orchards.length === 0" class="text-center q-pa-lg">
          <q-icon name="park" size="64px" color="grey-5" />
          <div class="text-h6 q-mt-md text-grey-7">Geen publieke boomgaarden gevonden</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            Er zijn momenteel geen publieke boomgaarden beschikbaar.
          </div>
        </q-card>

        <!-- Orchards List -->
        <div v-else class="row q-col-gutter-md">
          <div 
            v-for="orchard in orchards" 
            :key="orchard.id" 
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="cursor-pointer" @click="viewOrchard(orchard)">
              <q-card-section>
                <div class="text-h6">{{ orchard.name }}</div>
                <div class="text-caption text-grey-7">
                  {{ orchard.location || 'Geen locatie opgegeven' }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-body2">
                  {{ orchard.description || 'Geen beschrijving' }}
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat color="primary" label="Bekijken" icon="arrow_forward" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useQuasar } from 'quasar'
import { supabase } from '../config/supabase.js'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const drawer = ref(false)
const loading = ref(false)
const error = ref(null)
const orchards = ref([])

/**
 * Fetch publieke boomgaarden
 */
const fetchOrchards = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('orchards')
      .select('*')
      .eq('is_public', true)
      .order('name', { ascending: true })

    if (fetchError) {
      throw fetchError
    }

    orchards.value = data || []
  } catch (err) {
    console.error('Error fetching orchards:', err)
    error.value = 'Kon boomgaarden niet laden. Probeer het later opnieuw.'
  } finally {
    loading.value = false
  }
}

/**
 * Bekijk details van een boomgaard
 */
const viewOrchard = (orchard) => {
  $q.notify({
    type: 'info',
    message: `Boomgaard details voor "${orchard.name}" worden binnenkort beschikbaar`,
    position: 'top'
  })
}

/**
 * Handle logout
 */
const handleLogout = async () => {
  const success = await authStore.handleLogout()
  
  if (success) {
    $q.notify({
      type: 'positive',
      message: 'Je bent uitgelogd',
      position: 'top'
    })
    router.push('/login')
  }
}

// Load orchards on mount
onMounted(() => {
  fetchOrchards()
})
</script>

<style scoped>
/* Custom styles */
</style>
