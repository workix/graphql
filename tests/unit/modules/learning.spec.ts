import learningRepository from '../../../src/modules/learning/repository/learning.repo';
import learningResolvers from '../../../src/modules/learning/graphql/learning.resolvers';
import CourseDTO from '../../../src/dtos/CourseDTO';
import CourseLessonDTO from '../../../src/dtos/CourseLessonDTO';
import CourseEnrollmentDTO from '../../../src/dtos/CourseEnrollmentDTO';
import CourseCompletionDTO from '../../../src/dtos/CourseCompletionDTO';
import { Course, CourseLesson, CourseEnrollment, CourseCompletion } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Course: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  CourseLesson: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  CourseEnrollment: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  CourseCompletion: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Learning Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: { Sequelize: { Op: { like: Symbol('like'), or: Symbol('or') } } } };
    jest.clearAllMocks();
  });

  describe('learningRepository', () => {
    it('should create a course with extra details (company, level, requirements, etc)', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101', instructor_id: 10, provider_type: 'COMPANY', company_id: 2 };
      (Course.create as jest.Mock).mockResolvedValue(mockCourse);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.createCourse(10, 'GraphQL 101', 'Learn GraphQL', 5, {
        companyId: 2,
        providerType: 'COMPANY',
        level: 'ADVANCED',
        category: 'Tecnologia',
        requirements: 'Conhecimento prévio de JS',
        whatYouWillLearn: 'Construção de APIs',
        durationHours: 12.5
      });

      expect(Course.create).toHaveBeenCalledWith({
        title: 'GraphQL 101',
        description: 'Learn GraphQL',
        instructor_id: 10,
        media_id: 5,
        company_id: 2,
        provider_type: 'COMPANY',
        level: 'ADVANCED',
        category: 'Tecnologia',
        requirements: 'Conhecimento prévio de JS',
        what_you_will_learn: 'Construção de APIs',
        duration_hours: 12.5
      });
      expect(res).toEqual(mockCourse);
    });

    it('should update course details', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockCourse = { id: 1, title: 'Old Title', update: mockUpdate };
      (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.updateCourse(1, { title: 'New Title', level: 'BEGINNER' });

      expect(mockUpdate).toHaveBeenCalledWith({ title: 'New Title', level: 'BEGINNER' });
      expect(res).toBe(mockCourse);
    });

    it('should throw error when updating a non-existing course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = learningRepository(mockCtx.orm);

      await expect(repo.updateCourse(999, { title: 'New' })).rejects.toThrow('Course 999 not found');
    });

    it('should get courses with filters and search query', async () => {
      const mockCourses = [{ id: 1, title: 'Vue 3 Course', category: 'Frontend', level: 'BEGINNER' }];
      (Course.findAll as jest.Mock).mockResolvedValue(mockCourses);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.getCourses({ category: 'Frontend', level: 'BEGINNER', providerType: 'PLATFORM', search: 'Vue' });

      expect(Course.findAll).toHaveBeenCalled();
      expect(res).toEqual(mockCourses);
    });

    it('should get company courses by companyId', async () => {
      const mockCourses = [{ id: 2, title: 'Company Kotlin Course', company_id: 5 }];
      (Course.findAll as jest.Mock).mockResolvedValue(mockCourses);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.getCompanyCourses(5);

      expect(Course.findAll).toHaveBeenCalledWith({
        where: { company_id: 5 },
        order: [['created_at', 'DESC']]
      });
      expect(res).toEqual(mockCourses);
    });

    it('should get course by id', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101' };
      (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);

      const repo = learningRepository(mockCtx.orm);
      expect(await repo.getCourseById(1)).toEqual(mockCourse);
    });

    it('should add a lesson with section, videoUrl and attachmentUrl to an existing course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      const mockLesson = {
        id: 1,
        course_id: 1,
        title: 'Intro',
        order_index: 0,
        section_name: 'Módulo 1: Fundamentos',
        content_type: 'VIDEO',
        video_url: 'https://cdn.workix.com/v1.mp4',
        attachment_url: 'https://cdn.workix.com/slides.pdf',
        attachment_name: 'slides.pdf',
        duration_minutes: 15,
        description: 'Primeiros passos'
      };
      (CourseLesson.create as jest.Mock).mockResolvedValue(mockLesson);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.addLesson(1, 'Intro', 2, 0, {
        sectionName: 'Módulo 1: Fundamentos',
        contentType: 'VIDEO',
        videoUrl: 'https://cdn.workix.com/v1.mp4',
        attachmentUrl: 'https://cdn.workix.com/slides.pdf',
        attachmentName: 'slides.pdf',
        durationMinutes: 15,
        description: 'Primeiros passos'
      });

      expect(CourseLesson.create).toHaveBeenCalledWith({
        course_id: 1,
        title: 'Intro',
        media_id: 2,
        order_index: 0,
        section_name: 'Módulo 1: Fundamentos',
        content_type: 'VIDEO',
        video_url: 'https://cdn.workix.com/v1.mp4',
        attachment_url: 'https://cdn.workix.com/slides.pdf',
        attachment_name: 'slides.pdf',
        duration_minutes: 15,
        description: 'Primeiros passos'
      });
      expect(res).toEqual(mockLesson);
    });

    it('should group lessons into structured sections (Udemy style)', async () => {
      const mockLessons = [
        { id: 1, course_id: 1, title: 'L1', section_name: 'Seção 1' },
        { id: 2, course_id: 1, title: 'L2', section_name: 'Seção 1' },
        { id: 3, course_id: 1, title: 'L3', section_name: 'Seção 2' }
      ];
      (CourseLesson.findAll as jest.Mock).mockResolvedValue(mockLessons);

      const repo = learningRepository(mockCtx.orm);
      const sections = await repo.getCourseSections(1);

      expect(sections).toHaveLength(2);
      expect(sections[0].name).toBe('Seção 1');
      expect(sections[0].lessons).toHaveLength(2);
      expect(sections[1].name).toBe('Seção 2');
      expect(sections[1].lessons).toHaveLength(1);
    });

    it('should enroll a user in a course and complete course with certificate', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (CourseEnrollment.findOne as jest.Mock).mockResolvedValue(null);
      const mockEnrollment = { id: 1, course_id: 1, user_id: 10 };
      (CourseEnrollment.create as jest.Mock).mockResolvedValue(mockEnrollment);
      (CourseEnrollment.findByPk as jest.Mock).mockResolvedValue(mockEnrollment);
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(null);
      const mockCompletion = { id: 1, enrollment_id: 1, certificate_url: '/certificates/1' };
      (CourseCompletion.create as jest.Mock).mockResolvedValue(mockCompletion);

      const repo = learningRepository(mockCtx.orm);
      const enrolled = await repo.enroll(1, 10);
      expect(enrolled).toEqual(mockEnrollment);

      const completed = await repo.completeCourse(1);
      expect(completed).toEqual(mockCompletion);
    });
  });

  describe('learningResolvers', () => {
    it('should resolve queries and mutations for learning', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101', instructor_id: 10 };
      const mockLesson = { id: 1, course_id: 1, title: 'Intro', section_name: 'Sec 1' };
      const mockEnrollment = { id: 5, course_id: 1, user_id: 10 };
      const mockCompletion = { id: 1, enrollment_id: 5, certificate_url: '/certificates/5' };

      (Course.findAll as jest.Mock).mockResolvedValue([mockCourse]);
      (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);
      (Course.create as jest.Mock).mockResolvedValue(mockCourse);
      (CourseLesson.findAll as jest.Mock).mockResolvedValue([mockLesson]);
      (CourseLesson.create as jest.Mock).mockResolvedValue(mockLesson);
      (CourseEnrollment.findOne as jest.Mock).mockResolvedValue(null);
      (CourseEnrollment.create as jest.Mock).mockResolvedValue(mockEnrollment);
      (CourseEnrollment.findByPk as jest.Mock).mockResolvedValue(mockEnrollment);
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(null);
      (CourseCompletion.create as jest.Mock).mockResolvedValue(mockCompletion);

      const q = learningResolvers.Query;
      const m = learningResolvers.Mutation;

      const courses = await q.courses(null, {}, mockCtx, {});
      expect(courses[0]).toBeInstanceOf(CourseDTO);

      const companyCourses = await q.companyCourses(null, { companyId: 2 }, mockCtx, {});
      expect(companyCourses[0]).toBeInstanceOf(CourseDTO);

      const courseDto = await q.course(null, { id: 1 }, mockCtx, {});
      expect(courseDto).toBeInstanceOf(CourseDTO);

      const lessons = await q.courseLessons(null, { courseId: 1 }, mockCtx, {});
      expect(lessons[0]).toBeInstanceOf(CourseLessonDTO);

      const completion = await q.courseCompletion(null, { enrollmentId: 5 }, mockCtx, {});
      expect(completion).toBeNull();

      const createdCourse = await m.createCourse(null, { instructorId: 10, title: 'GraphQL 101' }, mockCtx, {});
      expect(createdCourse).toBeInstanceOf(CourseDTO);

      const addedLesson = await m.addCourseLesson(null, { courseId: 1, title: 'Intro' }, mockCtx, {});
      expect(addedLesson).toBeInstanceOf(CourseLessonDTO);

      const enrolled = await m.enrollInCourse(null, { courseId: 1, userId: 10 }, mockCtx, {});
      expect(enrolled).toBeInstanceOf(CourseEnrollmentDTO);

      const completed = await m.completeCourse(null, { enrollmentId: 5 }, mockCtx, {});
      expect(completed).toBeInstanceOf(CourseCompletionDTO);

      // Section resolver test
      const sections = await (learningResolvers as any).Course.sections({ id: 1 }, {}, mockCtx, {});
      expect(sections).toHaveLength(1);
      expect(sections[0].name).toBe('Sec 1');
      expect(sections[0].lessons[0]).toBeInstanceOf(CourseLessonDTO);
    });
  });

  describe('DTOs null check and full fields mapping', () => {
    it('should handle null input gracefully', () => {
      expect(new CourseDTO(null).id).toBeUndefined();
      expect(new CourseLessonDTO(null).id).toBeUndefined();
      expect(new CourseEnrollmentDTO(null).id).toBeUndefined();
      expect(new CourseCompletionDTO(null).id).toBeUndefined();
    });

    it('should map camelCase and snake_case fields for Udemy style properties', () => {
      const now = new Date();
      const c = new CourseDTO({
        id: 1,
        title: 'X',
        instructorId: 10,
        mediaId: 2,
        company_id: 3,
        provider_type: 'COMPANY',
        level: 'ADVANCED',
        category: 'Back-end',
        requirements: 'Basic JS',
        what_you_will_learn: 'Node, GraphQL',
        duration_hours: 20.5,
        createdAt: now,
        updatedAt: now
      });
      expect(c.companyId).toBe(3);
      expect(c.providerType).toBe('COMPANY');
      expect(c.level).toBe('ADVANCED');
      expect(c.category).toBe('Back-end');
      expect(c.requirements).toBe('Basic JS');
      expect(c.whatYouWillLearn).toBe('Node, GraphQL');
      expect(c.durationHours).toBe(20.5);

      const l = new CourseLessonDTO({
        id: 1,
        courseId: 1,
        title: 'Intro',
        mediaId: 2,
        order_index: 1,
        section_name: 'Módulo 1',
        content_type: 'VIDEO',
        video_url: 'https://video.mp4',
        attachment_url: 'https://file.pdf',
        attachment_name: 'file.pdf',
        duration_minutes: 25,
        description: 'Aula 1',
        createdAt: now
      });
      expect(l.sectionName).toBe('Módulo 1');
      expect(l.contentType).toBe('VIDEO');
      expect(l.videoUrl).toBe('https://video.mp4');
      expect(l.attachmentUrl).toBe('https://file.pdf');
      expect(l.attachmentName).toBe('file.pdf');
      expect(l.durationMinutes).toBe(25);
      expect(l.description).toBe('Aula 1');
    });
  });
});
