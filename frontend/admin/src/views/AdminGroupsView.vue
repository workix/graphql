<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Auditoria de Grupos & Comunidades</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Monitoramento e governança de comunidades profissionais ativas no Workix</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadGroups">
        Atualizar
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="groups"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.isPrivate="{ item }">
          <v-chip size="small" :color="item.isPrivate ? 'warning' : 'info'" variant="tonal">
            {{ item.isPrivate ? 'Privado / Fechado' : 'Público' }}
          </v-chip>
        </template>
        <template v-slot:item.memberCount="{ item }">
          <span class="font-weight-bold text-primary">{{ item.memberCount || 0 }} membros</span>
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
import groupsAdminService, { AdminGroupItem } from '../services/groupsAdmin.service';

const groups = ref<AdminGroupItem[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nome da Comunidade', key: 'name', width: '260px' },
  { title: 'Descrição', key: 'description' },
  { title: 'Privacidade', key: 'isPrivate', width: '170px' },
  { title: 'Membros', key: 'memberCount', width: '150px' },
  { title: 'Criado em', key: 'createdAt', width: '140px' }
];

onMounted(() => {
  loadGroups();
});

async function loadGroups() {
  loading.value = true;
  try {
    groups.value = await groupsAdminService.getGroups();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar grupos.';
  } finally {
    loading.value = false;
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
