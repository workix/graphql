export class CreateSkillDTO {
  [key: string]: any;
    constructor(input){        
        this.id = input.id        
        this.skill_name = input.skillName
        this.months = input.months
    }
}

export class UpdateSkillDTO {
  [key: string]: any;
    constructor(input){
        this.id = input.id        
        this.skill_name = input.skillName
        this.months = input.months
    }
}
