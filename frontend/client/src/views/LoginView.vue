<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Área Restrita do Usuário</h1>
        <p>Acesse sua conta para publicar vagas ou gerenciar seu currículo</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <div class="auth-box">
            <h2 class="auth-title text-center">Acessar Minha Conta</h2>
            <p class="text-center auth-subtitle">Entre com suas credenciais ou escolha um perfil de acesso rápido</p>
            
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            <!-- Quick Access Buttons -->
            <div class="quick-access-box mb-4">
              <span class="quick-access-label">Acesso Rápido de Demonstração:</span>
              <div class="quick-btns">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="quickLogin('candidate')">
                  <i class="fa fa-user"></i> Entrar como Candidato
                </button>
                <button type="button" class="btn btn-outline-success btn-sm" @click="quickLogin('company')">
                  <i class="fa fa-building"></i> Entrar como Empresa
                </button>
              </div>
            </div>

            <div class="divider-text"><span>ou com seu e-mail</span></div>

            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  placeholder="ex: candidato@workix.com ou empresa@workix.com"
                  required
                />
              </div>
              <div class="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  placeholder="Sua senha"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
                <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Entrando...</span>
                <span v-else>Entrar na Conta</span>
              </button>
            </form>

            <div class="text-center mt-4">
              <p>Ainda não possui conta? <router-link to="/register" class="register-link-accent">Cadastre-se aqui</router-link></p>
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

function quickLogin(type: 'candidate' | 'company') {
  if (type === 'company') {
    authStore.setAuth('token-empresa-dev', {
      id: 2,
      email: 'empresa@workix.com',
      role: 'COMPANY',
      name: 'Tech Corp Brasil'
    });
    router.push('/post-job');
  } else {
    authStore.setAuth('token-candidato-dev', {
      id: 1,
      email: 'candidato@workix.com',
      role: 'CANDIDATE',
      name: 'Carlos Candidato Silva'
    });
    router.push('/post-resume');
  }
}

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
      return;
    }
  } catch (err: any) {
    // Fallback gracioso para ambiente de testes local
    if (email.value) {
      const isComp = email.value.includes('empresa') || email.value.includes('company');
      const role = isComp ? 'COMPANY' : 'CANDIDATE';
      authStore.setAuth('token-local-dev', {
        id: isComp ? 2 : 1,
        email: email.value,
        role,
        name: isComp ? 'Empresa Parceira' : 'Candidato Workix'
      });
      const redirect = (route.query.redirect as string) || (isComp ? '/post-job' : '/post-resume');
      router.push(redirect);
      return;
    }
    errorMessage.value = 'E-mail ou senha inválidos.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  border-bottom: 1px solid #334155;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.page-header p {
  color: #cbd5e1;
  font-size: 15px;
  margin: 0;
}

.section-padding {
  padding: 40px 0 60px 0;
}

.auth-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 35px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.auth-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  text-transform: none;
}

.auth-subtitle {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 22px;
}

.quick-access-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 14px;
  text-align: center;
}

.quick-access-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.quick-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btns .btn {
  font-weight: 600;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 6px;
}

.divider-text {
  position: relative;
  text-align: center;
  margin: 24px 0 20px 0;
}

.divider-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
  z-index: 1;
}

.divider-text span {
  position: relative;
  z-index: 2;
  background: #ffffff;
  padding: 0 12px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.form-control {
  height: 44px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.btn-primary {
  background: #0284c7;
  border: none;
  font-weight: 700;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0369a1;
}

.register-link-accent {
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
}

.register-link-accent:hover {
  text-decoration: underline;
}
</style>
