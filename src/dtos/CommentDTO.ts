export default class CommentDTO {
  [key: string]: any;
    constructor(comment){
        this.id = comment.id
        this.createdAt = comment.created_at
        this.updatedAt = comment.updated_at
        this.uuid = comment.uuid
        this.email = comment.email
        this.name = comment.name
        this.text = comment.text     
        this.parentId = comment.parent_id   
    }
}
