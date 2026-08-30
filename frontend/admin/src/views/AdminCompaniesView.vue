<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Empresas Parceiras</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie o cadastro de empresas contratantes</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="companies" :loading="loading" class="elevation-0">
        <template v-slot:item.website="{ item }">
          <a :href="item.website" target="_blank" class="text-decoration-none text-primary">{{ item.website || '-' }}</a>
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
const companies = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Razão Social / Nome', key: 'name' },
  { title: 'CNPJ/Identificador', key: 'cnpj' },
  { title: 'Website', key: 'website' }
];

async function fetchCompanies() {
  loading.value = true;
  try {
    const res = await adminService.getCompanies();
    companies.value = Array.isArray(res.data) ? res.data : res.data.companies || res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar empresas:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCompanies();
});
</script>
