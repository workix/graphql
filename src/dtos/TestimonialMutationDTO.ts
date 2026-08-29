import { v4 as uuidv4 } from 'uuid';

export class CreateTestimonialDTO {
  [key: string]: any;
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
  [key: string]: any;
    constructor(input){
        this.picture = input.picture
        this.signature = input.signature
        this.text = input.text
        this.author_id = input.authorId
    }
}
