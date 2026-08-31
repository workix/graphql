<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Feed Social da Comunidade</h1>
        <p>Compartilhe ideias, artigos, conquistas e conecte-se com outros profissionais</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Left Sidebar: Mini Profile -->
        <div class="col-md-3 col-sm-4">
          <div class="mini-profile-card">
            <div class="profile-banner"></div>
            <div class="profile-avatar-wrap">
              <div class="user-avatar-circle">
                <i class="fa fa-user"></i>
              </div>
            </div>
            <div class="profile-info-body">
              <h4 class="profile-name">{{ authStore.user?.name || 'Profissional Workix' }}</h4>
              <p class="profile-role">{{ authStore.user?.role === 'COMPANY' ? 'Empresa Contratante' : 'Candidato / Especialista' }}</p>
              <div class="profile-stats">
                <div class="stat-line">
                  <span>Conexões</span>
                  <strong>--</strong>
                </div>
                <div class="stat-line">
                  <span>Visualizações</span>
                  <strong>--</strong>
                </div>
              </div>
              <router-link to="/jobs" class="btn-profile-link">Explorar Oportunidades</router-link>
            </div>
          </div>
        </div>

        <!-- Center Column: Create Post & Feed Stream -->
        <div class="col-md-6 col-sm-8">
          <!-- Create Post Box -->
          <div class="create-post-card">
            <div class="create-post-header">
              <div class="creator-avatar">
                <i class="fa fa-user-circle"></i>
              </div>
              <textarea
                v-model="newPostContent"
                class="create-post-textarea"
                placeholder="No que você está pensando hoje? Use #hashtags e compartilhe com sua rede..."
                rows="3"
              ></textarea>
            </div>
            <div class="create-post-footer">
              <div class="post-media-shortcuts">
                <button type="button" class="btn-shortcut" @click="insertTagPrompt">
                  <i class="fa fa-hashtag"></i> Tag
                </button>
                <button type="button" class="btn-shortcut" @click="attachMediaPrompt">
                  <i class="fa fa-picture-o"></i> Foto
                </button>
              </div>
              <button
                type="button"
                class="btn-publish-post"
                :disabled="!newPostContent.trim() || postsStore.isSubmitting"
                @click="publishPost"
              >
                <i v-if="postsStore.isSubmitting" class="fa fa-spinner fa-spin"></i>
                <span v-else><i class="fa fa-paper-plane"></i> Publicar</span>
              </button>
            </div>
          </div>

          <!-- Feed Filter / Sort Tabs -->
          <div class="feed-sort-bar">
            <div class="sort-options">
              <button
                type="button"
                class="sort-tab"
                :class="{ active: !isRankedMode }"
                @click="switchFeedMode(false)"
              >
                <i class="fa fa-clock-o"></i> Mais Recentes
              </button>
              <button
                type="button"
                class="sort-tab"
                :class="{ active: isRankedMode }"
                @click="switchFeedMode(true)"
              >
                <i class="fa fa-star"></i> Principais / Destaques
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="postsStore.error" class="alert alert-danger">
            <i class="fa fa-exclamation-triangle"></i> {{ postsStore.error }}
          </div>

          <!-- Feed Posts List -->
          <div class="posts-stream">
            <PostCard
              v-for="post in postsStore.feed"
              :key="post.id"
              :post="post"
            />
          </div>

          <!-- Loading Spinner -->
          <div v-if="postsStore.isLoading" class="loading-more-box">
            <i class="fa fa-spinner fa-spin"></i> Carregando postagens...
          </div>

          <!-- Load More Button -->
          <div v-else-if="postsStore.hasMore && postsStore.feed.length > 0" class="text-center load-more-wrap">
            <button type="button" class="btn-load-more" @click="loadMore">
              Carregar Mais Postagens <i class="fa fa-chevron-down"></i>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="!postsStore.isLoading && postsStore.feed.length === 0" class="empty-feed-card">
            <div class="empty-icon">
              <i class="fa fa-newspaper-o"></i>
            </div>
            <h3>Nenhuma publicação encontrada</h3>
            <p>Seja o primeiro a compartilhar uma postagem com a comunidade Workix!</p>
          </div>
        </div>

        <!-- Right Sidebar: Trending Topics & Tips -->
        <div class="col-md-3 hidden-sm hidden-xs">
          <div class="sidebar-widget trending-widget">
            <h4 class="widget-title"><i class="fa fa-fire"></i> Em Alta no Workix</h4>
            <ul class="trending-list">
              <li v-for="t in TRENDING_TAGS" :key="t">
                <router-link :to="`/hashtag/${t}`" class="trending-link">
                  <span class="tag-name">#{{ t }}</span>
                  <span class="tag-posts-count">Tópico relevante</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="sidebar-widget tip-widget">
            <h4 class="widget-title"><i class="fa fa-lightbulb-o"></i> Dica Profissional</h4>
            <p>Postagens com perguntas abertas e discussões de mercado recebem 3x mais comentários e conexões!</p>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import usePostsStore from '../stores/posts';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import PostCard from '../components/PostCard.vue';

const authStore = useAuthStore();
const postsStore = usePostsStore();

const newPostContent = ref('');
const isRankedMode = ref(false);

const TRENDING_TAGS = ['tecnologia', 'carreira', 'remoto', 'oportunidades', 'desenvolvimento', 'javascript'];

onMounted(async () => {
  await postsStore.fetchFeed(true, isRankedMode.value);
});

async function publishPost() {
  const content = newPostContent.value.trim();
  if (!content) return;

  await postsStore.createNewPost(content);
  newPostContent.value = '';
}

async function switchFeedMode(ranked: boolean) {
  if (isRankedMode.value === ranked) return;
  isRankedMode.value = ranked;
  await postsStore.fetchFeed(true, ranked);
}

async function loadMore() {
  await postsStore.fetchFeed(false, isRankedMode.value);
}

function insertTagPrompt() {
  const tag = prompt('Digite a hashtag (sem o #):');
  if (tag) {
    newPostContent.value = `${newPostContent.value} #${tag.trim()} `;
  }
}

function attachMediaPrompt() {
  alert('Selecione uma imagem ou anexo nos próximos updates!');
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
  margin-bottom: 20px;
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

/* Mini Profile Card */
.mini-profile-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.profile-banner {
  height: 65px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.profile-avatar-wrap {
  display: flex;
  justify-content: center;
  margin-top: -35px;
}

.user-avatar-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #0284c7;
}

.profile-info-body {
  padding: 16px 20px 20px 20px;
  text-align: center;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.profile-role {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.profile-stats {
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 12px 0;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.btn-profile-link {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: #f0f9ff;
  color: #0284c7;
  font-weight: 600;
  font-size: 13px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-profile-link:hover {
  background: #0284c7;
  color: #ffffff;
}

/* Create Post Card */
.create-post-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.create-post-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.creator-avatar {
  font-size: 38px;
  color: #94a3b8;
}

.create-post-textarea {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  resize: vertical;
  min-height: 75px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.create-post-textarea:focus {
  border-color: #0284c7;
}

.create-post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f8fafc;
}

.post-media-shortcuts {
  display: flex;
  gap: 8px;
}

.btn-shortcut {
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-shortcut:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-publish-post {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-publish-post:hover:not(:disabled) {
  background: #0369a1;
}

.btn-publish-post:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Feed Sort Bar */
.feed-sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sort-options {
  display: flex;
  gap: 10px;
}

.sort-tab {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-tab.active {
  background: #ffffff;
  color: #0284c7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.loading-more-box {
  text-align: center;
  padding: 20px 0;
  color: #64748b;
  font-size: 14px;
}

.load-more-wrap {
  margin-top: 10px;
  margin-bottom: 30px;
}

.btn-load-more {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-load-more:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.empty-feed-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

/* Sidebar Widgets */
.sidebar-widget {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.widget-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-title i {
  color: #0284c7;
}

.trending-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trending-link {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  text-decoration: none;
}

.trending-link:last-child {
  border-bottom: none;
}

.tag-name {
  font-size: 14px;
  font-weight: 600;
  color: #0284c7;
}

.tag-posts-count {
  font-size: 11px;
  color: #94a3b8;
}

.tip-widget p {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}
</style>
