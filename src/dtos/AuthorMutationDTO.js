import { v4 as uuidv4 } from 'uuid';
import { CreateMediaDTO, UpdateMediaDTO } from './MediaMutationDTO';

export class CreateAuthorDTO {
    constructor(input){        
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.about_text = input.aboutText
        this.name = input.name
        this.picture = input.picture      
        this.medias = input.medias ? input.medias.map(m => new CreateMediaDTO(m)) : null
    }
}

export class UpdateAuthorDTO {
    constructor(input){
        this.about_text = input.aboutText
        this.name = input.name
        this.picture = input.picture    
        this.medias = input.medias ? input.medias.map(m => new UpdateMediaDTO(m)) : null
    }
}