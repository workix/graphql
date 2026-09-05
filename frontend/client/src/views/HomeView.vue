<template>
  <div class="page-wrapper">
    <TheHeader />

    <!-- Hero Section -->
    <section class="hero-section text-center">
      <div class="container">
        <h1>Encontre o Emprego dos Seus Sonhos</h1>
        <p class="hero-subtitle">Milhares de vagas de tecnologia, engenharia e negócios esperando por você.</p>

        <form @submit.prevent="handleSearch" class="search-form">
          <div class="row">
            <div class="col-md-5 col-sm-4">
              <input type="text" v-model="searchQuery" class="form-control input-lg" placeholder="Título da vaga, tecnologia ou palavra-chave..." />
            </div>
            <div class="col-md-4 col-sm-4">
              <input type="text" v-model="searchLocation" class="form-control input-lg" placeholder="Cidade ou Estado..." />
            </div>
            <div class="col-md-3 col-sm-4">
              <button type="submit" class="btn btn-primary btn-lg btn-block">
                <i class="fa fa-search"></i> Buscar Vagas
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Counter Statistics -->
    <section class="stats-section">
      <div class="container text-center">
        <div class="row">
          <div class="col-md-4 col-sm-4">
            <div class="stat-box">
              <i class="fa fa-briefcase fa-3x text-primary"></i>
              <h2>{{ stats.jobsCount || 120 }}</h2>
              <p>Vagas Ativas</p>
            </div>
          </div>
          <div class="col-md-4 col-sm-4">
            <div class="stat-box">
              <i class="fa fa-building fa-3x text-primary"></i>
              <h2>{{ stats.companiesCount || 45 }}</h2>
              <p>Empresas Cadastradas</p>
            </div>
          </div>
          <div class="col-md-4 col-sm-4">
            <div class="stat-box">
              <i class="fa fa-users fa-3x text-primary"></i>
              <h2>{{ stats.candidatesCount || 890 }}</h2>
              <p>Talentos Cadastrados</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorias de Vagas em Destaque -->
    <section class="categories-section section-padding">
      <div class="container">
        <div class="section-title text-center">
          <h2>Navegue por Categorias de Vagas</h2>
          <p>Explore oportunidades segmentadas e encontre a vaga que combina com a sua rotina</p>
        </div>

        <div class="row">
          <div v-for="cat in categoryCards" :key="cat.code" class="col-md-3 col-sm-6 col-xs-12 mb-4">
            <div class="category-card" @click="navigateToCategory(cat.code)">
              <div class="cat-icon-box" :style="{ backgroundColor: cat.bg }">
                <i :class="['fa', cat.icon]" :style="{ color: cat.color }"></i>
              </div>
              <h4>{{ cat.title }}</h4>
              <p>{{ cat.desc }}</p>
              <span class="cat-link">Ver Vagas <i class="fa fa-arrow-right"></i></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Jobs Section -->
    <section class="featured-jobs-section section-padding">
      <div class="container">
        <div class="section-title text-center">
          <h2>Vagas em Destaque</h2>
          <p>Confira as oportunidades mais recentes publicadas por empresas parceiras</p>
        </div>

        <LoadingOverlay :loading="loading" />

        <div v-if="!loading && featuredJobs.length === 0" class="alert alert-info text-center">
          Nenhuma vaga em destaque encontrada no momento.
        </div>

        <div v-else class="jobs-list">
          <JobCard v-for="job in featuredJobs" :key="job.id" :job="job" />
        </div>

        <div class="text-center mt-4">
          <router-link to="/jobs" class="btn btn-default btn-lg">Ver Todas as Vagas</router-link>
        </div>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import JobCard from '../components/JobCard.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { jobsService } from '../services/jobs';
import graphqlClient from '../services/graphql';

const searchQuery = ref('');
const searchLocation = ref('');
const featuredJobs = ref<any[]>([]);
const stats = ref<any>({
  jobsCount: 0,
  companiesCount: 0,
  candidatesCount: 0
});
const loading = ref(false);

const categoryCards = [
  { code: 'ESTAGIO', title: 'Estágio', desc: 'Inicie sua carreira com bolsas e aprendizado prático', icon: 'fa-id-badge', bg: '#eff6ff', color: '#2563eb' },
  { code: 'MEIO_PERIODO', title: 'Meio Período', desc: 'Jornadas flexíveis para conciliar com estudos', icon: 'fa-clock-o', bg: '#f0fdf4', color: '#16a34a' },
  { code: 'PRIMEIRA_OPORTUNIDADE', title: 'Primeira Oportunidade', desc: 'Vagas para quem está buscando o primeiro emprego', icon: 'fa-graduation-cap', bg: '#fef3c7', color: '#d97706' },
  { code: 'NOTURNO', title: 'Noturno', desc: 'Oportunidades em turnos noturnos e adicionais', icon: 'fa-moon-o', bg: '#ede9fe', color: '#7c3aed' },
  { code: 'TEMPORARIO', title: 'Temporário', desc: 'Contratos por prazo determinado e sazonais', icon: 'fa-calendar', bg: '#fee2e2', color: '#dc2626' },
  { code: 'FREELANCE', title: 'Freelance', desc: 'Projetos sob demanda com autonomia total', icon: 'fa-laptop', bg: '#e0f2fe', color: '#0284c7' },
  { code: 'PERICULOSIDADE', title: 'Com Periculosidade', desc: 'Vagas com adicional de periculosidade assegurado', icon: 'fa-bolt', bg: '#fef9c3', color: '#ca8a04' }
];

function navigateToCategory(categoryCode: string) {
  router.push({
    path: '/jobs',
    query: { category: categoryCode }
  });
}

function handleSearch() {
  router.push({
    path: '/jobs',
    query: { q: searchQuery.value, location: searchLocation.value }
  });
}

async function loadData() {
  loading.value = true;
  try {
    const jobsPromise = jobsService.getFeatured(6).catch(() => ({ data: [] }));
    const statsQuery = `
      query StatisticsCount {
        statisticsCount {
          members
          jobs
          resumes
          companies
        }
      }
    `;
    const statsPromise = graphqlClient.request<any>(statsQuery).catch(() => ({ statisticsCount: {} }));

    const [jobsRes, statsRes] = await Promise.all([jobsPromise, statsPromise]);
    featuredJobs.value = jobsRes.data || [];
    
    if (statsRes?.statisticsCount) {
      stats.value = {
        jobsCount: statsRes.statisticsCount.jobs || 0,
        companiesCount: statsRes.statisticsCount.companies || 0,
        candidatesCount: statsRes.statisticsCount.resumes || statsRes.statisticsCount.members || 0
      };
    }
  } catch (err) {
    console.error('Erro ao carregar dados da Home via GraphQL:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 80px 0;
  border-bottom: 1px solid #334155;
}
.hero-section h1 {
  font-size: 38px;
  font-weight: 700;
  color: #ffffff !important;
  margin-bottom: 15px;
  text-transform: none;
}
.hero-subtitle {
  font-size: 18px;
  color: #e2e8f0 !important;
  margin-bottom: 40px;
}
.search-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.search-form .form-control {
  color: #0f172a !important;
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1;
  font-weight: 500;
}
.search-form .form-control::placeholder {
  color: #94a3b8 !important;
}
.stats-section {
  background: #f8fafc;
  padding: 40px 0;
  border-bottom: 1px solid #e2e8f0;
}
.stat-box h2 {
  font-size: 36px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 5px;
}
.stat-box p {
  color: #64748b;
  font-size: 16px;
}
.section-padding {
  padding: 60px 0;
}
.section-title h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}
.section-title p {
  color: #64748b;
  margin-bottom: 40px;
}

.categories-section {
  background: #ffffff;
}

.category-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border-color: #38bdf8;
}

.cat-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.category-card h4 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.category-card p {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
  flex-grow: 1;
}

.cat-link {
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-card:hover .cat-link {
  color: #0369a1;
}
</style>
