export default class CourseDTO {
  id?: number;
  title?: string;
  description?: string;
  instructorId?: number;
  mediaId?: number;
  companyId?: number;
  providerType?: string;
  level?: string;
  category?: string;
  requirements?: string;
  whatYouWillLearn?: string;
  durationHours?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(course: any) {
    if (course) {
      this.id = course.id;
      this.title = course.title;
      this.description = course.description;
      this.instructorId = course.instructor_id || course.instructorId;
      this.mediaId = course.media_id || course.mediaId;
      this.companyId = course.company_id || course.companyId;
      this.providerType = course.provider_type || course.providerType || 'PLATFORM';
      this.level = course.level || 'INTERMEDIATE';
      this.category = course.category;
      this.requirements = course.requirements;
      this.whatYouWillLearn = course.what_you_will_learn || course.whatYouWillLearn;
      this.durationHours = course.duration_hours !== undefined ? course.duration_hours : course.durationHours;
      this.createdAt = course.created_at || course.createdAt;
      this.updatedAt = course.updated_at || course.updatedAt;
    }
  }
}
