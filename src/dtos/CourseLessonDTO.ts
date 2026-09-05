export default class CourseLessonDTO {
  id?: number;
  courseId?: number;
  title?: string;
  mediaId?: number;
  orderIndex?: number;
  sectionName?: string;
  contentType?: string;
  videoUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  durationMinutes?: number;
  description?: string;
  createdAt?: Date;

  constructor(lesson: any) {
    if (lesson) {
      this.id = lesson.id;
      this.courseId = lesson.course_id || lesson.courseId;
      this.title = lesson.title;
      this.mediaId = lesson.media_id || lesson.mediaId;
      this.orderIndex = lesson.order_index !== undefined ? lesson.order_index : (lesson.orderIndex ?? 0);
      this.sectionName = lesson.section_name || lesson.sectionName || 'Módulo Principal';
      this.contentType = lesson.content_type || lesson.contentType || 'VIDEO';
      this.videoUrl = lesson.video_url || lesson.videoUrl;
      this.attachmentUrl = lesson.attachment_url || lesson.attachmentUrl;
      this.attachmentName = lesson.attachment_name || lesson.attachmentName;
      this.durationMinutes = lesson.duration_minutes !== undefined ? lesson.duration_minutes : (lesson.durationMinutes ?? 10);
      this.description = lesson.description;
      this.createdAt = lesson.created_at || lesson.createdAt;
    }
  }
}
