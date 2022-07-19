export class CreatePictureDTO {
    constructor(input){    
        this.id = input.id            
        this.picture = input.picture              
    }
}

export class UpdatePictureDTO {
    constructor(input){   
        this.id = input.id     
        this.picture = input.picture            
    }
}