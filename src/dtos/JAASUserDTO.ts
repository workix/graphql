export default class JAASUserDTO {
  [key: string]: any;
    constructor(jaasUser) {
        this.id = jaasUser.id
        this.login = jaasUser.login
        this.password = jaasUser.password
    }
}
