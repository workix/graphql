<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Moderação de Vagas</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Aprove, edite ou remova vagas publicadas no portal</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="jobs" :loading="loading" hover class="elevation-0">
        <template v-slot:item.contract_type="{ item }">
          <v-chip color="info" size="small">{{ item.contract_type || 'CLT' }}</v-chip>
        </template>
        <template v-slot:item.is_featured="{ item }">
          <v-chip :color="item.is_featured ? 'warning' : 'grey'" size="small">
            {{ item.is_featured ? 'Destaque' : 'Normal' }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="error" variant="text" @click="handleDeleteJob(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
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
const jobs = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Título da Vaga', key: 'title' },
  { title: 'Empresa', key: 'company_name' },
  { title: 'Cidade/UF', key: 'city' },
  { title: 'Tipo', key: 'contract_type' },
  { title: 'Destaque', key: 'is_featured' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchJobs() {
  loading.value = true;
  try {
    const res = await adminService.getJobs();
    jobs.value = Array.isArray(res.data) ? res.data : res.data.jobs || res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar vagas:', err);
  } finally {
    loading.value = false;
  }
}

async function handleDeleteJob(item: any) {
  if (confirm(`Excluir a vaga ${item.title}?`)) {
    try {
      await adminService.deleteJob(item.id);
      fetchJobs();
    } catch (err) {
      console.error('Erro ao excluir vaga:', err);
    }
  }
}

onMounted(() => {
  fetchJobs();
});
</script>
