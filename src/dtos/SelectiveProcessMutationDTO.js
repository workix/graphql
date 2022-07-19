import { v4 as uuidv4 } from 'uuid';

export class CreateSelectiveProcessDTO {
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.activated = input.activated
        this.disabled_at = input.disabledAt
        this.expires_in = input.expiresIn
        this.max_candidates = input.maxCandidates
        this.starts_in = input.startsIn
        this.job_id = input.jobId
    }
}

export class UpdateSelectiveProcessDTO {
    constructor(input) {
        this.activated = input.activated
        this.disabled_at = input.disabledAt
        this.expires_in = input.expiresIn
        this.max_candidates = input.maxCandidates
        this.starts_in = input.startsIn
        this.job_id = input.jobId
    }
}