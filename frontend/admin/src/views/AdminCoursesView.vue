<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Gestão de Cursos (LMS)</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Cadastro e governança dos cursos da plataforma Workix Learning</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Curso
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
        :items="courses"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.instructorId="{ item }">
          <v-chip size="small" color="primary" variant="outlined">
            Instrutor #{{ item.instructorId }}
          </v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Criação -->
    <v-dialog v-model="dialog" max-width="650px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Cadastrar Novo Curso</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="form.title" label="Título do Curso *" required></v-text-field>
          <v-textarea v-model="form.description" label="Descrição e Objetivos *" rows="4" required></v-textarea>
          <v-text-field v-model="form.instructorId" label="ID do Instrutor Responsável *" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!form.title" @click="saveCourse">Cadastrar Curso</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import coursesAdminService, { AdminCourseItem } from '../services/coursesAdmin.service';

const courses = ref<AdminCourseItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Título do Curso', key: 'title' },
  { title: 'Descrição', key: 'description' },
  { title: 'Instrutor', key: 'instructorId', width: '150px' },
  { title: 'Criado em', key: 'createdAt', width: '150px' }
];

const form = reactive({
  title: '',
  description: '',
  instructorId: 1
});

onMounted(() => {
  loadCourses();
});

async function loadCourses() {
  loading.value = true;
  try {
    courses.value = await coursesAdminService.getCoursesList();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar cursos.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.title = '';
  form.description = '';
  form.instructorId = 1;
  dialog.value = true;
}

async function saveCourse() {
  saving.value = true;
  try {
    await coursesAdminService.createCourse({
      title: form.title,
      description: form.description,
      instructorId: Number(form.instructorId)
    });
    dialog.value = false;
    successMessage.value = 'Curso cadastrado com sucesso!';
    await loadCourses();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao cadastrar curso.';
  } finally {
    saving.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
</script>
