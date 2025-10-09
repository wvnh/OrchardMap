<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <q-card class="register-card q-pa-md">
          <q-card-section class="text-center">
            <div class="text-h4 text-primary q-mb-md">
              🌳 OrchardMap
            </div>
            <div class="text-h6 text-grey-7">
              Registreren
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="firstName"
                label="Voornaam"
                outlined
                required
                :error="!!fieldErrors.firstName"
                :error-message="fieldErrors.firstName"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="lastName"
                label="Achternaam"
                outlined
                required
                :error="!!fieldErrors.lastName"
                :error-message="fieldErrors.lastName"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

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
                hint="Minimaal 6 karakters"
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

              <q-input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Bevestig wachtwoord"
                outlined
                required
                :error="!!fieldErrors.confirmPassword"
                :error-message="fieldErrors.confirmPassword"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
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

              <q-banner
                v-if="successMessage"
                class="bg-positive text-white"
                rounded
              >
                <template v-slot:avatar>
                  <q-icon name="check_circle" />
                </template>
                {{ successMessage }}
              </q-banner>

              <q-btn
                type="submit"
                label="Registreren"
                color="primary"
                class="full-width"
                :loading="loading"
                :disable="loading"
              />

              <div class="text-center q-mt-md">
                <router-link to="/login" class="text-primary">
                  Al een account? Log hier in
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const fieldErrors = ref({})

/**
 * Valideer formulier
 */
const validateForm = () => {
  fieldErrors.value = {}
  
  if (!firstName.value.trim()) {
    fieldErrors.value.firstName = 'Voornaam is verplicht'
    return false
  }
  
  if (!lastName.value.trim()) {
    fieldErrors.value.lastName = 'Achternaam is verplicht'
    return false
  }
  
  if (!email.value) {
    fieldErrors.value.email = 'Email is verplicht'
    return false
  }
  
  // Email validatie
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    fieldErrors.value.email = 'Ongeldig email adres'
    return false
  }
  
  if (!password.value) {
    fieldErrors.value.password = 'Wachtwoord is verplicht'
    return false
  }
  
  if (password.value.length < 6) {
    fieldErrors.value.password = 'Wachtwoord moet minimaal 6 karakters bevatten'
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    fieldErrors.value.confirmPassword = 'Wachtwoorden komen niet overeen'
    return false
  }
  
  return true
}

/**
 * Handle register form submission
 */
const onSubmit = async () => {
  // Reset errors
  error.value = null
  successMessage.value = null
  
  // Valideer formulier
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const metadata = {
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
      role: 'registered_user' // Standaard rol
    }
    
    const success = await authStore.handleRegister(email.value, password.value, metadata)
    
    if (success) {
      successMessage.value = 'Account succesvol aangemaakt! Je wordt doorgestuurd...'
      
      $q.notify({
        type: 'positive',
        message: 'Account succesvol aangemaakt!',
        position: 'top'
      })
      
      // Wacht 2 seconden en redirect naar dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      error.value = authStore.error || 'Registratie mislukt. Probeer het opnieuw.'
    }
  } catch (err) {
    error.value = 'Er is een fout opgetreden. Probeer het opnieuw.'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  min-width: 350px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .register-card {
    min-width: 90vw;
  }
}
</style>
