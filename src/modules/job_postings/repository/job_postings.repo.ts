import { JobPosting, JobApplication } from '../../../models';

const jobPostingsRepository = (db: any) => {
  const createJobPosting = async (
    companyId: number,
    title: string,
    description: string,
    location?: string,
    workType?: string,
    requiredSkills?: string[]
  ) => {
    const job = await JobPosting.create({
      company_id: companyId,
      title,
      description,
      location,
      work_type: workType,
      required_skills: requiredSkills ? JSON.stringify(requiredSkills) : null
    });
    return job;
  };

  const getJobPostings = async (companyId?: number, limit = 20, offset = 0) => {
    const where = companyId ? { company_id: companyId } : {};
    const jobs = await JobPosting.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    return jobs;
  };

  const getJobPostingById = async (id: number) => {
    return await JobPosting.findByPk(id);
  };

  const applyToJob = async (jobId: number, candidateId: number, candidateSkills: string[] = [], resumeId?: number) => {
    const job = await JobPosting.findByPk(jobId);
    if (!job) {
      throw new Error(`Job posting ${jobId} not found`);
    }

    let requiredSkillsArr: string[] = [];
    if (job.required_skills) {
      try {
        requiredSkillsArr = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : job.required_skills;
      } catch {
        requiredSkillsArr = [];
      }
    }

    let matchScore = 0;
    if (requiredSkillsArr.length > 0) {
      const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
      const matched = requiredSkillsArr.filter(reqSkill =>
        normalizedCandidateSkills.includes(reqSkill.toLowerCase().trim())
      );
      matchScore = Math.round((matched.length / requiredSkillsArr.length) * 100 * 100) / 100;
    } else {
      matchScore = 100;
    }

    const application = await JobApplication.create({
      job_id: jobId,
      candidate_id: candidateId,
      resume_id: resumeId,
      status: 'SUBMITTED',
      match_score: matchScore
    });

    return application;
  };

  const getJobApplications = async (jobId: number) => {
    return await JobApplication.findAll({
      where: { job_id: jobId },
      order: [['match_score', 'DESC']]
    });
  };

  return {
    createJobPosting,
    getJobPostings,
    getJobPostingById,
    applyToJob,
    getJobApplications
  };
};

export default jobPostingsRepository;
