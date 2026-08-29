export class CreateJAASUserDTO {
  [key: string]: any;
    constructor(input) {
        this.id = input.id
        this.login = input.login
        this.password = input.password
    }
}

export class UpdateJAASUserDTO {
  [key: string]: any;
    constructor(input) {
        this.id = input.id
        this.login = input.login
        this.password = input.password
    }
}
