<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card q-pa-md" style="width: 100%; max-width: 400px;">
      <q-card-section>
        <div class="text-h4 text-center q-mb-md">Inloggen</div>
        <div class="text-subtitle2 text-center text-grey-7 q-mb-lg">
          Log in bij uw OrchardMap account
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="E-mailadres"
            outlined
            :rules="[val => !!val || 'E-mail is verplicht']"
            autocomplete="email"
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
            :rules="[val => !!val || 'Wachtwoord is verplicht']"
            autocomplete="current-password"
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

          <div class="text-center">
            <q-btn
              type="submit"
              color="primary"
              label="Inloggen"
              class="full-width"
              size="lg"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center text-grey-6">
        <p class="text-caption q-ma-none">
          Test accounts (zie seed.sql):<br>
          admin@orchardmap.nl / securepassword
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await login(email.value, password.value)
    
    $q.notify({
      type: 'positive',
      message: 'Succesvol ingelogd!',
      icon: 'check_circle'
    })

    // Redirect naar oorspronkelijke pagina of dashboard
    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Login mislukt. Controleer uw gegevens.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
