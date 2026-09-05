<template>
  <div class="job-card">
    <div class="job-card-main">
      <!-- Company Icon / Avatar -->
      <div class="company-icon-box">
        <i class="fa fa-briefcase"></i>
      </div>

      <!-- Job Info -->
      <div class="job-info">
        <div class="job-header">
          <h4 class="job-title">
            <router-link :to="`/jobs/${job.id}`">{{ job.title }}</router-link>
          </h4>
          <span v-if="job.featured || job.is_featured" class="badge-featured">DESTAQUE</span>
        </div>

        <div class="job-meta">
          <span class="meta-item">
            <i class="fa fa-building-o"></i>
            {{ job.company?.name || job.company_name || 'Tech Corp Brasil' }}
          </span>
          <span class="meta-item">
            <i class="fa fa-map-marker"></i>
            {{ job.city || 'São Paulo, SP' }}
          </span>
          <span class="meta-badge job-type">
            {{ job.employmentType || job.jobType || job.contract_type || 'CLT' }}
          </span>
          <span v-for="cat in (job.categories || [])" :key="cat" class="meta-badge category-badge">
            {{ formatCategory(cat) }}
          </span>
          <span v-if="job.minPayment || job.maxPayment" class="meta-badge salary">
            <i class="fa fa-money"></i>
            R$ {{ Number(job.minPayment || 0).toLocaleString('pt-BR') }} - R$ {{ Number(job.maxPayment || 0).toLocaleString('pt-BR') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="job-action">
      <router-link :to="`/jobs/${job.id}`" class="btn-view-job">
        Ver Detalhes <i class="fa fa-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Job {
  id: string | number;
  title: string;
  company_name?: string;
  company_logo?: string;
  city?: string;
  state?: string;
  contract_type?: string;
  jobType?: string;
  categories?: string[];
  employmentType?: string;
  minPayment?: number;
  maxPayment?: number;
  featured?: boolean;
  is_featured?: boolean;
  company?: {
    id?: string | number;
    name?: string;
    description?: string;
  };
}

defineProps<{
  job: Job;
}>();

const categoryLabels: Record<string, string> = {
  MEIO_PERIODO: 'Meio Período',
  PRIMEIRA_OPORTUNIDADE: 'Primeira Oportunidade',
  ESTAGIO: 'Estágio',
  NOTURNO: 'Noturno',
  TEMPORARIO: 'Temporário',
  FREELANCE: 'Freelance',
  PERICULOSIDADE: 'Com Periculosidade'
};

function formatCategory(cat: string): string {
  return categoryLabels[cat] || cat;
}
</script>

<style scoped>
.job-card {
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

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #38bdf8;
}

.job-card-main {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.company-icon-box {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
}

.job-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.job-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.job-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}

.job-title a {
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.job-title a:hover {
  color: #0284c7;
}

.badge-featured {
  background: #f97316;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 3px 9px;
  border-radius: 6px;
  text-transform: uppercase;
  display: inline-block;
  white-space: nowrap;
}

.job-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item i {
  color: #0284c7;
}

.meta-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.meta-badge.job-type {
  background: #e0f2fe;
  color: #0369a1;
}

.meta-badge.salary {
  background: #ecfdf5;
  color: #047857;
}

.job-action {
  flex-shrink: 0;
}

.btn-view-job {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0284c7;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-view-job:hover {
  background: #0369a1;
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

@media (max-width: 768px) {
  .job-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .job-action {
    width: 100%;
    margin-top: 10px;
  }
  .btn-view-job {
    width: 100%;
    justify-content: center;
  }
}
</style>
