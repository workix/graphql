<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Usuários</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie contas, credenciais e ativação de usuários via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openDialog()">Novo Usuário</v-btn>
    </div>

    <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <!-- Users Data Table -->
    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.activated="{ item }">
          <v-chip :color="item.activated ? 'success' : 'error'" size="small">
            {{ item.activated ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:item.verified="{ item }">
          <v-chip :color="item.verified ? 'info' : 'grey'" size="small">
            {{ item.verified ? 'Verificado' : 'Pendente' }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          <span>{{ new Date(item.createdAt || Date.now()).toLocaleDateString() }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="primary" variant="text" class="mr-1" @click="openDialog(item)">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Cadastro / Edição -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-4 font-weight-bold">
          {{ editedItem.id ? 'Editar Usuário' : 'Novo Usuário' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="editedItem.email"
              label="E-mail *"
              type="email"
              :rules="[v => !!v || 'E-mail é obrigatório']"
              required
            ></v-text-field>

            <v-checkbox
              v-model="editedItem.activated"
              label="Usuário Ativo no Sistema"
              color="success"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveUser">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover o usuário <strong>{{ selectedUser?.email }}</strong>?
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
import { adminUsersService, AdminUserModel } from '../services/users.service';

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);

const users = ref<AdminUserModel[]>([]);
const selectedUser = ref<AdminUserModel | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'E-mail', key: 'email' },
  { title: 'Status', key: 'activated' },
  { title: 'Identidade', key: 'verified' },
  { title: 'Criado em', key: 'createdAt' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

const editedItem = ref<any>({
  id: null,
  email: '',
  activated: true
});

async function fetchUsers() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminUsersService.getPaginated(1, 20);
    users.value = res.data.users || [];
  } catch (err: any) {
    console.error('Erro ao carregar usuários:', err);
    errorMessage.value = err.message || 'Erro ao carregar usuários.';
  } finally {
    loading.value = false;
  }
}

function openDialog(item?: AdminUserModel) {
  if (item) {
    editedItem.value = {
      id: item.id,
      email: item.email,
      activated: Boolean(item.activated)
    };
  } else {
    editedItem.value = { id: null, email: '', activated: true };
  }
  dialog.value = true;
}

async function saveUser() {
  saving.value = true;
  try {
    if (editedItem.value.id) {
      await adminUsersService.update(editedItem.value.id, editedItem.value);
      successMessage.value = 'Usuário atualizado com sucesso pelo GraphQL!';
    } else {
      await adminUsersService.create(editedItem.value);
      successMessage.value = 'Novo usuário criado com sucesso pelo GraphQL!';
    }
    dialog.value = false;
    await fetchUsers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar usuário.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: AdminUserModel) {
  selectedUser.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedUser.value?.id) return;
  deleting.value = true;
  try {
    await adminUsersService.delete(selectedUser.value.id);
    successMessage.value = 'Usuário excluído com sucesso!';
    deleteDialog.value = false;
    await fetchUsers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao excluir usuário.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>
