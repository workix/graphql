import { v4 as uuidv4 } from 'uuid';

export class CreateSubscriberDTO {
  [key: string]: any;
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()        
        this.email = input.email        
    }
}

export class UpdateSubscriberDTO {
  [key: string]: any;
    constructor(input){        
        this.email = input.email        
    }
}
