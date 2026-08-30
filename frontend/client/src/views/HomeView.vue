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
import api from '../services/api';

const searchQuery = ref('');
const searchLocation = ref('');
const featuredJobs = ref<any[]>([]);
const stats = ref<any>({});
const loading = ref(false);

const router = useRouter();

function handleSearch() {
  router.push({
    path: '/jobs',
    query: { q: searchQuery.value, location: searchLocation.value }
  });
}

async function loadData() {
  loading.value = true;
  try {
    const [jobsRes, statsRes] = await Promise.all([
      api.get('/jobs/random_featured').catch(() => ({ data: [] })),
      api.get('/statistics').catch(() => ({ data: {} }))
    ]);
    featuredJobs.value = Array.isArray(jobsRes.data) ? jobsRes.data : [];
    stats.value = statsRes.data || {};
  } catch (err) {
    console.error('Erro ao carregar dados da Home:', err);
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
  color: #fff;
  padding: 80px 0;
}
.hero-section h1 {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 15px;
}
.hero-subtitle {
  font-size: 18px;
  color: #cbd5e1;
  margin-bottom: 40px;
}
.search-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
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
</style>
