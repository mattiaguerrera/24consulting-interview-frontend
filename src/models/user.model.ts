interface UserType {
    email: string;
    password: string;
    id: number | null;
}

export default class UserModel implements UserType {
    email: string;
    password: string;
    id: number | null;

    constructor(email: string, password: string, id: number) {
        this.email = email;
        this.password = password;
        this.id = id;
    }

}