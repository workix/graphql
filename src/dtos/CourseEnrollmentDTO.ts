export default class CourseEnrollmentDTO {
  id?: number;
  courseId?: number;
  userId?: number;
  enrolledAt?: Date;

  constructor(enrollment: any) {
    if (enrollment) {
      this.id = enrollment.id;
      this.courseId = enrollment.course_id || enrollment.courseId;
      this.userId = enrollment.user_id || enrollment.userId;
      this.enrolledAt = enrollment.enrolled_at || enrollment.enrolledAt;
    }
  }
}
