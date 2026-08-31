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
    await adminAuthStore.loginWithFirebase(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.push(redirect);
  } catch (err: any) {
    console.error('Erro no login admin Firebase:', err);
    switch (err.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Formato de e-mail inválido.';
        break;
      case 'auth/user-not-found':
        errorMessage.value = 'Nenhuma conta administrativa encontrada com este e-mail.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage.value = 'E-mail ou senha administrativa incorretos.';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'Muitas tentativas consecutivas. Aguarde alguns instantes.';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'Falha de conexão com a rede. Verifique sua internet.';
        break;
      default:
        errorMessage.value = err.message || 'Falha ao autenticar administrador com Firebase.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
</style>
