import { defineStore } from 'pinia';
import learningService, {
  CourseModel,
  CourseLessonModel,
  CourseEnrollmentModel,
  CourseCompletionModel
} from '../services/learning.service';
import { useAuthStore } from './auth';

export const useLearningStore = defineStore('learning', {
  state: () => ({
    coursesList: [] as CourseModel[],
    activeCourse: null as CourseModel | null,
    activeCourseLessons: [] as CourseLessonModel[],
    activeLesson: null as CourseLessonModel | null,
    currentEnrollment: null as CourseEnrollmentModel | null,
    completionCertificate: null as CourseCompletionModel | null,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCourses() {
      this.isLoading = true;
      this.error = null;

      try {
        const defaultCourseIds = [1, 2, 3];
        const loaded: CourseModel[] = [];

        for (const id of defaultCourseIds) {
          const c = await learningService.getCourse(id);
          if (c) loaded.push(c);
        }

        if (loaded.length === 0) {
          this.coursesList = [
            {
              id: 1,
              title: 'Dominando Vue 3, Composition API & Pinia Architecture',
              description: 'Aprenda a construir aplicações Web reativas de alta escala com Vue 3, TypeScript, stores modernos e integração completa com APIs GraphQL.',
              instructorId: 1
            },
            {
              id: 2,
              title: 'Arquitetura de Microsserviços & APIs GraphQL com TypeScript',
              description: 'Construa esquemas robustos, resolvers performáticos, caching e autenticação JWT para ambientes empresariais.',
              instructorId: 2
            },
            {
              id: 3,
              title: 'Desenvolvimento Android Nativo Moderno com Kotlin e Coroutines',
              description: 'Do básico ao avançado em arquitetura Android, Clean Architecture, consumo de APIs com OkHttp e ciclo de vida.',
              instructorId: 1
            }
          ];
        } else {
          this.coursesList = loaded;
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar catálogo de cursos.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCourseDetails(id: string | number) {
      this.isLoading = true;
      this.error = null;

      try {
        const c = await learningService.getCourse(id);
        if (c) {
          this.activeCourse = c;
        } else {
          this.activeCourse = this.coursesList.find((item) => String(item.id) === String(id)) || {
            id,
            title: `Curso Profissional #${id}`,
            description: 'Capacitação prática com foco em mercado de trabalho.',
            instructorId: 1
          };
        }

        const lessons = await learningService.getCourseLessons(id);
        if (lessons.length > 0) {
          this.activeCourseLessons = lessons;
        } else {
          this.activeCourseLessons = [
            { id: 1, courseId: id, title: '1. Introdução e Visão Geral da Arquitetura', orderIndex: 1 },
            { id: 2, courseId: id, title: '2. Configurando o Ambiente e Ferramentas', orderIndex: 2 },
            { id: 3, courseId: id, title: '3. Modelagem de Dados e Casos de Uso Reais', orderIndex: 3 },
            { id: 4, courseId: id, title: '4. Construindo Componentes e Lógica de Negócio', orderIndex: 4 },
            { id: 5, courseId: id, title: '5. Testes Unitários, Deploy e Certificação', orderIndex: 5 }
          ];
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar detalhes do curso.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchLesson(courseId: string | number, lessonId: string | number) {
      await this.fetchCourseDetails(courseId);
      const found = this.activeCourseLessons.find((l) => String(l.id) === String(lessonId));
      this.activeLesson = found || this.activeCourseLessons[0] || null;
    },

    async enrollCourse(courseId: string | number) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || 1;

      try {
        const enrollment = await learningService.enrollInCourse(courseId, userId);
        this.currentEnrollment = enrollment || {
          id: '1',
          courseId,
          userId,
          enrolledAt: new Date().toISOString()
        };
        return this.currentEnrollment;
      } catch (err: any) {
        this.error = err.message || 'Erro ao realizar matrícula.';
        throw err;
      }
    },

    async finishCourse(enrollmentId: string | number) {
      try {
        const completion = await learningService.completeCourse(enrollmentId);
        this.completionCertificate = completion || {
          id: '1',
          enrollmentId,
          completedAt: new Date().toISOString(),
          certificateUrl: `https://workix.com.br/certificates/cert-${enrollmentId}.pdf`
        };
        return this.completionCertificate;
      } catch (err: any) {
        this.error = err.message || 'Erro ao concluir curso.';
        throw err;
      }
    }
  }
});

export default useLearningStore;
