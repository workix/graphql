export default class BlogDTO {
    constructor(blog){
        this.id = blog.id
        this.createdAt = blog.created_at
        this.updatedAt = blog.updated_at
        this.uuid = blog.uuid
        this.citation = blog.citation
        this.content = blog.content
        this.date = blog.date
        this.resume = blog.resume
        this.title = blog.title
        this.authorId = blog.author_id
    }
}