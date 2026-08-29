import { v4 as uuidv4 } from 'uuid';
import { CreateCommentDTO, UpdateCommentDTO } from './CommentMutationDTO';
import { CreatePictureDTO, UpdatePictureDTO } from './PictureMutationDTO';
import { CreateTagDTO, UpdateTagDTO } from './TagMutationDTO';
import { CreateCategoryDTO, UpdateCategoryDTO } from './CategoryMutationDTO';


export class CreateBlogDTO {
  [key: string]: any;
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.citation = input.citation
        this.content = input.content
        this.date = input.date
        this.resume = input.resume
        this.title = input.title
        this.author_id = input.authorId
        this.comments = input.comments ? input.comments.map(c => new CreateCommentDTO(c)) : null
        this.pictures = input.pictures ? input.pictures.map(p => new CreatePictureDTO(p)) : null
        this.tags = input.tags ? input.tags.map(t => new CreateTagDTO(t)) : null
        this.categories = input.categories ? input.categories.map(c => new CreateCategoryDTO(c)) : null
    }
}

export class UpdateBlogDTO {
  [key: string]: any;
    constructor(input) {
        this.citation = input.citation
        this.content = input.content
        this.date = input.date
        this.resume = input.resume
        this.title = input.title
        this.author_id = input.authorId
        this.comments = input.comments ? input.comments.map(c => new UpdateCommentDTO(c)) : null
        this.pictures = input.pictures ? input.pictures.map(p => new UpdatePictureDTO(p)) : null
        this.tags = input.tags ? input.tags.map(t => new UpdateTagDTO(t)) : null
        this.categories = input.categories ? input.categories.map(c => new UpdateCategoryDTO(c)) : null
    }
}
