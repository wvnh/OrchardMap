<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <q-card class="login-card q-pa-md">
          <q-card-section class="text-center">
            <div class="text-h4 text-primary q-mb-md">
              🌳 OrchardMap
            </div>
            <div class="text-h6 text-grey-7">
              Inloggen
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="email"
                type="email"
                label="Email"
                outlined
                required
                :error="!!fieldErrors.email"
                :error-message="fieldErrors.email"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Wachtwoord"
                outlined
                required
                :error="!!fieldErrors.password"
                :error-message="fieldErrors.password"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-banner
                v-if="error"
                class="bg-negative text-white"
                rounded
              >
                <template v-slot:avatar>
                  <q-icon name="error" />
                </template>
                {{ error }}
              </q-banner>

              <q-btn
                type="submit"
                label="Inloggen"
                color="primary"
                class="full-width"
                :loading="loading"
                :disable="loading"
              />

              <div class="text-center q-mt-md">
                <router-link to="/register" class="text-primary">
                  Nog geen account? Registreer hier
                </router-link>
              </div>

              <div class="text-center text-caption text-grey-6 q-mt-sm">
                <router-link to="/public-orchards" class="text-grey-6">
                  Of bekijk publieke boomgaarden als gast
                </router-link>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const $q = useQuasar()

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const fieldErrors = ref({})

/**
 * Handle login form submission
 */
const onSubmit = async () => {
  // Reset errors
  error.value = null
  fieldErrors.value = {}
  
  // Client-side validatie
  if (!email.value) {
    fieldErrors.value.email = 'Email is verplicht'
    return
  }
  
  if (!password.value) {
    fieldErrors.value.password = 'Wachtwoord is verplicht'
    return
  }
  
  loading.value = true
  
  try {
    const success = await authStore.handleLogin(email.value, password.value)
    
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Succesvol ingelogd!',
        position: 'top'
      })
      
      // Redirect naar de gevraagde pagina of dashboard
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
    } else {
      error.value = authStore.error || 'Login mislukt. Controleer je gegevens.'
    }
  } catch (err) {
    error.value = 'Er is een fout opgetreden. Probeer het opnieuw.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  min-width: 350px;
  max-width: 450px;
  width: 100%;
}

@media (max-width: 600px) {
  .login-card {
    min-width: 90vw;
  }
}
</style>
