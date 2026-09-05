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

            <!-- Tipo de Contratação -->
            <div class="filter-group">
              <label class="filter-label">Tipo de Contratação</label>
              <div class="input-icon-wrap">
                <i class="fa fa-file-text-o"></i>
                <select v-model="employmentType" class="custom-form-control custom-select">
                  <option value="">Todos os Tipos</option>
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="CONTRATO_TEMPORARIO">Contrato Temporário</option>
                </select>
              </div>
            </div>

            <!-- Categorias de Vagas -->
            <div class="filter-group">
              <label class="filter-label">Categorias de Vagas</label>
              <div class="category-filter-list">
                <label v-for="cat in availableCategories" :key="cat.value" class="category-checkbox-item">
                  <input
                    type="checkbox"
                    :value="cat.value"
                    v-model="selectedCategories"
                  />
                  <span>{{ cat.label }}</span>
                </label>
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

          <!-- Chips de Filtros Ativos -->
          <div v-if="hasActiveFilters" class="active-filters-bar mb-4">
            <span class="active-label">Filtros Ativos:</span>
            <span v-if="searchQuery" class="filter-chip">
              Termo: "{{ searchQuery }}"
              <i class="fa fa-times" @click="searchQuery = ''"></i>
            </span>
            <span v-if="location" class="filter-chip">
              Local: "{{ location }}"
              <i class="fa fa-times" @click="location = ''"></i>
            </span>
            <span v-if="employmentType" class="filter-chip">
              Contratação: {{ employmentType }}
              <i class="fa fa-times" @click="employmentType = ''"></i>
            </span>
            <span
              v-for="cat in selectedCategories"
              :key="cat"
              class="filter-chip category-chip"
            >
              {{ getCategoryLabel(cat) }}
              <i class="fa fa-times" @click="removeCategory(cat)"></i>
            </span>
            <button class="btn-clear-all" @click="clearFilters">Limpar Tudo</button>
          </div>

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
import { ref, computed, onMounted, watch } from 'vue';
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
const employmentType = ref((route.query.employmentType as string) || '');
const selectedCategories = ref<string[]>(
  route.query.category ? [String(route.query.category)] :
  route.query.categories ? (Array.isArray(route.query.categories) ? route.query.categories as string[] : [String(route.query.categories)]) : []
);
const contractType = ref('');
const currentPage = ref(1);
const pageSize = 10;
const allJobsList = ref<any[]>([]);
const loading = ref(false);

const availableCategories = [
  { value: 'MEIO_PERIODO', label: 'Meio Período' },
  { value: 'PRIMEIRA_OPORTUNIDADE', label: 'Primeira Oportunidade' },
  { value: 'ESTAGIO', label: 'Estágio' },
  { value: 'NOTURNO', label: 'Noturno' },
  { value: 'TEMPORARIO', label: 'Emprego Temporário' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'PERICULOSIDADE', label: 'Com Periculosidade' }
];

function getCategoryLabel(catVal: string): string {
  const found = availableCategories.find(c => c.value === catVal);
  return found ? found.label : catVal;
}

function removeCategory(catVal: string) {
  selectedCategories.value = selectedCategories.value.filter(c => c !== catVal);
}

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || location.value || employmentType.value || selectedCategories.value.length > 0 || contractType.value);
});

const filteredJobs = computed(() => {
  return allJobsList.value.filter((job) => {
    // 1. Filtro de Palavra-chave
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

    // 2. Filtro de Localização
    if (location.value.trim()) {
      const loc = location.value.toLowerCase().trim();
      const cityMatch = (job.city || '').toLowerCase().includes(loc);
      const stateMatch = (job.state || '').toLowerCase().includes(loc);
      const defaultMatch = 'são paulo sp brasil'.includes(loc);
      if (!cityMatch && !stateMatch && !defaultMatch) {
        return false;
      }
    }

    // 3. Filtro de Tipo de Contratação
    if (employmentType.value) {
      const jEmpType = (job.employmentType || job.jobType || job.contract_type || 'CLT').toUpperCase();
      if (jEmpType !== employmentType.value.toUpperCase()) {
        return false;
      }
    }

    // 4. Filtro de Categorias (Multi-seleção combinada: AND)
    if (selectedCategories.value.length > 0) {
      let jobCats: string[] = [];
      if (Array.isArray(job.categories)) {
        jobCats = job.categories;
      } else if (typeof job.categories === 'string') {
        try {
          jobCats = JSON.parse(job.categories);
        } catch {
          jobCats = job.categories.split(',').map((s: string) => s.trim());
        }
      }
      const upperJobCats = jobCats.map((c: string) => c.toUpperCase());
      const allSelectedMatch = selectedCategories.value.every(cat => upperJobCats.includes(cat.toUpperCase()));
      if (!allSelectedMatch) {
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
  employmentType.value = '';
  selectedCategories.value = [];
  contractType.value = '';
  currentPage.value = 1;
}

watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    selectedCategories.value = [String(newQuery.category)];
  }
  if (newQuery.employmentType) {
    employmentType.value = String(newQuery.employmentType);
  }
});

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

.category-filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.category-checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  margin-bottom: 0;
}

.category-checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0284c7;
}

.active-filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.active-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #bae6fd;
}

.filter-chip i {
  cursor: pointer;
  font-size: 11px;
}

.filter-chip i:hover {
  color: #ef4444;
}

.category-chip {
  background: #f1f5f9;
  color: #334155;
  border-color: #cbd5e1;
}

.btn-clear-all {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0 4px;
}
</style>
