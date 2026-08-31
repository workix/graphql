<template>
  <div class="page-wrapper">
    <TheHeader />

    <div v-if="learningStore.isLoading" class="loading-container text-center section-padding">
      <i class="fa fa-spinner fa-spin"></i> Carregando curso...
    </div>

    <div v-else-if="learningStore.activeCourse" class="course-detail-page">
      <!-- Course Banner Header -->
      <div class="course-header-banner">
        <div class="container">
          <div class="course-banner-content">
            <span class="cert-pill"><i class="fa fa-certificate"></i> Certificado de Conclusão Incluso</span>
            <h1 class="course-main-title">{{ learningStore.activeCourse.title }}</h1>
            <p class="course-main-desc">{{ learningStore.activeCourse.description }}</p>

            <div class="course-meta-row d-flex flex-wrap gap-20 align-items-center margin-top-16">
              <span class="meta-item">
                <i class="fa fa-user-circle"></i> Instrutor #{{ learningStore.activeCourse.instructorId }}
              </span>
              <span class="meta-item">
                <i class="fa fa-book"></i> {{ learningStore.activeCourseLessons.length }} Lições
              </span>
              <span class="meta-item">
                <i class="fa fa-level-up"></i> Nível Intermediário/Avançado
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
          <!-- Lessons Curriculum Column -->
          <div class="col-md-8 col-sm-12">
            <div class="curriculum-card">
              <div class="card-header-bar">
                <h3><i class="fa fa-list-ol"></i> Grade Curricular & Lições</h3>
              </div>

              <div class="card-body">
                <div class="lessons-list">
                  <div
                    v-for="(lesson, index) in learningStore.activeCourseLessons"
                    :key="lesson.id"
                    class="lesson-item-row"
                  >
                    <div class="lesson-num">{{ index + 1 }}</div>
                    <div class="lesson-info">
                      <h4 class="lesson-title">{{ lesson.title }}</h4>
                      <span class="lesson-dur"><i class="fa fa-clock-o"></i> 10 min de conteúdo prático</span>
                    </div>
                    <div class="lesson-action">
                      <router-link
                        :to="`/learning/${learningStore.activeCourse.id}/lesson/${lesson.id}`"
                        class="btn btn-sm btn-outline-primary"
                      >
                        <i class="fa fa-play"></i> Assistir Aula
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Benefits Column -->
          <div class="col-md-4 col-sm-12">
            <div class="benefits-card">
              <h4><i class="fa fa-star"></i> O que você vai obter</h4>
              <ul class="benefits-list">
                <li>Acesso ilimitado a todas as aulas e códigos de exemplo.</li>
                <li>Exercícios práticos para fixação de conhecimento.</li>
                <li>Certificado digital validado para enriquecer seu perfil.</li>
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

onMounted(async () => {
  const courseId = route.params.id as string;
  await learningStore.fetchCourseDetails(courseId);
});

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
  padding: 40px 0;
  margin-bottom: 24px;
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
  margin-bottom: 12px;
}

.course-main-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.course-main-desc {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
  max-width: 700px;
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
.margin-top-16 { margin-top: 16px; }
.margin-top-24 { margin-top: 24px; }
.margin-top-10 { margin-top: 10px; }

.curriculum-card,
.benefits-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
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

.card-body {
  padding: 20px;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lesson-item-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  gap: 14px;
}

.lesson-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.lesson-dur {
  font-size: 12px;
  color: #64748b;
}

.benefits-card {
  padding: 20px;
}

.benefits-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.benefits-list {
  padding-left: 18px;
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.loading-container,
.empty-box {
  text-align: center;
  padding: 50px 20px;
  color: #64748b;
}
</style>
