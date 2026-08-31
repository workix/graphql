<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Auditoria de Arquivos & Mídias</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Inspeção de uploads seguros, mídias de perfil, anexos sociais e currículos em PDF</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadMedia">
        Atualizar
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="mediaList"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.context="{ item }">
          <v-chip size="small" :color="getContextColor(item.context)" variant="tonal">
            {{ item.context }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip size="small" :color="item.status === 'READY' ? 'success' : 'warning'" variant="outlined">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.url="{ item }">
          <a v-if="item.url" :href="item.url" target="_blank" class="text-primary text-decoration-none font-weight-medium">
            <v-icon icon="mdi-open-in-new" size="small" class="mr-1"></v-icon> Abrir Ativo
          </a>
          <span v-else class="text-medium-emphasis">-</span>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import mediaAdminService, { AdminMediaAsset } from '../services/mediaAdmin.service';

const mediaList = ref<AdminMediaAsset[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '70px' },
  { title: 'Nome do Arquivo', key: 'fileName', width: '240px' },
  { title: 'Tipo MIME', key: 'fileType', width: '160px' },
  { title: 'Contexto', key: 'context', width: '150px' },
  { title: 'Status', key: 'status', width: '110px' },
  { title: 'Ativo', key: 'url', sortable: false, width: '130px' },
  { title: 'Enviado em', key: 'createdAt', width: '140px' }
];

onMounted(() => {
  loadMedia();
});

async function loadMedia() {
  loading.value = true;
  try {
    mediaList.value = await mediaAdminService.getMediaList();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar mídias.';
  } finally {
    loading.value = false;
  }
}

function getContextColor(ctx: string) {
  switch (ctx) {
    case 'AVATAR': return 'primary';
    case 'BANNER': return 'secondary';
    case 'RESUME_PDF': return 'error';
    case 'POST_ATTACHMENT': return 'info';
    default: return 'default';
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
