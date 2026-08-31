<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Auditoria de Perfis Profissionais</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Monitoramento de perfis sociais, headlines profissionais e badges Open to Work</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="loadProfiles">
        Atualizar
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="profiles"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="36" class="mr-3" color="primary">
              <v-img v-if="item.avatarUrl" :src="item.avatarUrl" alt="Avatar"></v-img>
              <span v-else class="text-white text-caption">{{ item.name?.charAt(0) }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
            </div>
          </div>
        </template>
        <template v-slot:item.openToWork="{ item }">
          <v-chip size="small" :color="item.openToWork ? 'success' : 'default'" variant="tonal">
            <v-icon start :icon="item.openToWork ? 'mdi-check-circle' : 'mdi-minus-circle'" size="small"></v-icon>
            {{ item.openToWork ? 'Open to Work' : 'Indisponível' }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import profilesAdminService, { AdminUserProfile } from '../services/profilesAdmin.service';

const profiles = ref<AdminUserProfile[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '70px' },
  { title: 'Profissional', key: 'name', width: '280px' },
  { title: 'Headline / Título', key: 'headline', width: '320px' },
  { title: 'Localização', key: 'location', width: '160px' },
  { title: 'Status de Carreira', key: 'openToWork', width: '180px' }
];

onMounted(() => {
  loadProfiles();
});

async function loadProfiles() {
  loading.value = true;
  try {
    profiles.value = await profilesAdminService.getAllProfiles();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar perfis.';
  } finally {
    loading.value = false;
  }
}
</script>
