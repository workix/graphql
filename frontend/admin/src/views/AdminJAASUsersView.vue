<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Usuários JAAS</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestão de autenticação e contas do módulo JAAS</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="jaasUsers" :loading="loading" class="elevation-0">
        <template v-slot:item.active="{ item }">
          <v-chip :color="item.active ? 'success' : 'error'" size="small">
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </v-chip>
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
const jaasUsers = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Username', key: 'username' },
  { title: 'E-mail', key: 'email' },
  { title: 'Status', key: 'active' }
];

async function fetchJAASUsers() {
  loading.value = true;
  try {
    const res = await adminService.getJAASUsers();
    jaasUsers.value = Array.isArray(res.data) ? res.data : res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar JAAS Users:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchJAASUsers();
});
</script>
