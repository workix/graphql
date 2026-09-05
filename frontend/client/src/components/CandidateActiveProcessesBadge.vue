<template>
  <div class="active-processes-wrapper">
    <!-- Clickable Badge -->
    <button
      type="button"
      class="active-processes-badge"
      :class="{
        'is-active': summary?.hasActiveProcesses,
        'is-restricted': summary?.isRestricted,
        'is-compact': compact
      }"
      @click="openModal"
      :title="tooltipText"
    >
      <span class="badge-icon">
        <i v-if="summary?.isRestricted" class="fa fa-lock"></i>
        <i v-else-if="summary?.hasActiveProcesses" class="fa fa-bolt pulse"></i>
        <i v-else class="fa fa-briefcase"></i>
      </span>

      <span v-if="!compact" class="badge-text">
        <template v-if="summary?.isRestricted">
          Recurso Premium
        </template>
        <template v-else-if="summary?.hasActiveProcesses">
          <strong>{{ summary.totalCount }}</strong> {{ summary.totalCount === 1 ? 'Processo Ativo' : 'Processos Ativos' }}
        </template>
        <template v-else>
          Disponível no Mercado
        </template>
      </span>

      <span v-else class="badge-compact-count">
        {{ summary?.isRestricted ? '★' : summary?.totalCount || 0 }}
      </span>
    </button>

    <!-- Details Modal -->
    <CandidateActiveProcessesModal
      :is-open="isModalOpen"
      :candidate-id="candidateId"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { selectiveProcessesService, type CandidateActiveProcessesSummaryModel } from '../services/selectiveProcesses.service';
import CandidateActiveProcessesModal from './CandidateActiveProcessesModal.vue';

const props = withDefaults(defineProps<{
  candidateId: string | number;
  initialSummary?: CandidateActiveProcessesSummaryModel | null;
  compact?: boolean;
}>(), {
  initialSummary: null,
  compact: false
});

const isModalOpen = ref(false);
const summary = ref<CandidateActiveProcessesSummaryModel | null>(props.initialSummary);

const tooltipText = computed(() => {
  if (summary.value?.isRestricted) {
    return 'Recurso exclusivo para empresas assinantes do plano Premium';
  }
  if (summary.value?.hasActiveProcesses) {
    return `Este candidato está participando de ${summary.value.totalCount} processos seletivos ativos na plataforma. Clique para ver detalhes.`;
  }
  return 'Nenhum outro processo seletivo ativo no momento. Clique para detalhes.';
});

const fetchSummary = async () => {
  if (props.initialSummary) {
    summary.value = props.initialSummary;
    return;
  }
  if (!props.candidateId) return;

  try {
    const data = await selectiveProcessesService.getCandidateActiveProcessesSummary(props.candidateId);
    summary.value = data;
  } catch {
    summary.value = {
      hasActiveProcesses: false,
      totalCount: 0,
      isRestricted: true,
      restrictionReason: 'Exclusivo para assinantes Premium'
    };
  }
};

onMounted(() => {
  fetchSummary();
});

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped>
.active-processes-wrapper {
  display: inline-block;
}

.active-processes-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f1f5f9;
  color: #475569;
}

.active-processes-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.active-processes-badge.is-active {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1d4ed8;
  border-color: #93c5fd;
}

.active-processes-badge.is-active:hover {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-color: #60a5fa;
}

.active-processes-badge.is-restricted {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  color: #b45309;
  border-color: #fde68a;
}

.active-processes-badge.is-compact {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse {
  animation: pulseAnimation 2s infinite;
  color: #f59e0b;
}

@keyframes pulseAnimation {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
