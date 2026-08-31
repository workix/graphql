<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Caixa de Entrada de Suporte</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Mensagens de contato, ouvidoria e solicitações de usuários e empresas</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadForms">
        Atualizar
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
        :items="forms"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.email="{ item }">
          <a :href="'mailto:' + item.email" class="text-primary font-weight-medium text-decoration-none">
            {{ item.email }}
          </a>
        </template>
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

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão de Mensagem</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover a mensagem de <strong>{{ selectedForm?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteForm">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import formsAdminService, { AdminFormItem } from '../services/formsAdmin.service';

const forms = ref<AdminFormItem[]>([]);
const loading = ref(false);
const deleting = ref(false);
const deleteDialog = ref(false);
const selectedForm = ref<AdminFormItem | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nome', key: 'name', width: '160px' },
  { title: 'E-mail', key: 'email', width: '200px' },
  { title: 'Assunto', key: 'subject', width: '220px' },
  { title: 'Mensagem', key: 'message' },
  { title: 'Recebido em', key: 'createdAt', width: '140px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '90px', align: 'center' as const }
];

onMounted(() => {
  loadForms();
});

async function loadForms() {
  loading.value = true;
  try {
    const res = await formsAdminService.getFormsPaginated(1, 20);
    forms.value = res.forms;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar mensagens.';
  } finally {
    loading.value = false;
  }
}

function confirmDelete(item: AdminFormItem) {
  selectedForm.value = item;
  deleteDialog.value = true;
}

async function deleteForm() {
  if (!selectedForm.value) return;
  deleting.value = true;
  try {
    await formsAdminService.deleteForm(selectedForm.value.id);
    deleteDialog.value = false;
    successMessage.value = 'Mensagem removida com sucesso!';
    await loadForms();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover mensagem.';
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
