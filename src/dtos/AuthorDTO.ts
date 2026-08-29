export default class AuthorDTO {
  [key: string]: any;
    constructor(author){
        this.id = author.id
        this.createdAt = author.created_at
        this.updatedAt = author.updated_at
        this.uuid = author.uuid
        this.aboutText = author.about_text
        this.name = author.name
        this.picture = author.picture        
    }
}
