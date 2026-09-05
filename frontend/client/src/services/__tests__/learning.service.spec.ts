import { describe, it, expect, beforeEach, vi } from 'vitest';
import learningService from '../learning.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('learningService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCourse retorna detalhes do curso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      course: { id: '1', title: 'Vue 3 Avançado', instructorId: '10' }
    });

    const course = await learningService.getCourse('1');
    expect(course?.title).toBe('Vue 3 Avançado');
  });

  it('getCourseLessons retorna aulas do curso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      courseLessons: [{ id: '101', courseId: '1', title: 'Introdução à Composition API', orderIndex: 1 }]
    });

    const lessons = await learningService.getCourseLessons('1');
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe('Introdução à Composition API');
  });

  it('createCourse cria novo curso no LMS', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createCourse: { id: '5', title: 'TypeScript Pro', instructorId: '20' }
    });

    const course = await learningService.createCourse('20', 'TypeScript Pro', 'Curso de TS');
    expect(course?.id).toBe('5');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('enrollInCourse matricula usuario no curso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      enrollInCourse: { id: 'en-1', courseId: '5', userId: '30' }
    });

    const enrollment = await learningService.enrollInCourse('5', '30');
    expect(enrollment?.id).toBe('en-1');
  });

  it('completeCourse emite certificado de conclusao', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      completeCourse: { id: 'comp-1', enrollmentId: 'en-1', certificateUrl: '/certificates/cert-1.pdf' }
    });

    const cert = await learningService.completeCourse('en-1');
    expect(cert?.certificateUrl).toBe('/certificates/cert-1.pdf');
  });
});
