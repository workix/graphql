import { Course, CourseLesson, CourseEnrollment, CourseCompletion } from '../../../models';

const learningRepository = (db: any) => {
  const getCourses = async (filters: { category?: string; level?: string; providerType?: string; search?: string } = {}) => {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.level) {
      where.level = filters.level;
    }
    if (filters.providerType) {
      where.provider_type = filters.providerType;
    }
    if (filters.search) {
      const Op = db?.Sequelize?.Op || { like: '$like', or: '$or' };
      where[Op.or || '$or'] = [
        { title: { [Op.like || '$like']: `%${filters.search}%` } },
        { description: { [Op.like || '$like']: `%${filters.search}%` } }
      ];
    }

    return await Course.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
  };

  const getCompanyCourses = async (companyId: number) => {
    return await Course.findAll({
      where: { company_id: companyId },
      order: [['created_at', 'DESC']]
    });
  };

  const createCourse = async (
    instructorId: number,
    title: string,
    description?: string,
    mediaId?: number,
    extraData: {
      companyId?: number;
      providerType?: string;
      level?: string;
      category?: string;
      requirements?: string;
      whatYouWillLearn?: string;
      durationHours?: number;
    } = {}
  ) => {
    return await Course.create({
      title,
      description,
      instructor_id: instructorId,
      media_id: mediaId,
      company_id: extraData.companyId || null,
      provider_type: extraData.providerType || (extraData.companyId ? 'COMPANY' : 'PLATFORM'),
      level: extraData.level || 'INTERMEDIATE',
      category: extraData.category || null,
      requirements: extraData.requirements || null,
      what_you_will_learn: extraData.whatYouWillLearn || null,
      duration_hours: extraData.durationHours || 0
    });
  };

  const updateCourse = async (
    id: number,
    updateData: {
      title?: string;
      description?: string;
      mediaId?: number;
      level?: string;
      category?: string;
      requirements?: string;
      whatYouWillLearn?: string;
      durationHours?: number;
    }
  ) => {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new Error(`Course ${id} not found`);
    }

    const payload: any = {};
    if (updateData.title !== undefined) payload.title = updateData.title;
    if (updateData.description !== undefined) payload.description = updateData.description;
    if (updateData.mediaId !== undefined) payload.media_id = updateData.mediaId;
    if (updateData.level !== undefined) payload.level = updateData.level;
    if (updateData.category !== undefined) payload.category = updateData.category;
    if (updateData.requirements !== undefined) payload.requirements = updateData.requirements;
    if (updateData.whatYouWillLearn !== undefined) payload.what_you_will_learn = updateData.whatYouWillLearn;
    if (updateData.durationHours !== undefined) payload.duration_hours = updateData.durationHours;

    await course.update(payload);
    return course;
  };

  const getCourseById = async (id: number) => {
    return await Course.findByPk(id);
  };

  const addLesson = async (
    courseId: number,
    title: string,
    mediaId?: number,
    orderIndex = 0,
    extraLessonData: {
      sectionName?: string;
      contentType?: string;
      videoUrl?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      durationMinutes?: number;
      description?: string;
    } = {}
  ) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }

    return await CourseLesson.create({
      course_id: courseId,
      title,
      media_id: mediaId,
      order_index: orderIndex,
      section_name: extraLessonData.sectionName || 'Módulo Principal',
      content_type: extraLessonData.contentType || 'VIDEO',
      video_url: extraLessonData.videoUrl || null,
      attachment_url: extraLessonData.attachmentUrl || null,
      attachment_name: extraLessonData.attachmentName || null,
      duration_minutes: extraLessonData.durationMinutes || 10,
      description: extraLessonData.description || null
    });
  };

  const getCourseLessons = async (courseId: number) => {
    return await CourseLesson.findAll({
      where: { course_id: courseId },
      order: [['order_index', 'ASC']]
    });
  };

  const getCourseSections = async (courseId: number) => {
    const lessons = await getCourseLessons(courseId);
    const sectionsMap = new Map<string, any[]>();

    for (const lesson of lessons) {
      const sectionName = lesson.section_name || 'Módulo Principal';
      if (!sectionsMap.has(sectionName)) {
        sectionsMap.set(sectionName, []);
      }
      sectionsMap.get(sectionName)!.push(lesson);
    }

    const sections: Array<{ name: string; lessons: any[] }> = [];
    sectionsMap.forEach((secLessons, name) => {
      sections.push({ name, lessons: secLessons });
    });

    return sections;
  };

  const enroll = async (courseId: number, userId: number) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }

    const existing = await CourseEnrollment.findOne({ where: { course_id: courseId, user_id: userId } });
    if (existing) return existing;

    return await CourseEnrollment.create({ course_id: courseId, user_id: userId });
  };

  const completeCourse = async (enrollmentId: number) => {
    const enrollment = await CourseEnrollment.findByPk(enrollmentId);
    if (!enrollment) {
      throw new Error(`Course enrollment ${enrollmentId} not found`);
    }

    const existing = await CourseCompletion.findOne({ where: { enrollment_id: enrollmentId } });
    if (existing) return existing;

    return await CourseCompletion.create({
      enrollment_id: enrollmentId,
      certificate_url: `/certificates/${enrollmentId}`
    });
  };

  const getCourseCompletion = async (enrollmentId: number) => {
    return await CourseCompletion.findOne({ where: { enrollment_id: enrollmentId } });
  };

  return {
    getCourses,
    getCompanyCourses,
    createCourse,
    updateCourse,
    getCourseById,
    addLesson,
    getCourseLessons,
    getCourseSections,
    enroll,
    completeCourse,
    getCourseCompletion
  };
};

export default learningRepository;
