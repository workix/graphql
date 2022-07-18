import { v4 as uuidv4 } from 'uuid';

export class CreateBlogDTO {
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
        this.comments = input.comments  
        this.pictures = input.pictures
        this.tags = input.tags
        this.categories = input.categories
    }
}

export class UpdateBlogDTO {
    constructor(input) {
        this.citation = input.citation
        this.content = input.content
        this.date = input.date
        this.resume = input.resume
        this.title = input.title
        this.author_id = input.authorId
    }
}