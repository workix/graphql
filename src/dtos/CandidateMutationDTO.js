import { v4 as uuidv4 } from 'uuid';

export class CreateCandidateDTO {
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.mobile_phone = input.mobilePhone
        this.city = input.city
        this.state = input.state
        this.neighborhood = input.neighborhood
        this.number = input.number
        this.street = input.street
        this.zip_code = input.zipCode
        this.name = input.name
        this.birth_date = input.birthDate
        this.cpf = input.cpf
        this.user_id = input.userId
    }
}

export class UpdateCandidateDTO {
    constructor(input) {
        this.mobile_phone = input.mobilePhone
        this.city = input.city
        this.state = input.state
        this.neighborhood = input.neighborhood
        this.number = input.number
        this.street = input.street
        this.zip_code = input.zipCode
        this.name = input.name
        this.birth_date = input.birthDate
        this.cpf = input.cpf
        this.user_id = input.userId
    }
}