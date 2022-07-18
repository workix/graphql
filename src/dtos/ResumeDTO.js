export default class ResumeDTO {
    constructor(resume){
        this.id = resume.id
        this.createdAt = resume.created_at
        this.updatedAt = resume.updated_at
        this.uuid = resume.uuid       
        this.carrerLevel = resume.carrer_level
        this.content = resume.content
        this.objective = resume.objective
        this.presence = resume.presence
        this.candidateId = resume.candidate_id       
    }
}