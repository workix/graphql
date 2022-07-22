export class CreateJAASUserDTO {
    constructor(input) {
        this.id = input.id
        this.login = input.login
        this.password = input.password
    }
}

export class UpdateJAASUserDTO {
    constructor(input) {
        this.id = input.id
        this.login = input.login
        this.password = input.password
    }
}