export default class ResumeDTO {
  [key: string]: any;
    constructor(resume){
        const validLevels = ['JUNIOR', 'MIDDLE', 'SENIOR', 'EXPERT'];
        const validPresences = ['REMOTE', 'OFFICE', 'RELOCATION', 'TRAVEL_A_LOT'];

        this.id = resume.id
        this.createdAt = resume.created_at
        this.updatedAt = resume.updated_at
        this.uuid = resume.uuid       
        this.carrerLevel = validLevels.includes(String(resume.carrer_level).toUpperCase()) ? String(resume.carrer_level).toUpperCase() : 'SENIOR'
        this.content = resume.content
        this.objective = resume.objective
        this.presence = validPresences.includes(String(resume.presence).toUpperCase()) ? String(resume.presence).toUpperCase() : 'REMOTE'
        this.candidateId = resume.candidate_id       
    }
}
