export default class SelectiveProcessDTO {
    constructor(sp){
        this.id = sp.id
        this.createdAt = sp.created_at
        this.updatedAt = sp.updated_at
        this.uuid = sp.uuid           
        this.activated = sp.activated        
        this.disabledAt = sp.disabled_at
        this.expiresIn = sp.expires_in
        this.maxCandidates = sp.max_candidates
        this.startsIn = sp.starts_in
        this.jobId = sp.job_id
    }
}