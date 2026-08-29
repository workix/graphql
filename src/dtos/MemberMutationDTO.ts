import { v4 as uuidv4 } from 'uuid';
import { CreateMediaDTO, UpdateMediaDTO } from './MediaMutationDTO';

export class CreateMemberDTO {
  [key: string]: any;
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.name = input.name
        this.occupation = input.occupation
        this.picture = input.picture
        this.short_text = input.shortText
        this.medias = input.medias ? input.medias.map(m => new CreateMediaDTO(m)) : null    
    }
}

export class UpdateMemberDTO {
  [key: string]: any;
    constructor(input) {
        this.name = input.name
        this.occupation = input.occupation
        this.picture = input.picture
        this.short_text = input.shortText
        this.medias = input.medias ? input.medias.map(m => new UpdateMediaDTO(m)) : null
    }
}
