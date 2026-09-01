<template>
  <header class="site-header">
    <div class="top-bar">
      <div class="container">
        <div class="row">
          <div class="col-sm-5 col-xs-12">
            <span class="welcome-msg">Bem-vindo ao Workix</span>
          </div>
          <div class="col-sm-7 col-xs-12 text-right header-actions">
            <LanguageSwitcher class="header-lang-switcher" />
            <template v-if="authStore.isAuthenticated">
              <span class="user-info"><i class="fa fa-user-circle"></i> {{ authStore.user?.email }}</span>
              <router-link v-if="authStore.isCompany" to="/my-jobs" class="top-nav-link">
                <i class="fa fa-briefcase"></i> {{ $t('nav.jobs') }}
              </router-link>
              <router-link v-else to="/my-applications" class="top-nav-link">
                <i class="fa fa-paper-plane"></i> {{ $t('jobs.applied') }}
              </router-link>
              <button class="btn btn-sm btn-link logout-btn" @click="handleLogout">
                <i class="fa fa-sign-out"></i> {{ $t('nav.logout') }}
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="login-link"><i class="fa fa-lock"></i> {{ $t('auth.login') }}</router-link>
              <router-link to="/register" class="register-link"><i class="fa fa-user"></i> {{ $t('auth.register') }}</router-link>
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
            <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
            <li><router-link to="/feed">Feed</router-link></li>
            <li><router-link to="/mynetwork">{{ $t('nav.network') }}</router-link></li>
            <li><router-link to="/groups">Grupos</router-link></li>
            <li><router-link to="/events">Eventos</router-link></li>
            <li><router-link to="/learning">{{ $t('nav.learning') }}</router-link></li>
            <li><router-link to="/messaging">{{ $t('nav.messaging') }}</router-link></li>
            <li>
              <router-link to="/notifications" class="nav-notif-link">
                {{ $t('nav.notifications') }}
                <span v-if="notificationsStore.unreadCount > 0" class="header-notif-badge">
                  {{ notificationsStore.unreadCount }}
                </span>
              </router-link>
            </li>
            <li><router-link to="/premium" class="premium-nav-highlight"><i class="fa fa-diamond"></i> Premium</router-link></li>
            <li><router-link to="/jobs">{{ $t('nav.jobs') }}</router-link></li>
            <li><router-link to="/candidates">Candidatos</router-link></li>
            <template v-if="authStore.isCompany">
              <li><router-link to="/my-jobs">Minhas Vagas</router-link></li>
              <li><router-link to="/post-job">Publicar Vaga</router-link></li>
            </template>
            <template v-else-if="authStore.isAuthenticated">
              <li><router-link to="/profile/edit">{{ $t('nav.profile') }}</router-link></li>
              <li><router-link to="/analytics/ssi">Analytics</router-link></li>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import useNotificationsStore from '../stores/notifications';
import LanguageSwitcher from './LanguageSwitcher.vue';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();
const isNavOpen = ref(false);

onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationsStore.fetchUnreadCount();
  }
});

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
.nav-notif-link {
  position: relative;
}
.header-notif-badge {
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: 4px;
}
.premium-nav-highlight {
  color: #eab308 !important;
  font-weight: 700;
}
.premium-nav-highlight i {
  color: #eab308;
  margin-right: 3px;
}
</style>
