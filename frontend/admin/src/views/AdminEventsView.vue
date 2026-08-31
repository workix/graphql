<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Auditoria de Eventos & RSVP</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Governança e auditoria de summits, webinars e encontros presenciais</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadEvents">
        Atualizar
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="events"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.eventType="{ item }">
          <v-chip size="small" :color="item.eventType === 'ONLINE' ? 'info' : 'success'" variant="tonal">
            {{ item.eventType === 'ONLINE' ? 'Online / Webinar' : 'Presencial' }}
          </v-chip>
        </template>
        <template v-slot:item.startDate="{ item }">
          {{ formatDate(item.startDate) }}
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import eventsAdminService, { AdminEventItem } from '../services/eventsAdmin.service';

const events = ref<AdminEventItem[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Título do Evento', key: 'title', width: '260px' },
  { title: 'Formato', key: 'eventType', width: '160px' },
  { title: 'Local / Transmissão', key: 'location' },
  { title: 'Data e Hora', key: 'startDate', width: '160px' }
];

onMounted(() => {
  loadEvents();
});

async function loadEvents() {
  loading.value = true;
  try {
    events.value = await eventsAdminService.getEvents();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar eventos.';
  } finally {
    loading.value = false;
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
