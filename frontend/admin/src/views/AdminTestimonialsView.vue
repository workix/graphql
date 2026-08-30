<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Moderação de Depoimentos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestão e publicação de depoimentos via GraphQL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Depoimento
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
        :items="testimonials"
        :loading="loading"
        hover
        class="elevation-0"
      >
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
        <v-card-title class="text-h5 pa-4">Novo Depoimento</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="signature" label="Assinatura / Nome do Autor *" required></v-text-field>
          <v-textarea v-model="text" label="Texto do Depoimento *" rows="4" required></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!signature || !text" @click="saveTestimonial">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Confirmar Exclusão</v-card-title>
        <v-card-text class="pa-4">
          Tem certeza de que deseja remover o depoimento de <strong>{{ selectedTestimonial?.signature }}</strong>?
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
import { adminTestimonialsService, TestimonialModel } from '../services/testimonials.service';

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const testimonials = ref<TestimonialModel[]>([]);

const dialog = ref(false);
const deleteDialog = ref(false);
const selectedTestimonial = ref<TestimonialModel | null>(null);
const signature = ref('');
const text = ref('');

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Autor / Assinatura', key: 'signature' },
  { title: 'Depoimento', key: 'text' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
];

async function fetchTestimonials() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminTestimonialsService.getPaginated(1, 20);
    testimonials.value = res.data.testimonials || [];
  } catch (err: any) {
    console.error('Erro ao carregar depoimentos:', err);
    errorMessage.value = err.message || 'Erro ao carregar depoimentos.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  signature.value = '';
  text.value = '';
  dialog.value = true;
}

async function saveTestimonial() {
  saving.value = true;
  try {
    await adminTestimonialsService.create({
      signature: signature.value,
      text: text.value
    });
    successMessage.value = 'Depoimento publicado com sucesso pelo GraphQL!';
    dialog.value = false;
    await fetchTestimonials();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar depoimento.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: TestimonialModel) {
  selectedTestimonial.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!selectedTestimonial.value?.id) return;
  deleting.value = true;
  try {
    await adminTestimonialsService.delete(selectedTestimonial.value.id);
    successMessage.value = 'Depoimento removido com sucesso!';
    deleteDialog.value = false;
    await fetchTestimonials();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao remover depoimento.';
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchTestimonials();
});
</script>
