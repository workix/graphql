export default class JAASUserDTO {
    constructor(jaasUser) {
        this.id = jaasUser.id
        this.login = jaasUser.login
        this.password = jaasUser.password
    }
}