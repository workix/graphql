export default class EducationDTO {
  [key: string]: any;
    constructor(education){
        this.id = education.id
        this.description = education.description
        this.endDate = education.end_date
        this.qualification = education.qualification
        this.schoolName = education.school_name
        this.startDate = education.start_date
    }
}
