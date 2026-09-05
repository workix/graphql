import { defineStore } from 'pinia';
import learningService, {
  CourseModel,
  CourseLessonModel,
  CourseSectionModel,
  CourseEnrollmentModel,
  CourseCompletionModel
} from '../services/learning.service';
import { useAuthStore } from './auth';

export const useLearningStore = defineStore('learning', {
  state: () => ({
    coursesList: [] as CourseModel[],
    companyCourses: [] as CourseModel[],
    activeCourse: null as CourseModel | null,
    activeCourseSections: [] as CourseSectionModel[],
    activeCourseLessons: [] as CourseLessonModel[],
    activeLesson: null as CourseLessonModel | null,
    completedLessonIds: [] as (string | number)[],
    currentEnrollment: null as CourseEnrollmentModel | null,
    completionCertificate: null as CourseCompletionModel | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    totalLessonsCount: (state) => state.activeCourseLessons.length,
    completedLessonsCount: (state) => state.completedLessonIds.length,
    progressPercentage: (state) => {
      if (state.activeCourseLessons.length === 0) return 0;
      return Math.round((state.completedLessonIds.length / state.activeCourseLessons.length) * 100);
    }
  },

  actions: {
    async fetchCourses(filters: { category?: string; level?: string; providerType?: string; search?: string } = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const list = await learningService.getCourses(filters);
        if (list && list.length > 0) {
          this.coursesList = list;
        } else {
          // Fallback enriquecido com dados estilo Udemy
          this.coursesList = [
            {
              id: 1,
              title: 'Dominando Vue 3, Composition API & Pinia Architecture',
              description: 'Aprenda a construir aplicações Web reativas de alta escala com Vue 3, TypeScript, stores modernos e integração completa com APIs GraphQL.',
              instructorId: 1,
              instructorName: 'Equipe Workix Learning',
              providerType: 'PLATFORM',
              level: 'INTERMEDIATE',
              category: 'Frontend',
              requirements: 'Conhecimento básico de JavaScript (ES6+) e HTML/CSS.',
              whatYouWillLearn: 'Arquitetura reativa, Composition API, Gerenciamento global com Pinia e consumo de GraphQL.',
              durationHours: 14.5
            },
            {
              id: 2,
              title: 'Arquitetura de Microsserviços & APIs GraphQL com TypeScript',
              description: 'Construa esquemas robustos, resolvers performáticos, caching, DataLoaders e autenticação JWT para ambientes empresariais.',
              instructorId: 2,
              instructorName: 'Tech Lead Partner',
              companyId: 1,
              companyName: 'TechCorp Brasil',
              providerType: 'COMPANY',
              level: 'ADVANCED',
              category: 'Backend',
              requirements: 'Experiência prévia em Node.js e bancos de dados relacionais.',
              whatYouWillLearn: 'Modelagem GraphQL Schema-First, DataLoaders em lote, TDD com Jest e escalabilidade.',
              durationHours: 22.0
            },
            {
              id: 3,
              title: 'Desenvolvimento Android Nativo Moderno com Kotlin e Coroutines',
              description: 'Do básico ao avançado em arquitetura Android, Clean Architecture, consumo de APIs com OkHttp e ciclo de vida.',
              instructorId: 1,
              instructorName: 'Especialista Mobile Workix',
              providerType: 'PLATFORM',
              level: 'BEGINNER',
              category: 'Mobile',
              requirements: 'Lógica de programação e familiaridade com orientação a objetos.',
              whatYouWillLearn: 'Activities, Fragments, ViewBinding, Networking e boas práticas com Kotlin.',
              durationHours: 18.0
            }
          ];
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar catálogo de cursos.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCompanyCourses(companyId: string | number) {
      try {
        const courses = await learningService.getCompanyCourses(companyId);
        this.companyCourses = courses;
        return courses;
      } catch (err: any) {
        console.warn('Erro ao carregar cursos da empresa:', err);
        return [];
      }
    },

    async fetchCourseDetails(id: string | number) {
      this.isLoading = true;
      this.error = null;

      try {
        const c = await learningService.getCourse(id);
        if (c) {
          this.activeCourse = c;
          this.activeCourseSections = c.sections && c.sections.length > 0 ? c.sections : [];
          this.activeCourseLessons = c.lessons && c.lessons.length > 0 ? c.lessons : [];
        } else {
          const fallbackCourse = this.coursesList.find((item) => String(item.id) === String(id)) || {
            id,
            title: `Curso Profissional #${id}`,
            description: 'Capacitação prática completa inspirada na Udemy.',
            instructorId: 1,
            instructorName: 'Instrutor Especialista',
            providerType: 'PLATFORM',
            level: 'INTERMEDIATE',
            category: 'Tecnologia',
            requirements: 'Acesso à internet e vontade de aprender.',
            whatYouWillLearn: 'Domínio prático das principais ferramentas do mercado.',
            durationHours: 10.0
          };
          this.activeCourse = fallbackCourse;
        }

        if (this.activeCourseLessons.length === 0) {
          const fetchedLessons = await learningService.getCourseLessons(id);
          if (fetchedLessons.length > 0) {
            this.activeCourseLessons = fetchedLessons;
          } else {
            this.activeCourseLessons = [
              {
                id: 1,
                courseId: id,
                title: '1. Introdução e Visão Geral da Arquitetura',
                sectionName: 'Seção 1: Fundamentos e Setup',
                contentType: 'VIDEO',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                attachmentUrl: 'https://workix.com.br/downloads/guia-setup.pdf',
                attachmentName: 'guia-setup.pdf',
                durationMinutes: 12,
                description: 'Apresentação do curso, objetivos de aprendizagem e configuração completa.',
                orderIndex: 1
              },
              {
                id: 2,
                courseId: id,
                title: '2. Configurando o Ambiente e Ferramentas',
                sectionName: 'Seção 1: Fundamentos e Setup',
                contentType: 'VIDEO',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                attachmentUrl: 'https://workix.com.br/downloads/arquivos-iniciais.zip',
                attachmentName: 'arquivos-iniciais.zip',
                durationMinutes: 18,
                description: 'Instalação de pacotes, dependências e primeiros scripts.',
                orderIndex: 2
              },
              {
                id: 3,
                courseId: id,
                title: '3. Modelagem de Dados e Casos de Uso Reais',
                sectionName: 'Seção 2: Desenvolvimento Prático',
                contentType: 'VIDEO',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                attachmentUrl: 'https://workix.com.br/downloads/diagrama-erd.pdf',
                attachmentName: 'diagrama-erd.pdf',
                durationMinutes: 25,
                description: 'Criando modelos, tabelas e regras de validação consistentes.',
                orderIndex: 3
              },
              {
                id: 4,
                courseId: id,
                title: '4. Construindo Componentes e Lógica de Negócio',
                sectionName: 'Seção 2: Desenvolvimento Prático',
                contentType: 'ARTICLE',
                attachmentUrl: 'https://workix.com.br/downloads/exercicio-pratico.pdf',
                attachmentName: 'exercicio-pratico.pdf',
                durationMinutes: 30,
                description: 'Implementação de interfaces ricas, estados globais e queries GraphQL.',
                orderIndex: 4
              },
              {
                id: 5,
                courseId: id,
                title: '5. Testes Unitários, Deploy e Certificação',
                sectionName: 'Seção 3: Conclusão & Certificado',
                contentType: 'VIDEO',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                attachmentUrl: 'https://workix.com.br/downloads/resumo-final.pdf',
                attachmentName: 'resumo-final.pdf',
                durationMinutes: 20,
                description: 'Finalização do projeto, execução de testes automatizados e emissão do certificado.',
                orderIndex: 5
              }
            ];
          }
        }

        // Agrupar seções se estiver vazio
        if (this.activeCourseSections.length === 0) {
          const map = new Map<string, CourseLessonModel[]>();
          for (const l of this.activeCourseLessons) {
            const sName = l.sectionName || 'Módulo Principal';
            if (!map.has(sName)) map.set(sName, []);
            map.get(sName)!.push(l);
          }
          this.activeCourseSections = Array.from(map.entries()).map(([name, lessons]) => ({ name, lessons }));
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

    toggleLessonCompleted(lessonId: string | number) {
      const idx = this.completedLessonIds.indexOf(lessonId);
      if (idx >= 0) {
        this.completedLessonIds.splice(idx, 1);
      } else {
        this.completedLessonIds.push(lessonId);
      }
    },

    isLessonCompleted(lessonId: string | number) {
      return this.completedLessonIds.includes(lessonId);
    },

    async createCompanyCourse(courseData: {
      title: string;
      description?: string;
      level?: string;
      category?: string;
      requirements?: string;
      whatYouWillLearn?: string;
      durationHours?: number;
      companyId?: string | number;
    }) {
      const authStore = useAuthStore();
      const instructorId = authStore.user?.id || 1;

      try {
        const newCourse = await learningService.createCourse(
          instructorId,
          courseData.title,
          courseData.description,
          undefined,
          {
            companyId: courseData.companyId || authStore.user?.id,
            providerType: 'COMPANY',
            level: courseData.level,
            category: courseData.category,
            requirements: courseData.requirements,
            whatYouWillLearn: courseData.whatYouWillLearn,
            durationHours: courseData.durationHours
          }
        );

        if (newCourse) {
          this.coursesList.unshift(newCourse);
          this.companyCourses.unshift(newCourse);
        }
        return newCourse;
      } catch (err: any) {
        this.error = err.message || 'Erro ao criar curso corporativo.';
        throw err;
      }
    },

    async addLessonToCourse(
      courseId: string | number,
      lessonData: {
        title: string;
        sectionName?: string;
        contentType?: string;
        videoUrl?: string;
        attachmentUrl?: string;
        attachmentName?: string;
        durationMinutes?: number;
        description?: string;
      }
    ) {
      try {
        const lesson = await learningService.addCourseLesson(
          courseId,
          lessonData.title,
          undefined,
          this.activeCourseLessons.length + 1,
          lessonData
        );

        if (lesson) {
          this.activeCourseLessons.push(lesson);
          await this.fetchCourseDetails(courseId);
        }
        return lesson;
      } catch (err: any) {
        this.error = err.message || 'Erro ao adicionar aula.';
        throw err;
      }
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
