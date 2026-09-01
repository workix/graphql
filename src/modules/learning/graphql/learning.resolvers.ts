import learningRepository from '../repository/learning.repo';
import CourseDTO from '../../../dtos/CourseDTO';
import CourseLessonDTO from '../../../dtos/CourseLessonDTO';
import CourseEnrollmentDTO from '../../../dtos/CourseEnrollmentDTO';
import CourseCompletionDTO from '../../../dtos/CourseCompletionDTO';
import UserDTO from '../../../dtos/UserDTO';

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
  },
  Course: {
    instructor: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.instructorId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.instructorId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    lessons: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      const lessons = await ctx.dataloaders.lessonsLoader.load({ key: parent.id, info });
      return (lessons || []).map((l: any) => new CourseLessonDTO(l));
    }
  },
  CourseLesson: {
    course: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.courseId) return null;
      const courses = await ctx.dataloaders.coursesLoader.load({ key: parent.courseId, info });
      return courses && courses[0] ? new CourseDTO(courses[0]) : null;
    }
  },
  CourseEnrollment: {
    course: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.courseId) return null;
      const courses = await ctx.dataloaders.coursesLoader.load({ key: parent.courseId, info });
      return courses && courses[0] ? new CourseDTO(courses[0]) : null;
    },
    user: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  }
};

export default learningResolvers;

