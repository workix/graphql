<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="job" class="job-detail-page">
      <div class="job-header-banner">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2>{{ job.title }}</h2>
              <p class="company-sub"><i class="fa fa-building-o"></i> {{ job.company_name || 'Empresa Parceira' }} - {{ job.city || 'São Paulo' }}, {{ job.state || 'SP' }}</p>
            </div>
            <div class="col-md-4 text-right">
              <button class="btn btn-success btn-lg" @click="handleApply" :disabled="submitting || applied">
                <span v-if="applied"><i class="fa fa-check"></i> Candidatura Enviada</span>
                <span v-else-if="submitting"><i class="fa fa-spinner fa-spin"></i> Enviando...</span>
                <span v-else><i class="fa fa-paper-plane"></i> Candidatar-se Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8">
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            <div class="content-box">
              <h3>Descrição da Vaga</h3>
              <div class="job-description-text" v-html="job.description || '<p>Descrição detalhada da vaga de emprego.</p>'"></div>

              <h3 class="mt-4">Requisitos</h3>
              <p>{{ job.requirements || 'Experiência relevante na área, proatividade e bom trabalho em equipe.' }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="sidebar-box">
              <h4>Resumo da Vaga</h4>
              <ul class="job-overview-list">
                <li><strong>Tipo:</strong> {{ job.contract_type || 'CLT' }}</li>
                <li><strong>Salário:</strong> {{ job.salary ? `R$ ${job.salary}` : 'A combinar' }}</li>
                <li><strong>Publicado em:</strong> {{ new Date(job.created_at || Date.now()).toLocaleDateString() }}</li>
              </ul>
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
  } catch (err) {
    console.error('Erro ao carregar detalhes da vaga:', err);
  } finally {
    loading.value = false;
  }
}

async function handleApply() {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }

  submitting.value = true;
  errorMessage.value = '';
  try {
    await jobsService.subscribe(job.value.id);
    applied.value = true;
    successMessage.value = 'Sua candidatura foi enviada com sucesso!';
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erro ao enviar candidatura.';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadJob();
});
</script>

<style scoped>
.job-header-banner {
  background: #0f172a;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.content-box, .sidebar-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
}
.job-overview-list {
  list-style: none;
  padding: 0;
}
.job-overview-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}
</style>
