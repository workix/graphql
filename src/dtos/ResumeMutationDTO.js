import { v4 as uuidv4 } from 'uuid';
import { CreateEducationDTO , UpdateEducationDTO} from './EducationsMutationDTO';
import { CreateExperienceDTO, UpdateExperienceDTO } from './ExperienceMutationDTO';
import { CreateSkillDTO, UpdateSkillDTO } from './SkillMutationDTO';

export class CreateResumeDTO {
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.carrer_level = input.carrerLevel
        this.content = input.content
        this.objective = input.objective
        this.presence = input.presence
        this.candidate_id = input.candidateId
        this.educations = input.educations.map(e => new CreateEducationDTO(e))
        this.experiences = input.experiences.map(e => new CreateExperienceDTO(e))
        this.skills = input.skills.map(s => new CreateSkillDTO(s))
    }
}

export class UpdateResumeDTO {
    constructor(input) {
        this.carrer_level = input.carrerLevel
        this.content = input.content
        this.objective = input.objective
        this.presence = input.presence
        this.candidate_id = input.candidateId
        this.educations = input.educations.map(e => new UpdateEducationDTO(e))
        this.experiences = input.experiences.map(e => new UpdateExperienceDTO(e))
        this.skills = input.skills.map(s => new UpdateSkillDTO(s))
    }
}