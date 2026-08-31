<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="container section-padding">
      <div v-if="profilesStore.isLoading" class="loading-state">
        <i class="fa fa-spinner fa-spin"></i> Carregando perfil profissional...
      </div>

      <div v-else-if="profile" class="row">
        <div class="col-md-8 col-sm-12">
          <!-- Main Profile Header Card -->
          <div class="profile-hero-card">
            <div
              class="hero-banner"
              :style="{ backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : 'none' }"
            >
              <div v-if="profile.openToWork" class="badge-opentowork">
                <i class="fa fa-check-circle"></i> #OpenToWork
              </div>
            </div>

            <div class="hero-body">
              <div class="avatar-row">
                <div class="profile-avatar" :class="{ 'with-opentowork': profile.openToWork }">
                  <i class="fa fa-user"></i>
                </div>
                <div class="action-buttons-top">
                  <router-link
                    v-if="isOwnProfile"
                    to="/profile/edit"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="fa fa-pencil"></i> Editar Perfil
                  </router-link>
                  <template v-else>
                    <button class="btn btn-primary btn-sm" @click="handleConnect">
                      <i class="fa fa-user-plus"></i> Conectar
                    </button>
                    <router-link to="/messaging" class="btn btn-outline-secondary btn-sm">
                      <i class="fa fa-comment-o"></i> Mensagem
                    </router-link>
                  </template>
                </div>
              </div>

              <div class="profile-main-meta">
                <h1 class="profile-name">
                  {{ profileName }}
                  <span v-if="profile.openToWork" class="label-opentowork">Disponível para contratação</span>
                </h1>
                <p class="profile-headline">{{ profile.headline || 'Profissional em busca de oportunidades' }}</p>
                <div class="profile-location-industry">
                  <span v-if="profile.location"><i class="fa fa-map-marker"></i> {{ profile.location }}</span>
                  <span v-if="profile.industry"> • <i class="fa fa-industry"></i> {{ profile.industry }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div v-if="profile.about" class="profile-section-card margin-top-24">
            <div class="section-header">
              <h3><i class="fa fa-align-left"></i> Sobre</h3>
            </div>
            <div class="section-body">
              <p class="about-text">{{ profile.about }}</p>
            </div>
          </div>

          <!-- Featured Items Section -->
          <div v-if="profilesStore.currentViewingFeatured.length > 0" class="profile-section-card margin-top-24">
            <div class="section-header">
              <h3><i class="fa fa-star"></i> Em Destaque</h3>
            </div>
            <div class="section-body">
              <div class="featured-grid">
                <div
                  v-for="item in profilesStore.currentViewingFeatured"
                  :key="item.id"
                  class="featured-card-item"
                >
                  <span class="featured-tag">{{ item.type }}</span>
                  <h4 class="featured-title">{{ item.title }}</h4>
                  <a v-if="item.url" :href="item.url" target="_blank" class="featured-link">
                    <i class="fa fa-external-link"></i> Acessar Projeto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Right Column -->
        <div class="col-md-4 col-sm-12">
          <div class="sidebar-box">
            <h4><i class="fa fa-shield"></i> Informações do Perfil</h4>
            <p>Perfil verificado no ecossistema <strong>Workix</strong> com proteção de dados e autenticidade profissional.</p>
            <hr />
            <router-link to="/mynetwork" class="btn btn-block btn-outline-default">
              <i class="fa fa-users"></i> Explorar Conexões
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="empty-state-box">
        <i class="fa fa-user-times"></i>
        <h3>Perfil não encontrado</h3>
        <p>O perfil profissional solicitado não está disponível ou foi desativado.</p>
        <router-link to="/feed" class="btn btn-primary">Voltar ao Feed</router-link>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import useProfilesStore from '../stores/profiles';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const route = useRoute();
const authStore = useAuthStore();
const profilesStore = useProfilesStore();

const targetUserId = computed(() => route.params.id as string || '1');
const isOwnProfile = computed(() => String(authStore.user?.id || 1) === String(targetUserId.value));
const profile = computed(() => profilesStore.currentViewingProfile);

const profileName = computed(() => {
  if (isOwnProfile.value && authStore.user?.name) {
    return authStore.user.name;
  }
  return `Profissional #${targetUserId.value}`;
});

async function loadProfile() {
  await profilesStore.fetchPublicProfile(targetUserId.value);
}

onMounted(loadProfile);
watch(() => route.params.id, loadProfile);

function handleConnect() {
  alert('Convite de conexão enviado com sucesso!');
}
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.section-padding {
  padding: 40px 0 60px 0;
}

.profile-hero-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.hero-banner {
  height: 160px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 16px;
}

.badge-opentowork {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #22c55e;
  color: #ffffff;
  font-weight: 700;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.hero-body {
  padding: 0 24px 24px 24px;
}

.avatar-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -50px;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  color: #64748b;
}

.profile-avatar.with-opentowork {
  border-color: #22c55e;
}

.action-buttons-top {
  display: flex;
  gap: 8px;
}

.profile-main-meta .profile-name {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label-opentowork {
  background: #dcfce7;
  color: #15803d;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.profile-headline {
  font-size: 15px;
  color: #334155;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.profile-location-industry {
  font-size: 13px;
  color: #64748b;
}

.profile-section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}

.margin-top-24 {
  margin-top: 24px;
}

.section-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.section-body {
  padding: 20px 24px;
}

.about-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.featured-card-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.featured-tag {
  font-size: 10px;
  font-weight: 800;
  background: #e0f2fe;
  color: #0284c7;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 6px;
}

.featured-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.featured-link {
  font-size: 12px;
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
}

.sidebar-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.sidebar-box h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.sidebar-box p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.loading-state,
.empty-state-box {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state-box i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}
</style>
