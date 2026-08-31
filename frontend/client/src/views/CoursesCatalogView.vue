<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Workix Learning — Capacitação & Carreira</h1>
        <p>Aprenda novas tecnologias, conquiste certificados digitais e impulsione sua trajetória profissional</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Search Bar -->
      <div class="search-catalog-bar">
        <div class="search-box">
          <i class="fa fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="O que você deseja aprender hoje? (Vue 3, GraphQL, Kotlin, Carreira...)"
            class="form-control"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="learningStore.isLoading" class="loading-state">
        <i class="fa fa-spinner fa-spin"></i> Carregando catálogo de cursos...
      </div>

      <!-- Courses Grid -->
      <div v-else-if="filteredCourses.length > 0" class="row margin-top-24">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24"
        >
          <div class="course-card">
            <div class="course-thumb-banner">
              <div class="course-icon-badge">
                <i class="fa fa-graduation-cap"></i>
              </div>
              <span class="cert-badge"><i class="fa fa-certificate"></i> Certificado Incluso</span>
            </div>

            <div class="course-body">
              <span class="instructor-tag">
                <i class="fa fa-user-circle"></i> Instrutor #{{ course.instructorId }}
              </span>

              <h4 class="course-title">{{ course.title }}</h4>
              <p class="course-desc">{{ course.description || 'Domine conceitos essenciais e práticos para sua carreira.' }}</p>

              <div class="course-footer">
                <router-link :to="`/learning/${course.id}`" class="btn btn-block btn-primary">
                  <i class="fa fa-play-circle"></i> Ver Ementa & Iniciar
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-box">
        <i class="fa fa-book"></i>
        <h3>Nenhum curso encontrado</h3>
        <p>Tente buscar por outros termos como "Vue", "Kotlin" ou "GraphQL".</p>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useLearningStore from '../stores/learning';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const learningStore = useLearningStore();
const searchQuery = ref('');

onMounted(async () => {
  await learningStore.fetchCourses();
});

const filteredCourses = computed(() => {
  if (!searchQuery.value.trim()) return learningStore.coursesList;
  const q = searchQuery.value.toLowerCase();
  return learningStore.coursesList.filter(
    (c) => c.title.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
  );
});
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
}

.section-padding {
  padding-bottom: 60px;
}

.search-catalog-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 14px;
  top: 12px;
  color: #94a3b8;
}

.search-box input {
  padding-left: 38px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.margin-top-24 { margin-top: 24px; }
.margin-bottom-24 { margin-bottom: 24px; }

/* Course Card */
.course-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.course-thumb-banner {
  height: 80px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.cert-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  color: #ffffff;
}

.course-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.instructor-tag {
  font-size: 12px;
  color: #0284c7;
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.course-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.4;
  flex: 1;
}

.course-footer {
  margin-top: auto;
}

.loading-state,
.empty-state-box {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state-box i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 14px;
}

.empty-state-box h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}
</style>
