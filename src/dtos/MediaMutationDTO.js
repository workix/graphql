export class CreateMediaDTO {
    constructor(input){        
        this.id = input.id        
        this.media = input.media
        this.url = input.url    
    }
}

export class UpdateMediaDTO {
    constructor(input){
        this.id = input.id        
        this.media = input.media
        this.url = input.url
    }
}