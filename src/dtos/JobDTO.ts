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
    }
}
