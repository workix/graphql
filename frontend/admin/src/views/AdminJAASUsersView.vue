<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Usuários JAAS</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestão de contas e perfis de segurança JAAS via GraphQL</p>
      </div>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="jaasUsers"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.roles="{ item }">
          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="(r, idx) in item.roles"
              :key="idx"
              color="primary"
              size="x-small"
              class="mr-1"
            >
              {{ r.name }}
            </v-chip>
            <span v-if="!item.roles || item.roles.length === 0" class="text-caption text-grey">Sem Roles</span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminJAASService, JAASUserModel } from '../services/jaas.service';

const loading = ref(false);
const jaasUsers = ref<JAASUserModel[]>([]);
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Login / Usuário', key: 'login' },
  { title: 'Roles Associadas', key: 'roles' }
];

async function fetchJAASUsers() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminJAASService.getUsersPaginated(1, 20);
    jaasUsers.value = res.data.jaasUsers || [];
  } catch (err: any) {
    console.error('Erro ao carregar JAAS Users:', err);
    errorMessage.value = err.message || 'Erro ao carregar usuários JAAS.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchJAASUsers();
});
</script>
