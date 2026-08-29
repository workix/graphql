export class CreateMediaDTO {
  [key: string]: any;
    constructor(input){        
        this.id = input.id        
        this.media = input.media
        this.url = input.url    
    }
}

export class UpdateMediaDTO {
  [key: string]: any;
    constructor(input){
        this.id = input.id        
        this.media = input.media
        this.url = input.url
    }
}
