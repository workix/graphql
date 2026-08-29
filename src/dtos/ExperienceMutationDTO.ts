export class CreateExperienceDTO {
  [key: string]: any;
    constructor(input){        
        this.id = input.id
        this.description = input.description
        this.employer_name = input.employerName
        this.end_date = input.endDate
        this.job_title = input.jobTitle        
        this.start_date = input.startDate
        this.responsibilities = input.responsibilities
    }
}

export class UpdateExperienceDTO {
  [key: string]: any;
    constructor(input){
        this.id = input.id
        this.description = input.description
        this.employer_name = input.employerName
        this.end_date = input.endDate
        this.job_title = input.jobTitle        
        this.start_date = input.startDate
        this.responsibilities = input.responsibilities
    }
}
