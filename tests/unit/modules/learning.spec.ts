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
    mockCtx = { orm: {} };
    jest.clearAllMocks();
  });

  describe('learningRepository', () => {
    it('should create a course', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101', instructor_id: 10 };
      (Course.create as jest.Mock).mockResolvedValue(mockCourse);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.createCourse(10, 'GraphQL 101', 'Learn GraphQL', 5);

      expect(Course.create).toHaveBeenCalledWith({
        title: 'GraphQL 101',
        description: 'Learn GraphQL',
        instructor_id: 10,
        media_id: 5
      });
      expect(res).toEqual(mockCourse);
    });

    it('should get course by id', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101' };
      (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);

      const repo = learningRepository(mockCtx.orm);
      expect(await repo.getCourseById(1)).toEqual(mockCourse);
    });

    it('should throw error when adding a lesson to a non-existing course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = learningRepository(mockCtx.orm);

      await expect(repo.addLesson(99, 'Intro', 1, 0)).rejects.toThrow('Course 99 not found');
    });

    it('should add a lesson to an existing course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      const mockLesson = { id: 1, course_id: 1, title: 'Intro', order_index: 0 };
      (CourseLesson.create as jest.Mock).mockResolvedValue(mockLesson);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.addLesson(1, 'Intro', 2, 0);

      expect(CourseLesson.create).toHaveBeenCalledWith({ course_id: 1, title: 'Intro', media_id: 2, order_index: 0 });
      expect(res).toEqual(mockLesson);
    });

    it('should list course lessons ordered by order_index', async () => {
      const mockLessons = [{ id: 1, course_id: 1, title: 'Intro', order_index: 0 }];
      (CourseLesson.findAll as jest.Mock).mockResolvedValue(mockLessons);

      const repo = learningRepository(mockCtx.orm);
      expect(await repo.getCourseLessons(1)).toEqual(mockLessons);
    });

    it('should throw error when enrolling in a non-existing course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = learningRepository(mockCtx.orm);

      await expect(repo.enroll(99, 10)).rejects.toThrow('Course 99 not found');
    });

    it('should enroll a user in a course', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (CourseEnrollment.findOne as jest.Mock).mockResolvedValue(null);
      const mockEnrollment = { id: 1, course_id: 1, user_id: 10 };
      (CourseEnrollment.create as jest.Mock).mockResolvedValue(mockEnrollment);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.enroll(1, 10);

      expect(CourseEnrollment.create).toHaveBeenCalledWith({ course_id: 1, user_id: 10 });
      expect(res).toEqual(mockEnrollment);
    });

    it('should return existing enrollment when user is already enrolled', async () => {
      const mockEnrollment = { id: 1, course_id: 1, user_id: 10 };
      (Course.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (CourseEnrollment.findOne as jest.Mock).mockResolvedValue(mockEnrollment);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.enroll(1, 10);

      expect(CourseEnrollment.create).not.toHaveBeenCalled();
      expect(res).toEqual(mockEnrollment);
    });

    it('should throw error when completing a non-existing enrollment', async () => {
      (CourseEnrollment.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = learningRepository(mockCtx.orm);

      await expect(repo.completeCourse(99)).rejects.toThrow('Course enrollment 99 not found');
    });

    it('should create a course completion with a certificate url', async () => {
      (CourseEnrollment.findByPk as jest.Mock).mockResolvedValue({ id: 5, course_id: 1, user_id: 10 });
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(null);
      const mockCompletion = { id: 1, enrollment_id: 5, certificate_url: '/certificates/5' };
      (CourseCompletion.create as jest.Mock).mockResolvedValue(mockCompletion);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.completeCourse(5);

      expect(CourseCompletion.create).toHaveBeenCalledWith({ enrollment_id: 5, certificate_url: '/certificates/5' });
      expect(res).toEqual(mockCompletion);
    });

    it('should return existing completion idempotently when course was already completed', async () => {
      (CourseEnrollment.findByPk as jest.Mock).mockResolvedValue({ id: 5, course_id: 1, user_id: 10 });
      const mockCompletion = { id: 1, enrollment_id: 5, certificate_url: '/certificates/5' };
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(mockCompletion);

      const repo = learningRepository(mockCtx.orm);
      const res = await repo.completeCourse(5);

      expect(CourseCompletion.create).not.toHaveBeenCalled();
      expect(res).toEqual(mockCompletion);
    });

    it('should get course completion by enrollment id', async () => {
      const mockCompletion = { id: 1, enrollment_id: 5 };
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(mockCompletion);

      const repo = learningRepository(mockCtx.orm);
      expect(await repo.getCourseCompletion(5)).toEqual(mockCompletion);
    });
  });

  describe('learningResolvers', () => {
    it('should resolve queries and mutations for learning', async () => {
      const mockCourse = { id: 1, title: 'GraphQL 101', instructor_id: 10 };
      const mockLesson = { id: 1, course_id: 1, title: 'Intro' };
      const mockEnrollment = { id: 5, course_id: 1, user_id: 10 };
      const mockCompletion = { id: 1, enrollment_id: 5, certificate_url: '/certificates/5' };

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
    });

    it('should resolve courseCompletion query when a completion already exists', async () => {
      const mockCompletion = { id: 1, enrollment_id: 5, certificate_url: '/certificates/5' };
      (CourseCompletion.findOne as jest.Mock).mockResolvedValue(mockCompletion);

      const q = learningResolvers.Query;
      const res = await q.courseCompletion(null, { enrollmentId: 5 }, mockCtx, {});
      expect(res).toBeInstanceOf(CourseCompletionDTO);
    });

    it('should return null for course query when course does not exist', async () => {
      (Course.findByPk as jest.Mock).mockResolvedValue(null);
      const q = learningResolvers.Query;

      const res = await q.course(null, { id: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      expect(new CourseDTO(null).id).toBeUndefined();
      expect(new CourseLessonDTO(null).id).toBeUndefined();
      expect(new CourseEnrollmentDTO(null).id).toBeUndefined();
      expect(new CourseCompletionDTO(null).id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const c = new CourseDTO({ id: 1, title: 'X', instructorId: 10, mediaId: 2, createdAt: now, updatedAt: now });
      expect(c.instructorId).toBe(10);
      expect(c.mediaId).toBe(2);
      expect(c.createdAt).toBe(now);
      expect(c.updatedAt).toBe(now);

      const l = new CourseLessonDTO({ id: 1, courseId: 1, title: 'Intro', mediaId: 2, orderIndex: 1, createdAt: now });
      expect(l.courseId).toBe(1);
      expect(l.mediaId).toBe(2);
      expect(l.orderIndex).toBe(1);
      expect(l.createdAt).toBe(now);

      const e = new CourseEnrollmentDTO({ id: 1, courseId: 1, userId: 10, enrolledAt: now });
      expect(e.courseId).toBe(1);
      expect(e.userId).toBe(10);
      expect(e.enrolledAt).toBe(now);

      const cc = new CourseCompletionDTO({ id: 1, enrollmentId: 5, completedAt: now, certificateUrl: '/certificates/5' });
      expect(cc.enrollmentId).toBe(5);
      expect(cc.completedAt).toBe(now);
      expect(cc.certificateUrl).toBe('/certificates/5');
    });
  });
});
