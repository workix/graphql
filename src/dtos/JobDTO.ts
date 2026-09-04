export default class JobDTO {
  [key: string]: any;
    constructor(job){
        const validCategories = ['MANAGEMENT', 'OPERATOR'];
        const validTypes = ['FREELANCE', 'FULLTIME', 'INTERNSHIP', 'PARTTIME', 'TEMPORARY', 'VOLUNTEER'];

        this.id = job.id
        this.createdAt = job.created_at
        this.updatedAt = job.updated_at
        this.uuid = job.uuid    
        this.activated = job.activated
        this.benefits = job.benefits
        this.description = job.description
        this.featured = Boolean(job.featured)
        this.jobCategory = validCategories.includes(job.job_category) ? job.job_category : 'MANAGEMENT'
        this.jobType = validTypes.includes(job.job_type) ? job.job_type : 'FULLTIME'
        this.maxPayment = job.max_payment
        this.minPayment = job.min_payment
        this.requirement = job.requirement
        this.title = job.title
        this.companyId = job.company_id
        this.expiresAt = job.expires_at || null
        this.outcomeStatus = job.outcome_status || 'OPEN'
        this.isSponsored = Boolean(job.is_sponsored)
        this.sponsorLabel = job.sponsor_label || (job.is_sponsored ? 'Patrocinada' : null)
        
        // Campos de busca estruturada
        let parsedSkills: string[] = [];
        if (Array.isArray(job.skills)) {
            parsedSkills = job.skills;
        } else if (typeof job.skills === 'string') {
            try {
                parsedSkills = JSON.parse(job.skills);
            } catch (e) {
                parsedSkills = job.skills.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        this.skills = Array.isArray(parsedSkills) ? parsedSkills : [];
        this.workplaceType = job.workplace_type || 'ON_SITE';
        this.seniorityLevel = job.seniority_level || 'PLENO';
        this.city = job.city || null;
        this.state = job.state || null;
    }
}
