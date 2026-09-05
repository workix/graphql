export default class CandidateDTO {
  [key: string]: any;
    constructor(candidate){
        this.id = candidate.id
        this.createdAt = candidate.created_at
        this.updatedAt = candidate.updated_at
        this.uuid = candidate.uuid
        this.mobilePhone = candidate.mobile_phone
        this.city = candidate.city
        this.state = candidate.state
        this.neighborhood = candidate.neighborhood
        this.number = candidate.number
        this.street = candidate.street
        this.zipCode = candidate.zip_code
        this.name = candidate.name
        this.birthDate = candidate.birth_date
        this.cpf = candidate.cpf
        this.userId = candidate.user_id
        this.lookingForJob = Boolean(candidate.looking_for_job)
        this.inCareerTransition = Boolean(candidate.in_career_transition)
        this.careerTransitionTarget = candidate.career_transition_target || null
        this.acceptsEntryLevel = Boolean(candidate.accepts_entry_level)
        this.activeProcessesSummary = candidate.activeProcessesSummary || null
        this.activeProcesses = candidate.activeProcesses || null
    }
}
