<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-header">
        <div class="header-title-wrapper">
          <div class="icon-circle">
            <i class="fa fa-briefcase"></i>
          </div>
          <div>
            <h3>Processos Seletivos Ativos do Candidato</h3>
            <p class="subtitle">Visibilidade de mercado e concorrência exclusiva para empresas Premium</p>
          </div>
        </div>
        <button class="btn-close" @click="close" aria-label="Fechar modal">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Loading State -->
        <div v-if="loading" class="state-container loading-state">
          <i class="fa fa-spinner fa-spin fa-2x"></i>
          <p>Consultando processos seletivos em andamento...</p>
        </div>

        <!-- Restricted State (Non-Premium / Privacy) -->
        <div v-else-if="response?.isRestricted" class="state-container restricted-card">
          <div class="restricted-icon">
            <i class="fa fa-lock fa-3x"></i>
          </div>
          <h4>Informação Exclusiva do Plano Premium</h4>
          <p class="restricted-text">
            {{ response.restrictionReason || 'Assine o plano Premium Corporativo para ter visibilidade se o candidato está participando de outros processos e acelerar sua contratação.' }}
          </p>
          <div class="premium-benefits">
            <div class="benefit-item">
              <i class="fa fa-check-circle"></i>
              <span>Veja a quantidade exata de processos concorrentes</span>
            </div>
            <div class="benefit-item">
              <i class="fa fa-check-circle"></i>
              <span>Acompanhe o estágio atual (Triagem, Entrevista, Proposta)</span>
            </div>
            <div class="benefit-item">
              <i class="fa fa-check-circle"></i>
              <span>Priorize candidatos com alto risco de fechamento rápido</span>
            </div>
          </div>
          <router-link to="/premium" class="btn-upgrade">
            <i class="fa fa-diamond"></i> Conhecer Planos Premium
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else-if="!response?.processes || response.processes.length === 0" class="state-container empty-card">
          <div class="empty-icon">
            <i class="fa fa-check-circle-o fa-3x"></i>
          </div>
          <h4>Nenhum outro processo seletivo ativo no momento</h4>
          <p>Este candidato não possui outras candidaturas ativas registradas na Workix recentemente.</p>
        </div>

        <!-- Active Processes List -->
        <div v-else class="processes-list-container">
          <div class="summary-banner">
            <div class="summary-badge">
              <i class="fa fa-bolt"></i>
              <span><strong>{{ response.totalCount }}</strong> {{ response.totalCount === 1 ? 'processo seletivo ativo' : 'processos seletivos ativos' }} na plataforma</span>
            </div>
            <span class="privacy-note">
              <i class="fa fa-shield"></i> Dados compartilhados com consentimento
            </span>
          </div>

          <div class="processes-grid">
            <div v-for="proc in response.processes" :key="proc.id" class="process-card">
              <div class="process-card-header">
                <div class="company-brand">
                  <div v-if="proc.isConfidential" class="confidential-avatar">
                    <i class="fa fa-user-secret"></i>
                  </div>
                  <img v-else-if="proc.companyLogo" :src="proc.companyLogo" :alt="proc.companyName || 'Empresa'" class="company-logo" />
                  <div v-else class="company-avatar-placeholder">
                    <i class="fa fa-building"></i>
                  </div>
                  <div class="company-info">
                    <h5 class="job-title">{{ proc.jobTitle || 'Vaga em Recrutamento' }}</h5>
                    <span class="company-name" :class="{ 'is-confidential': proc.isConfidential }">
                      <i v-if="proc.isConfidential" class="fa fa-lock"></i>
                      {{ proc.companyName || 'Empresa Parceira' }}
                    </span>
                  </div>
                </div>
                <div class="stage-tag" :class="getStageClass(proc.currentStage || proc.status)">
                  <i class="fa fa-circle"></i> {{ proc.currentStage || proc.status || 'Em Análise' }}
                </div>
              </div>

              <div class="process-card-meta">
                <span class="meta-date">
                  <i class="fa fa-calendar"></i> Inscrição: {{ formatDate(proc.subscribedAt) }}
                </span>
                <span v-if="proc.updatedAt" class="meta-date">
                  <i class="fa fa-clock-o"></i> Atualizado: {{ formatDate(proc.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="close">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { selectiveProcessesService, type CandidateActiveProcessesResponse } from '../services/selectiveProcesses.service';

const props = defineProps<{
  isOpen: boolean;
  candidateId: string | number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const loading = ref(false);
const response = ref<CandidateActiveProcessesResponse | null>(null);

const fetchActiveProcesses = async () => {
  if (!props.candidateId) return;
  loading.value = true;
  try {
    const data = await selectiveProcessesService.getCandidateActiveProcesses(props.candidateId);
    response.value = data;
  } catch {
    response.value = {
      candidateId: props.candidateId,
      hasActiveProcesses: false,
      totalCount: 0,
      isRestricted: true,
      processes: []
    };
  } finally {
    loading.value = false;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    fetchActiveProcesses();
  }
}, { immediate: true });

onMounted(() => {
  if (props.isOpen) {
    fetchActiveProcesses();
  }
});

const close = () => {
  emit('close');
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Recente';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recente' : d.toLocaleDateString('pt-BR');
  } catch {
    return 'Recente';
  }
};

const getStageClass = (stage?: string | null) => {
  if (!stage) return 'stage-default';
  const lower = stage.toLowerCase();
  if (lower.includes('proposta') || lower.includes('offer')) return 'stage-offer';
  if (lower.includes('entrevista') || lower.includes('interview')) return 'stage-interview';
  if (lower.includes('teste') || lower.includes('technical')) return 'stage-test';
  return 'stage-screening';
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-close:hover {
  color: #0f172a;
  background: #e2e8f0;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
}

.loading-state i {
  color: #4f46e5;
  margin-bottom: 1rem;
}

.restricted-card {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}

.restricted-icon {
  color: #f59e0b;
  margin-bottom: 1rem;
}

.restricted-card h4 {
  margin: 0 0 0.5rem;
  color: #1e293b;
  font-weight: 700;
}

.restricted-text {
  color: #64748b;
  font-size: 0.9rem;
  max-width: 460px;
  margin-bottom: 1.25rem;
}

.premium-benefits {
  text-align: left;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.85rem;
}

.benefit-item i {
  color: #10b981;
}

.btn-upgrade {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-upgrade:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.empty-card {
  background: #f8fafc;
  border-radius: 12px;
}

.empty-icon {
  color: #10b981;
  margin-bottom: 1rem;
}

.summary-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 0.75rem 1rem;
  border-radius: 10px;
}

.summary-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1d4ed8;
  font-size: 0.9rem;
}

.privacy-note {
  font-size: 0.75rem;
  color: #64748b;
}

.processes-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.process-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: #ffffff;
  transition: all 0.2s;
}

.process-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.process-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.company-avatar-placeholder, .confidential-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.confidential-avatar {
  background: #fef3c7;
  color: #b45309;
}

.company-info {
  display: flex;
  flex-direction: column;
}

.job-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.company-name {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.15rem;
}

.company-name.is-confidential {
  color: #b45309;
  font-style: italic;
}

.stage-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stage-tag i {
  font-size: 0.45rem;
}

.stage-screening {
  background: #f1f5f9;
  color: #475569;
}

.stage-interview {
  background: #e0e7ff;
  color: #4338ca;
}

.stage-test {
  background: #fef3c7;
  color: #b45309;
}

.stage-offer {
  background: #d1fae5;
  color: #065f46;
}

.process-card-meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.75rem;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.6rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f1f5f9;
  color: #0f172a;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
