import learningRepository from '../repository/learning.repo';
import CourseDTO from '../../../dtos/CourseDTO';
import CourseLessonDTO from '../../../dtos/CourseLessonDTO';
import CourseEnrollmentDTO from '../../../dtos/CourseEnrollmentDTO';
import CourseCompletionDTO from '../../../dtos/CourseCompletionDTO';
import UserDTO from '../../../dtos/UserDTO';
import CompanyDTO from '../../../dtos/CompanyDTO';

const learningResolvers = {
  Query: {
    courses: async (parent: any, args: any, ctx: any, info: any) => {
      const courses = await learningRepository(ctx.orm).getCourses(args);
      return (courses || []).map((c: any) => new CourseDTO(c));
    },
    companyCourses: async (parent: any, args: any, ctx: any, info: any) => {
      const courses = await learningRepository(ctx.orm).getCompanyCourses(args.companyId);
      return (courses || []).map((c: any) => new CourseDTO(c));
    },
    course: async (parent: any, args: any, ctx: any, info: any) => {
      const course = await learningRepository(ctx.orm).getCourseById(args.id);
      return course ? new CourseDTO(course) : null;
    },
    courseLessons: async (parent: any, args: any, ctx: any, info: any) => {
      const lessons = await learningRepository(ctx.orm).getCourseLessons(args.courseId);
      return (lessons || []).map((l: any) => new CourseLessonDTO(l));
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
        args.mediaId,
        {
          companyId: args.companyId,
          providerType: args.providerType,
          level: args.level,
          category: args.category,
          requirements: args.requirements,
          whatYouWillLearn: args.whatYouWillLearn,
          durationHours: args.durationHours
        }
      );
      return new CourseDTO(course);
    },
    updateCourse: async (parent: any, args: any, ctx: any, info: any) => {
      const course = await learningRepository(ctx.orm).updateCourse(args.id, {
        title: args.title,
        description: args.description,
        mediaId: args.mediaId,
        level: args.level,
        category: args.category,
        requirements: args.requirements,
        whatYouWillLearn: args.whatYouWillLearn,
        durationHours: args.durationHours
      });
      return new CourseDTO(course);
    },
    addCourseLesson: async (parent: any, args: any, ctx: any, info: any) => {
      const lesson = await learningRepository(ctx.orm).addLesson(
        args.courseId,
        args.title,
        args.mediaId,
        args.orderIndex,
        {
          sectionName: args.sectionName,
          contentType: args.contentType,
          videoUrl: args.videoUrl,
          attachmentUrl: args.attachmentUrl,
          attachmentName: args.attachmentName,
          durationMinutes: args.durationMinutes,
          description: args.description
        }
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
      if (ctx.dataloaders?.usersLoader) {
        const users = await ctx.dataloaders.usersLoader.load({ key: parent.instructorId, info });
        return users && users[0] ? new UserDTO(users[0]) : null;
      }
      return null;
    },
    company: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.companyId) return null;
      if (ctx.dataloaders?.companiesLoader) {
        const companies = await ctx.dataloaders.companiesLoader.load({ key: parent.companyId, info });
        return companies && companies[0] ? new CompanyDTO(companies[0]) : null;
      }
      return null;
    },
    lessons: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      if (ctx.dataloaders?.lessonsLoader) {
        const lessons = await ctx.dataloaders.lessonsLoader.load({ key: parent.id, info });
        return (lessons || []).map((l: any) => new CourseLessonDTO(l));
      }
      const lessons = await learningRepository(ctx.orm).getCourseLessons(parent.id);
      return (lessons || []).map((l: any) => new CourseLessonDTO(l));
    },
    sections: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      const sections = await learningRepository(ctx.orm).getCourseSections(parent.id);
      return sections.map((sec) => ({
        name: sec.name,
        lessons: sec.lessons.map((l: any) => new CourseLessonDTO(l))
      }));
    }
  },
  CourseLesson: {
    course: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.courseId) return null;
      if (ctx.dataloaders?.coursesLoader) {
        const courses = await ctx.dataloaders.coursesLoader.load({ key: parent.courseId, info });
        return courses && courses[0] ? new CourseDTO(courses[0]) : null;
      }
      const course = await learningRepository(ctx.orm).getCourseById(parent.courseId);
      return course ? new CourseDTO(course) : null;
    }
  },
  CourseEnrollment: {
    course: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.courseId) return null;
      if (ctx.dataloaders?.coursesLoader) {
        const courses = await ctx.dataloaders.coursesLoader.load({ key: parent.courseId, info });
        return courses && courses[0] ? new CourseDTO(courses[0]) : null;
      }
      const course = await learningRepository(ctx.orm).getCourseById(parent.courseId);
      return course ? new CourseDTO(course) : null;
    },
    user: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId) return null;
      if (ctx.dataloaders?.usersLoader) {
        const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info });
        return users && users[0] ? new UserDTO(users[0]) : null;
      }
      return null;
    }
  }
};

export default learningResolvers;
