import { environment } from "../assets/environment";
import UserModel from "../models/user-registration.model";

export default class UserService {

    login(user: UserModel) {
        return loginUser(user);
    }

    register(user: UserModel) {
        return registerUser(user);
    }
}


async function loginUser(user: UserModel): Promise<any> {
    try {
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
        const result = (await response.json()) as any;
        console.log(result);
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

async function registerUser(user: UserModel): Promise<any> {
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
        const result = (await response.json()) as any;
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