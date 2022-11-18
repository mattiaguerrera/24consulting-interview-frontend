interface UserType {
    email: string;
    password: string;
}

export default class UserRegistrationModel implements UserType {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}