<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Usuários</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie todos os usuários do sistema, permissões e contas</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openDialog()">Novo Usuário</v-btn>
    </div>

    <!-- Filter Card -->
    <v-card class="pa-4 mb-4" variant="outlined">
      <v-row density="compact">
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="search" label="Pesquisar por nome ou e-mail" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details density="compact"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <!-- Users Data Table -->
    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.role="{ item }">
          <v-chip :color="item.role === 'ROLE_ADMIN' ? 'error' : item.role === 'COMPANY' ? 'primary' : 'info'" size="small">
            {{ item.role || 'CANDIDATE' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="info" variant="text" class="mr-1" @click="openDialog(item)">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" variant="text" @click="deleteUserItem(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold">{{ editedItem.id ? 'Editar Usuário' : 'Novo Usuário' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="editedItem.name" label="Nome Completo" variant="outlined" class="mb-3"></v-text-field>
            <v-text-field v-model="editedItem.email" label="E-mail" variant="outlined" type="email" class="mb-3"></v-text-field>
            <v-select
              v-model="editedItem.role"
              :items="['CANDIDATE', 'COMPANY', 'ROLE_OPERATOR', 'ROLE_ADMIN']"
              label="Perfil / Perfil de Acesso"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveUser">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminService } from '../services/admin';

const search = ref('');
const loading = ref(false);
const dialog = ref(false);
const users = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'Perfil', key: 'role' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

const editedItem = ref<any>({
  id: null,
  name: '',
  email: '',
  role: 'CANDIDATE'
});

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await adminService.getUsers();
    users.value = Array.isArray(res.data) ? res.data : res.data.users || res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
  } finally {
    loading.value = false;
  }
}

function openDialog(item?: any) {
  if (item) {
    editedItem.value = { ...item };
  } else {
    editedItem.value = { id: null, name: '', email: '', role: 'CANDIDATE' };
  }
  dialog.value = true;
}

async function saveUser() {
  try {
    if (editedItem.value.id) {
      await adminService.updateUser(editedItem.value.id, editedItem.value);
    }
    dialog.value = false;
    fetchUsers();
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
  }
}

async function deleteUserItem(item: any) {
  if (confirm(`Tem certeza que deseja excluir o usuário ${item.email}?`)) {
    try {
      await adminService.deleteUser(item.id);
      fetchUsers();
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
    }
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
</style>
