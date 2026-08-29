export default class SkillDTO {
  [key: string]: any;
    constructor(skill){
        this.id = skill.id        
        this.skillName = skill.skill_name
        this.months = skill.months
    }
}
