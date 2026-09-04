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

        // Campos de Inclusão e Modalidade (PCD & Remoto)
        this.isPcd = Boolean(job.is_pcd);
        this.isRemote = job.is_remote !== undefined ? Boolean(job.is_remote) : (job.workplace_type === 'REMOTE');
        this.pcdDetails = job.pcd_details || null;

        let parsedAccessibility: string[] = [];
        if (Array.isArray(job.accessibility_features)) {
            parsedAccessibility = job.accessibility_features;
        } else if (typeof job.accessibility_features === 'string') {
            try {
                parsedAccessibility = JSON.parse(job.accessibility_features);
            } catch (e) {
                parsedAccessibility = job.accessibility_features.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        this.accessibilityFeatures = Array.isArray(parsedAccessibility) ? parsedAccessibility : [];
    }
}
