<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão do Blog Corporativo</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Publicação e moderação de artigos e notícias do ecossistema Workix</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Artigo
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
        :items="blogs"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Criação -->
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Publicar Novo Artigo no Blog</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="form.title" label="Título do Artigo *" required></v-text-field>
          <v-text-field v-model="form.shortText" label="Resumo / Subtítulo *" required></v-text-field>
          <v-textarea v-model="form.text" label="Conteúdo Completo do Artigo *" rows="6" required></v-textarea>
          <v-text-field v-model="form.authorId" label="ID do Autor *" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!form.title || !form.text" @click="saveBlog">Publicar Artigo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover o artigo <strong>"{{ selectedBlog?.title }}"</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteBlog">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import blogsAdminService, { AdminBlogItem } from '../services/blogsAdmin.service';

const blogs = ref<AdminBlogItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const selectedBlog = ref<AdminBlogItem | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Título do Artigo', key: 'title' },
  { title: 'Resumo', key: 'shortText' },
  { title: 'Publicado em', key: 'createdAt', width: '160px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px', align: 'center' as const }
];

const form = reactive({
  title: '',
  shortText: '',
  text: '',
  authorId: 1
});

onMounted(() => {
  loadBlogs();
});

async function loadBlogs() {
  loading.value = true;
  try {
    const res = await blogsAdminService.getBlogsPaginated(1, 20);
    blogs.value = res.blogs;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar blogs.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.title = '';
  form.shortText = '';
  form.text = '';
  form.authorId = 1;
  dialog.value = true;
}

async function saveBlog() {
  saving.value = true;
  try {
    await blogsAdminService.createBlog({
      title: form.title,
      shortText: form.shortText,
      text: form.text,
      authorId: Number(form.authorId)
    });
    dialog.value = false;
    successMessage.value = 'Artigo publicado com sucesso no blog!';
    await loadBlogs();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar artigo.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: AdminBlogItem) {
  selectedBlog.value = item;
  deleteDialog.value = true;
}

async function deleteBlog() {
  if (!selectedBlog.value) return;
  deleting.value = true;
  try {
    await blogsAdminService.deleteBlog(selectedBlog.value.id);
    deleteDialog.value = false;
    successMessage.value = 'Artigo removido com sucesso!';
    await loadBlogs();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover artigo.';
  } finally {
    deleting.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
</script>
