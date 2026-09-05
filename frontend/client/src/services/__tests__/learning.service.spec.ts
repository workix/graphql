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

  it('getCourses retorna catálogo de cursos com filtros e busca', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      courses: [
        { id: '1', title: 'Vue 3 Avançado', instructorId: '10', providerType: 'PLATFORM', level: 'ADVANCED' },
        { id: '2', title: 'Arquitetura de Microsserviços', instructorId: '20', providerType: 'COMPANY', companyId: '5' }
      ]
    });

    const courses = await learningService.getCourses({ providerType: 'COMPANY', level: 'ADVANCED' });
    expect(courses).toHaveLength(2);
    expect(courses[0].title).toBe('Vue 3 Avançado');
    expect(courses[1].providerType).toBe('COMPANY');
  });

  it('getCompanyCourses retorna cursos concedidos por uma empresa', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      companyCourses: [
        { id: '10', title: 'Treinamento Corporativo Kotlin', companyId: '5', providerType: 'COMPANY' }
      ]
    });

    const courses = await learningService.getCompanyCourses('5');
    expect(courses).toHaveLength(1);
    expect(courses[0].title).toBe('Treinamento Corporativo Kotlin');
  });

  it('getCourse retorna detalhes do curso com seções e lições', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      course: {
        id: '1',
        title: 'Vue 3 Avançado',
        instructorId: '10',
        sections: [
          { name: 'Módulo 1', lessons: [{ id: '101', title: 'Aula 1', contentType: 'VIDEO' }] }
        ],
        lessons: [{ id: '101', title: 'Aula 1' }]
      }
    });

    const course = await learningService.getCourse('1');
    expect(course?.title).toBe('Vue 3 Avançado');
    expect(course?.sections).toHaveLength(1);
  });

  it('getCourseLessons retorna aulas do curso com links de vídeo e anexos', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      courseLessons: [{
        id: '101',
        courseId: '1',
        title: 'Introdução à Composition API',
        sectionName: 'Módulo 1',
        contentType: 'VIDEO',
        videoUrl: 'https://youtube.com/watch?v=123',
        attachmentUrl: 'https://workix.com.br/slides.pdf',
        attachmentName: 'slides.pdf',
        orderIndex: 1
      }]
    });

    const lessons = await learningService.getCourseLessons('1');
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe('Introdução à Composition API');
    expect(lessons[0].attachmentName).toBe('slides.pdf');
  });

  it('createCourse cria novo curso no LMS com suporte a empresa premium', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createCourse: { id: '5', title: 'TypeScript Pro', instructorId: '20', companyId: '2', providerType: 'COMPANY' }
    });

    const course = await learningService.createCourse('20', 'TypeScript Pro', 'Curso de TS', undefined, {
      companyId: '2',
      providerType: 'COMPANY',
      level: 'ADVANCED'
    });
    expect(course?.id).toBe('5');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('addCourseLesson adiciona aula com vídeo e material anexo', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      addCourseLesson: { id: '202', courseId: '5', title: 'Aula 2: Anexos', attachmentUrl: 'https://cdn.com/res.pdf' }
    });

    const lesson = await learningService.addCourseLesson('5', 'Aula 2: Anexos', undefined, 2, {
      attachmentUrl: 'https://cdn.com/res.pdf',
      attachmentName: 'res.pdf'
    });
    expect(lesson?.id).toBe('202');
  });

  it('enrollInCourse matricula usuario no curso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      enrollInCourse: { id: 'en-1', courseId: '5', userId: '30' }
    });

    const enrollment = await learningService.enrollInCourse('5', '30');
    expect(enrollment?.id).toBe('en-1');
  });

  it('completeCourse e getCourseCompletion emitem e consultam certificado', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      completeCourse: { id: 'comp-1', enrollmentId: 'en-1', certificateUrl: '/certificates/cert-1.pdf' }
    });

    const cert = await learningService.completeCourse('en-1');
    expect(cert?.certificateUrl).toBe('/certificates/cert-1.pdf');

    (graphqlClient.request as any).mockResolvedValueOnce({
      courseCompletion: { id: 'comp-1', enrollmentId: 'en-1', certificateUrl: '/certificates/cert-1.pdf' }
    });
    const fetched = await learningService.getCourseCompletion('en-1');
    expect(fetched?.certificateUrl).toBe('/certificates/cert-1.pdf');
  });
});
