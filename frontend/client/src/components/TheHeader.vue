<template>
  <header class="site-header">
    <div class="top-bar">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-xs-12">
            <span class="welcome-msg">Bem-vindo ao Workix - Portal de Empregos & Talentos</span>
          </div>
          <div class="col-sm-6 col-xs-12 text-right">
            <template v-if="authStore.isAuthenticated">
              <span class="user-info"><i class="fa fa-user-circle"></i> Olá, {{ authStore.user?.email }}</span>
              <router-link v-if="authStore.isCompany" to="/my-jobs" class="top-nav-link">
                <i class="fa fa-briefcase"></i> Minhas Vagas
              </router-link>
              <router-link v-else to="/my-applications" class="top-nav-link">
                <i class="fa fa-paper-plane"></i> Minhas Candidaturas
              </router-link>
              <button class="btn btn-sm btn-link logout-btn" @click="handleLogout">
                <i class="fa fa-sign-out"></i> Sair
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="login-link"><i class="fa fa-lock"></i> Entrar</router-link>
              <router-link to="/register" class="register-link"><i class="fa fa-user"></i> Cadastrar</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" @click="toggleNav">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand brand-logo" to="/">
            <i class="fa fa-users brand-icon"></i>
            <span class="brand-text">WORKIX</span>
          </router-link>
        </div>

        <div :class="['collapse', 'navbar-collapse', { in: isNavOpen }]" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/jobs">Vagas</router-link></li>
            <li><router-link to="/candidates">Candidatos</router-link></li>
            <template v-if="authStore.isCompany">
              <li><router-link to="/my-jobs">Minhas Vagas</router-link></li>
              <li><router-link to="/post-job">Publicar Vaga</router-link></li>
            </template>
            <template v-else-if="authStore.isAuthenticated">
              <li><router-link to="/my-applications">Minhas Candidaturas</router-link></li>
              <li><router-link to="/post-resume">Meu Currículo</router-link></li>
            </template>
            <template v-else>
              <li><router-link to="/post-resume">Enviar Currículo</router-link></li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isNavOpen = ref(false);

function toggleNav() {
  isNavOpen.value = !isNavOpen.value;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.site-header {
  position: relative !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent;
  z-index: 100;
}
.top-bar {
  background: #0f172a;
  color: #94a3b8;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.top-bar a {
  color: #cbd5e1;
  margin-left: 15px;
}
.top-bar a:hover {
  color: #fff;
}
.top-nav-link {
  color: #38bdf8 !important;
  font-weight: 600;
  margin-left: 15px;
  text-decoration: none;
}
.top-nav-link:hover {
  color: #7dd3fc !important;
  text-decoration: underline;
}
.user-info {
  color: #e2e8f0;
  font-weight: 500;
}
.logout-btn {
  color: #ef4444;
  margin-left: 15px;
  text-decoration: none;
}
.navbar {
  margin: 0 !important;
  padding: 5px 0 !important;
  border: none !important;
  border-radius: 0 !important;
}
.brand-logo {
  display: flex !important;
  align-items: center;
  gap: 12px;
  height: 50px;
  padding: 0 15px !important;
  color: #ffffff !important;
  text-decoration: none !important;
}
.brand-icon {
  font-size: 26px;
  color: #ffffff !important;
}
.brand-text {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff !important;
  letter-spacing: 2px;
  font-family: 'Montserrat', 'Lato', sans-serif;
  text-transform: uppercase;
  line-height: 1;
}
</style>
