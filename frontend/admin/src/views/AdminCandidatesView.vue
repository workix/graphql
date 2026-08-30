<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Candidatos & Currículos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Consulta e moderação de candidatos cadastrados via GraphQL</p>
      </div>
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
        :items="candidates"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.carrerLevel="{ item }">
          <v-chip color="primary" size="small">{{ item.resume?.carrerLevel || 'NÃO INFORMADO' }}</v-chip>
        </template>
        <template v-slot:item.location="{ item }">
          <span>{{ item.locale ? `${item.locale.city || ''}, ${item.locale.state || ''}` : 'Brasil' }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="info" variant="text" class="mr-1" title="Notificar Candidato" @click="openNotifyDialog(item)">
            <v-icon icon="mdi-bell-ring-outline"></v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" variant="text" title="Remover Candidato" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Notificação -->
    <v-dialog v-model="notifyDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Notificar Candidato: {{ selectedCandidate?.name }}</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="notifyTitle" label="Título da Notificação *" required></v-text-field>
          <v-textarea v-model="notifyMessage" label="Mensagem *" rows="3" required></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="notifyDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="sendingNotify" :disabled="!notifyTitle || !notifyMessage" @click="sendNotification">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover o candidato <strong>{{ selectedCandidate?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="executeDelete">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminCandidatesService, AdminCandidateModel } from '../services/candidates.service';

const loading = ref(false);
const deleting = ref(false);
const sendingNotify = ref(false);
const candidates = ref<AdminCandidateModel[]>([]);

const deleteDialog = ref(false);
const notifyDialog = ref(false);
const selectedCandidate = ref<AdminCandidateModel | null>(null);
const notifyTitle = ref('');
const notifyMessage = ref('');

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome do Candidato', key: 'name' },
  { title: 'Nível Profissional', key: 'carrerLevel' },
  { title: 'Localização', key: 'location' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchCandidates() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminCandidatesService.getPaginated(1, 20);
    candidates.value = res.data.candidates || [];
  } catch (err: any) {
    console.error('Erro ao carregar candidatos:', err);
    errorMessage.value = err.message || 'Erro ao carregar candidatos.';
  } finally {
    loading.value = false;
  }
}

function openNotifyDialog(item: AdminCandidateModel) {
  selectedCandidate.value = item;
  notifyTitle.value = 'Atualização sobre sua candidatura';
  notifyMessage.value = 'Seu perfil foi selecionado para uma nova oportunidade.';
  notifyDialog.value = true;
}

async function sendNotification() {
  if (!selectedCandidate.value?.id) return;
  sendingNotify.value = true;
  try {
    await adminCandidatesService.notify(selectedCandidate.value.id, notifyTitle.value, notifyMessage.value);
    successMessage.value = 'Notificação enviada com sucesso pelo GraphQL!';
    notifyDialog.value = false;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao enviar notificação.';
  } finally {
    sendingNotify.value = false;
  }
}

function confirmDelete(item: AdminCandidateModel) {
  selectedCandidate.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedCandidate.value?.id) return;
  deleting.value = true;
  try {
    await adminCandidatesService.delete(selectedCandidate.value.id);
    successMessage.value = 'Candidato removido com sucesso!';
    deleteDialog.value = false;
    await fetchCandidates();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover candidato.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchCandidates();
});
</script>
