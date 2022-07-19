export class CreateTagDTO {
    constructor(input){     
        this.id = input.id           
        this.name = input.name              
    }
}

export class UpdateTagDTO {
    constructor(input){   
        this.id = input.id     
        this.name = input.name            
    }
}