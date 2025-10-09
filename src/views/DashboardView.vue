<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h2 class="text-h4 q-mb-md">Dashboard</h2>
        <p class="text-subtitle1 text-grey-7">Welkom terug, {{ user?.email }}</p>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <q-icon name="eco" size="32px" class="q-mr-sm" />
              Boomgaarden
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-h3 text-center q-my-md">5</div>
            <p class="text-center text-grey-7">Totaal aantal boomgaarden</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="primary" label="Bekijk alles" class="full-width" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              <q-icon name="nature" size="32px" class="q-mr-sm" />
              Bomen
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-h3 text-center q-my-md">10</div>
            <p class="text-center text-grey-7">Totaal aantal bomen</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="secondary" label="Bekijk alles" class="full-width" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">
              <q-icon name="category" size="32px" class="q-mr-sm" />
              Soorten
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-h3 text-center q-my-md">5</div>
            <p class="text-center text-grey-7">Totaal aantal soorten</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="accent" label="Bekijk alles" class="full-width" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Snelle Acties</div>
            <div class="q-gutter-md">
              <q-btn color="primary" icon="add" label="Nieuwe Boomgaard" />
              <q-btn color="secondary" icon="add" label="Nieuwe Boom" />
              <q-btn color="accent" icon="map" label="Kaartweergave" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Recente Activiteit</div>
            <q-list separator>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="eco" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Nieuwe boomgaard toegevoegd</q-item-label>
                  <q-item-label caption>2 uur geleden</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white" icon="nature" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Boom bijgewerkt</q-item-label>
                  <q-item-label caption>5 uur geleden</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="accent" text-color="white" icon="category" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Nieuwe soort toegevoegd</q-item-label>
                  <q-item-label caption>1 dag geleden</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, userRole } = useAuth()
</script>

<style scoped>
/* Dashboard specific styles */
</style>
