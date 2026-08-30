<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Inscritos da Newsletter</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Lista e moderação de e-mails cadastrados via GraphQL</p>
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
        :items="subscribers"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.createdAt="{ item }">
          <span>{{ new Date(item.createdAt || Date.now()).toLocaleString() }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Remoção</v-card-title>
        <v-card-text class="pa-4">
          Remover o assinante <strong>{{ selectedSubscriber?.email }}</strong> da lista?
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
import { adminSubscribersService, SubscriberModel } from '../services/subscribers.service';

const loading = ref(false);
const deleting = ref(false);
const subscribers = ref<SubscriberModel[]>([]);

const deleteDialog = ref(false);
const selectedSubscriber = ref<SubscriberModel | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'E-mail Cadastrado', key: 'email' },
  { title: 'Data de Inscrição', key: 'createdAt' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchSubscribers() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminSubscribersService.getPaginated(1, 20);
    subscribers.value = res.data.subscribers || [];
  } catch (err: any) {
    console.error('Erro ao carregar inscritos:', err);
    errorMessage.value = err.message || 'Erro ao carregar inscritos.';
  } finally {
    loading.value = false;
  }
}

function confirmDelete(item: SubscriberModel) {
  selectedSubscriber.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedSubscriber.value?.id) return;
  deleting.value = true;
  try {
    await adminSubscribersService.delete(selectedSubscriber.value.id);
    successMessage.value = 'Inscrito removido com sucesso!';
    deleteDialog.value = false;
    await fetchSubscribers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover inscrito.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchSubscribers();
});
</script>
