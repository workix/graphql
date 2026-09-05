import graphqlClient from './graphql';

export interface CourseModel {
  id: string | number;
  title: string;
  description?: string;
  instructorId: string | number;
  instructorName?: string;
  companyId?: string | number;
  companyName?: string;
  providerType?: 'PLATFORM' | 'COMPANY' | string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS' | string;
  category?: string;
  requirements?: string;
  whatYouWillLearn?: string;
  durationHours?: number;
  mediaId?: string | number;
  lessons?: CourseLessonModel[];
  sections?: CourseSectionModel[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSectionModel {
  name: string;
  lessons: CourseLessonModel[];
}

export interface CourseLessonModel {
  id: string | number;
  courseId: string | number;
  title: string;
  sectionName?: string;
  contentType?: 'VIDEO' | 'ARTICLE' | 'DOCUMENT' | string;
  videoUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  durationMinutes?: number;
  description?: string;
  mediaId?: string | number;
  orderIndex: number;
  isCompleted?: boolean;
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
  async getCourses(filters: { category?: string; level?: string; providerType?: string; search?: string } = {}): Promise<CourseModel[]> {
    const query = `
      query GetCourses($category: String, $level: String, $providerType: String, $search: String) {
        courses(category: $category, level: $level, providerType: $providerType, search: $search) {
          id
          title
          description
          instructorId
          instructor {
            id
            name
          }
          companyId
          company {
            id
            name
          }
          providerType
          level
          category
          requirements
          whatYouWillLearn
          durationHours
          mediaId
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ courses: any[] }>(query, filters);
      return (data.courses || []).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        instructorId: c.instructorId,
        instructorName: c.instructor?.name,
        companyId: c.companyId,
        companyName: c.company?.name,
        providerType: c.providerType || 'PLATFORM',
        level: c.level || 'INTERMEDIATE',
        category: c.category || 'Geral',
        requirements: c.requirements,
        whatYouWillLearn: c.whatYouWillLearn,
        durationHours: c.durationHours || 0,
        mediaId: c.mediaId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));
    } catch (err) {
      console.warn('Erro ao buscar catálogo de cursos:', err);
      return [];
    }
  },

  async getCompanyCourses(companyId: string | number): Promise<CourseModel[]> {
    const query = `
      query GetCompanyCourses($companyId: ID!) {
        companyCourses(companyId: $companyId) {
          id
          title
          description
          providerType
          level
          category
          durationHours
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ companyCourses: any[] }>(query, {
        companyId: String(companyId)
      });
      return (data.companyCourses || []).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        instructorId: 1,
        companyId,
        providerType: c.providerType || 'COMPANY',
        level: c.level || 'INTERMEDIATE',
        category: c.category || 'Empresarial',
        durationHours: c.durationHours || 0,
        createdAt: c.createdAt
      }));
    } catch (err) {
      console.warn('Erro ao buscar cursos da empresa:', err);
      return [];
    }
  },

  async getCourse(id: string | number): Promise<CourseModel | null> {
    const query = `
      query GetCourse($id: ID!) {
        course(id: $id) {
          id
          title
          description
          instructorId
          instructor {
            id
            name
          }
          companyId
          company {
            id
            name
          }
          providerType
          level
          category
          requirements
          whatYouWillLearn
          durationHours
          mediaId
          sections {
            name
            lessons {
              id
              courseId
              title
              sectionName
              contentType
              videoUrl
              attachmentUrl
              attachmentName
              durationMinutes
              description
              orderIndex
            }
          }
          lessons {
            id
            courseId
            title
            sectionName
            contentType
            videoUrl
            attachmentUrl
            attachmentName
            durationMinutes
            description
            orderIndex
            createdAt
          }
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ course: any }>(query, {
        id: String(id)
      });

      if (!data.course) return null;
      const c = data.course;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        instructorId: c.instructorId,
        instructorName: c.instructor?.name,
        companyId: c.companyId,
        companyName: c.company?.name,
        providerType: c.providerType || 'PLATFORM',
        level: c.level || 'INTERMEDIATE',
        category: c.category || 'Geral',
        requirements: c.requirements,
        whatYouWillLearn: c.whatYouWillLearn,
        durationHours: c.durationHours || 0,
        mediaId: c.mediaId,
        sections: (c.sections || []).map((sec: any) => ({
          name: sec.name,
          lessons: (sec.lessons || []).map((l: any) => ({
            id: l.id,
            courseId: l.courseId,
            title: l.title,
            sectionName: l.sectionName || sec.name,
            contentType: l.contentType || 'VIDEO',
            videoUrl: l.videoUrl,
            attachmentUrl: l.attachmentUrl,
            attachmentName: l.attachmentName,
            durationMinutes: l.durationMinutes || 10,
            description: l.description,
            orderIndex: l.orderIndex
          }))
        })),
        lessons: (c.lessons || []).map((l: any) => ({
          id: l.id,
          courseId: l.courseId,
          title: l.title,
          sectionName: l.sectionName || 'Módulo Principal',
          contentType: l.contentType || 'VIDEO',
          videoUrl: l.videoUrl,
          attachmentUrl: l.attachmentUrl,
          attachmentName: l.attachmentName,
          durationMinutes: l.durationMinutes || 10,
          description: l.description,
          orderIndex: l.orderIndex,
          createdAt: l.createdAt
        })),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      };
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
          sectionName
          contentType
          videoUrl
          attachmentUrl
          attachmentName
          durationMinutes
          description
          mediaId
          orderIndex
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ courseLessons: any[] }>(query, {
        courseId: String(courseId)
      });
      return (data.courseLessons || []).map((l) => ({
        id: l.id,
        courseId: l.courseId,
        title: l.title,
        sectionName: l.sectionName || 'Módulo Principal',
        contentType: l.contentType || 'VIDEO',
        videoUrl: l.videoUrl,
        attachmentUrl: l.attachmentUrl,
        attachmentName: l.attachmentName,
        durationMinutes: l.durationMinutes || 10,
        description: l.description,
        mediaId: l.mediaId,
        orderIndex: l.orderIndex,
        createdAt: l.createdAt
      }));
    } catch (err) {
      console.warn('Erro ao carregar aulas do curso:', err);
      return [];
    }
  },

  async createCourse(
    instructorId: string | number,
    title: string,
    description?: string,
    mediaId?: string | number,
    extra: {
      companyId?: string | number;
      providerType?: string;
      level?: string;
      category?: string;
      requirements?: string;
      whatYouWillLearn?: string;
      durationHours?: number;
    } = {}
  ): Promise<CourseModel | null> {
    const mutation = `
      mutation CreateCourse(
        $instructorId: ID!
        $title: String!
        $description: String
        $mediaId: ID
        $companyId: ID
        $providerType: String
        $level: String
        $category: String
        $requirements: String
        $whatYouWillLearn: String
        $durationHours: Float
      ) {
        createCourse(
          instructorId: $instructorId
          title: $title
          description: $description
          mediaId: $mediaId
          companyId: $companyId
          providerType: $providerType
          level: $level
          category: $category
          requirements: $requirements
          whatYouWillLearn: $whatYouWillLearn
          durationHours: $durationHours
        ) {
          id
          title
          description
          instructorId
          companyId
          providerType
          level
          category
          durationHours
        }
      }
    `;

    const data = await graphqlClient.request<{ createCourse: any }>(mutation, {
      instructorId: String(instructorId),
      title,
      description,
      mediaId: mediaId ? String(mediaId) : null,
      companyId: extra.companyId ? String(extra.companyId) : null,
      providerType: extra.providerType || (extra.companyId ? 'COMPANY' : 'PLATFORM'),
      level: extra.level || 'INTERMEDIATE',
      category: extra.category,
      requirements: extra.requirements,
      whatYouWillLearn: extra.whatYouWillLearn,
      durationHours: extra.durationHours || 0
    });

    return data.createCourse || null;
  },

  async addCourseLesson(
    courseId: string | number,
    title: string,
    mediaId?: string | number,
    orderIndex = 1,
    extraLesson: {
      sectionName?: string;
      contentType?: string;
      videoUrl?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      durationMinutes?: number;
      description?: string;
    } = {}
  ): Promise<CourseLessonModel | null> {
    const mutation = `
      mutation AddCourseLesson(
        $courseId: ID!
        $title: String!
        $mediaId: ID
        $orderIndex: Int
        $sectionName: String
        $contentType: String
        $videoUrl: String
        $attachmentUrl: String
        $attachmentName: String
        $durationMinutes: Int
        $description: String
      ) {
        addCourseLesson(
          courseId: $courseId
          title: $title
          mediaId: $mediaId
          orderIndex: $orderIndex
          sectionName: $sectionName
          contentType: $contentType
          videoUrl: $videoUrl
          attachmentUrl: $attachmentUrl
          attachmentName: $attachmentName
          durationMinutes: $durationMinutes
          description: $description
        ) {
          id
          courseId
          title
          sectionName
          contentType
          videoUrl
          attachmentUrl
          attachmentName
          durationMinutes
          description
          orderIndex
        }
      }
    `;

    const data = await graphqlClient.request<{ addCourseLesson: any }>(mutation, {
      courseId: String(courseId),
      title,
      mediaId: mediaId ? String(mediaId) : null,
      orderIndex,
      sectionName: extraLesson.sectionName || 'Módulo Principal',
      contentType: extraLesson.contentType || 'VIDEO',
      videoUrl: extraLesson.videoUrl,
      attachmentUrl: extraLesson.attachmentUrl,
      attachmentName: extraLesson.attachmentName,
      durationMinutes: extraLesson.durationMinutes || 10,
      description: extraLesson.description
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
