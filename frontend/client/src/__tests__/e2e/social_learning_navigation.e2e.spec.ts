import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import SocialFeedView from '../../views/SocialFeedView.vue';
import GroupsListView from '../../views/GroupsListView.vue';
import EventsListView from '../../views/EventsListView.vue';
import CoursesCatalogView from '../../views/CoursesCatalogView.vue';
import LessonPlayerView from '../../views/LessonPlayerView.vue';
import { postsService } from '../../services/posts.service';
import { groupsService } from '../../services/groups.service';
import { eventsService } from '../../services/events.service';
import { learningService } from '../../services/learning.service';

vi.mock('../../services/posts.service', () => ({
  postsService: {
    getRankedSocialFeed: vi.fn(),
    getSocialFeed: vi.fn(),
    createPost: vi.fn(),
    reactToPost: vi.fn(),
    commentOnPost: vi.fn()
  }
}));

vi.mock('../../services/groups.service', () => ({
  groupsService: {
    getAllGroups: vi.fn(),
    createGroup: vi.fn(),
    joinGroup: vi.fn()
  }
}));

vi.mock('../../services/events.service', () => ({
  eventsService: {
    getAllEvents: vi.fn(),
    createEvent: vi.fn(),
    attendEvent: vi.fn()
  }
}));

vi.mock('../../services/learning.service', () => ({
  learningService: {
    getCourses: vi.fn(),
    getCourseById: vi.fn(),
    enrollCourse: vi.fn(),
    completeLesson: vi.fn()
  }
}));

describe('E2E Frontend Client: Navegação Social, Comunidades, Eventos e Cursos LMS', () => {
  let router: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    vi.clearAllMocks();

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/feed', name: 'SocialFeed', component: SocialFeedView },
        { path: '/groups', name: 'GroupsList', component: GroupsListView },
        { path: '/events', name: 'EventsList', component: EventsListView },
        { path: '/courses', name: 'CoursesCatalog', component: CoursesCatalogView },
        { path: '/courses/:id/lesson/:lessonId', name: 'LessonPlayer', component: LessonPlayerView }
      ]
    });

    const authStore = useAuthStore();
    authStore.setAuth('jwt-valid-token', {
      id: 1,
      candidateId: 10,
      email: 'candidato@workix.com',
      name: 'Felipe Dev',
      role: 'CANDIDATE'
    });

    (postsService.getRankedSocialFeed as any).mockResolvedValue([
      {
        id: 'post-1',
        content: 'Compartilhando nova publicação no feed do Workix!',
        author: { name: 'Felipe Dev' },
        reactionsCount: 5,
        commentsCount: 2
      }
    ]);

    (groupsService.getAllGroups as any).mockResolvedValue([
      { id: 'group-1', name: 'Devs TypeScript', privacy: 'PUBLIC' }
    ]);

    (eventsService.getAllEvents as any).mockResolvedValue([
      { id: 'event-1', title: 'Workix Summit', eventType: 'ONLINE' }
    ]);

    (learningService.getCourses as any).mockResolvedValue([
      { id: 'course-1', title: 'Formação Frontend Vue 3', level: 'INTERMEDIATE', durationHours: 20 }
    ]);

    await router.push('/feed');
    await router.isReady();
  });

  it('deve carregar o feed social com posts e permitir interações', async () => {
    expect(router.currentRoute.value.name).toBe('SocialFeed');
  });

  it('deve navegar entre as seções de Grupos, Eventos e Catálogo de Cursos', async () => {
    await router.push('/groups');
    expect(router.currentRoute.value.name).toBe('GroupsList');

    await router.push('/events');
    expect(router.currentRoute.value.name).toBe('EventsList');

    await router.push('/courses');
    expect(router.currentRoute.value.name).toBe('CoursesCatalog');
  });

  it('deve acessar a rota do player de lição de um curso', async () => {
    await router.push('/courses/course-1/lesson/lesson-1');
    expect(router.currentRoute.value.name).toBe('LessonPlayer');
    expect(router.currentRoute.value.params.id).toBe('course-1');
    expect(router.currentRoute.value.params.lessonId).toBe('lesson-1');
  });
});
