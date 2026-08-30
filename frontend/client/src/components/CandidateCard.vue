<template>
  <div class="candidate-card">
    <div class="candidate-card-main">
      <!-- Candidate Avatar -->
      <div class="candidate-avatar">
        <i class="fa fa-user-circle"></i>
      </div>

      <!-- Candidate Info -->
      <div class="candidate-info">
        <div class="candidate-header">
          <h4 class="candidate-name">
            <router-link :to="`/candidates/${candidate.id}`">
              {{ candidate.candidate?.name || candidate.name || 'Candidato Workix' }}
            </router-link>
          </h4>
          <span v-if="candidate.carrerLevel" class="badge-level">{{ candidate.carrerLevel }}</span>
        </div>

        <p class="candidate-headline">
          {{ candidate.objective || candidate.carrerLevel || candidate.title || 'Profissional de Tecnologia Qualificado' }}
        </p>

        <div class="candidate-meta">
          <span class="meta-item">
            <i class="fa fa-map-marker"></i>
            {{ candidate.candidate?.locale?.city || candidate.city || 'São Paulo, SP' }}
          </span>
          <span class="meta-badge presence">
            <i class="fa fa-laptop"></i>
            {{ candidate.presence || 'Remoto / Híbrido' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="candidate-action">
      <router-link :to="`/candidates/${candidate.id}`" class="btn-view-profile">
        Ver Currículo <i class="fa fa-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Candidate {
  id: string | number;
  name?: string;
  title?: string;
  avatar?: string;
  city?: string;
  carrerLevel?: string;
  objective?: string;
  presence?: string;
  candidate?: {
    name?: string;
    locale?: { city?: string; state?: string };
  };
}

defineProps<{
  candidate: Candidate;
}>();
</script>

<style scoped>
.candidate-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 22px 28px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease-in-out;
  width: 100%;
}

.candidate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #0284c7;
}

.candidate-card-main {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.candidate-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.25);
}

.candidate-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.candidate-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.candidate-name {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
}

.candidate-name a {
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.candidate-name a:hover {
  color: #0284c7;
}

.badge-level {
  background: #e0f2fe;
  color: #0369a1;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  text-transform: uppercase;
}

.candidate-headline {
  color: #475569;
  font-size: 14px;
  margin: 0;
}

.candidate-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item i {
  color: #0284c7;
}

.meta-badge.presence {
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.candidate-action {
  flex-shrink: 0;
}

.btn-view-profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-view-profile:hover {
  background: #0284c7;
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

@media (max-width: 768px) {
  .candidate-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .candidate-action {
    width: 100%;
    margin-top: 10px;
  }
  .btn-view-profile {
    width: 100%;
    justify-content: center;
  }
}
</style>
