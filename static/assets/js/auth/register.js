import { BaseAuthenticationMiddleware } from "./main.js";

class Registration {
    constructor() {
        this.main = new BaseAuthenticationMiddleware();
    }
    init() {
        console.log("Registration initialized");
    }
}

const register = new Registration()
register.init()
