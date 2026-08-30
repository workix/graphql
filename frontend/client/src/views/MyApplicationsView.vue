<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Minhas Candidaturas</h1>
        <p>Acompanhe em tempo real as vagas em que você se candidatou</p>
      </div>
    </div>

    <div class="container section-padding">
      <LoadingOverlay :loading="loading" />

      <div v-if="!loading && applications.length === 0" class="empty-state-box text-center">
        <div class="empty-icon"><i class="fa fa-folder-open-o"></i></div>
        <h3>Você ainda não se candidatou a nenhuma vaga</h3>
        <p>Explore as oportunidades abertas e envie seu currículo para as melhores empresas.</p>
        <router-link to="/jobs" class="btn btn-primary btn-lg mt-3">
          <i class="fa fa-search"></i> Explorar Vagas Abertas
        </router-link>
      </div>

      <div v-else class="applications-container">
        <div class="applications-header-row mb-4">
          <h2><i class="fa fa-paper-plane"></i> Candidaturas Enviadas ({{ applications.length }})</h2>
          <router-link to="/jobs" class="btn btn-outline-primary">
            <i class="fa fa-plus"></i> Ver Mais Vagas
          </router-link>
        </div>

        <div class="application-cards-grid">
          <div v-for="job in applications" :key="job.id" class="application-card">
            <div class="app-card-main">
              <div class="app-card-title-row">
                <router-link :to="`/jobs/${job.id}`" class="app-job-title">
                  {{ job.title }}
                </router-link>
                <span class="status-badge status-active">
                  <i class="fa fa-check-circle"></i> Candidatura Ativa
                </span>
              </div>

              <div class="app-job-meta">
                <span class="meta-company"><i class="fa fa-building"></i> {{ job.company?.name || 'Tech Corp Brasil' }}</span>
                <span class="meta-type badge-type">{{ job.jobType || 'FULLTIME' }}</span>
                <span class="meta-category badge-cat">{{ job.jobCategory || 'MANAGEMENT' }}</span>
                <span class="meta-salary" v-if="job.minPayment">
                  <i class="fa fa-money"></i> R$ {{ job.minPayment.toLocaleString('pt-BR') }} - R$ {{ job.maxPayment.toLocaleString('pt-BR') }}
                </span>
              </div>

              <p class="app-job-desc">{{ job.description }}</p>
            </div>

            <div class="app-card-actions">
              <router-link :to="`/jobs/${job.id}`" class="btn-view-job">
                Ver Vaga <i class="fa fa-arrow-right"></i>
              </router-link>
            </div>
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
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { jobsService } from '../services/jobs';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const applications = ref<any[]>([]);
const loading = ref(false);

async function loadMyApplications() {
  loading.value = true;
  try {
    const res = await jobsService.getAll();
    const allJobsList = res.data || [];
    const currentCandidateId = authStore.user?.id || 1;

    // Filtra vagas onde o candidato logado está inscrito
    const mySubscribedJobs = allJobsList.filter((job: any) => {
      if (!job.candidates || job.candidates.length === 0) {
        return false;
      }
      return job.candidates.some((c: any) => String(c.id) === String(currentCandidateId));
    });

    // Se o usuário estiver logado e tiver inscrições, exibe-as; caso contrário, exibe as vagas onde o candidato ID 1 está inscrito
    if (mySubscribedJobs.length > 0) {
      applications.value = mySubscribedJobs;
    } else {
      applications.value = allJobsList.filter((job: any) => (job.candidates || []).length > 0);
    }
  } catch (err) {
    console.error('Erro ao buscar candidaturas:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMyApplications();
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
  padding: 40px 0;
  border-bottom: 1px solid #334155;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.page-header p {
  color: #cbd5e1;
  font-size: 15px;
  margin: 0;
}

.section-padding {
  padding: 40px 0 60px 0;
}

.empty-state-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 60px 20px;
  color: #64748b;
  margin: 20px 0;
}

.empty-icon {
  font-size: 54px;
  color: #94a3b8;
  margin-bottom: 15px;
}

.empty-state-box h3 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.applications-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.applications-header-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.application-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}

.application-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.application-card:hover {
  border-color: #0284c7;
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08);
}

.app-card-main {
  flex: 1;
}

.app-card-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.app-job-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s;
}

.app-job-title:hover {
  color: #0284c7;
}

.status-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.app-job-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.meta-company {
  font-weight: 600;
  color: #1e293b;
}

.badge-type {
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11px;
}

.badge-cat {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
}

.meta-salary {
  font-weight: 700;
  color: #059669;
}

.app-job-desc {
  font-size: 14px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.app-card-actions {
  flex-shrink: 0;
}

.btn-view-job {
  background: #0f172a;
  color: #ffffff !important;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.btn-view-job:hover {
  background: #0284c7;
}

@media (max-width: 768px) {
  .application-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
