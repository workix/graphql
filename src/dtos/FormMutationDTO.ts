import { v4 as uuidv4 } from 'uuid';

export class CreateFormDTO {
  [key: string]: any;
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
  [key: string]: any;
    constructor(input){
        this.email = input.email
        this.message = input.message
        this.name = input.name
        this.subject = input.subject
    }
}
