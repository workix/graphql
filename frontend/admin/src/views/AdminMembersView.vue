<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão da Equipe Institucional</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Cadastro e manutenção dos membros exibidos na página pública de apresentação</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Membro
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
        :items="members"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.picture="{ item }">
          <v-avatar size="36">
            <v-img :src="item.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'"></v-img>
          </v-avatar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Criação -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Cadastrar Novo Membro da Equipe</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="form.name" label="Nome Completo *" required></v-text-field>
          <v-text-field v-model="form.occupation" label="Cargo / Especialidade *" required></v-text-field>
          <v-text-field v-model="form.picture" label="URL da Foto"></v-text-field>
          <v-textarea v-model="form.shortText" label="Mini Biografia / Resumo" rows="3"></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!form.name || !form.occupation" @click="saveMember">Salvar Membro</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover <strong>{{ selectedMember?.name }}</strong> da equipe institucional?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteMember">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import membersAdminService, { AdminMemberItem } from '../services/membersAdmin.service';

const members = ref<AdminMemberItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const selectedMember = ref<AdminMemberItem | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'Foto', key: 'picture', width: '70px', sortable: false },
  { title: 'Nome Completo', key: 'name', width: '220px' },
  { title: 'Cargo / Função', key: 'occupation', width: '220px' },
  { title: 'Mini Bio', key: 'shortText' },
  { title: 'Ações', key: 'actions', sortable: false, width: '90px', align: 'center' as const }
];

const form = reactive({
  name: '',
  occupation: '',
  picture: '',
  shortText: ''
});

onMounted(() => {
  loadMembers();
});

async function loadMembers() {
  loading.value = true;
  try {
    members.value = await membersAdminService.getMembers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar equipe.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.name = '';
  form.occupation = '';
  form.picture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
  form.shortText = '';
  dialog.value = true;
}

async function saveMember() {
  saving.value = true;
  try {
    await membersAdminService.createMember({
      name: form.name,
      occupation: form.occupation,
      picture: form.picture,
      shortText: form.shortText
    });
    dialog.value = false;
    successMessage.value = 'Membro cadastrado com sucesso!';
    await loadMembers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar membro.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: AdminMemberItem) {
  selectedMember.value = item;
  deleteDialog.value = true;
}

async function deleteMember() {
  if (!selectedMember.value) return;
  deleting.value = true;
  try {
    await membersAdminService.deleteMember(selectedMember.value.id);
    deleteDialog.value = false;
    successMessage.value = 'Membro removido com sucesso!';
    await loadMembers();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover membro.';
  } finally {
    deleting.value = false;
  }
}
</script>
