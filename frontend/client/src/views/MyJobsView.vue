<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Minhas Vagas Publicadas</h1>
        <p>Gerencie suas oportunidades ativas e visualize os candidatos inscritos</p>
      </div>
    </div>

    <div class="container section-padding">
      <LoadingOverlay :loading="loading" />

      <div class="my-jobs-header-row mb-4">
        <div>
          <h2><i class="fa fa-briefcase"></i> Vagas da Empresa ({{ myJobs.length }})</h2>
          <p class="text-muted">Acompanhe as inscrições recebidas e o status de cada processo</p>
        </div>
        <router-link to="/post-job" class="btn btn-primary btn-lg">
          <i class="fa fa-plus-circle"></i> Publicar Nova Vaga
        </router-link>
      </div>

      <div v-if="!loading && myJobs.length === 0" class="empty-state-box text-center">
        <div class="empty-icon"><i class="fa fa-folder-open-o"></i></div>
        <h3>Nenhuma vaga cadastrada pela sua empresa</h3>
        <p>Comece publicando uma nova vaga para atrair os melhores talentos da plataforma.</p>
        <router-link to="/post-job" class="btn btn-primary btn-lg mt-3">
          <i class="fa fa-plus"></i> Publicar Primeira Vaga
        </router-link>
      </div>

      <div v-else class="jobs-list-container">
        <div v-for="job in myJobs" :key="job.id" class="job-manage-card">
          <div class="job-manage-header">
            <div class="job-manage-title-box">
              <router-link :to="`/jobs/${job.id}`" class="job-manage-title">
                {{ job.title }}
              </router-link>
              <div class="job-manage-meta">
                <span class="badge-type">{{ job.jobType || 'FULLTIME' }}</span>
                <span class="badge-cat">{{ job.jobCategory || 'MANAGEMENT' }}</span>
                <span class="salary-tag" v-if="job.minPayment">
                  R$ {{ job.minPayment.toLocaleString('pt-BR') }} - R$ {{ job.maxPayment.toLocaleString('pt-BR') }}
                </span>
                <span class="date-tag">
                  <i class="fa fa-calendar"></i> {{ new Date(job.createdAt || Date.now()).toLocaleDateString('pt-BR') }}
                </span>
              </div>
            </div>

            <div class="job-manage-actions">
              <router-link :to="`/jobs/${job.id}`" class="btn-action-view">
                <i class="fa fa-eye"></i> Ver no Portal
              </router-link>
            </div>
          </div>

          <!-- Candidates Subscribed Accordion / Box -->
          <div class="candidates-subscribed-box">
            <div class="cand-box-header">
              <h4>
                <i class="fa fa-users"></i> Candidatos Inscritos
                <span class="cand-count-badge">{{ (job.candidates || []).length }}</span>
              </h4>
            </div>

            <div v-if="!job.candidates || job.candidates.length === 0" class="cand-empty">
              <span>Nenhum candidato inscrito até o momento.</span>
            </div>

            <div v-else class="cand-grid">
              <div v-for="cand in job.candidates" :key="cand.id" class="cand-mini-card">
                <div class="cand-mini-avatar">
                  <i class="fa fa-user"></i>
                </div>
                <div class="cand-mini-info">
                  <strong>{{ cand.name || 'Candidato Workix' }}</strong>
                  <span class="cand-mini-locale" v-if="cand.locale?.city">
                    <i class="fa fa-map-marker"></i> {{ cand.locale.city }}, {{ cand.locale.state }}
                  </span>
                </div>
                <router-link :to="`/candidates/${cand.id}`" class="btn-view-cand">
                  Ver Perfil
                </router-link>
              </div>
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

const myJobs = ref<any[]>([]);
const loading = ref(false);

async function loadMyJobs() {
  loading.value = true;
  try {
    const res = await jobsService.getAll();
    myJobs.value = res.data || [];
  } catch (err) {
    console.error('Erro ao carregar vagas da empresa:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMyJobs();
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

.my-jobs-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.my-jobs-header-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.jobs-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
}

.job-manage-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.job-manage-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f1f5f9;
}

.job-manage-title {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s;
}

.job-manage-title:hover {
  color: #0284c7;
}

.job-manage-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  font-size: 13px;
}

.badge-type {
  background: #e0f2fe;
  color: #0369a1;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11px;
}

.badge-cat {
  background: #f1f5f9;
  color: #475569;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
}

.salary-tag {
  font-weight: 700;
  color: #059669;
}

.date-tag {
  color: #94a3b8;
}

.btn-action-view {
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-action-view:hover {
  background: #0284c7;
  color: #ffffff !important;
}

.candidates-subscribed-box {
  margin-top: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.cand-box-header h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cand-count-badge {
  background: #0284c7;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
}

.cand-empty {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}

.cand-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cand-mini-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cand-mini-avatar {
  width: 32px;
  height: 32px;
  background: #e0f2fe;
  color: #0284c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.cand-mini-info {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.cand-mini-info strong {
  color: #0f172a;
}

.cand-mini-locale {
  font-size: 11px;
  color: #64748b;
}

.btn-view-cand {
  font-size: 12px;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-view-cand:hover {
  background: #0284c7;
  color: #ffffff;
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
</style>
