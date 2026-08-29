export class CreateTagDTO {
  [key: string]: any;
    constructor(input){     
        this.id = input.id           
        this.name = input.name              
    }
}

export class UpdateTagDTO {
  [key: string]: any;
    constructor(input){   
        this.id = input.id     
        this.name = input.name            
    }
}
