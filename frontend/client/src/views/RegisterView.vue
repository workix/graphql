<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="container section-padding">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <div class="auth-box">
            <h2 class="text-center mb-4">Criar Nova Conta</h2>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label>Nome Completo / Razão Social</label>
                <input type="text" v-model="name" class="form-control" placeholder="Seu nome" required />
              </div>
              <div class="form-group">
                <label>E-mail</label>
                <input type="email" v-model="email" class="form-control" placeholder="seuemail@exemplo.com" required />
              </div>
              <div class="form-group">
                <label>Senha</label>
                <input type="password" v-model="password" class="form-control" placeholder="Mínimo 6 caracteres" required minlength="6" />
              </div>
              <div class="form-group">
                <label>Tipo de Conta</label>
                <select v-model="role" class="form-control">
                  <option value="CANDIDATE">Candidato (Buscando Emprego)</option>
                  <option value="COMPANY">Empresa (Publicar Vagas)</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Cadastrando...</span>
                <span v-else>Cadastrar</span>
              </button>
            </form>
            <div class="text-center mt-3">
              <p>Já possui conta? <router-link to="/login">Acesse sua conta</router-link></p>
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
import { useRouter } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import { useAuthStore } from '../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref<'CANDIDATE' | 'COMPANY'>('CANDIDATE');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

async function handleRegister() {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const userProfile = await authStore.registerWithFirebase(
      email.value,
      password.value,
      name.value,
      role.value
    );
    successMessage.value = 'Conta criada e autenticada com sucesso! Redirecionando...';
    setTimeout(() => {
      router.push(userProfile.role === 'COMPANY' ? '/post-job' : '/post-resume');
    }, 1500);
  } catch (err: any) {
    console.error('Erro no cadastro Firebase:', err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'Este e-mail já está cadastrado. Tente fazer login.';
        break;
      case 'auth/invalid-email':
        errorMessage.value = 'Formato de e-mail inválido.';
        break;
      case 'auth/weak-password':
        errorMessage.value = 'A senha informada é fraca. Use pelo menos 6 caracteres.';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'Falha de conexão com a rede. Verifique sua internet.';
        break;
      default:
        errorMessage.value = err.message || 'Erro ao realizar cadastro com Firebase.';
    }
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
