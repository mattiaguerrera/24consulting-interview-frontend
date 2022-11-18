interface UserType {
    email: string;
    password: string;
    id: number;
}

export default class UserModel implements UserType {
    email: string;
    password: string;
    id: number;

    constructor(email: string, password: string, id: number) {
        this.email = email;
        this.password = password;
        this.id = id;
    }

}