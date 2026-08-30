<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Empresas Parceiras</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Cadastro e manutenção de empresas contratantes via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Nova Empresa
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
        :items="companies"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="primary" variant="text" class="mr-1" @click="openEditDialog(item)">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Cadastro / Edição -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-4">
          {{ isEditing ? 'Editar Empresa' : 'Cadastrar Nova Empresa' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="formData.name"
              label="Razão Social / Nome *"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.cnpj"
              label="CNPJ"
            ></v-text-field>

            <v-text-field
              v-model="formData.email"
              label="E-mail Corporativo"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="formData.phone"
              label="Telefone / Contato"
            ></v-text-field>

            <v-text-field
              v-model="formData.location"
              label="Localização (Cidade, Estado)"
            ></v-text-field>

            <v-textarea
              v-model="formData.description"
              label="Descrição Institucional"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveCompany">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover a empresa <strong>{{ selectedCompany?.name }}</strong>?
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
import { adminCompaniesService, AdminCompanyModel } from '../services/companies.service';

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const companies = ref<AdminCompanyModel[]>([]);

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const formValid = ref(false);
const selectedCompany = ref<AdminCompanyModel | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const formData = ref<any>({
  id: null,
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  location: '',
  description: ''
});

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Razão Social / Nome', key: 'name' },
  { title: 'CNPJ', key: 'cnpj' },
  { title: 'E-mail', key: 'email' },
  { title: 'Localização', key: 'location' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchCompanies() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminCompaniesService.getPaginated(1, 20);
    companies.value = res.data.companies || [];
  } catch (err: any) {
    console.error('Erro ao carregar empresas:', err);
    errorMessage.value = err.message || 'Erro ao carregar empresas.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    location: '',
    description: ''
  };
  dialog.value = true;
}

function openEditDialog(item: AdminCompanyModel) {
  isEditing.value = true;
  formData.value = {
    id: item.id,
    name: item.name,
    cnpj: item.cnpj || '',
    email: item.email || '',
    phone: item.phone || '',
    location: item.location || '',
    description: item.description || ''
  };
  dialog.value = true;
}

async function saveCompany() {
  saving.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value && formData.value.id) {
      await adminCompaniesService.update(formData.value.id, formData.value);
      successMessage.value = 'Empresa atualizada com sucesso pelo GraphQL!';
    } else {
      await adminCompaniesService.create(formData.value);
      successMessage.value = 'Nova empresa cadastrada com sucesso pelo GraphQL!';
    }
    dialog.value = false;
    await fetchCompanies();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar empresa.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: AdminCompanyModel) {
  selectedCompany.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedCompany.value?.id) return;
  deleting.value = true;
  errorMessage.value = '';
  try {
    await adminCompaniesService.delete(selectedCompany.value.id);
    successMessage.value = `Empresa "${selectedCompany.value.name}" removida com sucesso!`;
    deleteDialog.value = false;
    await fetchCompanies();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover empresa.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchCompanies();
});
</script>
