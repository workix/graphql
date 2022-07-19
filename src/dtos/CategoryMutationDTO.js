export class CreateCategoryDTO {
    constructor(input){   
        this.id = input.id             
        this.category = input.category              
    }
}

export class UpdateCategoryDTO {
    constructor(input){   
        this.id = input.id     
        this.category = input.category            
    }
}