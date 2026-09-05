<template>
  <div class="page-wrapper">
    <TheHeader />

    <div v-if="learningStore.isLoading" class="loading-container text-center section-padding">
      <i class="fa fa-spinner fa-spin"></i> Carregando detalhes do curso...
    </div>

    <div v-else-if="learningStore.activeCourse" class="course-detail-page">
      <!-- Course Hero Banner (Udemy Style) -->
      <div class="course-header-banner" :class="{ 'company-header': learningStore.activeCourse.providerType === 'COMPANY' }">
        <div class="container">
          <div class="course-banner-content">
            <div class="d-flex align-items-center gap-10 margin-bottom-12">
              <span class="cert-pill"><i class="fa fa-certificate"></i> Certificado de Conclusão Incluso</span>
              <span class="provider-pill">
                {{ learningStore.activeCourse.providerType === 'COMPANY' ? (learningStore.activeCourse.companyName || 'Empresa Parceira') : 'Workix Oficial' }}
              </span>
            </div>

            <h1 class="course-main-title">{{ learningStore.activeCourse.title }}</h1>
            <p class="course-main-desc">{{ learningStore.activeCourse.description }}</p>

            <div class="course-meta-row d-flex flex-wrap gap-20 align-items-center margin-top-16">
              <span class="meta-item">
                <i class="fa fa-user-circle"></i> {{ learningStore.activeCourse.instructorName || `Instrutor #${learningStore.activeCourse.instructorId}` }}
              </span>
              <span class="meta-item">
                <i class="fa fa-book"></i> {{ learningStore.activeCourseLessons.length }} Lições
              </span>
              <span class="meta-item" v-if="learningStore.activeCourse.durationHours">
                <i class="fa fa-clock-o"></i> {{ learningStore.activeCourse.durationHours }} Horas de Conteúdo
              </span>
              <span class="meta-item">
                <i class="fa fa-level-up"></i> {{ formatLevel(learningStore.activeCourse.level) }}
              </span>
            </div>

            <div class="course-cta-box margin-top-24">
              <button
                type="button"
                class="btn btn-primary btn-lg"
                :disabled="isEnrolling"
                @click="handleEnroll"
              >
                <i class="fa" :class="isEnrolling ? 'fa-spinner fa-spin' : 'fa-play-circle'"></i>
                {{ isEnrolling ? 'Matriculando...' : 'Iniciar Curso Agora' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <!-- Main Content Column -->
          <div class="col-md-8 col-sm-12">
            <!-- What You'll Learn Box -->
            <div class="learning-objectives-card margin-bottom-24" v-if="learningStore.activeCourse.whatYouWillLearn">
              <h3><i class="fa fa-check-circle text-success"></i> O que você aprenderá neste curso</h3>
              <p class="objectives-text">{{ learningStore.activeCourse.whatYouWillLearn }}</p>
            </div>

            <!-- Curriculum Accordion Sections (Udemy Style) -->
            <div class="curriculum-card margin-bottom-24">
              <div class="card-header-bar d-flex justify-content-between align-items-center">
                <h3><i class="fa fa-list-ol"></i> Conteúdo do Curso</h3>
                <span class="curriculum-summary">
                  {{ learningStore.activeCourseSections.length }} seções • {{ learningStore.activeCourseLessons.length }} aulas
                </span>
              </div>

              <div class="card-body">
                <div class="sections-accordion">
                  <div
                    v-for="(sec, sIdx) in learningStore.activeCourseSections"
                    :key="sIdx"
                    class="section-accordion-item"
                  >
                    <div class="section-accordion-header" @click="toggleSection(sIdx)">
                      <div class="section-title-wrap">
                        <i class="fa" :class="isSectionOpen(sIdx) ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                        <span class="section-name">{{ sec.name }}</span>
                      </div>
                      <span class="section-lessons-count">{{ sec.lessons.length }} aulas</span>
                    </div>

                    <div v-show="isSectionOpen(sIdx)" class="section-lessons-body">
                      <div
                        v-for="(lesson, lIdx) in sec.lessons"
                        :key="lesson.id"
                        class="lesson-item-row"
                      >
                        <div class="lesson-icon-type">
                          <i class="fa" :class="getLessonIcon(lesson)"></i>
                        </div>
                        <div class="lesson-info">
                          <h5 class="lesson-title">{{ lesson.title }}</h5>
                          <div class="lesson-submeta">
                            <span v-if="lesson.durationMinutes"><i class="fa fa-clock-o"></i> {{ lesson.durationMinutes }} min</span>
                            <span v-if="lesson.attachmentName" class="has-attachment-badge">
                              <i class="fa fa-paperclip"></i> {{ lesson.attachmentName }}
                            </span>
                          </div>
                        </div>
                        <div class="lesson-action">
                          <router-link
                            :to="`/learning/${learningStore.activeCourse.id}/lesson/${lesson.id}`"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="fa fa-play"></i> Assistir
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Requirements Box -->
            <div class="requirements-card" v-if="learningStore.activeCourse.requirements">
              <h4><i class="fa fa-info-circle"></i> Requisitos Prévios</h4>
              <p class="requirements-text">{{ learningStore.activeCourse.requirements }}</p>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="col-md-4 col-sm-12">
            <div class="benefits-card">
              <h4><i class="fa fa-star text-warning"></i> Este curso inclui:</h4>
              <ul class="benefits-list">
                <li><i class="fa fa-video-camera"></i> Aulas em vídeo em alta definição</li>
                <li><i class="fa fa-file-text-o"></i> Materiais e códigos anexos para download</li>
                <li><i class="fa fa-infinity"></i> Acesso ilimitado e sem expiração</li>
                <li><i class="fa fa-mobile"></i> Acesso pelo computador e aplicativo Android</li>
                <li><i class="fa fa-trophy"></i> Certificado digital oficial com autenticação</li>
              </ul>
              <hr />
              <router-link to="/learning" class="btn btn-outline-default btn-block">
                <i class="fa fa-arrow-left"></i> Voltar ao Catálogo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="container section-padding text-center">
      <div class="empty-box">
        <i class="fa fa-exclamation-triangle"></i>
        <h3>Curso não encontrado</h3>
        <p>O curso solicitado não está disponível no momento.</p>
        <router-link to="/learning" class="btn btn-primary margin-top-10">Ver Todos os Cursos</router-link>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLearningStore from '../stores/learning';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();

const isEnrolling = ref(false);
const openSections = ref<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true });

onMounted(async () => {
  const courseId = route.params.id as string;
  await learningStore.fetchCourseDetails(courseId);
});

function toggleSection(index: number) {
  openSections.value[index] = !openSections.value[index];
}

function isSectionOpen(index: number) {
  return openSections.value[index] !== false;
}

function formatLevel(level?: string) {
  if (level === 'BEGINNER') return 'Iniciante';
  if (level === 'ADVANCED') return 'Avançado';
  if (level === 'ALL_LEVELS') return 'Todos os Níveis';
  return 'Intermediário';
}

function getLessonIcon(lesson: any) {
  if (lesson.contentType === 'ARTICLE') return 'fa-file-text';
  if (lesson.contentType === 'DOCUMENT') return 'fa-file-pdf-o';
  return 'fa-play-circle';
}

async function handleEnroll() {
  if (!learningStore.activeCourse) return;
  isEnrolling.value = true;
  try {
    await learningStore.enrollCourse(learningStore.activeCourse.id);
    const firstLessonId = learningStore.activeCourseLessons[0]?.id || 1;
    router.push(`/learning/${learningStore.activeCourse.id}/lesson/${firstLessonId}`);
  } catch (err: any) {
    console.error(err);
  } finally {
    isEnrolling.value = false;
  }
}
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.course-header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 44px 0;
  margin-bottom: 24px;
}

.course-header-banner.company-header {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
}

.cert-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  background: #0284c7;
  color: #ffffff;
}

.provider-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
}

.course-main-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.course-main-desc {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
  max-width: 740px;
  line-height: 1.5;
}

.course-meta-row {
  font-size: 13px;
  color: #cbd5e1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-padding {
  padding-bottom: 60px;
}

.gap-20 { gap: 20px; }
.gap-10 { gap: 10px; }
.margin-top-16 { margin-top: 16px; }
.margin-top-24 { margin-top: 24px; }
.margin-bottom-12 { margin-bottom: 12px; }
.margin-bottom-24 { margin-bottom: 24px; }
.margin-top-10 { margin-top: 10px; }

.learning-objectives-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.learning-objectives-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.objectives-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
}

/* Curriculum Card */
.curriculum-card,
.benefits-card,
.requirements-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.card-header-bar h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.curriculum-summary {
  font-size: 12px;
  color: #64748b;
}

.card-body {
  padding: 0;
}

/* Accordion */
.section-accordion-item {
  border-bottom: 1px solid #f1f5f9;
}

.section-accordion-header {
  padding: 14px 20px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.section-accordion-header:hover {
  background: #f8fafc;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.section-title-wrap i {
  color: #64748b;
  font-size: 12px;
}

.section-lessons-count {
  font-size: 12px;
  color: #64748b;
}

.section-lessons-body {
  background: #fafafa;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lesson-item-row {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  gap: 12px;
}

.lesson-icon-type {
  color: #0284c7;
  font-size: 16px;
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.lesson-submeta {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.has-attachment-badge {
  background: #f0f9ff;
  color: #0369a1;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.requirements-card,
.benefits-card {
  padding: 20px;
}

.requirements-card h4,
.benefits-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
  color: #334155;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefits-list i {
  color: #0284c7;
  font-size: 14px;
}

.loading-container,
.empty-box {
  text-align: center;
  padding: 50px 20px;
  color: #64748b;
}
</style>
