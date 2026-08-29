export default class TestimonialDTO {
  [key: string]: any;
    constructor(testimonial){
        this.id = testimonial.id
        this.createdAt = testimonial.created_at
        this.updatedAt = testimonial.updated_at
        this.uuid = testimonial.uuid
        this.picture = testimonial.picture
        this.signature = testimonial.signature
        this.text = testimonial.text
        this.authorId = testimonial.author_id
    }
}
