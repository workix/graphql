<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="player-top-bar">
      <div class="container d-flex justify-content-between align-items-center flex-wrap gap-12">
        <div class="breadcrumb-info">
          <router-link to="/learning" class="back-link">
            <i class="fa fa-arrow-left"></i> Cursos
          </router-link>
          <span class="divider">/</span>
          <router-link :to="`/learning/${courseId}`" class="course-name-link">
            {{ learningStore.activeCourse?.title || 'Curso' }}
          </router-link>
        </div>

        <div class="progress-info">
          <span>Aula {{ currentLessonIndex + 1 }} de {{ learningStore.activeCourseLessons.length }}</span>
        </div>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Main Video Player & Lesson Content Column -->
        <div class="col-md-8 col-sm-12">
          <div class="player-main-card">
            <!-- Simulated Video Player -->
            <div class="video-screen-container">
              <div class="video-placeholder">
                <div class="play-button-circle">
                  <i class="fa fa-play"></i>
                </div>
                <div class="video-overlay-title">
                  {{ learningStore.activeLesson?.title || 'Reproduzindo Vídeo da Aula' }}
                </div>
              </div>
            </div>

            <div class="player-body">
              <h2 class="current-lesson-title">
                {{ learningStore.activeLesson?.title }}
              </h2>
              <p class="lesson-meta-desc">
                Nesta aula, exploramos a implementação prática dos conceitos do módulo, técnicas de otimização e boas práticas recomendadas.
              </p>

              <!-- Lesson Controls & Finish Button -->
              <div class="lesson-actions-bar d-flex justify-content-between align-items-center flex-wrap gap-12 margin-top-24">
                <button
                  v-if="prevLessonId"
                  type="button"
                  class="btn btn-outline-default"
                  @click="goToLesson(prevLessonId)"
                >
                  <i class="fa fa-chevron-left"></i> Aula Anterior
                </button>
                <div v-else></div>

                <div class="d-flex gap-10">
                  <button
                    v-if="nextLessonId"
                    type="button"
                    class="btn btn-primary"
                    @click="goToLesson(nextLessonId)"
                  >
                    Próxima Aula <i class="fa fa-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    class="btn btn-success"
                    :disabled="isFinishing"
                    @click="handleCompleteCourse"
                  >
                    <i class="fa" :class="isFinishing ? 'fa-spinner fa-spin' : 'fa-certificate'"></i>
                    {{ isFinishing ? 'Emitindo...' : 'Concluir Curso' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificate Modal / Feedback Box -->
          <div v-if="learningStore.completionCertificate" class="cert-congrats-card margin-top-24">
            <div class="cert-header">
              <i class="fa fa-trophy trophy-icon"></i>
              <h3>Parabéns! Você concluiu este curso!</h3>
              <p>Seu certificado digital oficial foi emitido com sucesso e vinculado ao seu perfil Workix.</p>
            </div>
            <div class="cert-actions text-center margin-top-16">
              <a
                :href="learningStore.completionCertificate.certificateUrl"
                target="_blank"
                class="btn btn-primary"
              >
                <i class="fa fa-download"></i> Baixar Certificado PDF
              </a>
              <router-link to="/profile/edit" class="btn btn-outline-default margin-left-10">
                Adicionar aos Destaques
              </router-link>
            </div>
          </div>
        </div>

        <!-- Sidebar Playlist Lessons Column -->
        <div class="col-md-4 col-sm-12">
          <div class="playlist-card">
            <div class="playlist-header">
              <h4><i class="fa fa-list"></i> Conteúdo do Curso</h4>
            </div>

            <div class="playlist-items">
              <div
                v-for="(lesson, index) in learningStore.activeCourseLessons"
                :key="lesson.id"
                class="playlist-item"
                :class="{ active: String(lesson.id) === String(currentLessonId) }"
                @click="goToLesson(lesson.id)"
              >
                <div class="item-status-icon">
                  <i class="fa" :class="String(lesson.id) === String(currentLessonId) ? 'fa-play-circle' : 'fa-check-circle'"></i>
                </div>
                <div class="item-details">
                  <span class="item-idx">Aula {{ index + 1 }}</span>
                  <h5 class="item-title">{{ lesson.title }}</h5>
                </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLearningStore from '../stores/learning';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();

const courseId = computed(() => route.params.courseId as string);
const currentLessonId = computed(() => route.params.lessonId as string);
const isFinishing = ref(false);

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
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.player-top-bar {
  background: #0f172a;
  color: #ffffff;
  padding: 14px 0;
}

.breadcrumb-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.back-link,
.course-name-link {
  color: #38bdf8;
  font-weight: 600;
}

.divider {
  color: #64748b;
}

.progress-info {
  font-size: 12px;
  color: #94a3b8;
}

.section-padding {
  padding: 24px 0 60px 0;
}

.player-main-card,
.playlist-card,
.cert-congrats-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.video-screen-container {
  background: #020617;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.video-placeholder {
  text-align: center;
  color: #ffffff;
}

.play-button-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  font-size: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.5);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.play-button-circle:hover {
  transform: scale(1.08);
}

.video-overlay-title {
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
}

.player-body {
  padding: 24px;
}

.current-lesson-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.lesson-meta-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.gap-12 { gap: 12px; }
.gap-10 { gap: 10px; }
.margin-top-24 { margin-top: 24px; }
.margin-top-16 { margin-top: 16px; }
.margin-left-10 { margin-left: 10px; }

/* Playlist */
.playlist-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.playlist-header h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.playlist-items {
  display: flex;
  flex-direction: column;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background 0.2s ease;
}

.playlist-item:hover {
  background: #f8fafc;
}

.playlist-item.active {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
}

.item-status-icon {
  font-size: 16px;
  color: #94a3b8;
}

.playlist-item.active .item-status-icon {
  color: #0284c7;
}

.item-idx {
  font-size: 11px;
  color: #64748b;
  display: block;
}

.item-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Certificate Congrats */
.cert-congrats-card {
  padding: 24px;
  border-left: 6px solid #16a34a;
}

.cert-header {
  text-align: center;
}

.trophy-icon {
  font-size: 40px;
  color: #eab308;
  margin-bottom: 10px;
}

.cert-header h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.cert-header p {
  font-size: 13px;
  color: #475569;
  margin: 0;
}
</style>
