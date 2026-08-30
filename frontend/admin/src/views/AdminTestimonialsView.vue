<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Moderação de Depoimentos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie testemunhos exibidos na Home</p>
      </div>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="testimonials" :loading="loading" class="elevation-0">
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminService } from '../services/admin';

const loading = ref(false);
const testimonials = ref<any[]>([]);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Autor', key: 'author' },
  { title: 'Cargo / Empresa', key: 'role' },
  { title: 'Depoimento', key: 'content' }
];

async function fetchTestimonials() {
  loading.value = true;
  try {
    const res = await adminService.getTestimonials();
    testimonials.value = Array.isArray(res.data) ? res.data : res.data.rows || [];
  } catch (err) {
    console.error('Erro ao carregar depoimentos:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchTestimonials();
});
</script>
