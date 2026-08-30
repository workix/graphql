<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Buscar Vagas de Emprego</h1>
        <p>Encontre a oportunidade ideal para o seu perfil</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-md-3 col-sm-4">
          <div class="filter-sidebar">
            <h3>Filtrar Vagas</h3>
            <div class="form-group">
              <label>Palavra-chave</label>
              <input type="text" v-model="searchQuery" class="form-control" placeholder="Cargo ou tecnologia..." @keyup.enter="fetchJobs" />
            </div>
            <div class="form-group">
              <label>Localização</label>
              <input type="text" v-model="location" class="form-control" placeholder="Cidade ou Estado..." @keyup.enter="fetchJobs" />
            </div>
            <div class="form-group">
              <label>Tipo de Contrato</label>
              <select v-model="contractType" class="form-control" @change="fetchJobs">
                <option value="">Todos os Tipos</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="ESTAGIO">Estágio</option>
                <option value="REMOTO">Remoto</option>
              </select>
            </div>
            <button class="btn btn-primary btn-block" @click="fetchJobs">Aplicar Filtros</button>
          </div>
        </div>

        <!-- Jobs Main List -->
        <div class="col-md-9 col-sm-8 position-relative">
          <LoadingOverlay :loading="loading" />

          <div v-if="!loading && jobs.length === 0" class="alert alert-info text-center">
            Nenhuma vaga encontrada com os filtros selecionados.
          </div>

          <div v-else class="jobs-container">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
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
import { useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import JobCard from '../components/JobCard.vue';
import Pagination from '../components/Pagination.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { jobsService } from '../services/jobs';

const route = useRoute();

const searchQuery = ref((route.query.q as string) || '');
const location = ref((route.query.location as string) || '');
const contractType = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const jobs = ref<any[]>([]);
const loading = ref(false);

async function fetchJobs() {
  loading.value = true;
  try {
    const response = await jobsService.getPaginated({
      page: currentPage.value,
      limit: 10,
      q: searchQuery.value,
      location: location.value,
      contract_type: contractType.value
    });
    if (response.data) {
      jobs.value = response.data.jobs || response.data.rows || response.data || [];
      totalPages.value = response.data.totalPages || 1;
    }
  } catch (err) {
    console.error('Erro ao buscar vagas:', err);
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchJobs();
}

onMounted(() => {
  fetchJobs();
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
.filter-sidebar h3 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
