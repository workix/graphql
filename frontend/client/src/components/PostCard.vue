<template>
  <div class="social-post-card">
    <!-- Post Header -->
    <div class="post-card-header">
      <div class="author-avatar-box">
        <img v-if="post.authorAvatar" :src="post.authorAvatar" alt="Avatar" class="avatar-img" />
        <div v-else class="avatar-placeholder">
          <i class="fa fa-user"></i>
        </div>
      </div>
      <div class="author-info">
        <h5 class="author-name">
          {{ post.authorName || `Profissional Workix #${post.authorId}` }}
        </h5>
        <span class="author-headline" v-if="post.authorRole">
          {{ post.authorRole }}
        </span>
        <span class="post-timestamp">
          {{ formatTimestamp(post.createdAt) }} • <i class="fa fa-globe" title="Público"></i>
        </span>
      </div>
      <div class="post-options">
        <button type="button" class="btn-options-menu" title="Mais opções">
          <i class="fa fa-ellipsis-h"></i>
        </button>
      </div>
    </div>

    <!-- Post Content with Hashtags and Mentions formatting -->
    <div class="post-card-body">
      <div class="post-text-content" v-html="formattedContent"></div>

      <!-- Media Attachments Preview -->
      <div class="post-media-grid" v-if="post.mediaUrls && post.mediaUrls.length > 0">
        <img
          v-for="(url, idx) in post.mediaUrls"
          :key="idx"
          :src="url"
          alt="Mídia da postagem"
          class="post-media-image"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Reactions Bar -->
    <PostReactionsBar
      :reactions-count="post.reactionsCount || 0"
      :comments-count="post.commentsCount || 0"
      :user-reaction="post.userReaction"
      @react="handleReact"
      @toggle-comments="toggleComments"
    />

    <!-- Comments Section (collapsible) -->
    <transition name="fade">
      <PostCommentsSection
        v-if="showComments"
        :post-id="post.id"
        :comments="comments"
        :is-loading="isLoadingComments"
        @add-comment="handleAddComment"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PostModel } from '../services/posts.service';
import usePostsStore from '../stores/posts';
import PostReactionsBar from './PostReactionsBar.vue';
import PostCommentsSection from './PostCommentsSection.vue';

const props = defineProps<{
  post: PostModel;
}>();

const router = useRouter();
const postsStore = usePostsStore();

const showComments = ref(false);
const isLoadingComments = ref(false);

const comments = computed(() => {
  return postsStore.commentsMap[String(props.post.id)] || [];
});

const formattedContent = computed(() => {
  if (!props.post.content) return '';

  let text = props.post.content
    // Escape HTML básico
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Formatar hashtags como links clicáveis
  text = text.replace(/#(\w+)/g, '<a href="/hashtag/$1" class="post-hashtag">#$1</a>');

  // Formatar menções
  text = text.replace(/@(\w+)/g, '<span class="post-mention">@$1</span>');

  return text;
});

async function handleReact(type: string) {
  await postsStore.reactToPost(props.post.id, type);
}

async function toggleComments() {
  showComments.value = !showComments.value;
  if (showComments.value && comments.value.length === 0) {
    isLoadingComments.value = true;
    try {
      await postsStore.loadComments(props.post.id);
    } finally {
      isLoadingComments.value = false;
    }
  }
}

async function handleAddComment(content: string) {
  await postsStore.addComment(props.post.id, content);
}

function formatTimestamp(dateStr?: string) {
  if (!dateStr) return 'Agora';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Poucos minutos atrás';
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d atrás`;

    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.social-post-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease;
  width: 100%;
}

.social-post-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.post-card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
}

.author-avatar-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f1f5f9;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0f2fe;
  color: #0284c7;
  font-size: 20px;
}

.author-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.author-name {
  margin: 0 0 2px 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.author-headline {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-timestamp {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-options {
  flex-shrink: 0;
}

.btn-options-menu {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-options-menu:hover {
  background: #f1f5f9;
  color: #475569;
}

.post-card-body {
  margin-bottom: 12px;
}

.post-text-content {
  font-size: 15px;
  color: #1e293b;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
}

:deep(.post-hashtag) {
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
}

:deep(.post-hashtag:hover) {
  text-decoration: underline;
}

:deep(.post-mention) {
  color: #0369a1;
  font-weight: 600;
  background: #f0f9ff;
  padding: 1px 4px;
  border-radius: 4px;
}

.post-media-grid {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.post-media-image {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
