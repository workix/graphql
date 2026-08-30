<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="candidate" class="candidate-detail-page">
      <!-- Top Banner -->
      <div class="candidate-header-banner">
        <div class="container">
          <div class="banner-content">
            <div class="candidate-avatar-box">
              <i class="fa fa-user-circle"></i>
            </div>
            <div class="banner-info">
              <div class="banner-title-row">
                <h1 class="candidate-detail-title">
                  {{ candidate.candidate?.name || candidate.name || 'Perfil do Candidato' }}
                </h1>
                <span v-if="candidate.carrerLevel" class="badge-level">
                  {{ candidate.carrerLevel }}
                </span>
              </div>
              <div class="banner-meta">
                <span>
                  <i class="fa fa-briefcase"></i>
                  {{ candidate.objective || 'Engenheiro de Software & Especialista em Tecnologia' }}
                </span>
                <span>
                  <i class="fa fa-map-marker"></i>
                  {{ candidate.candidate?.locale?.city || candidate.city || 'São Paulo, SP' }}
                </span>
                <span class="badge-presence">
                  <i class="fa fa-laptop"></i> {{ candidate.presence || 'REMOTE' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8">
            <!-- Objetivo & Resumo -->
            <div class="content-box">
              <h3 class="section-heading"><i class="fa fa-user"></i> Resumo Profissional</h3>
              <p class="section-text">
                {{ candidate.content || candidate.objective || 'Profissional altamente qualificado com ampla experiência no setor de tecnologia.' }}
              </p>

              <!-- Competências & Habilidades -->
              <div v-if="candidate.skills && candidate.skills.length > 0" class="mt-4">
                <h3 class="section-heading"><i class="fa fa-code"></i> Competências & Tecnologias</h3>
                <div class="skills-grid">
                  <div v-for="(skill, idx) in candidate.skills" :key="idx" class="skill-pill">
                    <span class="skill-name">{{ skill.skillName }}</span>
                    <span class="skill-time">{{ skill.months }} meses</span>
                  </div>
                </div>
              </div>

              <!-- Experiência Profissional -->
              <div v-if="candidate.experiences && candidate.experiences.length > 0" class="mt-4">
                <h3 class="section-heading"><i class="fa fa-building"></i> Experiência Profissional</h3>
                <div class="timeline-list">
                  <div v-for="(exp, idx) in candidate.experiences" :key="idx" class="timeline-item">
                    <div class="timeline-header">
                      <h4 class="exp-title">{{ exp.jobTitle }}</h4>
                      <span class="exp-company">{{ exp.employerName }}</span>
                    </div>
                    <p class="exp-desc">{{ exp.description || exp.responsibilities || 'Atuação em desenvolvimento e entrega de projetos de software.' }}</p>
                  </div>
                </div>
              </div>

              <!-- Formação Acadêmica -->
              <div v-if="candidate.educations && candidate.educations.length > 0" class="mt-4">
                <h3 class="section-heading"><i class="fa fa-graduation-cap"></i> Formação Acadêmica</h3>
                <div class="timeline-list">
                  <div v-for="(edu, idx) in candidate.educations" :key="idx" class="timeline-item">
                    <div class="timeline-header">
                      <h4 class="exp-title">{{ edu.qualification }}</h4>
                      <span class="exp-company">{{ edu.schoolName }}</span>
                    </div>
                    <p class="exp-desc" v-if="edu.description">{{ edu.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-md-4">
            <div class="sidebar-box">
              <h4 class="sidebar-heading">Informações Gerais</h4>
              <ul class="info-list">
                <li>
                  <span class="info-label"><i class="fa fa-map-marker"></i> Localização</span>
                  <span class="info-value">{{ candidate.candidate?.locale?.city || candidate.city || 'São Paulo, SP' }}</span>
                </li>
                <li>
                  <span class="info-label"><i class="fa fa-laptop"></i> Modalidade</span>
                  <span class="info-value badge-modalidade">{{ candidate.presence || 'REMOTE' }}</span>
                </li>
                <li>
                  <span class="info-label"><i class="fa fa-level-up"></i> Nível</span>
                  <span class="info-value">{{ candidate.carrerLevel || 'Sênior' }}</span>
                </li>
                <li>
                  <span class="info-label"><i class="fa fa-calendar"></i> Cadastrado em</span>
                  <span class="info-value">{{ new Date(candidate.createdAt || Date.now()).toLocaleDateString('pt-BR') }}</span>
                </li>
              </ul>

              <div class="sidebar-cta mt-4">
                <router-link to="/candidates" class="btn-back">
                  <i class="fa fa-arrow-left"></i> Voltar para Lista de Talentos
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
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.candidate-header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 50px 0;
  border-bottom: 1px solid #334155;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 25px;
}

.candidate-avatar-box {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 40px;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
}

.banner-info {
  flex: 1;
}

.banner-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.candidate-detail-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff !important;
  margin: 0;
  text-transform: none;
}

.badge-level {
  background: #38bdf8;
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
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
  color: #cbd5e1 !important;
}

.banner-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-meta i {
  color: #38bdf8;
}

.badge-presence {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8 !important;
  font-weight: 600;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 6px;
}

.section-padding {
  padding: 45px 0 60px 0;
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
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: none;
}

.section-heading i {
  color: #0284c7;
  font-size: 18px;
}

.section-text {
  color: #475569;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.skill-pill {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 6px 14px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.skill-time {
  background: #0284c7;
  color: #ffffff;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 10px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.timeline-item {
  padding: 16px 20px;
  background: #f8fafc;
  border-left: 4px solid #0284c7;
  border-radius: 0 8px 8px 0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
}

.exp-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.exp-company {
  font-size: 14px;
  font-weight: 600;
  color: #0284c7;
}

.exp-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.sidebar-heading {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 20px;
  text-transform: none;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.info-label {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label i {
  color: #0284c7;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.badge-modalidade {
  background: #f0fdf4;
  color: #15803d;
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 14px;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #0284c7;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
