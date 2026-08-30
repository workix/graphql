<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="post" class="blog-post-page">
      <div class="post-header-banner">
        <div class="container">
          <h2>{{ post.title }}</h2>
          <p class="post-meta"><i class="fa fa-calendar"></i> {{ new Date(post.created_at || Date.now()).toLocaleDateString() }}</p>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <div class="content-box">
              <div v-html="post.content || '<p>Conteúdo completo do artigo do blog.</p>'"></div>
            </div>

            <!-- Comments Section -->
            <div class="comments-box mt-5">
              <h3>Comentários</h3>
              <div v-if="comments.length === 0" class="text-muted">Seja o primeiro a comentar!</div>
              <div v-for="c in comments" :key="c.id" class="comment-item mb-3">
                <strong>{{ c.name || c.author_name || 'Usuário' }}</strong>
                <p>{{ c.text || c.comment }}</p>
              </div>

              <!-- Add Comment Form -->
              <form @submit.prevent="handleComment" class="mt-4">
                <div class="form-group">
                  <label>Deixe seu comentário</label>
                  <textarea v-model="newComment" class="form-control" rows="3" placeholder="Escreva seu comentário aqui..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="submitting">Enviar Comentário</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { blogsService } from '../services/blogs';

const route = useRoute();
const post = ref<any>(null);
const comments = ref<any[]>([]);
const newComment = ref('');
const loading = ref(false);
const submitting = ref(false);

async function loadPost() {
  loading.value = true;
  try {
    const id = route.params.id as string;
    const response = await blogsService.getById(id);
    post.value = response.data;
    comments.value = response.data?.comments || [];
  } catch (err) {
    console.error('Erro ao carregar artigo:', err);
  } finally {
    loading.value = false;
  }
}

async function handleComment() {
  if (!newComment.value || !post.value) return;
  submitting.value = true;
  try {
    const response = await blogsService.createComment(
      post.value.id,
      'Visitante Workix',
      'visitante@workix.com.br',
      newComment.value
    );
    comments.value.push(response.data || { id: Date.now(), text: newComment.value, name: 'Você' });
    newComment.value = '';
  } catch (err) {
    console.error('Erro ao enviar comentário:', err);
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.post-header-banner {
  background: #0f172a;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.content-box, .comments-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}
.comment-item {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}
</style>
