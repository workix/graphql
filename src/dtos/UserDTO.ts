export default class UserDTO {
  [key: string]: any;
    constructor(user){
        this.id = user.id
        this.createdAt = user.created_at
        this.updatedAt = user.updated_at
        this.uuid = user.uuid
        this.activated = user.activated
        this.email = user.email
        this.firebaseMessageToken = user.firebase_message_token
        this.firebaseUUID = user.firebase_uuid
    }
}
