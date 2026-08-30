<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Buscar Vagas de Emprego</h1>
        <p>Encontre a oportunidade ideal para o seu perfil profissional</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-md-4 col-sm-5">
          <div class="filter-sidebar">
            <div class="filter-header">
              <h3><i class="fa fa-sliders"></i> Filtrar Vagas</h3>
              <button v-if="hasActiveFilters" class="btn-clear" @click="clearFilters">
                <i class="fa fa-times"></i> Limpar
              </button>
            </div>

            <!-- Palavra Chave -->
            <div class="filter-group">
              <label class="filter-label">Palavra-chave</label>
              <div class="input-icon-wrap">
                <i class="fa fa-search"></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="custom-form-control"
                  placeholder="Cargo, tecnologia ou empresa..."
                />
              </div>
            </div>

            <!-- Localização -->
            <div class="filter-group">
              <label class="filter-label">Localização</label>
              <div class="input-icon-wrap">
                <i class="fa fa-map-marker"></i>
                <input
                  type="text"
                  v-model="location"
                  class="custom-form-control"
                  placeholder="Cidade ou Estado..."
                />
              </div>
            </div>

            <!-- Tipo de Contrato -->
            <div class="filter-group">
              <label class="filter-label">Tipo de Contrato</label>
              <div class="input-icon-wrap">
                <i class="fa fa-briefcase"></i>
                <select v-model="contractType" class="custom-form-control custom-select">
                  <option value="">Todos os Tipos</option>
                  <option value="FULLTIME">Tempo Integral (Full-time)</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="PARTTIME">Meio Período (Part-time)</option>
                  <option value="INTERNSHIP">Estágio</option>
                  <option value="TEMPORARY">Temporário</option>
                  <option value="VOLUNTEER">Voluntário</option>
                </select>
              </div>
            </div>

            <!-- Categoria -->
            <div class="filter-group">
              <label class="filter-label">Categoria</label>
              <div class="input-icon-wrap">
                <i class="fa fa-tags"></i>
                <select v-model="category" class="custom-form-control custom-select">
                  <option value="">Todas as Categorias</option>
                  <option value="MANAGEMENT">Gestão & Engenharia (MANAGEMENT)</option>
                  <option value="OPERATOR">Operacional & Técnico (OPERATOR)</option>
                </select>
              </div>
            </div>

            <div class="filter-stats">
              <span>{{ filteredJobs.length }} vaga(s) encontrada(s)</span>
            </div>
          </div>
        </div>

        <!-- Jobs Main List -->
        <div class="col-md-8 col-sm-7 position-relative">
          <LoadingOverlay :loading="loading" />

          <div v-if="!loading && paginatedJobs.length === 0" class="empty-state-box text-center">
            <div class="empty-icon"><i class="fa fa-folder-open-o"></i></div>
            <h4>Nenhuma vaga encontrada</h4>
            <p>Tente ajustar os termos da busca ou limpar os filtros aplicados.</p>
            <button class="btn-reset" @click="clearFilters">Limpar Todos os Filtros</button>
          </div>

          <div v-else class="jobs-container">
            <JobCard v-for="job in paginatedJobs" :key="job.id" :job="job" />
            <Pagination
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
const category = ref('');
const currentPage = ref(1);
const pageSize = 10;
const allJobsList = ref<any[]>([]);
const loading = ref(false);

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || location.value || contractType.value || category.value);
});

const filteredJobs = computed(() => {
  return allJobsList.value.filter((job) => {
    // 1. Filtro de Palavra-chave (Título, Descrição, Requisitos, Nome da Empresa)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const titleMatch = (job.title || '').toLowerCase().includes(q);
      const descMatch = (job.description || '').toLowerCase().includes(q);
      const reqMatch = (job.requirement || '').toLowerCase().includes(q);
      const compMatch = (job.company?.name || job.company_name || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !reqMatch && !compMatch) {
        return false;
      }
    }

    // 2. Filtro de Localização (Cidade ou Estado)
    if (location.value.trim()) {
      const loc = location.value.toLowerCase().trim();
      const cityMatch = (job.city || '').toLowerCase().includes(loc);
      const stateMatch = (job.state || '').toLowerCase().includes(loc);
      const defaultMatch = 'são paulo sp brasil'.includes(loc);
      if (!cityMatch && !stateMatch && !defaultMatch) {
        return false;
      }
    }

    // 3. Filtro de Tipo de Contrato (Enum GraphQL)
    if (contractType.value) {
      const jType = (job.jobType || job.contract_type || '').toUpperCase();
      if (jType !== contractType.value.toUpperCase()) {
        return false;
      }
    }

    // 4. Filtro de Categoria (Enum GraphQL)
    if (category.value) {
      const jCat = (job.jobCategory || '').toUpperCase();
      if (jCat !== category.value.toUpperCase()) {
        return false;
      }
    }

    return true;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredJobs.value.length / pageSize));
});

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredJobs.value.slice(start, start + pageSize);
});

function clearFilters() {
  searchQuery.value = '';
  location.value = '';
  contractType.value = '';
  category.value = '';
  currentPage.value = 1;
}

async function fetchJobs() {
  loading.value = true;
  try {
    const res = await jobsService.getAll();
    allJobsList.value = res.data || [];
  } catch (err) {
    console.error('Erro ao buscar lista de vagas via GraphQL:', err);
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 45px 0;
  border-bottom: 1px solid #334155;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.page-header p {
  color: #cbd5e1;
  font-size: 16px;
  margin: 0;
}

.section-padding {
  padding: 40px 0 60px 0;
}

.filter-sidebar {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 25px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.filter-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-clear {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-clear:hover {
  background: #fef2f2;
}

.filter-group {
  margin-bottom: 18px;
}

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-wrap i {
  position: absolute;
  left: 12px;
  color: #0284c7;
  font-size: 14px;
  pointer-events: none;
}

.custom-form-control {
  width: 100%;
  height: 42px;
  padding: 8px 12px 8px 36px;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a !important;
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
}

.custom-form-control::placeholder {
  color: #94a3b8 !important;
  opacity: 1;
}

.custom-form-control:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.custom-select {
  cursor: pointer;
  appearance: auto;
}

.filter-stats {
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.empty-state-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 50px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 15px;
}

.empty-state-box h4 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.btn-reset {
  margin-top: 15px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-reset:hover {
  background: #0369a1;
}
</style>
