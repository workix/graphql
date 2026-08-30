export default class JobPostingDTO {
  id?: number;
  companyId?: number;
  title?: string;
  description?: string;
  location?: string;
  workType?: string;
  requiredSkills?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(job: any) {
    if (job) {
      this.id = job.id;
      this.companyId = job.company_id || job.companyId;
      this.title = job.title;
      this.description = job.description;
      this.location = job.location;
      this.workType = job.work_type || job.workType;
      if (job.required_skills) {
        try {
          this.requiredSkills = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : job.required_skills;
        } catch {
          this.requiredSkills = [];
        }
      } else {
        this.requiredSkills = job.requiredSkills || [];
      }
      this.createdAt = job.created_at || job.createdAt;
      this.updatedAt = job.updated_at || job.updatedAt;
    }
  }
}
