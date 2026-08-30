<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="candidate" class="candidate-detail-page">
      <div class="candidate-header-banner">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2>{{ candidate.candidate?.name || candidate.name || 'Perfil do Candidato' }}</h2>
              <p class="headline"><i class="fa fa-briefcase"></i> {{ candidate.objective || 'Objetivo Profissional' }} - <span class="label label-info">{{ candidate.carrerLevel || 'Nível não informado' }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8">
            <div class="content-box">
              <h3>Objetivo & Resumo</h3>
              <p>{{ candidate.objective || candidate.content || 'Profissional qualificado com ampla experiência no setor.' }}</p>

              <div v-if="candidate.skills && candidate.skills.length > 0">
                <h3 class="mt-4">Competências & Habilidades</h3>
                <div class="skills-chips">
                  <span v-for="(skill, idx) in candidate.skills" :key="idx" class="badge badge-primary mr-2 mb-2">
                    {{ skill.skillName }} ({{ skill.months }} meses)
                  </span>
                </div>
              </div>

              <div v-if="candidate.experiences && candidate.experiences.length > 0">
                <h3 class="mt-4">Experiência Profissional</h3>
                <div v-for="(exp, idx) in candidate.experiences" :key="idx" class="mb-3">
                  <strong>{{ exp.jobTitle }}</strong> - {{ exp.employerName }}
                  <p class="text-muted">{{ exp.description }}</p>
                </div>
              </div>

              <div v-if="candidate.educations && candidate.educations.length > 0">
                <h3 class="mt-4">Formação Acadêmica</h3>
                <div v-for="(edu, idx) in candidate.educations" :key="idx" class="mb-3">
                  <strong>{{ edu.qualification }}</strong> - {{ edu.schoolName }}
                  <p class="text-muted">{{ edu.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="sidebar-box">
              <h4>Informações Gerais</h4>
              <ul class="contact-info-list">
                <li><i class="fa fa-map-marker"></i> {{ candidate.candidate?.locale?.city || 'São Paulo, SP' }}</li>
                <li><i class="fa fa-clock-o"></i> Preferência: {{ candidate.presence || 'REMOTE' }}</li>
                <li><i class="fa fa-calendar"></i> Cadastrado em: {{ new Date(candidate.createdAt || Date.now()).toLocaleDateString() }}</li>
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
import { useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { resumesService } from '../services/resumes';

const route = useRoute();
const candidate = ref<any>(null);
const loading = ref(false);

async function loadCandidate() {
  loading.value = true;
  try {
    const id = route.params.id as string;
    const response = await resumesService.getById(id);
    candidate.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCandidate();
});
</script>

<style scoped>
.candidate-header-banner {
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
.contact-info-list {
  list-style: none;
  padding: 0;
}
.contact-info-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}
</style>
