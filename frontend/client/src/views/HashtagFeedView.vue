<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>#{{ currentTag }}</h1>
        <p>Publicações e discussões da comunidade com esta hashtag</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Center Column: Hashtag Posts -->
        <div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <div class="hashtag-navigation-bar">
            <router-link to="/feed" class="btn-back-feed">
              <i class="fa fa-arrow-left"></i> Voltar ao Feed Completo
            </router-link>
            <span class="hashtag-posts-count" v-if="postsStore.hashtagFeed.length > 0">
              {{ postsStore.hashtagFeed.length }} {{ postsStore.hashtagFeed.length === 1 ? 'publicação' : 'publicações' }}
            </span>
          </div>

          <!-- Loading Spinner -->
          <div v-if="postsStore.isLoading" class="loading-box">
            <i class="fa fa-spinner fa-spin"></i> Carregando postagens com #{{ currentTag }}...
          </div>

          <!-- Posts Stream -->
          <div v-else-if="postsStore.hashtagFeed.length > 0" class="posts-stream">
            <PostCard
              v-for="post in postsStore.hashtagFeed"
              :key="post.id"
              :post="post"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="empty-feed-card">
            <div class="empty-icon">
              <i class="fa fa-hashtag"></i>
            </div>
            <h3>Nenhuma publicação com #{{ currentTag }}</h3>
            <p>Nenhum membro da comunidade utilizou esta hashtag recentemente.</p>
            <router-link to="/feed" class="btn-publish-first">
              Publicar no Feed
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import usePostsStore from '../stores/posts';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import PostCard from '../components/PostCard.vue';

const route = useRoute();
const postsStore = usePostsStore();

const currentTag = computed(() => {
  return String(route.params.tag || '').replace(/^#/, '');
});

async function loadTagFeed() {
  if (currentTag.value) {
    await postsStore.fetchHashtagFeed(currentTag.value, true);
  }
}

onMounted(() => {
  loadTagFeed();
});

watch(() => route.params.tag, () => {
  loadTagFeed();
});
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.page-header p {
  font-size: 15px;
  color: #e0f2fe;
  margin: 0;
}

.section-padding {
  padding-bottom: 60px;
}

.hashtag-navigation-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-back-feed {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0284c7;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-back-feed:hover {
  background: #f0f9ff;
  border-color: #0284c7;
}

.hashtag-posts-count {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

.loading-box {
  text-align: center;
  padding: 40px 0;
  color: #64748b;
  font-size: 15px;
}

.empty-feed-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 50px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 14px;
}

.btn-publish-first {
  display: inline-block;
  background: #0284c7;
  color: #ffffff;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 14px;
  transition: background 0.2s ease;
}

.btn-publish-first:hover {
  background: #0369a1;
}
</style>
