<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Perfis & Roles JAAS</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Permissões de autorização e controle de acesso</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="roles" :loading="loading" class="elevation-0">
        <template v-slot:item.name="{ item }">
          <v-chip color="secondary" size="small">{{ item.name }}</v-chip>
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
const roles = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome da Role', key: 'name' },
  { title: 'Descrição', key: 'description' }
];

async function fetchRoles() {
  loading.value = true;
  try {
    const res = await adminService.getJAASRoles();
    roles.value = Array.isArray(res.data) ? res.data : res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar JAAS Roles:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
});
</script>
