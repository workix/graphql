<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Buscar Talentos e Currículos</h1>
        <p>Encontre os profissionais perfeitos para a sua empresa</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <div class="col-md-3 col-sm-4">
          <div class="filter-sidebar">
            <h3>Filtrar Candidatos</h3>
            <div class="form-group">
              <label>Busca por Nome/Cargo</label>
              <input type="text" v-model="searchQuery" class="form-control" placeholder="Ex: Desenvolvedor React..." @keyup.enter="fetchCandidates" />
            </div>
            <button class="btn btn-primary btn-block" @click="fetchCandidates">Filtrar</button>
          </div>
        </div>

        <div class="col-md-9 col-sm-8 position-relative">
          <LoadingOverlay :loading="loading" />

          <div v-if="!loading && candidates.length === 0" class="alert alert-info text-center">
            Nenhum candidato encontrado.
          </div>

          <div v-else class="candidates-container">
            <CandidateCard v-for="candidate in candidates" :key="candidate.id" :candidate="candidate" />
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import CandidateCard from '../components/CandidateCard.vue';
import Pagination from '../components/Pagination.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { resumesService } from '../services/resumes';

const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const candidates = ref<any[]>([]);
const loading = ref(false);

async function fetchCandidates() {
  loading.value = true;
  try {
    const response = await resumesService.getPaginated(currentPage.value, 10);
    if (response.data) {
      candidates.value = response.data.resumes || [];
      totalPages.value = response.data.totalPages || 1;
    }
  } catch (err) {
    console.error('Erro ao buscar candidatos:', err);
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchCandidates();
}

onMounted(() => {
  fetchCandidates();
});
</script>

<style scoped>
.page-header {
  background: #1e293b;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.filter-sidebar {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
