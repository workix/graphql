<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar color="surface" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-shield-account" color="primary" class="mr-2"></v-icon>
        Workix Admin Panel
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <div v-if="adminAuthStore.user" class="mr-4 text-subtitle-2">
        <v-icon icon="mdi-account-circle" class="mr-1"></v-icon>
        {{ adminAuthStore.user.email }}
      </div>

      <v-btn icon color="error" title="Sair" @click="handleLogout">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" color="surface" elevation="1">
      <v-list nav density="compact">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-medium-emphasis">
          Navegação Principal
        </v-list-subheader>

        <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"></v-list-item>
        <v-list-item to="/users" prepend-icon="mdi-account-group" title="Usuários do Sistema" value="users"></v-list-item>
        <v-list-item to="/jaas-users" prepend-icon="mdi-account-key" title="Usuários JAAS" value="jaas-users"></v-list-item>
        <v-list-item to="/jaas-roles" prepend-icon="mdi-shield-lock" title="Perfis & Roles JAAS" value="jaas-roles"></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-medium-emphasis">
          Moderação de Conteúdo
        </v-list-subheader>

        <v-list-item to="/jobs" prepend-icon="mdi-briefcase-check" title="Moderação de Vagas" value="jobs"></v-list-item>
        <v-list-item to="/social-posts" prepend-icon="mdi-post" title="Posts Sociais" value="social-posts"></v-list-item>
        <v-list-item to="/blogs" prepend-icon="mdi-newspaper-variant-outline" title="Blog Corporativo" value="blogs"></v-list-item>
        <v-list-item to="/courses" prepend-icon="mdi-school" title="Cursos & LMS" value="courses"></v-list-item>
        <v-list-item to="/plans" prepend-icon="mdi-diamond" title="Planos Premium" value="plans"></v-list-item>
        <v-list-item to="/forms" prepend-icon="mdi-email-open-outline" title="Caixa de Suporte" value="forms"></v-list-item>
        <v-list-item to="/companies" prepend-icon="mdi-domain" title="Empresas Parceiras" value="companies"></v-list-item>
        <v-list-item to="/candidates" prepend-icon="mdi-account-search" title="Candidatos & Currículos" value="candidates"></v-list-item>
        <v-list-item to="/testimonials" prepend-icon="mdi-comment-quote" title="Depoimentos" value="testimonials"></v-list-item>
        <v-list-item to="/subscribers" prepend-icon="mdi-email-newsletter" title="Inscritos Newsletter" value="subscribers"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content View -->
    <v-main>
      <v-container fluid class="pa-6">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '../stores/adminAuth';

const drawer = ref(true);
const adminAuthStore = useAdminAuthStore();
const router = useRouter();

function handleLogout() {
  adminAuthStore.logout();
  router.push('/login');
}
</script>

<style scoped>
</style>
