<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          🌳 OrchardMap - Dashboard
        </q-toolbar-title>

        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" overlay bordered>
      <q-list>
        <q-item-label header>Navigatie</q-item-label>
        
        <q-item clickable v-ripple @click="$router.push('/dashboard')">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/public-orchards')">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>Publieke Boomgaarden</q-item-section>
        </q-item>

        <q-item 
          v-if="canAccessOrchards"
          clickable 
          v-ripple 
          @click="$router.push('/orchards')"
        >
          <q-item-section avatar>
            <q-icon name="park" />
          </q-item-section>
          <q-item-section>Mijn Boomgaarden</q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header>Account</q-item-label>
        
        <q-item>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ userName }}</q-item-label>
            <q-item-label caption>{{ userRole }}</q-item-label>
          </q-item-section>
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
        <div class="row q-col-gutter-md">
          <!-- Welcome Card -->
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h5">Welkom, {{ userName }}!</div>
                <div class="text-subtitle2 text-grey-7">
                  Rol: {{ roleName }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Statistics Cards -->
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="park" class="q-mr-sm" />
                  Boomgaarden
                </div>
                <div class="text-h4 text-primary q-mt-md">
                  {{ stats.orchards }}
                </div>
                <div class="text-caption text-grey-7">
                  Toegankelijk voor jou
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="nature" class="q-mr-sm" />
                  Bomen
                </div>
                <div class="text-h4 text-primary q-mt-md">
                  {{ stats.trees }}
                </div>
                <div class="text-caption text-grey-7">
                  Totaal aantal bomen
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="star" class="q-mr-sm" />
                  Favorieten
                </div>
                <div class="text-h4 text-primary q-mt-md">
                  {{ stats.favorites }}
                </div>
                <div class="text-caption text-grey-7">
                  Jouw favoriete bomen
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Quick Actions -->
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Snelle acties</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      unelevated
                      color="primary"
                      label="Publieke Boomgaarden"
                      icon="public"
                      class="full-width"
                      @click="$router.push('/public-orchards')"
                    />
                  </div>
                  <div v-if="canAccessOrchards" class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      unelevated
                      color="secondary"
                      label="Mijn Boomgaarden"
                      icon="park"
                      class="full-width"
                      @click="$router.push('/orchards')"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const drawer = ref(false)

// User info
const userName = computed(() => {
  const user = authStore.user
  if (!user) return 'Gebruiker'
  
  const firstName = user.user_metadata?.first_name
  const lastName = user.user_metadata?.last_name
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  
  return user.email || 'Gebruiker'
})

const userRole = computed(() => authStore.userRole || 'registered_user')

const roleName = computed(() => {
  const roleMap = {
    'admin': 'Beheerder',
    'orchard_manager': 'Boomgaardbeheerder',
    'orchard_worker': 'Medewerker',
    'species_manager': 'Soortenbeheerder',
    'registered_user': 'Geregistreerde gebruiker',
    'Owner': 'Eigenaar'
  }
  return roleMap[userRole.value] || userRole.value
})

const canAccessOrchards = computed(() => {
  return authStore.hasAnyRole(['admin', 'orchard_manager', 'orchard_worker'])
})

// Mock statistics (in real app, fetch from Supabase)
const stats = ref({
  orchards: 0,
  trees: 0,
  favorites: 0
})

/**
 * Handle logout
 */
const handleLogout = async () => {
  $q.dialog({
    title: 'Uitloggen',
    message: 'Weet je zeker dat je wilt uitloggen?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const success = await authStore.handleLogout()
    
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Je bent uitgelogd',
        position: 'top'
      })
      router.push('/login')
    } else {
      $q.notify({
        type: 'negative',
        message: 'Uitloggen mislukt',
        position: 'top'
      })
    }
  })
}
</script>

<style scoped>
/* Custom styles */
</style>
