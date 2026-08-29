export class CreatePictureDTO {
  [key: string]: any;
    constructor(input){    
        this.id = input.id            
        this.picture = input.picture              
    }
}

export class UpdatePictureDTO {
  [key: string]: any;
    constructor(input){   
        this.id = input.id     
        this.picture = input.picture            
    }
}
