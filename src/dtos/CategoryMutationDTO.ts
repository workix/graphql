export class CreateCategoryDTO {
  [key: string]: any;
    constructor(input){   
        this.id = input.id             
        this.category = input.category              
    }
}

export class UpdateCategoryDTO {
  [key: string]: any;
    constructor(input){   
        this.id = input.id     
        this.category = input.category            
    }
}
