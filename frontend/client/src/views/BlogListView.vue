<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Blog & Notícias do Mercado</h1>
        <p>Dicas de carreira, tendências de mercado e tecnologia</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <div class="col-md-8 col-md-offset-2 position-relative">
          <LoadingOverlay :loading="loading" />

          <div v-if="!loading && posts.length === 0" class="alert alert-info text-center">
            Nenhum artigo publicado no momento.
          </div>

          <div v-else class="blog-posts-list">
            <article v-for="post in posts" :key="post.id" class="blog-card">
              <h2><router-link :to="`/blog/${post.id}`">{{ post.title }}</router-link></h2>
              <p class="post-meta"><i class="fa fa-calendar"></i> {{ new Date(post.created_at || Date.now()).toLocaleDateString() }}</p>
              <p>{{ post.summary || 'Confira as últimas novidades do mercado de trabalho...' }}</p>
              <router-link :to="`/blog/${post.id}`" class="btn btn-default btn-sm">Ler Artigo Completo &raquo;</router-link>
            </article>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { blogsService } from '../services/blogs';

const posts = ref<any[]>([]);
const loading = ref(false);

async function fetchBlogs() {
  loading.value = true;
  try {
    const response = await blogsService.getPaginated({ page: 1, limit: 10 });
    posts.value = response.data.blogs || response.data.rows || response.data || [];
  } catch (err) {
    console.error('Erro ao buscar blog posts:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchBlogs();
});
</script>

<style scoped>
.page-header {
  background: #1e293b;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.blog-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
}
.post-meta {
  color: #94a3b8;
  font-size: 13px;
}
</style>
