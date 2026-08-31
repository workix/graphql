<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Moderação de Posts Sociais</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Auditoria, visualização e moderação do feed da comunidade via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="loadPosts">
        Atualizar Feed
      </v-btn>
    </div>

    <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="posts"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.content="{ item }">
          <div class="text-truncate" style="max-width: 350px;">
            {{ item.content }}
          </div>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            color="primary"
            variant="text"
            title="Inspecionar Comentários"
            @click="openCommentsDialog(item)"
          >
            <v-icon icon="mdi-comment-multiple-outline"></v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="info"
            variant="text"
            title="Ver Reações"
            @click="openReactionsDialog(item)"
          >
            <v-icon icon="mdi-thumb-up-outline"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Comentários -->
    <v-dialog v-model="commentsDialog" max-width="650px">
      <v-card>
        <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
          <span>Comentários da Postagem #{{ selectedPost?.id }}</span>
          <v-btn icon variant="text" size="small" @click="commentsDialog = false">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="mb-4 pa-3 bg-surface-variant rounded">
            <strong>Conteúdo da Postagem:</strong>
            <p class="mb-0 mt-1">{{ selectedPost?.content }}</p>
          </div>

          <div v-if="loadingComments" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <v-list v-else-if="currentComments.length > 0" lines="two">
            <v-list-item
              v-for="c in currentComments"
              :key="c.id"
              prepend-icon="mdi-account"
              :title="`Autor #${c.authorId}`"
              :subtitle="c.content"
            >
              <template v-slot:append>
                <span class="text-caption text-medium-emphasis">{{ formatDate(c.createdAt) }}</span>
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center text-medium-emphasis py-4">
            Nenhum comentário nesta postagem.
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="commentsDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Reações -->
    <v-dialog v-model="reactionsDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
          <span>Reações da Postagem #{{ selectedPost?.id }}</span>
          <v-btn icon variant="text" size="small" @click="reactionsDialog = false">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <div v-if="loadingReactions" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <v-list v-else-if="currentReactions.length > 0">
            <v-list-item
              v-for="r in currentReactions"
              :key="r.id"
              :title="`Usuário #${r.userId}`"
              :subtitle="`Tipo: ${r.type}`"
            >
              <template v-slot:prepend>
                <v-chip size="small" color="primary" class="mr-2">{{ r.type }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center text-medium-emphasis py-4">
            Nenhuma reação nesta postagem.
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="reactionsDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import adminSocialPostsService, {
  AdminSocialPostModel,
  AdminPostCommentModel,
  AdminPostReactionModel
} from '../services/socialPosts.service';

const posts = ref<AdminSocialPostModel[]>([]);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const selectedPost = ref<AdminSocialPostModel | null>(null);
const commentsDialog = ref(false);
const currentComments = ref<AdminPostCommentModel[]>([]);
const loadingComments = ref(false);

const reactionsDialog = ref(false);
const currentReactions = ref<AdminPostReactionModel[]>([]);
const loadingReactions = ref(false);

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Autor ID', key: 'authorId', width: '120px' },
  { title: 'Conteúdo da Postagem', key: 'content' },
  { title: 'Data de Publicação', key: 'createdAt', width: '180px' },
  { title: 'Ações de Auditoria', key: 'actions', sortable: false, width: '140px' }
];

onMounted(() => {
  loadPosts();
});

async function loadPosts() {
  loading.value = true;
  errorMessage.value = '';
  try {
    posts.value = await adminSocialPostsService.getPosts();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar postagens sociais.';
  } finally {
    loading.value = false;
  }
}

async function openCommentsDialog(post: AdminSocialPostModel) {
  selectedPost.value = post;
  commentsDialog.value = true;
  loadingComments.value = true;
  try {
    currentComments.value = await adminSocialPostsService.getComments(post.id);
  } finally {
    loadingComments.value = false;
  }
}

async function openReactionsDialog(post: AdminSocialPostModel) {
  selectedPost.value = post;
  reactionsDialog.value = true;
  loadingReactions.value = true;
  try {
    currentReactions.value = await adminSocialPostsService.getReactions(post.id);
  } finally {
    loadingReactions.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleString('pt-BR');
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
</style>
