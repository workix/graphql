<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Moderação de Processos Seletivos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Auditoria e governança dos processos seletivos e candidaturas ativas</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadProcesses">
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
        :items="processes"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.job="{ item }">
          <strong>{{ item.job?.title || 'Vaga #' + item.id }}</strong>
        </template>
        <template v-slot:item.activated="{ item }">
          <v-chip size="small" :color="item.activated ? 'success' : 'error'" variant="tonal">
            {{ item.activated ? 'Ativo' : 'Encerrado' }}
          </v-chip>
        </template>
        <template v-slot:item.startsIn="{ item }">
          {{ formatDate(item.startsIn) }}
        </template>
        <template v-slot:item.expiresIn="{ item }">
          {{ formatDate(item.expiresIn) }}
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
        <v-card-title class="text-h6 pa-4">Confirmar Encerramento/Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja excluir o processo seletivo da vaga <strong>"{{ selectedProcess?.job?.title }}"</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteProcess">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import selectiveProcessesAdminService, { AdminSelectiveProcessItem } from '../services/selectiveProcessesAdmin.service';

const processes = ref<AdminSelectiveProcessItem[]>([]);
const loading = ref(false);
const deleting = ref(false);
const deleteDialog = ref(false);
const selectedProcess = ref<AdminSelectiveProcessItem | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '70px' },
  { title: 'Vaga Vinculada', key: 'job' },
  { title: 'Status', key: 'activated', width: '110px' },
  { title: 'Limite Candidatos', key: 'maxCandidates', width: '160px' },
  { title: 'Início', key: 'startsIn', width: '140px' },
  { title: 'Expiração', key: 'expiresIn', width: '140px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '90px', align: 'center' as const }
];

onMounted(() => {
  loadProcesses();
});

async function loadProcesses() {
  loading.value = true;
  try {
    const res = await selectiveProcessesAdminService.getSelectiveProcessesPaginated(1, 20);
    processes.value = res.selectiveProcesses;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar processos seletivos.';
  } finally {
    loading.value = false;
  }
}

function confirmDelete(item: AdminSelectiveProcessItem) {
  selectedProcess.value = item;
  deleteDialog.value = true;
}

async function deleteProcess() {
  if (!selectedProcess.value) return;
  deleting.value = true;
  try {
    await selectiveProcessesAdminService.deleteSelectiveProcess(selectedProcess.value.id);
    deleteDialog.value = false;
    successMessage.value = 'Processo seletivo removido com sucesso!';
    await loadProcesses();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover processo.';
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
