<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Candidatos & Currículos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Moderação e gestão de talentos cadastrados</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="candidates" :loading="loading" class="elevation-0">
        <template v-slot:item.email="{ item }">
          <span>{{ item.email || item.User?.email || '-' }}</span>
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminService } from '../services/admin';

const loading = ref(false);
const candidates = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome do Candidato', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'CPF', key: 'cpf' }
];

async function fetchCandidates() {
  loading.value = true;
  try {
    const res = await adminService.getCandidates();
    candidates.value = Array.isArray(res.data) ? res.data : res.data.candidates || res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar candidatos:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCandidates();
});
</script>
