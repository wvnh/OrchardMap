<script setup lang="ts">
// Home page with Quasar components demo
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 800px">
      <div class="text-h4 text-center q-mb-md">
        🌳 Welkom bij OrchardMap
      </div>
      
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Frontend Setup Compleet!</div>
          <div class="text-subtitle2">Vue.js 3 + Quasar Framework + Tailwind CSS</div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section>
          <p>De volgende componenten zijn succesvol geconfigureerd:</p>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vue.js 3 met Composition API</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Quasar Framework componenten</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tailwind CSS voor custom styling</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vue Router voor navigatie</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Supabase client integratie</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        
        <q-separator />
        
        <q-card-actions align="right">
          <q-btn flat color="primary" label="Lees documentatie" icon="description" />
          <q-btn unelevated color="primary" label="Ga aan de slag" icon="arrow_forward" to="/about" />
        </q-card-actions>
      </q-card>
      
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">📱 PWA Ready</div>
              <p class="text-caption">Progressive Web App ondersteuning voor mobiel gebruik</p>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">🎨 Responsive</div>
              <p class="text-caption">Werkt perfect op desktop, tablet en mobiel</p>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">🔐 Secure</div>
              <p class="text-caption">Supabase authenticatie en RLS beveiliging</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
