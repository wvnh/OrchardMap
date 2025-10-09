<template>
  <q-page class="flex flex-center">
    <div class="text-center max-w-2xl px-4">
      <h1 class="text-h2 q-mb-md">Welkom bij OrchardMap</h1>
      <p class="text-h6 q-mb-lg text-grey-7">
        Geografisch beheersysteem voor boomgaarden en boomsoorten
      </p>
      
      <div class="q-gutter-md">
        <q-btn
          v-if="!user"
          color="primary"
          size="lg"
          label="Inloggen"
          @click="$router.push('/login')"
          class="q-px-xl"
        />
        <q-btn
          v-else
          color="primary"
          size="lg"
          label="Naar Dashboard"
          @click="$router.push('/dashboard')"
          class="q-px-xl"
        />
      </div>

      <div class="q-mt-xl q-pa-md bg-grey-2 rounded-borders">
        <h3 class="text-h5 q-mb-md">Functies</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded shadow">
            <q-icon name="location_on" size="48px" color="primary" />
            <h4 class="text-h6 q-mt-sm">GPS Mapping</h4>
            <p class="text-body2 text-grey-7">Markeer bomen op kaart met GPS-coördinaten</p>
          </div>
          <div class="p-4 bg-white rounded shadow">
            <q-icon name="nature" size="48px" color="primary" />
            <h4 class="text-h6 q-mt-sm">Soortenbeheer</h4>
            <p class="text-body2 text-grey-7">Beheer boomsoorten en eigenschappen</p>
          </div>
          <div class="p-4 bg-white rounded shadow">
            <q-icon name="eco" size="48px" color="primary" />
            <h4 class="text-h6 q-mt-sm">Boomgaardbeheer</h4>
            <p class="text-body2 text-grey-7">Overzicht van alle boomgaarden</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<style scoped>
.rounded {
  border-radius: 8px;
}
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
