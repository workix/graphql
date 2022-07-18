import { v4 as uuidv4 } from 'uuid';

export class CreateCommentDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()        
        this.email = input.email
        this.name = input.name
        this.text = input.text   
        this.parent_id = input.parentId
    }
}

export class UpdateCommentDTO {
    constructor(input){
        this.email = input.email
        this.name = input.name
        this.text = input.text  
        this.parent_id = input.parentId
    }
}