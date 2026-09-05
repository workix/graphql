import { v4 as uuidv4 } from 'uuid';
import { normalizeJobCategories } from '../types/job_categories';
import { normalizeJobEmploymentType, JobEmploymentType } from '../types/job_employment_types';

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
        this.job_category = input.jobCategory || 'MANAGEMENT'
        this.job_type = input.jobType || 'FULLTIME'
        this.max_payment = input.maxPayment
        this.min_payment = input.minPayment
        this.requirement = input.requirement
        this.title = input.title
        this.company_id = input.companyId
        this.expires_at = input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        this.outcome_status = input.outcomeStatus || 'OPEN'
        this.is_sponsored = Boolean(input.isSponsored)
        this.sponsor_label = input.sponsorLabel || (input.isSponsored ? 'Patrocinada' : 'Patrocinada')
        this.skills = input.skills ? (Array.isArray(input.skills) ? JSON.stringify(input.skills) : input.skills) : '[]'
        this.workplace_type = input.workplaceType || (input.isRemote ? 'REMOTE' : 'ON_SITE')
        this.seniority_level = input.seniorityLevel || 'PLENO'
        this.city = input.city || null
        this.state = input.state || null
        this.is_pcd = Boolean(input.isPcd)
        this.is_remote = input.isRemote !== undefined ? Boolean(input.isRemote) : (this.workplace_type === 'REMOTE')
        this.pcd_details = input.pcdDetails || null
        this.accessibility_features = input.accessibilityFeatures
            ? (Array.isArray(input.accessibilityFeatures) ? JSON.stringify(input.accessibilityFeatures) : input.accessibilityFeatures)
            : '[]'
        
        // Novas Categorias e Tipo de Contratação
        const categories = normalizeJobCategories(input.categories)
        this.categories = JSON.stringify(categories)
        this.employment_type = normalizeJobEmploymentType(input.employmentType, JobEmploymentType.CLT)
    }
}

export class UpdateJobDTO {
  [key: string]: any;
    constructor(input) {
        if (input.activated !== undefined) this.activated = input.activated
        if (input.benefits !== undefined) this.benefits = input.benefits
        if (input.description !== undefined) this.description = input.description
        if (input.featured !== undefined) this.featured = input.featured
        if (input.jobCategory !== undefined) this.job_category = input.jobCategory
        if (input.jobType !== undefined) this.job_type = input.jobType
        if (input.maxPayment !== undefined) this.max_payment = input.maxPayment
        if (input.minPayment !== undefined) this.min_payment = input.minPayment
        if (input.requirement !== undefined) this.requirement = input.requirement
        if (input.title !== undefined) this.title = input.title
        if (input.companyId !== undefined) this.company_id = input.companyId
        if (input.expiresAt) this.expires_at = new Date(input.expiresAt)
        if (input.outcomeStatus) this.outcome_status = input.outcomeStatus
        if (input.isSponsored !== undefined) this.is_sponsored = Boolean(input.isSponsored)
        if (input.sponsorLabel) this.sponsor_label = input.sponsorLabel
        if (input.skills !== undefined) this.skills = Array.isArray(input.skills) ? JSON.stringify(input.skills) : input.skills
        if (input.workplaceType) {
            this.workplace_type = input.workplaceType
            if (input.isRemote === undefined) {
                this.is_remote = (input.workplaceType === 'REMOTE')
            }
        }
        if (input.seniorityLevel) this.seniority_level = input.seniorityLevel
        if (input.city !== undefined) this.city = input.city
        if (input.state !== undefined) this.state = input.state
        if (input.isPcd !== undefined) this.is_pcd = Boolean(input.isPcd)
        if (input.isRemote !== undefined) {
            this.is_remote = Boolean(input.isRemote)
            if (input.isRemote && !input.workplaceType) {
                this.workplace_type = 'REMOTE'
            }
        }
        if (input.pcdDetails !== undefined) this.pcd_details = input.pcdDetails
        if (input.accessibilityFeatures !== undefined) {
            this.accessibility_features = Array.isArray(input.accessibilityFeatures)
                ? JSON.stringify(input.accessibilityFeatures)
                : input.accessibilityFeatures
        }
        if (input.categories !== undefined) {
            this.categories = JSON.stringify(normalizeJobCategories(input.categories))
        }
        if (input.employmentType !== undefined) {
            this.employment_type = normalizeJobEmploymentType(input.employmentType, JobEmploymentType.CLT)
        }
    }
}
