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
              <span class="user-info">Olá, {{ authStore.user?.email }}</span>
              <button class="btn btn-sm btn-link logout-btn" @click="handleLogout">Sair</button>
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
          <router-link class="navbar-brand" to="/">
            <img src="../assets/images/logo.png" alt="Workix Logo" class="logo-img" />
          </router-link>
        </div>

        <div :class="['collapse', 'navbar-collapse', { in: isNavOpen }]" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/jobs">Vagas</router-link></li>
            <li><router-link to="/candidates">Candidatos</router-link></li>
            <li v-if="authStore.isCompany"><router-link to="/post-job">Publicar Vaga</router-link></li>
            <li v-if="authStore.isCandidate || !authStore.isAuthenticated"><router-link to="/post-resume">Enviar Currículo</router-link></li>
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
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}
.top-bar {
  background: #1e293b;
  color: #94a3b8;
  padding: 8px 0;
  font-size: 13px;
}
.top-bar a {
  color: #cbd5e1;
  margin-left: 15px;
}
.top-bar a:hover {
  color: #fff;
}
.logout-btn {
  color: #ef4444;
  margin-left: 15px;
  text-decoration: none;
}
.logo-img {
  max-height: 40px;
}
</style>
