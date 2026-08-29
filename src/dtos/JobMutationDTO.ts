import { v4 as uuidv4 } from 'uuid';

export class CreateJobDTO {
  [key: string]: any;
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.activated = input.activated
        this.benefits = input.benefits
        this.description = input.description
        this.featured = input.featured
        this.job_category = input.jobCategory
        this.job_type = input.jobType
        this.max_payment = input.maxPayment
        this.min_payment = input.minPayment
        this.requirement = input.requirement
        this.title = input.title
        this.company_id = input.companyId
    }
}

export class UpdateJobDTO {
  [key: string]: any;
    constructor(input) {
        this.activated = input.activated
        this.benefits = input.benefits
        this.description = input.description
        this.featured = input.featured
        this.job_category = input.jobCategory
        this.job_type = input.jobType
        this.max_payment = input.maxPayment
        this.min_payment = input.minPayment
        this.requirement = input.requirement
        this.title = input.title
        this.company_id = input.companyId
    }
}
