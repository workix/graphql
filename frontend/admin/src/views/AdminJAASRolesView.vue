<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Perfis & Roles JAAS</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Controle e cadastro de perfis de acesso via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Nova Role
      </v-btn>
    </div>

    <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="roles"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.name="{ item }">
          <v-chip color="secondary" size="small">{{ item.name }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Criação de Role -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Nova Role JAAS</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="roleName" label="Nome da Role (ex: ROLE_MANAGER) *" required></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!roleName" @click="saveRole">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Exclusão de Role -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover a role <strong>{{ selectedRole?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="executeDelete">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminJAASService, JAASRoleModel } from '../services/jaas.service';

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const roles = ref<JAASRoleModel[]>([]);

const dialog = ref(false);
const deleteDialog = ref(false);
const roleName = ref('');
const selectedRole = ref<JAASRoleModel | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'Nome da Role JAAS', key: 'name' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchRoles() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminJAASService.getRolesPaginated(1, 20);
    roles.value = res.data.jaasRoles || [];
  } catch (err: any) {
    console.error('Erro ao carregar JAAS Roles:', err);
    errorMessage.value = err.message || 'Erro ao carregar roles.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  roleName.value = '';
  dialog.value = true;
}

async function saveRole() {
  saving.value = true;
  try {
    await adminJAASService.createRole(roleName.value);
    successMessage.value = 'Role criada com sucesso pelo GraphQL!';
    dialog.value = false;
    await fetchRoles();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao criar role.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: JAASRoleModel) {
  selectedRole.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedRole.value?.name) return;
  deleting.value = true;
  try {
    await adminJAASService.deleteRole(selectedRole.value.name);
    successMessage.value = 'Role removida com sucesso!';
    deleteDialog.value = false;
    await fetchRoles();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover role.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchRoles();
});
</script>
