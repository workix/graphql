<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Autores de Blog</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Cadastro e governança de colunistas e redatores de conteúdo</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Autor
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
        :items="authors"
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
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Cadastrar Novo Autor</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="form.name" label="Nome do Autor *" required></v-text-field>
          <v-text-field v-model="form.email" label="E-mail de Contato *" type="email" required></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!form.name" @click="saveAuthor">Salvar Autor</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover o autor <strong>"{{ selectedAuthor?.name }}"</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteAuthor">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import authorsAdminService, { AdminAuthorItem } from '../services/authorsAdmin.service';

const authors = ref<AdminAuthorItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const selectedAuthor = ref<AdminAuthorItem | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nome Completo', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'Cadastrado em', key: 'createdAt', width: '150px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '90px', align: 'center' as const }
];

const form = reactive({
  name: '',
  email: ''
});

onMounted(() => {
  loadAuthors();
});

async function loadAuthors() {
  loading.value = true;
  try {
    authors.value = await authorsAdminService.getAuthors();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar autores.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.name = '';
  form.email = '';
  dialog.value = true;
}

async function saveAuthor() {
  saving.value = true;
  try {
    await authorsAdminService.createAuthor({
      name: form.name,
      email: form.email
    });
    dialog.value = false;
    successMessage.value = 'Autor cadastrado com sucesso!';
    await loadAuthors();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar autor.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: AdminAuthorItem) {
  selectedAuthor.value = item;
  deleteDialog.value = true;
}

async function deleteAuthor() {
  if (!selectedAuthor.value) return;
  deleting.value = true;
  try {
    await authorsAdminService.deleteAuthor(selectedAuthor.value.id);
    deleteDialog.value = false;
    successMessage.value = 'Autor removido com sucesso!';
    await loadAuthors();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover autor.';
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
