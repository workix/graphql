<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="job" class="job-detail-page">
      <!-- Top Banner -->
      <div class="job-header-banner">
        <div class="container">
          <div class="banner-content">
            <div class="banner-info">
              <div class="banner-title-row">
                <h1 class="job-detail-title">{{ job.title }}</h1>
                <span v-if="job.featured" class="badge-featured">DESTAQUE</span>
              </div>
              <div class="banner-meta">
                <span><i class="fa fa-building-o"></i> {{ job.company?.name || job.company_name || 'Tech Corp Brasil' }}</span>
                <span><i class="fa fa-map-marker"></i> {{ job.city || 'São Paulo, SP' }}</span>
                <span class="badge-type">{{ job.jobType || job.contract_type || 'FULLTIME' }}</span>
              </div>
            </div>

            <div class="banner-action">
              <button class="btn-apply" @click="handleApply" :disabled="submitting || applied">
                <span v-if="applied"><i class="fa fa-check"></i> Candidatura Enviada</span>
                <span v-else-if="submitting"><i class="fa fa-spinner fa-spin"></i> Enviando...</span>
                <span v-else><i class="fa fa-paper-plane"></i> Candidatar-se Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8">
            <div v-if="successMessage" class="alert alert-success"><i class="fa fa-check-circle"></i> {{ successMessage }}</div>
            <div v-if="errorMessage" class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> {{ errorMessage }}</div>

            <div class="content-box">
              <h3 class="section-heading">Descrição da Vaga</h3>
              <div class="job-description-text" v-html="job.description || '<p>Descrição detalhada da vaga de emprego.</p>'"></div>

              <h3 class="section-heading mt-4">Requisitos</h3>
              <p class="section-text">{{ job.requirement || job.requirements || 'Experiência relevante na área, proatividade e bom trabalho em equipe.' }}</p>

              <div v-if="job.benefits">
                <h3 class="section-heading mt-4">Benefícios</h3>
                <p class="section-text">{{ job.benefits }}</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="sidebar-box">
              <h4 class="sidebar-heading">Resumo da Oportunidade</h4>
              <ul class="job-overview-list">
                <li>
                  <span class="label-name"><i class="fa fa-tags"></i> Categoria</span>
                  <span class="label-value">{{ job.jobCategory || 'Tecnologia' }}</span>
                </li>
                <li>
                  <span class="label-name"><i class="fa fa-file-text-o"></i> Tipo de Contrato</span>
                  <span class="label-value">{{ job.jobType || job.contract_type || 'FULLTIME' }}</span>
                </li>
                <li>
                  <span class="label-name"><i class="fa fa-money"></i> Faixa Salarial</span>
                  <span class="label-value salary-highlight">
                    {{ job.minPayment && job.maxPayment ? `R$ ${Number(job.minPayment).toLocaleString('pt-BR')} - R$ ${Number(job.maxPayment).toLocaleString('pt-BR')}` : 'A combinar' }}
                  </span>
                </li>
                <li>
                  <span class="label-name"><i class="fa fa-calendar"></i> Publicado em</span>
                  <span class="label-value">{{ new Date(job.createdAt || job.created_at || Date.now()).toLocaleDateString('pt-BR') }}</span>
                </li>
              </ul>

              <div class="sidebar-apply-box mt-4">
                <button class="btn-apply-sidebar" @click="handleApply" :disabled="submitting || applied">
                  <span v-if="applied"><i class="fa fa-check"></i> Inscrito</span>
                  <span v-else><i class="fa fa-send"></i> Enviar Candidatura</span>
                </button>
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
import { useRoute, useRouter } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { jobsService } from '../services/jobs';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const job = ref<any>(null);
const loading = ref(false);
const submitting = ref(false);
const applied = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

async function loadJob() {
  loading.value = true;
  try {
    const jobId = route.params.id as string;
    const response = await jobsService.getById(jobId);
    job.value = response.data;
  } catch (err: any) {
    console.error('Erro ao carregar detalhes da vaga:', err);
    errorMessage.value = err.message || 'Erro ao carregar detalhes da vaga.';
  } finally {
    loading.value = false;
  }
}

async function handleApply() {
  submitting.value = true;
  errorMessage.value = '';
  try {
    const candidateId = authStore.user?.id || 1;
    await jobsService.subscribe(job.value.id, candidateId);
    applied.value = true;
    successMessage.value = 'Sua candidatura foi enviada com sucesso pelo GraphQL!';
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao enviar candidatura.';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadJob();
});
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.job-header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 50px 0;
  border-bottom: 1px solid #334155;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.banner-info {
  flex: 1;
}

.banner-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 12px;
}

.job-detail-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.badge-featured {
  background: #f97316;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.banner-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 15px;
  color: #cbd5e1;
}

.banner-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-meta i {
  color: #38bdf8;
}

.badge-type {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  font-weight: 600;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 6px;
}

.banner-action {
  flex-shrink: 0;
}

.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #10b981;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-apply:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
}

.btn-apply:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.section-padding {
  padding: 50px 0;
}

.content-box, .sidebar-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.section-heading {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
}

.section-text, .job-description-text {
  color: #475569;
  font-size: 15px;
  line-height: 1.7;
}

.sidebar-heading {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 20px;
}

.job-overview-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.job-overview-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.label-name {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-name i {
  color: #0284c7;
}

.label-value {
  font-weight: 600;
  color: #1e293b;
}

.salary-highlight {
  color: #047857;
  font-weight: 700;
}

.btn-apply-sidebar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0284c7;
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-apply-sidebar:hover:not(:disabled) {
  background: #0369a1;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .banner-action, .btn-apply {
    width: 100%;
    justify-content: center;
  }
}
</style>
