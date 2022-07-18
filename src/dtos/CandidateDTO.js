export default class CandidateDTO {
    constructor(candidate){
        this.id = candidate.id
        this.createdAt = candidate.created_at
        this.updatedAt = candidate.updated_at
        this.uuid = candidate.uuid
        this.mobilePhone = candidate.mobile_phone
        this.city = candidate.city
        this.state = candidate.state
        this.neighborhood = candidate.neighborhood
        this.number = candidate.number
        this.street = candidate.street
        this.zipCode = candidate.zip_code
        this.name = candidate.name
        this.birthDate = candidate.birth_date
        this.cpf = candidate.cpf
        this.userId = candidate.user_id   
    }
}