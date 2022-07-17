import { v4 as uuidv4 } from 'uuid';

export class CreateUserDTO {
    constructor(input){        
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.uuid = uuidv4()
        this.activated = input.activated
        this.email = input.email
        this.firebase_message_token = input.firebaseMessageToken
        this.firebase_uuid = input.firebaseUUID
    }
}

export class UpdateUserDTO {
    constructor(input){
        this.activated = input.activated
        this.email = input.email
        this.firebase_message_token = input.firebaseMessageToken
        this.firebase_uuid = input.firebaseUUID
    }
}