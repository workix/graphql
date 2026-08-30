<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Inscritos da Newsletter</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Lista de e-mails cadastrados no boletim informativo</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="subscribers" :loading="loading" class="elevation-0">
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminService } from '../services/admin';

const loading = ref(false);
const subscribers = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'E-mail Cadastrado', key: 'email' },
  { title: 'Data de Inscrição', key: 'created_at' }
];

async function fetchSubscribers() {
  loading.value = true;
  try {
    const res = await adminService.getSubscribers();
    subscribers.value = Array.isArray(res.data) ? res.data : res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar inscritos:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchSubscribers();
});
</script>
