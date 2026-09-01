import learningResolvers from '../../src/modules/learning/graphql/learning.resolvers';
import groupsResolvers from '../../src/modules/groups/graphql/groups.resolvers';
import eventsResolvers from '../../src/modules/events/graphql/events.resolvers';

describe('DataLoaders for Learning, Groups and Events (TDD)', () => {
  describe('Learning Field Resolvers (Course, Lesson, Enrollment)', () => {
    it('should resolve instructor and lessons on Course using DataLoaders', async () => {
      const mockUserLoad = jest.fn().mockResolvedValue([{ id: 10, email: 'instructor@test.com' }]);
      const mockLessonsLoad = jest.fn().mockResolvedValue([{ id: 1, courseId: 100, title: 'Lesson 1' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad },
          lessonsLoader: { load: mockLessonsLoad }
        }
      };

      const parentCourse = { id: 100, instructorId: 10, title: 'TypeScript Advanced' };
      const instructor = await (learningResolvers as any).Course.instructor(parentCourse, {}, ctx, {});
      const lessons = await (learningResolvers as any).Course.lessons(parentCourse, {}, ctx, {});

      expect(mockUserLoad).toHaveBeenCalledWith({ key: 10, info: {} });
      expect(mockLessonsLoad).toHaveBeenCalledWith({ key: 100, info: {} });
      expect(instructor.id).toBe(10);
      expect(lessons).toHaveLength(1);
      expect(lessons[0].title).toBe('Lesson 1');
    });

    it('should resolve course on CourseLesson and user on CourseEnrollment', async () => {
      const mockCourseLoad = jest.fn().mockResolvedValue([{ id: 100, title: 'TypeScript Advanced' }]);
      const mockUserLoad = jest.fn().mockResolvedValue([{ id: 50, email: 'student@test.com' }]);
      const ctx = {
        dataloaders: {
          coursesLoader: { load: mockCourseLoad },
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentLesson = { id: 1, courseId: 100, title: 'Intro' };
      const parentEnrollment = { id: 2, courseId: 100, userId: 50 };

      const course = await (learningResolvers as any).CourseLesson.course(parentLesson, {}, ctx, {});
      const user = await (learningResolvers as any).CourseEnrollment.user(parentEnrollment, {}, ctx, {});

      expect(mockCourseLoad).toHaveBeenCalledWith({ key: 100, info: {} });
      expect(mockUserLoad).toHaveBeenCalledWith({ key: 50, info: {} });
      expect(course.id).toBe(100);
      expect(user.id).toBe(50);
    });
  });

  describe('Groups Field Resolvers (Group, GroupMembership, GroupPost)', () => {
    it('should resolve group owner, membership user and post author via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentGroup = { id: 1, ownerId: 101, name: 'Node.js Developers' };
      const parentMembership = { id: 2, groupId: 1, userId: 102 };
      const parentPost = { id: 3, groupId: 1, authorId: 103, content: 'Hello Group' };

      const owner = await (groupsResolvers as any).Group.owner(parentGroup, {}, ctx, {});
      const member = await (groupsResolvers as any).GroupMembership.user(parentMembership, {}, ctx, {});
      const author = await (groupsResolvers as any).GroupPost.author(parentPost, {}, ctx, {});

      expect(owner.id).toBe(101);
      expect(member.id).toBe(102);
      expect(author.id).toBe(103);
    });
  });

  describe('Events Field Resolvers (Event, EventAttendee)', () => {
    it('should resolve event organizer and attendee user via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentEvent = { id: 10, organizerId: 301, title: 'Tech Conference' };
      const parentAttendee = { id: 11, eventId: 10, userId: 302, status: 'GOING' };

      const organizer = await (eventsResolvers as any).Event.organizer(parentEvent, {}, ctx, {});
      const attendee = await (eventsResolvers as any).EventAttendee.user(parentAttendee, {}, ctx, {});

      expect(organizer.id).toBe(301);
      expect(attendee.id).toBe(302);
    });
  });
});
