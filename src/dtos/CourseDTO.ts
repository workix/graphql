export default class CourseDTO {
  id?: number;
  title?: string;
  description?: string;
  instructorId?: number;
  mediaId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(course: any) {
    if (course) {
      this.id = course.id;
      this.title = course.title;
      this.description = course.description;
      this.instructorId = course.instructor_id || course.instructorId;
      this.mediaId = course.media_id || course.mediaId;
      this.createdAt = course.created_at || course.createdAt;
      this.updatedAt = course.updated_at || course.updatedAt;
    }
  }
}
