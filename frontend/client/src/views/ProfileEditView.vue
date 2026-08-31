<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Editar Perfil Profissional</h1>
        <p>Personalize sua identidade, adicione seu resumo, destaques de carreira e ative o selo Open to Work</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Main Form Column -->
        <div class="col-md-8 col-sm-12">
          <!-- Profile Main Edit Card -->
          <div class="profile-card">
            <div class="card-header-bar">
              <h3><i class="fa fa-user-circle"></i> Informações Principais</h3>
            </div>

            <div class="card-body">
              <div v-if="successMessage" class="alert alert-success">
                <i class="fa fa-check-circle"></i> {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="alert alert-danger">
                <i class="fa fa-exclamation-circle"></i> {{ errorMessage }}
              </div>

              <form @submit.prevent="handleSaveProfile">
                <div class="form-group">
                  <label>Título Profissional (Headline) *</label>
                  <input
                    v-model="form.headline"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Desenvolvedor Full Stack Senior | Vue.js, Node.js & GraphQL"
                    required
                  />
                  <small class="form-text text-muted">Aparece abaixo do seu nome nos resultados de busca e feed.</small>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Setor / Indústria</label>
                      <input
                        v-model="form.industry"
                        type="text"
                        class="form-control"
                        placeholder="Ex: Tecnologia da Informação"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Localização</label>
                      <input
                        v-model="form.location"
                        type="text"
                        class="form-control"
                        placeholder="Ex: São Paulo, SP - Brasil"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Sobre você (Resumo Profissional)</label>
                  <textarea
                    v-model="form.about"
                    class="form-control"
                    rows="5"
                    placeholder="Descreva suas realizações, habilidades essenciais, objetivos e trajetória..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>URL da Imagem de Capa (Banner)</label>
                  <input
                    v-model="form.bannerUrl"
                    type="url"
                    class="form-control"
                    placeholder="https://exemplo.com/banner.jpg"
                  />
                </div>

                <!-- Open To Work Toggle Box -->
                <div class="open-to-work-card" :class="{ 'active': form.openToWork }">
                  <div class="toggle-content">
                    <div class="toggle-icon">
                      <i class="fa fa-briefcase"></i>
                    </div>
                    <div class="toggle-text">
                      <h4>Selo "Open To Work"</h4>
                      <p>Informe recrutadores e à comunidade que você está aberto(a) a novas propostas de emprego.</p>
                    </div>
                  </div>
                  <div class="toggle-switch">
                    <label class="switch">
                      <input type="checkbox" v-model="form.openToWork" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary btn-save" :disabled="profilesStore.isSaving">
                    <i v-if="profilesStore.isSaving" class="fa fa-spinner fa-spin"></i>
                    <i v-else class="fa fa-save"></i>
                    {{ profilesStore.isSaving ? 'Salvando...' : 'Salvar Alterações' }}
                  </button>
                  <router-link :to="`/in/${authStore.user?.id || 1}`" class="btn btn-default btn-view">
                    <i class="fa fa-external-link"></i> Ver Perfil Público
                  </router-link>
                </div>
              </form>
            </div>
          </div>

          <!-- Featured Items / Portfolio Card -->
          <div class="profile-card margin-top-30">
            <div class="card-header-bar d-flex justify-content-between align-items-center">
              <h3><i class="fa fa-star"></i> Destaques e Portfólio</h3>
              <button type="button" class="btn btn-sm btn-outline-primary" @click="showAddFeatured = !showAddFeatured">
                <i class="fa" :class="showAddFeatured ? 'fa-minus' : 'fa-plus'"></i>
                {{ showAddFeatured ? 'Fechar' : 'Adicionar Destaque' }}
              </button>
            </div>

            <div class="card-body">
              <!-- Inline Add Form -->
              <div v-if="showAddFeatured" class="add-featured-form">
                <h5>Adicionar Item em Destaque</h5>
                <form @submit.prevent="handleAddFeatured">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>Tipo</label>
                        <select v-model="newFeatured.type" class="form-control">
                          <option value="PROJECT">Projeto / Portfólio</option>
                          <option value="ARTICLE">Artigo / Publicação</option>
                          <option value="LINK">Link Externo</option>
                          <option value="CERTIFICATION">Certificado</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="form-group">
                        <label>Título *</label>
                        <input v-model="newFeatured.title" type="text" class="form-control" placeholder="Ex: App Open Source no GitHub" required />
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>URL / Link do Destaque</label>
                    <input v-model="newFeatured.url" type="url" class="form-control" placeholder="https://github.com/..." />
                  </div>
                  <button type="submit" class="btn btn-success btn-sm">
                    <i class="fa fa-plus"></i> Salvar Destaque
                  </button>
                </form>
              </div>

              <!-- List of Featured Items -->
              <div v-if="profilesStore.myFeaturedItems.length > 0" class="featured-items-list">
                <div v-for="item in profilesStore.myFeaturedItems" :key="item.id" class="featured-item-box">
                  <div class="item-info">
                    <span class="item-badge">{{ item.type }}</span>
                    <h4 class="item-title">{{ item.title }}</h4>
                    <a v-if="item.url" :href="item.url" target="_blank" class="item-url">
                      <i class="fa fa-link"></i> {{ item.url }}
                    </a>
                  </div>
                  <button type="button" class="btn btn-danger btn-xs btn-del" @click="handleDeleteFeatured(item.id)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </div>

              <div v-else class="empty-featured">
                <p>Nenhum item em destaque adicionado ainda. Mostre seus melhores projetos e artigos para recrutadores!</p>
              </div>
            </div>
          </div>

          <!-- Skills & Endorsements Section -->
          <div class="margin-top-30">
            <SkillEndorsementsSection
              :user-id="authStore.user?.id || 1"
              :is-own-profile="true"
            />
          </div>

          <!-- Recommendations Section -->
          <div class="margin-top-30">
            <RecommendationsSection
              :user-id="authStore.user?.id || 1"
              :is-own-profile="true"
            />
          </div>
        </div>

        <!-- Sidebar Preview Card -->
        <div class="col-md-4 col-sm-12">
          <div class="preview-card">
            <h4>Prévia do Card de Perfil</h4>
            <div class="profile-preview-box">
              <div class="preview-banner" :style="{ backgroundImage: form.bannerUrl ? `url(${form.bannerUrl})` : 'none' }">
                <span v-if="form.openToWork" class="badge-opentowork-pill">
                  #OpenToWork
                </span>
              </div>
              <div class="preview-avatar-wrapper">
                <div class="preview-avatar">
                  <i class="fa fa-user"></i>
                </div>
              </div>
              <div class="preview-info">
                <h4>{{ authStore.user?.name || 'Seu Nome' }}</h4>
                <p class="preview-headline">{{ form.headline || 'Seu cargo / título aparecerá aqui' }}</p>
                <p class="preview-meta">
                  <i class="fa fa-map-marker"></i> {{ form.location || 'Localização' }}
                  <span v-if="form.industry"> • {{ form.industry }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import useProfilesStore from '../stores/profiles';
import SkillEndorsementsSection from '../components/SkillEndorsementsSection.vue';
import RecommendationsSection from '../components/RecommendationsSection.vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const authStore = useAuthStore();
const profilesStore = useProfilesStore();

const successMessage = ref('');
const errorMessage = ref('');
const showAddFeatured = ref(false);

const form = reactive({
  headline: '',
  about: '',
  bannerUrl: '',
  location: '',
  industry: '',
  openToWork: false
});

const newFeatured = reactive({
  type: 'PROJECT',
  title: '',
  url: ''
});

onMounted(async () => {
  await profilesStore.fetchMyProfile();
  if (profilesStore.myProfile) {
    form.headline = profilesStore.myProfile.headline || '';
    form.about = profilesStore.myProfile.about || '';
    form.bannerUrl = profilesStore.myProfile.bannerUrl || '';
    form.location = profilesStore.myProfile.location || '';
    form.industry = profilesStore.myProfile.industry || '';
    form.openToWork = !!profilesStore.myProfile.openToWork;
  }
});

async function handleSaveProfile() {
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await profilesStore.updateProfile({
      headline: form.headline,
      about: form.about,
      bannerUrl: form.bannerUrl,
      location: form.location,
      industry: form.industry,
      openToWork: form.openToWork
    });
    successMessage.value = 'Perfil atualizado com sucesso!';
    setTimeout(() => {
      successMessage.value = '';
    }, 4000);
  } catch (err: any) {
    errorMessage.value = err.message || 'Falha ao salvar dados do perfil.';
  }
}

async function handleAddFeatured() {
  if (!newFeatured.title) return;
  try {
    await profilesStore.addFeatured(newFeatured.type, newFeatured.title, newFeatured.url);
    newFeatured.title = '';
    newFeatured.url = '';
    showAddFeatured.value = false;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao adicionar item de portfólio.';
  }
}

async function handleDeleteFeatured(id: string | number) {
  if (confirm('Deseja realmente remover este destaque?')) {
    await profilesStore.deleteFeatured(id);
  }
}
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
}

.section-padding {
  padding-bottom: 60px;
}

.profile-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.margin-top-30 {
  margin-top: 30px;
}

.card-header-bar {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-header-bar h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
  display: block;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 14px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

/* Open to work toggle card */
.open-to-work-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.open-to-work-card.active {
  background: #f0fdf4;
  border-color: #86efac;
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.open-to-work-card.active .toggle-icon {
  background: #22c55e;
  color: #ffffff;
}

.toggle-text h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.toggle-text p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* Custom Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #22c55e;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.form-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}

.btn-save {
  background: #0284c7;
  border-color: #0284c7;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
}

.btn-save:hover {
  background: #0369a1;
}

.btn-view {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}

/* Featured section */
.add-featured-form {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 20px;
}

.add-featured-form h5 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 14px 0;
  color: #0f172a;
}

.featured-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-item-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
}

.item-badge {
  display: inline-block;
  background: #e0f2fe;
  color: #0284c7;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}

.item-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.item-url {
  font-size: 12px;
  color: #0284c7;
  text-decoration: none;
}

.empty-featured {
  text-align: center;
  color: #64748b;
  padding: 20px 0;
  font-size: 13px;
}

/* Sidebar Preview */
.preview-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.preview-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.profile-preview-box {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
}

.preview-banner {
  height: 90px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 10px;
}

.badge-opentowork-pill {
  background: #22c55e;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 12px;
  float: right;
}

.preview-avatar-wrapper {
  padding: 0 16px;
  margin-top: -30px;
}

.preview-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #64748b;
}

.preview-info {
  padding: 12px 16px 16px 16px;
}

.preview-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.preview-headline {
  font-size: 13px;
  color: #334155;
  margin: 0 0 8px 0;
}

.preview-meta {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}
</style>
