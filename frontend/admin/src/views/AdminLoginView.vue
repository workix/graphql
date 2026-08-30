<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-background">
      <v-card class="pa-8 elevation-12 rounded-lg" width="420">
        <div class="text-center mb-6">
          <v-icon icon="mdi-shield-account" color="primary" size="64"></v-icon>
          <h2 class="text-h5 font-weight-bold mt-2">Painel Administrativo</h2>
          <p class="text-caption text-medium-emphasis">Acesso restrito a administradores e operadores</p>
        </div>

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="E-mail Administrativo"
            prepend-inner-icon="mdi-email"
            type="email"
            variant="outlined"
            density="comfortable"
            required
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Senha de Acesso"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="outlined"
            density="comfortable"
            required
            class="mb-4"
          ></v-text-field>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="loading"
            elevation="2"
          >
            Entrar no Painel
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';
import { useAdminAuthStore } from '../stores/adminAuth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const adminAuthStore = useAdminAuthStore();
const router = useRouter();
const route = useRoute();

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });
    if (response.data && response.data.token) {
      adminAuthStore.setAdminAuth(
        response.data.token,
        response.data.user || { id: 1, email: email.value, role: 'ROLE_ADMIN' }
      );
      const redirect = (route.query.redirect as string) || '/dashboard';
      router.push(redirect);
    } else {
      errorMessage.value = 'Credenciais administrativas não reconhecidas.';
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'E-mail ou senha incorretos.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
</style>
