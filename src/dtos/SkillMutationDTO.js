export class CreateSkillDTO {
    constructor(input){        
        this.id = input.id        
        this.skill_name = input.skillName
        this.months = input.months
    }
}

export class UpdateSkillDTO {
    constructor(input){
        this.id = input.id        
        this.skill_name = input.skillName
        this.months = input.months
    }
}