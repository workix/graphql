export default class JobApplicationDTO {
  id?: number;
  jobId?: number;
  candidateId?: number;
  resumeId?: number;
  status?: string;
  matchScore?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(app: any) {
    this.matchScore = 0;
    if (app) {
      this.id = app.id;
      this.jobId = app.job_id || app.jobId;
      this.candidateId = app.candidate_id || app.candidateId;
      this.resumeId = app.resume_id || app.resumeId;
      this.status = app.status;
      this.matchScore = app.match_score !== undefined ? app.match_score : (app.matchScore || 0);
      this.createdAt = app.created_at || app.createdAt;
      this.updatedAt = app.updated_at || app.updatedAt;
    }
  }
}
