<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user, userRole } = useAuth()
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Over OrchardMap</div>
      
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Project Informatie</div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section>
          <p>
            OrchardMap is een geografisch beheersysteem voor boomgaarden en boomsoorten, 
            gebouwd met moderne technologieën voor een optimale gebruikerservaring.
          </p>
          
          <div class="q-mt-md">
            <div class="text-subtitle1 q-mb-sm">Tech Stack:</div>
            <q-chip color="primary" text-color="white" icon="code">Vue.js 3</q-chip>
            <q-chip color="secondary" text-color="white" icon="widgets">Quasar</q-chip>
            <q-chip color="accent" text-color="white" icon="palette">Tailwind CSS</q-chip>
            <q-chip color="positive" text-color="white" icon="storage">Supabase</q-chip>
          </div>
        </q-card-section>
      </q-card>
      
      <q-card>
        <q-card-section>
          <div class="text-h6">Authenticatie Status</div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section>
          <div v-if="user">
            <q-banner class="bg-positive text-white">
              <template v-slot:avatar>
                <q-icon name="check_circle" />
              </template>
              Ingelogd als: {{ user.email }} (Rol: {{ userRole }})
            </q-banner>
          </div>
          <div v-else>
            <q-banner class="bg-grey-3">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>
              Niet ingelogd. Auth composable is beschikbaar voor gebruik.
            </q-banner>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
/* Custom styles if needed */
</style>
