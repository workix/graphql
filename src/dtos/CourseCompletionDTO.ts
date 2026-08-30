export default class CourseCompletionDTO {
  id?: number;
  enrollmentId?: number;
  completedAt?: Date;
  certificateUrl?: string;

  constructor(completion: any) {
    if (completion) {
      this.id = completion.id;
      this.enrollmentId = completion.enrollment_id || completion.enrollmentId;
      this.completedAt = completion.completed_at || completion.completedAt;
      this.certificateUrl = completion.certificate_url || completion.certificateUrl;
    }
  }
}
