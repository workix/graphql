<template>
  <div class="candidate-card">
    <div class="row align-items-center">
      <div class="col-md-2 col-sm-3 text-center">
        <div class="candidate-avatar">
          <img :src="candidate.avatar || defaultAvatar" :alt="candidate.name" />
        </div>
      </div>
      <div class="col-md-7 col-sm-6">
        <h4 class="candidate-name">
          <router-link :to="`/candidates/${candidate.id}`">{{ candidate.candidate?.name || candidate.name || 'Candidato' }}</router-link>
        </h4>
        <p class="candidate-headline">{{ candidate.objective || candidate.carrerLevel || candidate.title || 'Profissional Qualificado' }}</p>
        <div class="candidate-meta">
          <span><i class="fa fa-map-marker"></i> {{ candidate.candidate?.locale?.city || candidate.city || 'Brasil' }}</span>
          <span v-if="candidate.carrerLevel" class="label label-info">{{ candidate.carrerLevel }}</span>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 text-right">
        <router-link :to="`/candidates/${candidate.id}`" class="btn btn-primary btn-sm">Ver Currículo</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from '../assets/images/empty.png';

interface Candidate {
  id: string | number;
  name?: string;
  title?: string;
  avatar?: string;
  city?: string;
  carrerLevel?: string;
  objective?: string;
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
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 15px;
}
.candidate-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.candidate-name {
  margin-top: 0;
  font-size: 18px;
}
.candidate-headline {
  color: #475569;
  margin-bottom: 5px;
}
.candidate-meta {
  color: #94a3b8;
  font-size: 13px;
}
.candidate-meta span {
  margin-right: 15px;
}
</style>
