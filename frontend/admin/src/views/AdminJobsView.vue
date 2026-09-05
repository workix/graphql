<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão e Moderação de Vagas</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerenciamento completo de vagas de emprego via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Nova Vaga
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
        :items="jobs"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.company="{ item }">
          <span>{{ item.company?.name || 'Empresa Geral' }}</span>
        </template>
        <template v-slot:item.employmentType="{ item }">
          <v-chip color="primary" size="small" variant="flat">{{ item.employmentType || 'CLT' }}</v-chip>
        </template>
        <template v-slot:item.categories="{ item }">
          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="cat in (item.categories || [])"
              :key="cat"
              size="x-small"
              color="secondary"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ getCategoryLabel(cat) }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.salary="{ item }">
          <span>{{ item.minPayment && item.maxPayment ? `R$ ${item.minPayment} - ${item.maxPayment}` : 'A combinar' }}</span>
        </template>
        <template v-slot:item.featured="{ item }">
          <v-chip :color="item.featured ? 'warning' : 'grey'" size="small">
            {{ item.featured ? 'Destaque' : 'Normal' }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="primary" variant="text" class="mr-1" @click="openEditDialog(item)">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" variant="text" @click="confirmDeleteJob(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Cadastro e Edição -->
    <v-dialog v-model="dialog" max-width="750px" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-4">
          {{ isEditing ? 'Editar Vaga' : 'Cadastrar Nova Vaga' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="formData.title"
              label="Título da Vaga *"
              :rules="[v => !!v || 'Título é obrigatório']"
              required
            ></v-text-field>

            <v-textarea
              v-model="formData.description"
              label="Descrição Detalhada *"
              :rules="[v => !!v || 'Descrição é obrigatória']"
              rows="4"
              required
            ></v-textarea>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.employmentType"
                  :items="availableEmploymentTypes"
                  item-title="title"
                  item-value="value"
                  label="Tipo de Contratação *"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.jobType"
                  :items="['FULLTIME', 'PARTTIME', 'FREELANCE', 'INTERNSHIP', 'TEMPORARY', 'VOLUNTEER']"
                  label="Modalidade / Carga Horária"
                ></v-select>
              </v-col>
            </v-row>

            <v-select
              v-model="formData.categories"
              :items="availableCategories"
              item-title="title"
              item-value="value"
              label="Categorias da Vaga (Seleção Múltipla)"
              multiple
              chips
              closable-chips
              hint="Selecione uma ou mais categorias (ex: Estágio, Meio Período, Noturno)"
              persistent-hint
              class="mb-4"
            ></v-select>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.minPayment"
                  label="Salário Mínimo (R$)"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.maxPayment"
                  label="Salário Máximo (R$)"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="formData.requirement"
              label="Requisitos"
            ></v-text-field>

            <v-text-field
              v-model="formData.benefits"
              label="Benefícios"
            ></v-text-field>

            <v-checkbox
              v-model="formData.featured"
              label="Destacar esta vaga no portal"
              color="warning"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveJob">
            Salvar Vaga
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover a vaga <strong>{{ selectedJob?.title }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="executeDeleteJob">Confirmar Exclusão</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminJobsService, AdminJobModel } from '../services/jobs.service';

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const jobs = ref<AdminJobModel[]>([]);

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const formValid = ref(false);
const selectedJob = ref<AdminJobModel | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const availableCategories = [
  { value: 'MEIO_PERIODO', title: 'Meio Período' },
  { value: 'PRIMEIRA_OPORTUNIDADE', title: 'Primeira Oportunidade' },
  { value: 'ESTAGIO', title: 'Estágio' },
  { value: 'NOTURNO', title: 'Noturno' },
  { value: 'TEMPORARIO', title: 'Emprego Temporário' },
  { value: 'FREELANCE', title: 'Freelance' },
  { value: 'PERICULOSIDADE', title: 'Com Periculosidade' }
];

const availableEmploymentTypes = [
  { value: 'CLT', title: 'CLT' },
  { value: 'PJ', title: 'PJ' },
  { value: 'CONTRATO_TEMPORARIO', title: 'Contrato Temporário' }
];

function getCategoryLabel(catKey: string): string {
  const found = availableCategories.find(c => c.value === catKey);
  return found ? found.title : catKey;
}

const formData = ref<any>({
  id: null,
  title: '',
  description: '',
  benefits: '',
  requirement: '',
  jobCategory: 'MANAGEMENT',
  jobType: 'FULLTIME',
  categories: [],
  employmentType: 'CLT',
  minPayment: 3000,
  maxPayment: 7000,
  featured: false,
  companyId: 1
});

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Título da Vaga', key: 'title' },
  { title: 'Empresa', key: 'company' },
  { title: 'Contratação', key: 'employmentType' },
  { title: 'Categorias', key: 'categories' },
  { title: 'Faixa Salarial', key: 'salary' },
  { title: 'Status', key: 'featured' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchJobs() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminJobsService.getPaginated({ page: 1, limit: 20 });
    jobs.value = res.data.jobs || [];
  } catch (err: any) {
    console.error('Erro ao carregar vagas:', err);
    errorMessage.value = err.message || 'Erro ao carregar vagas.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  isEditing.value = false;
  formData.value = {
    id: null,
    title: '',
    description: '',
    benefits: 'Vale Transporte, Vale Refeição, Plano de Saúde',
    requirement: 'Formação superior e experiência na área',
    jobCategory: 'MANAGEMENT',
    jobType: 'FULLTIME',
    categories: [],
    employmentType: 'CLT',
    minPayment: 3500,
    maxPayment: 8000,
    featured: false,
    companyId: 1
  };
  dialog.value = true;
}

function openEditDialog(item: AdminJobModel) {
  isEditing.value = true;
  formData.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    benefits: item.benefits || '',
    requirement: item.requirement || '',
    jobCategory: item.jobCategory || 'MANAGEMENT',
    jobType: item.jobType || 'FULLTIME',
    categories: item.categories || [],
    employmentType: item.employmentType || 'CLT',
    minPayment: item.minPayment || 0,
    maxPayment: item.maxPayment || 0,
    featured: Boolean(item.featured),
    companyId: item.company?.id || 1
  };
  dialog.value = true;
}

async function saveJob() {
  saving.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value && formData.value.id) {
      await adminJobsService.update(formData.value.id, formData.value);
      successMessage.value = 'Vaga atualizada com sucesso pelo GraphQL!';
    } else {
      await adminJobsService.create(formData.value);
      successMessage.value = 'Nova vaga cadastrada com sucesso pelo GraphQL!';
    }
    dialog.value = false;
    await fetchJobs();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar vaga.';
  } finally {
    saving.value = false;
  }
}

function confirmDeleteJob(item: AdminJobModel) {
  selectedJob.value = item;
  deleteDialog.value = true;
}

async function executeDeleteJob() {
  if (!selectedJob.value?.id) return;
  deleting.value = true;
  errorMessage.value = '';
  try {
    await adminJobsService.delete(selectedJob.value.id);
    successMessage.value = `Vaga "${selectedJob.value.title}" excluída com sucesso!`;
    deleteDialog.value = false;
    await fetchJobs();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao excluir vaga.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchJobs();
});
</script>
