<template>
  <div class="post-comments-section">
    <!-- Input Box -->
    <div class="comment-input-row">
      <div class="commenter-avatar">
        <i class="fa fa-user-circle"></i>
      </div>
      <div class="comment-form">
        <textarea
          v-model="commentText"
          class="comment-textarea"
          placeholder="Escreva um comentário..."
          rows="1"
          @keydown.enter.prevent="submitComment"
        ></textarea>
        <button
          type="button"
          class="btn-send-comment"
          :disabled="!commentText.trim() || isSubmitting"
          @click="submitComment"
        >
          <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
          <i v-else class="fa fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-list" v-if="comments && comments.length > 0">
      <div v-for="c in comments" :key="c.id" class="comment-item">
        <div class="comment-avatar">
          <i class="fa fa-user"></i>
        </div>
        <div class="comment-bubble">
          <div class="comment-header">
            <span class="comment-author">{{ c.authorName || `Usuário #${c.authorId}` }}</span>
            <span class="comment-date" v-if="c.createdAt">{{ formatDate(c.createdAt) }}</span>
          </div>
          <p class="comment-content">{{ c.content }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="isLoading" class="comments-loading">
      <i class="fa fa-spinner fa-spin"></i> Carregando comentários...
    </div>
    <div v-else class="no-comments">
      Seja o primeiro a comentar!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PostCommentModel } from '../services/posts.service';

const props = defineProps<{
  postId: string | number;
  comments: PostCommentModel[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-comment', content: string): void;
}>();

const commentText = ref('');
const isSubmitting = ref(false);

async function submitComment() {
  const text = commentText.value.trim();
  if (!text || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    emit('add-comment', text);
    commentText.value = '';
  } finally {
    isSubmitting.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.post-comments-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.commenter-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-form {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 4px 8px 4px 14px;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comment-textarea {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-size: 13px;
  color: #1e293b;
  font-family: inherit;
  line-height: 1.4;
  padding: 4px 0;
}

.btn-send-comment {
  background: #0284c7;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 12px;
  margin-left: 6px;
  flex-shrink: 0;
}

.btn-send-comment:hover:not(:disabled) {
  background: #0369a1;
}

.btn-send-comment:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.comment-bubble {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  flex: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.comment-date {
  font-size: 11px;
  color: #94a3b8;
}

.comment-content {
  margin: 0;
  font-size: 13px;
  color: #334155;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.comments-loading {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  padding: 8px 0;
}

.no-comments {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 6px 0;
}
</style>
