<template>
  <div class="player-wrapper">
    <!-- Player Top Navbar (Udemy Style) -->
    <header class="player-navbar">
      <div class="navbar-left">
        <router-link to="/learning" class="btn-back-learning" title="Voltar ao catálogo">
          <i class="fa fa-arrow-left"></i>
        </router-link>
        <span class="nav-divider">|</span>
        <router-link :to="`/learning/${courseId}`" class="nav-course-title">
          {{ learningStore.activeCourse?.title || 'Curso' }}
        </router-link>
      </div>

      <div class="navbar-right">
        <!-- Progress Bar & Indicator -->
        <div class="user-progress-box">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${learningStore.progressPercentage}%` }"></div>
          </div>
          <span class="progress-label">
            <i class="fa fa-trophy"></i> Seu progresso: {{ learningStore.progressPercentage }}%
          </span>
        </div>

        <button
          v-if="learningStore.progressPercentage >= 100 || isFinishing"
          type="button"
          class="btn-cert-quick"
          :disabled="isFinishing"
          @click="handleCompleteCourse"
        >
          <i class="fa" :class="isFinishing ? 'fa-spinner fa-spin' : 'fa-certificate'"></i>
          {{ isFinishing ? 'Emitindo...' : 'Emitir Certificado' }}
        </button>
      </div>
    </header>

    <!-- Main Player & Sidebar Container -->
    <div class="player-content-layout">
      <!-- Left Column: Video Screen + Tabs & Resources -->
      <main class="player-stage">
        <!-- Video Player Screen Container -->
        <div class="video-container">
          <iframe
            v-if="isVideoEmbed"
            :src="embedVideoUrl"
            class="video-frame"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video
            v-else-if="learningStore.activeLesson?.videoUrl"
            :src="learningStore.activeLesson.videoUrl"
            class="video-frame"
            controls
            autoplay
          ></video>
          <div v-else class="video-placeholder-stage">
            <div class="placeholder-content">
              <i class="fa" :class="learningStore.activeLesson?.contentType === 'ARTICLE' ? 'fa-file-text-o' : 'fa-play-circle'"></i>
              <h3>{{ learningStore.activeLesson?.title || 'Aula em Reprodução' }}</h3>
              <p>Conteúdo didático e materiais complementares estruturados abaixo.</p>
            </div>
          </div>
        </div>

        <!-- Lesson Bottom Bar (Controls & Completion Toggle) -->
        <div class="lesson-control-strip">
          <div class="strip-left">
            <button
              type="button"
              class="btn-toggle-complete"
              :class="{ completed: isCurrentLessonCompleted }"
              @click="toggleCurrentCompletion"
            >
              <i class="fa" :class="isCurrentLessonCompleted ? 'fa-check-circle' : 'fa-circle-o'"></i>
              <span>{{ isCurrentLessonCompleted ? 'Concluída' : 'Marcar como concluída' }}</span>
            </button>
          </div>

          <div class="strip-right">
            <button
              v-if="prevLessonId"
              type="button"
              class="btn-nav-lesson"
              @click="goToLesson(prevLessonId)"
            >
              <i class="fa fa-chevron-left"></i> Anterior
            </button>
            <button
              v-if="nextLessonId"
              type="button"
              class="btn-nav-lesson next-btn"
              @click="goToLesson(nextLessonId)"
            >
              Próxima <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Lesson Details & Resources Tabs -->
        <div class="lesson-tabs-container">
          <div class="tabs-header">
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'overview' }"
              @click="activeTab = 'overview'"
            >
              <i class="fa fa-info-circle"></i> Visão Geral
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'resources' }"
              @click="activeTab = 'resources'"
            >
              <i class="fa fa-folder-open"></i> Recursos & Downloads
              <span v-if="learningStore.activeLesson?.attachmentUrl" class="badge-count">1</span>
            </button>
          </div>

          <div class="tab-body">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-pane">
              <h2 class="lesson-headline">{{ learningStore.activeLesson?.title }}</h2>
              <p class="lesson-desc">
                {{ learningStore.activeLesson?.description || 'Nesta lição abordamos a construção técnica detalhada, arquitetura de componentes e as melhores práticas aplicáveis ao ecossistema moderno.' }}
              </p>
              <div class="lesson-meta-chips margin-top-16">
                <span class="meta-chip"><i class="fa fa-clock-o"></i> {{ learningStore.activeLesson?.durationMinutes || 10 }} minutos</span>
                <span class="meta-chip"><i class="fa fa-tag"></i> {{ learningStore.activeLesson?.sectionName || 'Módulo Principal' }}</span>
              </div>
            </div>

            <!-- Resources & Downloads Tab -->
            <div v-else-if="activeTab === 'resources'" class="tab-pane">
              <h3 class="resources-title"><i class="fa fa-download"></i> Arquivos & Materiais Anexados</h3>
              <div v-if="learningStore.activeLesson?.attachmentUrl" class="resource-download-card">
                <div class="resource-icon">
                  <i class="fa fa-file-pdf-o"></i>
                </div>
                <div class="resource-info">
                  <h5 class="resource-name">{{ learningStore.activeLesson?.attachmentName || 'Material-Complementar.pdf' }}</h5>
                  <span class="resource-size">Arquivo oficial para estudo e consulta</span>
                </div>
                <a
                  :href="learningStore.activeLesson?.attachmentUrl"
                  target="_blank"
                  download
                  class="btn-download-file"
                >
                  <i class="fa fa-download"></i> Baixar Arquivo
                </a>
              </div>
              <div v-else class="no-resources-box">
                <i class="fa fa-folder-o"></i>
                <p>Nenhum arquivo adicional anexado a esta lição.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificate Success Banner -->
        <div v-if="learningStore.completionCertificate" class="cert-modal-card margin-top-24">
          <div class="cert-icon-wrap">
            <i class="fa fa-trophy"></i>
          </div>
          <div class="cert-info">
            <h3>Parabéns! Certificado Emitido com Sucesso!</h3>
            <p>Você atingiu 100% de aproveitamento das aulas deste curso.</p>
            <div class="cert-btns margin-top-12">
              <a
                :href="learningStore.completionCertificate.certificateUrl"
                target="_blank"
                class="btn btn-success"
              >
                <i class="fa fa-file-pdf-o"></i> Baixar Certificado Oficial
              </a>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Column: Sidebar Course Curriculum Playlist (Udemy Style) -->
      <aside class="player-curriculum-sidebar">
        <div class="sidebar-header">
          <h4>Conteúdo do Curso</h4>
          <span class="sidebar-counter">
            {{ learningStore.completedLessonsCount }}/{{ learningStore.totalLessonsCount }} aulas concluídas
          </span>
        </div>

        <div class="sidebar-sections-list">
          <div
            v-for="(sec, sIdx) in learningStore.activeCourseSections"
            :key="sIdx"
            class="sidebar-section-group"
          >
            <div class="sidebar-section-title">
              <strong>{{ sec.name }}</strong>
            </div>

            <div class="sidebar-lessons-group">
              <div
                v-for="l in sec.lessons"
                :key="l.id"
                class="sidebar-lesson-row"
                :class="{ active: String(l.id) === String(currentLessonId) }"
                @click="goToLesson(l.id)"
              >
                <div class="lesson-checkbox-wrap" @click.stop="toggleLesson(l.id)">
                  <i
                    class="fa"
                    :class="learningStore.isLessonCompleted(l.id) ? 'fa-check-square text-success' : 'fa-square-o text-muted'"
                  ></i>
                </div>
                <div class="lesson-row-details">
                  <span class="lesson-row-title">{{ l.title }}</span>
                  <span class="lesson-row-time">
                    <i class="fa fa-play-circle"></i> {{ l.durationMinutes || 10 }} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLearningStore from '../stores/learning';

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();

const courseId = computed(() => route.params.courseId as string);
const currentLessonId = computed(() => route.params.lessonId as string);
const isFinishing = ref(false);
const activeTab = ref<'overview' | 'resources'>('overview');

onMounted(async () => {
  await learningStore.fetchLesson(courseId.value, currentLessonId.value);
});

watch(
  () => [route.params.courseId, route.params.lessonId],
  async ([newCourse, newLesson]) => {
    if (newCourse && newLesson) {
      await learningStore.fetchLesson(newCourse as string, newLesson as string);
    }
  }
);

const isCurrentLessonCompleted = computed(() => {
  return learningStore.isLessonCompleted(currentLessonId.value);
});

function toggleCurrentCompletion() {
  learningStore.toggleLessonCompleted(currentLessonId.value);
}

function toggleLesson(lessonId: string | number) {
  learningStore.toggleLessonCompleted(lessonId);
}

const currentLessonIndex = computed(() => {
  return learningStore.activeCourseLessons.findIndex(
    (l) => String(l.id) === String(currentLessonId.value)
  );
});

const prevLessonId = computed(() => {
  const idx = currentLessonIndex.value;
  if (idx > 0) return learningStore.activeCourseLessons[idx - 1].id;
  return null;
});

const nextLessonId = computed(() => {
  const idx = currentLessonIndex.value;
  if (idx >= 0 && idx < learningStore.activeCourseLessons.length - 1) {
    return learningStore.activeCourseLessons[idx + 1].id;
  }
  return null;
});

const isVideoEmbed = computed(() => {
  const url = learningStore.activeLesson?.videoUrl || '';
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
});

const embedVideoUrl = computed(() => {
  let url = learningStore.activeLesson?.videoUrl || '';
  if (url.includes('youtube.com/watch?v=')) {
    url = url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
  } else if (url.includes('youtu.be/')) {
    url = url.replace('youtu.be/', 'youtube.com/embed/');
  }
  return url;
});

function goToLesson(lessonId: string | number) {
  router.push(`/learning/${courseId.value}/lesson/${lessonId}`);
}

async function handleCompleteCourse() {
  isFinishing.value = true;
  try {
    const enrollmentId = learningStore.currentEnrollment?.id || '1';
    await learningStore.finishCourse(enrollmentId);
  } catch (err: any) {
    console.error(err);
  } finally {
    isFinishing.value = false;
  }
}
</script>

<style scoped>
.player-wrapper {
  background: #0f172a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.player-navbar {
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-back-learning {
  color: #94a3b8;
  font-size: 16px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.btn-back-learning:hover {
  color: #38bdf8;
}

.nav-divider {
  color: #334155;
}

.nav-course-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-progress-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.progress-bar-track {
  height: 6px;
  background: #334155;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #38bdf8;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-cert-quick {
  background: #16a34a;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;
}

.btn-cert-quick:hover:not(:disabled) {
  background: #15803d;
}

/* Layout */
.player-content-layout {
  display: flex;
  flex: 1;
  background: #f8fafc;
}

.player-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.video-container {
  background: #000000;
  width: 100%;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.video-placeholder-stage {
  color: #ffffff;
  text-align: center;
}

.placeholder-content i {
  font-size: 54px;
  color: #38bdf8;
  margin-bottom: 12px;
}

.placeholder-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.placeholder-content p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* Strip */
.lesson-control-strip {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-toggle-complete {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-toggle-complete.completed {
  background: #f0fdf4;
  border-color: #86efac;
  color: #16a34a;
}

.strip-right {
  display: flex;
  gap: 10px;
}

.btn-nav-lesson {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-nav-lesson.next-btn {
  background: #0284c7;
  border-color: #0284c7;
  color: #ffffff;
}

/* Tabs */
.lesson-tabs-container {
  background: #ffffff;
  padding: 24px 28px;
  flex: 1;
}

.tabs-header {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  padding: 8px 4px 12px 4px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #0284c7;
  border-bottom-color: #0284c7;
}

.badge-count {
  background: #0284c7;
  color: #ffffff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
}

.lesson-headline {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.lesson-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.lesson-meta-chips {
  display: flex;
  gap: 10px;
}

.meta-chip {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Resources */
.resources-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-download-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 18px;
}

.resource-icon {
  font-size: 28px;
  color: #ef4444;
}

.resource-info {
  flex: 1;
}

.resource-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.resource-size {
  font-size: 12px;
  color: #64748b;
}

.btn-download-file {
  background: #0284c7;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.no-resources-box {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}

.no-resources-box i {
  font-size: 36px;
  margin-bottom: 8px;
}

/* Sidebar Playlist (Udemy Style) */
.player-curriculum-sidebar {
  width: 360px;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow-y: auto;
}

.sidebar-header {
  padding: 18px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.sidebar-header h4 {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.sidebar-counter {
  font-size: 12px;
  color: #64748b;
}

.sidebar-section-title {
  padding: 12px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.sidebar-lesson-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sidebar-lesson-row:hover {
  background: #f8fafc;
}

.sidebar-lesson-row.active {
  background: #e0f2fe;
  border-left: 4px solid #0284c7;
}

.lesson-checkbox-wrap {
  font-size: 16px;
  padding-top: 1px;
}

.lesson-row-details {
  flex: 1;
}

.lesson-row-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  line-height: 1.35;
  margin-bottom: 2px;
}

.lesson-row-time {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cert-modal-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 18px 24px;
}

.cert-icon-wrap {
  font-size: 38px;
  color: #eab308;
}

.cert-info h3 {
  font-size: 16px;
  font-weight: 800;
  color: #166534;
  margin: 0 0 4px 0;
}

.cert-info p {
  font-size: 13px;
  color: #15803d;
  margin: 0;
}

.margin-top-12 { margin-top: 12px; }
.margin-top-16 { margin-top: 16px; }
.margin-top-24 { margin-top: 24px; }
</style>
