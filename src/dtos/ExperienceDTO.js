export default class ExperienceDTO {
    constructor(experience){
        this.id = experience.id
        this.description = experience.description
        this.employerName = experience.employer_name
        this.endDate = experience.end_date
        this.jobTitle = experience.job_title        
        this.startDate = experience.start_date
        this.responsibilities = experience.responsibilities
    }
}