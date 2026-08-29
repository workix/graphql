import { v4 as uuidv4 } from 'uuid';
import { CreateMediaDTO, UpdateMediaDTO } from './MediaMutationDTO';


export class CreateCompanyDTO {
  [key: string]: any;
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.mobile_phone = input.mobilePhone
        this.city = input.city
        this.state = input.state
        this.neighborhood = input.neighborhood
        this.number = input.number
        this.street = input.street
        this.zip_code = input.zipCode
        this.name = input.name
        this.cnpj = input.cnpj
        this.description = input.description
        this.logo = input.logo
        this.segment = input.segment
        this.user_id = input.userId     
        this.medias = input.medias ? input.medias.map(m => new CreateMediaDTO(m)) : null        
    }
}

export class UpdateCompanyDTO {
  [key: string]: any;
    constructor(input){
        this.mobile_phone = input.mobilePhone
        this.city = input.city
        this.state = input.state
        this.neighborhood = input.neighborhood
        this.number = input.number
        this.street = input.street
        this.zip_code = input.zipCode
        this.name = input.name
        this.cnpj = input.cnpj
        this.description = input.description
        this.logo = input.logo
        this.segment = input.segment
        this.user_id = input.userId     
        this.medias = input.medias ? input.medias.map(m => new UpdateMediaDTO(m)) : null      
    }
}
