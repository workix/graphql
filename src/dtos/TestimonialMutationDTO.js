import { v4 as uuidv4 } from 'uuid';

export class CreateTestimonialDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.picture = input.picture
        this.signature = input.signature
        this.text = input.text
        this.author_id = input.authorId
    }
}

export class UpdateTestimonialDTO {
    constructor(input){
        this.picture = input.picture
        this.signature = input.signature
        this.text = input.text
        this.author_id = input.authorId
    }
}