import { environment } from "../assets/environment";
import UserModel from "../models/user.model";

export default class UserService {

    login(user: UserModel) {
        return loginUser(user);
    }

    register(user: UserModel) {
        return registerUser(user);
    }
}


async function loginUser(user: UserModel): Promise<boolean> {
    try {
        console.log(JSON.stringify(user));
        const response = await fetch(environment.urlUserLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as boolean;
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return false;
        } else {
            console.log('unexpected error: ', error);
        }
        return false;
    }
}

async function registerUser(user: UserModel): Promise<boolean> {
    try {
        const response = await fetch(environment.urlUserRegister, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as boolean;
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return false;
        } else {
            console.log('unexpected error: ', error);
        }
        return false;
    }
}