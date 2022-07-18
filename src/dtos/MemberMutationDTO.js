import { v4 as uuidv4 } from 'uuid';

export class CreateMemberDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.name = input.name
        this.occupation = input.occupation
        this.picture = input.picture
        this.short_text = input.shortText        
    }
}

export class UpdateMemberDTO {
    constructor(input){
        this.name = input.name
        this.occupation = input.occupation
        this.picture = input.picture
        this.short_text = input.shortText    
    }
}