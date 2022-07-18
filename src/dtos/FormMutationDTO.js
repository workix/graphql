import { v4 as uuidv4 } from 'uuid';

export class CreateFormDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()        
        this.email = input.email
        this.message = input.message
        this.name = input.name
        this.subject = input.subject
    }
}

export class UpdateFormDTO {
    constructor(input){
        this.email = input.email
        this.message = input.message
        this.name = input.name
        this.subject = input.subject
    }
}