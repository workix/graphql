export default class CompanyDTO {
    constructor(company){
        this.id = company.id
        this.createdAt = company.created_at
        this.updatedAt = company.updated_at
        this.uuid = company.uuid
        this.mobilePhone = company.mobile_phone
        this.city = company.city
        this.state = company.state
        this.neighborhood = company.neighborhood
        this.number = company.number
        this.street = company.street
        this.zipCode = company.zip_code
        this.name = company.name
        this.cnpj = company.cnpj
        this.description = company.description
        this.logo = company.logo
        this.segment = company.segment
        this.userId = company.user_id               
    }
}