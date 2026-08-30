<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Buscar Talentos e Currículos</h1>
        <p>Encontre os profissionais perfeitos para a sua empresa ou projeto</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-md-4 col-sm-5">
          <div class="filter-sidebar">
            <div class="filter-header">
              <h3><i class="fa fa-sliders"></i> Filtrar Talentos</h3>
              <button v-if="hasActiveFilters" class="btn-clear" @click="clearFilters">
                <i class="fa fa-times"></i> Limpar
              </button>
            </div>

            <!-- Palavra Chave / Nome / Cargo -->
            <div class="filter-group">
              <label class="filter-label">Busca por Nome ou Especialidade</label>
              <div class="input-icon-wrap">
                <i class="fa fa-search"></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="custom-form-control"
                  placeholder="Ex: Vue, Kotlin, Node, Frontend..."
                />
              </div>
            </div>

            <!-- Nível de Carreira -->
            <div class="filter-group">
              <label class="filter-label">Nível de Experiência</label>
              <div class="input-icon-wrap">
                <i class="fa fa-graduation-cap"></i>
                <select v-model="carrerLevel" class="custom-form-control custom-select">
                  <option value="">Todos os Níveis</option>
                  <option value="JUNIOR">Júnior (JUNIOR)</option>
                  <option value="MIDDLE">Pleno (MIDDLE)</option>
                  <option value="SENIOR">Sênior (SENIOR)</option>
                  <option value="EXPERT">Especialista (EXPERT)</option>
                </select>
              </div>
            </div>

            <!-- Modalidade / Presença -->
            <div class="filter-group">
              <label class="filter-label">Modalidade de Trabalho</label>
              <div class="input-icon-wrap">
                <i class="fa fa-laptop"></i>
                <select v-model="presence" class="custom-form-control custom-select">
                  <option value="">Todas as Modalidades</option>
                  <option value="REMOTE">Remoto (REMOTE)</option>
                  <option value="OFFICE">Presencial (OFFICE)</option>
                  <option value="RELOCATION">Disponível para Mudança</option>
                  <option value="TRAVEL_A_LOT">Viagens Frequentes</option>
                </select>
              </div>
            </div>

            <div class="filter-stats">
              <span>{{ filteredCandidates.length }} talento(s) encontrado(s)</span>
            </div>
          </div>
        </div>

        <!-- Candidates Main List -->
        <div class="col-md-8 col-sm-7 position-relative">
          <LoadingOverlay :loading="loading" />

          <div v-if="!loading && paginatedCandidates.length === 0" class="empty-state-box text-center">
            <div class="empty-icon"><i class="fa fa-user-times"></i></div>
            <h4>Nenhum candidato encontrado</h4>
            <p>Tente ajustar os termos da busca ou limpar os filtros aplicados.</p>
            <button class="btn-reset" @click="clearFilters">Limpar Todos os Filtros</button>
          </div>

          <div v-else class="candidates-container">
            <CandidateCard v-for="candidate in paginatedCandidates" :key="candidate.id" :candidate="candidate" />
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
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import CandidateCard from '../components/CandidateCard.vue';
import Pagination from '../components/Pagination.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { resumesService } from '../services/resumes';

const searchQuery = ref('');
const carrerLevel = ref('');
const presence = ref('');
const currentPage = ref(1);
const pageSize = 10;
const allCandidatesList = ref<any[]>([]);
const loading = ref(false);

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || carrerLevel.value || presence.value);
});

const filteredCandidates = computed(() => {
  return allCandidatesList.value.filter((cand) => {
    // 1. Filtro de Palavra-chave (Nome, Objetivo, Conteúdo, Skills)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const nameMatch = (cand.candidate?.name || cand.name || '').toLowerCase().includes(q);
      const objMatch = (cand.objective || '').toLowerCase().includes(q);
      const contentMatch = (cand.content || '').toLowerCase().includes(q);
      const skillMatch = (cand.skills || []).some((s: any) => (s.skillName || '').toLowerCase().includes(q));
      if (!nameMatch && !objMatch && !contentMatch && !skillMatch) {
        return false;
      }
    }

    // 2. Filtro de Nível de Experiência (Enum GraphQL)
    if (carrerLevel.value) {
      const level = (cand.carrerLevel || '').toUpperCase();
      if (level !== carrerLevel.value.toUpperCase()) {
        return false;
      }
    }

    // 3. Filtro de Presença / Modalidade (Enum GraphQL)
    if (presence.value) {
      const pres = (cand.presence || '').toUpperCase();
      if (pres !== presence.value.toUpperCase()) {
        return false;
      }
    }

    return true;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCandidates.value.length / pageSize));
});

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCandidates.value.slice(start, start + pageSize);
});

function clearFilters() {
  searchQuery.value = '';
  carrerLevel.value = '';
  presence.value = '';
  currentPage.value = 1;
}

async function fetchCandidates() {
  loading.value = true;
  try {
    const res = await resumesService.getAll();
    allCandidatesList.value = res.data || [];
  } catch (err) {
    console.error('Erro ao buscar talentos via GraphQL:', err);
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

onMounted(() => {
  fetchCandidates();
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
