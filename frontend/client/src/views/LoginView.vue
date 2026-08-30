<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="container section-padding">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <div class="auth-box">
            <h2 class="text-center mb-4">Acessar Minha Conta</h2>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label>E-mail</label>
                <input type="email" v-model="email" class="form-control" placeholder="seuemail@exemplo.com" required />
              </div>
              <div class="form-group">
                <label>Senha</label>
                <input type="password" v-model="password" class="form-control" placeholder="Sua senha" required />
              </div>
              <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Entrando...</span>
                <span v-else>Entrar</span>
              </button>
            </form>
            <div class="text-center mt-3">
              <p>Ainda não possui conta? <router-link to="/register">Cadastre-se aqui</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
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
      authStore.setAuth(response.data.token, response.data.user || { id: 1, email: email.value, role: 'CANDIDATE' });
      const redirect = (route.query.redirect as string) || '/';
      router.push(redirect);
    } else {
      errorMessage.value = 'Resposta inválida do servidor.';
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'E-mail ou senha inválidos.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.section-padding {
  padding: 60px 0;
}
.auth-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}
</style>
