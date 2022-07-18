export class CreateEducationDTO {
    constructor(input){        
        this.id = input.id
        this.description = input.description
        this.end_date = input.endDate
        this.qualification = input.qualification
        this.school_name = input.schoolName
        this.start_date = input.startDate
    }
}

export class UpdateEducationDTO {
    constructor(input){
        this.id = input.id
        this.description = input.description
        this.end_date = input.endDate
        this.qualification = input.qualification
        this.school_name = input.schoolName
        this.start_date = input.startDate
    }
}