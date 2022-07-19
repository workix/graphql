export default class JobDTO {
    constructor(job){
        this.id = job.id
        this.createdAt = job.created_at
        this.updatedAt = job.updated_at
        this.uuid = job.uuid    
        this.activated = job.activated
        this.benefits = job.benefits
        this.description = job.description
        this.featured = job.featured
        this.jobCategory = job.job_category
        this.jobType = job.job_type
        this.maxPayment = job.max_payment
        this.minPayment = job.min_payment
        this.requirement = job.requirement
        this.title = job.title
        this.companyId = job.company_id       
    }
}