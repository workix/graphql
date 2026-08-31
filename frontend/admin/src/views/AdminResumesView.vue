<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Currículos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Auditoria e governança dos currículos e qualificações profissionais cadastradas</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadResumes">
        Atualizar
      </v-btn>
    </div>

    <v-alert v-if="feedbackMsg" :type="feedbackType" variant="tonal" class="mb-4" closable @click:close="feedbackMsg = ''">
      {{ feedbackMsg }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="resumes"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.title="{ item }">
          <div class="font-weight-bold">{{ item.title }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.summary }}</div>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-delete-outline" size="small" color="error" variant="text" @click="confirmDelete(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo de Exclusão -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza de que deseja excluir o currículo <strong>"{{ selectedResume?.title }}"</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogDelete = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteItem">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import resumesAdminService, { AdminResume } from '../services/resumesAdmin.service';

const resumes = ref<AdminResume[]>([]);
const loading = ref(false);
const deleting = ref(false);
const dialogDelete = ref(false);
const selectedResume = ref<AdminResume | null>(null);
const feedbackMsg = ref('');
const feedbackType = ref<'success' | 'error'>('success');

const headers = [
  { title: 'ID', key: 'id', width: '70px' },
  { title: 'Título do Currículo', key: 'title', width: '350px' },
  { title: 'ID Candidato', key: 'candidate_id', width: '120px' },
  { title: 'Cadastrado em', key: 'createdAt', width: '140px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px' }
];

onMounted(() => {
  loadResumes();
});

async function loadResumes() {
  loading.value = true;
  try {
    resumes.value = await resumesAdminService.getAllResumes();
  } catch (err: any) {
    feedbackType.value = 'error';
    feedbackMsg.value = err.message || 'Erro ao carregar currículos.';
  } finally {
    loading.value = false;
  }
}

function confirmDelete(item: AdminResume) {
  selectedResume.value = item;
  dialogDelete.value = true;
}

async function deleteItem() {
  if (!selectedResume.value) return;
  deleting.value = true;
  try {
    await resumesAdminService.deleteResume(selectedResume.value.id);
    feedbackType.value = 'success';
    feedbackMsg.value = 'Currículo excluído com sucesso.';
    dialogDelete.value = false;
    await loadResumes();
  } catch (err: any) {
    feedbackType.value = 'error';
    feedbackMsg.value = err.message || 'Erro ao excluir currículo.';
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
