<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.push('/dashboard')" />
        <q-toolbar-title>
          🌳 Mijn Boomgaarden
        </q-toolbar-title>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" overlay bordered>
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
        <div class="text-h5 q-mb-md">Mijn Boomgaarden</div>
        <div class="text-subtitle2 text-grey-7 q-mb-lg">
          Beheer je boomgaarden en bomen
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
          <div class="text-h6 q-mt-md text-grey-7">Nog geen boomgaarden</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            Je hebt nog geen boomgaarden of toegang tot boomgaarden.
          </div>
          <q-btn
            class="q-mt-md"
            color="primary"
            label="Nieuwe Boomgaard Aanmaken"
            icon="add"
            @click="createOrchard"
          />
        </q-card>

        <!-- Orchards List -->
        <div v-else>
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Nieuwe Boomgaard"
            icon="add"
            @click="createOrchard"
          />

          <div class="row q-col-gutter-md">
            <div 
              v-for="orchard in orchards" 
              :key="orchard.id" 
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{ orchard.name }}</div>
                  <div class="text-caption text-grey-7">
                    {{ orchard.location || 'Geen locatie' }}
                  </div>
                  <q-badge 
                    :color="orchard.is_public ? 'positive' : 'grey'" 
                    class="q-mt-sm"
                  >
                    {{ orchard.is_public ? 'Publiek' : 'Privé' }}
                  </q-badge>
                </q-card-section>

                <q-separator />

                <q-card-section>
                  <div class="text-body2">
                    {{ orchard.description || 'Geen beschrijving' }}
                  </div>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat color="primary" label="Bekijken" @click="viewOrchard(orchard)" />
                  <q-btn flat color="secondary" label="Bewerken" @click="editOrchard(orchard)" />
                </q-card-actions>
              </q-card>
            </div>
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
 * Fetch boomgaarden waar gebruiker toegang toe heeft
 */
const fetchOrchards = async () => {
  loading.value = true
  error.value = null

  try {
    // RLS policies zorgen ervoor dat gebruiker alleen boomgaarden ziet waartoe hij toegang heeft
    const { data, error: fetchError } = await supabase
      .from('orchards')
      .select('*')
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
 * Bekijk boomgaard details
 */
const viewOrchard = (orchard) => {
  $q.notify({
    type: 'info',
    message: `Boomgaard details voor "${orchard.name}" worden binnenkort beschikbaar`,
    position: 'top'
  })
}

/**
 * Bewerk boomgaard
 */
const editOrchard = (orchard) => {
  $q.notify({
    type: 'info',
    message: `Bewerken van "${orchard.name}" wordt binnenkort beschikbaar`,
    position: 'top'
  })
}

/**
 * Nieuwe boomgaard aanmaken
 */
const createOrchard = () => {
  $q.notify({
    type: 'info',
    message: 'Nieuwe boomgaard aanmaken wordt binnenkort beschikbaar',
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
