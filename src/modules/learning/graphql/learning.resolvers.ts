import learningRepository from '../repository/learning.repo';
import CourseDTO from '../../../dtos/CourseDTO';
import CourseLessonDTO from '../../../dtos/CourseLessonDTO';
import CourseEnrollmentDTO from '../../../dtos/CourseEnrollmentDTO';
import CourseCompletionDTO from '../../../dtos/CourseCompletionDTO';

const learningResolvers = {
  Query: {
    course: async (parent: any, args: any, ctx: any, info: any) => {
      const course = await learningRepository(ctx.orm).getCourseById(args.id);
      return course ? new CourseDTO(course) : null;
    },
    courseLessons: async (parent: any, args: any, ctx: any, info: any) => {
      const lessons = await learningRepository(ctx.orm).getCourseLessons(args.courseId);
      return lessons.map((l: any) => new CourseLessonDTO(l));
    },
    courseCompletion: async (parent: any, args: any, ctx: any, info: any) => {
      const completion = await learningRepository(ctx.orm).getCourseCompletion(args.enrollmentId);
      return completion ? new CourseCompletionDTO(completion) : null;
    }
  },
  Mutation: {
    createCourse: async (parent: any, args: any, ctx: any, info: any) => {
      const course = await learningRepository(ctx.orm).createCourse(
        args.instructorId,
        args.title,
        args.description,
        args.mediaId
      );
      return new CourseDTO(course);
    },
    addCourseLesson: async (parent: any, args: any, ctx: any, info: any) => {
      const lesson = await learningRepository(ctx.orm).addLesson(
        args.courseId,
        args.title,
        args.mediaId,
        args.orderIndex
      );
      return new CourseLessonDTO(lesson);
    },
    enrollInCourse: async (parent: any, args: any, ctx: any, info: any) => {
      const enrollment = await learningRepository(ctx.orm).enroll(args.courseId, args.userId);
      return new CourseEnrollmentDTO(enrollment);
    },
    completeCourse: async (parent: any, args: any, ctx: any, info: any) => {
      const completion = await learningRepository(ctx.orm).completeCourse(args.enrollmentId);
      return new CourseCompletionDTO(completion);
    }
  }
};

export default learningResolvers;
