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
        this.expires_at = input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        this.outcome_status = input.outcomeStatus || 'OPEN'
        this.is_sponsored = Boolean(input.isSponsored)
        this.sponsor_label = input.sponsorLabel || (input.isSponsored ? 'Patrocinada' : 'Patrocinada')
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
        if (input.expiresAt) this.expires_at = new Date(input.expiresAt)
        if (input.outcomeStatus) this.outcome_status = input.outcomeStatus
        if (input.isSponsored !== undefined) this.is_sponsored = Boolean(input.isSponsored)
        if (input.sponsorLabel) this.sponsor_label = input.sponsorLabel
    }
}
