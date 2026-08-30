import { Course, CourseLesson, CourseEnrollment, CourseCompletion } from '../../../models';

const learningRepository = (db: any) => {
  const createCourse = async (instructorId: number, title: string, description?: string, mediaId?: number) => {
    return await Course.create({
      title,
      description,
      instructor_id: instructorId,
      media_id: mediaId
    });
  };

  const getCourseById = async (id: number) => {
    return await Course.findByPk(id);
  };

  const addLesson = async (courseId: number, title: string, mediaId?: number, orderIndex = 0) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }

    return await CourseLesson.create({
      course_id: courseId,
      title,
      media_id: mediaId,
      order_index: orderIndex
    });
  };

  const getCourseLessons = async (courseId: number) => {
    return await CourseLesson.findAll({
      where: { course_id: courseId },
      order: [['order_index', 'ASC']]
    });
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
    createCourse,
    getCourseById,
    addLesson,
    getCourseLessons,
    enroll,
    completeCourse,
    getCourseCompletion
  };
};

export default learningRepository;
