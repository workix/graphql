import graphqlClient from './graphql';

export interface CourseModel {
  id: string | number;
  title: string;
  description?: string;
  instructorId: string | number;
  mediaId?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLessonModel {
  id: string | number;
  courseId: string | number;
  title: string;
  mediaId?: string | number;
  orderIndex: number;
  createdAt?: string;
}

export interface CourseEnrollmentModel {
  id: string | number;
  courseId: string | number;
  userId: string | number;
  enrolledAt?: string;
}

export interface CourseCompletionModel {
  id: string | number;
  enrollmentId: string | number;
  completedAt?: string;
  certificateUrl?: string;
}

export const learningService = {
  async getCourse(id: string | number): Promise<CourseModel | null> {
    const query = `
      query GetCourse($id: ID!) {
        course(id: $id) {
          id
          title
          description
          instructorId
          mediaId
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ course: CourseModel }>(query, {
        id: String(id)
      });
      return data.course || null;
    } catch (err) {
      console.warn('Erro ao carregar curso:', err);
      return null;
    }
  },

  async getCourseLessons(courseId: string | number): Promise<CourseLessonModel[]> {
    const query = `
      query GetCourseLessons($courseId: ID!) {
        courseLessons(courseId: $courseId) {
          id
          courseId
          title
          mediaId
          orderIndex
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ courseLessons: CourseLessonModel[] }>(query, {
        courseId: String(courseId)
      });
      return data.courseLessons || [];
    } catch (err) {
      console.warn('Erro ao carregar aulas do curso:', err);
      return [];
    }
  },

  async createCourse(
    instructorId: string | number,
    title: string,
    description?: string,
    mediaId?: string | number
  ): Promise<CourseModel | null> {
    const mutation = `
      mutation CreateCourse($instructorId: ID!, $title: String!, $description: String, $mediaId: ID) {
        createCourse(instructorId: $instructorId, title: $title, description: $description, mediaId: $mediaId) {
          id
          title
          description
          instructorId
          mediaId
        }
      }
    `;

    const data = await graphqlClient.request<{ createCourse: CourseModel }>(mutation, {
      instructorId: String(instructorId),
      title,
      description,
      mediaId: mediaId ? String(mediaId) : null
    });
    return data.createCourse || null;
  },

  async addCourseLesson(
    courseId: string | number,
    title: string,
    mediaId?: string | number,
    orderIndex = 1
  ): Promise<CourseLessonModel | null> {
    const mutation = `
      mutation AddCourseLesson($courseId: ID!, $title: String!, $mediaId: ID, $orderIndex: Int) {
        addCourseLesson(courseId: $courseId, title: $title, mediaId: $mediaId, orderIndex: $orderIndex) {
          id
          courseId
          title
          mediaId
          orderIndex
        }
      }
    `;

    const data = await graphqlClient.request<{ addCourseLesson: CourseLessonModel }>(mutation, {
      courseId: String(courseId),
      title,
      mediaId: mediaId ? String(mediaId) : null,
      orderIndex
    });
    return data.addCourseLesson || null;
  },

  async enrollInCourse(
    courseId: string | number,
    userId: string | number
  ): Promise<CourseEnrollmentModel | null> {
    const mutation = `
      mutation EnrollInCourse($courseId: ID!, $userId: ID!) {
        enrollInCourse(courseId: $courseId, userId: $userId) {
          id
          courseId
          userId
          enrolledAt
        }
      }
    `;

    const data = await graphqlClient.request<{ enrollInCourse: CourseEnrollmentModel }>(mutation, {
      courseId: String(courseId),
      userId: String(userId)
    });
    return data.enrollInCourse || null;
  },

  async completeCourse(enrollmentId: string | number): Promise<CourseCompletionModel | null> {
    const mutation = `
      mutation CompleteCourse($enrollmentId: ID!) {
        completeCourse(enrollmentId: $enrollmentId) {
          id
          enrollmentId
          completedAt
          certificateUrl
        }
      }
    `;

    const data = await graphqlClient.request<{ completeCourse: CourseCompletionModel }>(mutation, {
      enrollmentId: String(enrollmentId)
    });
    return data.completeCourse || null;
  },

  async getCourseCompletion(enrollmentId: string | number): Promise<CourseCompletionModel | null> {
    const query = `
      query GetCourseCompletion($enrollmentId: ID!) {
        courseCompletion(enrollmentId: $enrollmentId) {
          id
          enrollmentId
          completedAt
          certificateUrl
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ courseCompletion: CourseCompletionModel }>(query, {
        enrollmentId: String(enrollmentId)
      });
      return data.courseCompletion || null;
    } catch (err) {
      console.warn('Erro ao carregar conclusão do curso:', err);
      return null;
    }
  }
};

export default learningService;
