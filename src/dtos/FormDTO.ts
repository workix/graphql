export default class FormDTO {
  [key: string]: any;
    constructor(form){
        this.id = form.id
        this.createdAt = form.created_at
        this.updatedAt = form.updated_at
        this.uuid = form.uuid        
        this.email = form.email
        this.message = form.message
        this.name = form.name
        this.subject = form.subject
    }
}
