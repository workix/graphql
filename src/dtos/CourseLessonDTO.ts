export default class CourseLessonDTO {
  id?: number;
  courseId?: number;
  title?: string;
  mediaId?: number;
  orderIndex?: number;
  createdAt?: Date;

  constructor(lesson: any) {
    if (lesson) {
      this.id = lesson.id;
      this.courseId = lesson.course_id || lesson.courseId;
      this.title = lesson.title;
      this.mediaId = lesson.media_id || lesson.mediaId;
      this.orderIndex = lesson.order_index ?? lesson.orderIndex;
      this.createdAt = lesson.created_at || lesson.createdAt;
    }
  }
}
