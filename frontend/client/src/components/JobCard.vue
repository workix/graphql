<template>
  <div class="job-card">
    <div class="row align-items-center">
      <div class="col-md-2 col-sm-3 text-center">
        <div class="company-logo">
          <img :src="job.company_logo || defaultLogo" :alt="job.company_name || 'Empresa'" />
        </div>
      </div>
      <div class="col-md-7 col-sm-6">
        <h4 class="job-title">
          <router-link :to="`/jobs/${job.id}`">{{ job.title }}</router-link>
          <span v-if="job.is_featured" class="label label-warning margin-left">Destaque</span>
        </h4>
        <div class="job-meta">
          <span class="company-name"><i class="fa fa-building-o"></i> {{ job.company_name || 'Empresa Parceira' }}</span>
          <span class="job-location"><i class="fa fa-map-marker"></i> {{ job.city || 'São Paulo' }}, {{ job.state || 'SP' }}</span>
          <span class="job-type label label-info">{{ job.contract_type || 'CLT' }}</span>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 text-right">
        <router-link :to="`/jobs/${job.id}`" class="btn btn-default btn-sm">Ver Detalhes</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultLogo from '../assets/images/empty.png';

interface Job {
  id: number;
  title: string;
  company_name?: string;
  company_logo?: string;
  city?: string;
  state?: string;
  contract_type?: string;
  is_featured?: boolean;
}

defineProps<{
  job: Job;
}>();
</script>

<style scoped>
.job-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.2s ease-in-out;
}
.job-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #cbd5e1;
}
.company-logo img {
  max-width: 60px;
  max-height: 60px;
  border-radius: 4px;
}
.job-title {
  margin-top: 0;
  font-size: 18px;
}
.job-title a {
  color: #1e293b;
  text-decoration: none;
}
.job-title a:hover {
  color: #0284c7;
}
.job-meta {
  color: #64748b;
  font-size: 14px;
}
.job-meta span {
  margin-right: 15px;
}
</style>
