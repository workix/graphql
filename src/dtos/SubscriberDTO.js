export default class SubscriberDTO {
    constructor(subscriber){
        this.id = subscriber.id
        this.createdAt = subscriber.created_at
        this.updatedAt = subscriber.updated_at
        this.uuid = subscriber.uuid
        this.email = subscriber.email
    }
}