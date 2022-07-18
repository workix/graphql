import { v4 as uuidv4 } from 'uuid';

export class CreateSubscriberDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()        
        this.email = input.email        
    }
}

export class UpdateSubscriberDTO {
    constructor(input){        
        this.email = input.email        
    }
}