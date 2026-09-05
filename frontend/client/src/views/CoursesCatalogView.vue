<template>
  <div class="page-wrapper">
    <TheHeader />

    <!-- Hero Header -->
    <div class="page-header text-center">
      <div class="container">
        <span class="header-badge"><i class="fa fa-graduation-cap"></i> Workix Learning & Skills</span>
        <h1>Catálogo de Cursos & Treinamentos</h1>
        <p>Aprenda com cursos oficiais e capacitações exclusivas oferecidas por empresas parceiras do ecossistema</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Top Action Bar (Search + Filters + Company Action) -->
      <div class="catalog-controls-card">
        <div class="row align-items-center">
          <div class="col-md-6 col-sm-12">
            <div class="search-box">
              <i class="fa fa-search"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por tópicos (Vue 3, GraphQL, Kotlin, Arquitetura...)"
                class="form-control"
              />
            </div>
          </div>

          <div class="col-md-3 col-sm-6">
            <select v-model="selectedProvider" class="form-control filter-select">
              <option value="ALL">Todas as Origens</option>
              <option value="PLATFORM">Cursos Oficiais Workix</option>
              <option value="COMPANY">Cursos de Empresas Parceiras</option>
            </select>
          </div>

          <div class="col-md-3 col-sm-6 text-right">
            <button
              v-if="isCompanyUser"
              type="button"
              class="btn btn-create-course btn-block"
              @click="showCreateModal = true"
            >
              <i class="fa fa-plus-circle"></i> Criar Curso Corporativo
            </button>
            <div v-else class="learner-stat-pill">
              <i class="fa fa-certificate"></i> Certificados Oficiais
            </div>
          </div>
        </div>

        <!-- Level & Category Chips -->
        <div class="filter-chips-row margin-top-16">
          <button
            type="button"
            class="chip-btn"
            :class="{ active: selectedLevel === 'ALL' }"
            @click="selectedLevel = 'ALL'"
          >
            Todos os Níveis
          </button>
          <button
            type="button"
            class="chip-btn"
            :class="{ active: selectedLevel === 'BEGINNER' }"
            @click="selectedLevel = 'BEGINNER'"
          >
            Iniciante
          </button>
          <button
            type="button"
            class="chip-btn"
            :class="{ active: selectedLevel === 'INTERMEDIATE' }"
            @click="selectedLevel = 'INTERMEDIATE'"
          >
            Intermediário
          </button>
          <button
            type="button"
            class="chip-btn"
            :class="{ active: selectedLevel === 'ADVANCED' }"
            @click="selectedLevel = 'ADVANCED'"
          >
            Avançado
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="learningStore.isLoading" class="loading-state">
        <i class="fa fa-spinner fa-spin"></i> Carregando catálogo de cursos...
      </div>

      <!-- Courses Grid (Udemy Style Cards) -->
      <div v-else-if="filteredCourses.length > 0" class="row margin-top-24">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24"
        >
          <div class="course-card">
            <!-- Card Thumbnail Banner -->
            <div class="course-thumb-banner" :class="{ 'company-banner': course.providerType === 'COMPANY' }">
              <div class="course-icon-badge">
                <i class="fa" :class="course.providerType === 'COMPANY' ? 'fa-building' : 'fa-graduation-cap'"></i>
              </div>
              <span class="provider-pill">
                {{ course.providerType === 'COMPANY' ? (course.companyName || 'Empresa Parceira') : 'Workix Oficial' }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="course-body">
              <div class="course-badges-line">
                <span class="level-tag">{{ formatLevel(course.level) }}</span>
                <span class="duration-tag" v-if="course.durationHours">
                  <i class="fa fa-clock-o"></i> {{ course.durationHours }}h
                </span>
              </div>

              <h4 class="course-title">{{ course.title }}</h4>
              <p class="course-desc">{{ course.description }}</p>

              <div class="course-instructor-info">
                <i class="fa fa-user-circle"></i>
                <span>{{ course.instructorName || `Instrutor #${course.instructorId}` }}</span>
              </div>

              <div class="course-footer margin-top-16">
                <router-link :to="`/learning/${course.id}`" class="btn btn-block btn-start-course">
                  <i class="fa fa-play-circle"></i> Ver Ementa & Aulas
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
        <p>Tente ajustar os filtros ou pesquisar por outro termo.</p>
      </div>
    </div>

    <!-- Create Course Modal -->
    <CompanyCourseModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCourseCreated"
    />

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useLearningStore from '../stores/learning';
import { useAuthStore } from '../stores/auth';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import CompanyCourseModal from '../components/CompanyCourseModal.vue';

const learningStore = useLearningStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const selectedProvider = ref('ALL');
const selectedLevel = ref('ALL');
const showCreateModal = ref(false);

const isCompanyUser = computed(() => {
  return authStore.user?.role === 'COMPANY';
});

onMounted(async () => {
  await learningStore.fetchCourses();
});

async function handleCourseCreated() {
  await learningStore.fetchCourses();
}

function formatLevel(level?: string) {
  if (level === 'BEGINNER') return 'Iniciante';
  if (level === 'ADVANCED') return 'Avançado';
  if (level === 'ALL_LEVELS') return 'Todos os Níveis';
  return 'Intermediário';
}

const filteredCourses = computed(() => {
  let list = learningStore.coursesList;

  if (selectedProvider.value !== 'ALL') {
    list = list.filter((c) => c.providerType === selectedProvider.value);
  }

  if (selectedLevel.value !== 'ALL') {
    list = list.filter((c) => c.level === selectedLevel.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
    );
  }

  return list;
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
  padding: 44px 0;
  margin-bottom: 24px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
}

.section-padding {
  padding-bottom: 60px;
}

.catalog-controls-card {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
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

.filter-select {
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.btn-create-course {
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-create-course:hover {
  background: #0369a1;
}

.learner-stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.filter-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip-btn:hover {
  background: #e2e8f0;
}

.chip-btn.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.margin-top-16 { margin-top: 16px; }
.margin-top-24 { margin-top: 24px; }
.margin-bottom-24 { margin-bottom: 24px; }

/* Course Card (Udemy Style) */
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
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.course-thumb-banner {
  height: 90px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-thumb-banner.company-banner {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
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

.provider-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  white-space: nowrap;
}

.course-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.course-badges-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.level-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 4px;
}

.duration-tag {
  font-size: 11px;
  color: #64748b;
}

.course-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.35;
}

.course-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 14px 0;
  line-height: 1.45;
  flex: 1;
}

.course-instructor-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #0284c7;
  font-weight: 600;
}

.btn-start-course {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.2s ease;
}

.btn-start-course:hover {
  background: #0369a1;
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
