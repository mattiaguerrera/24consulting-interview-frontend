/* eslint-disable @typescript-eslint/no-var-requires */
import { assert } from "chai";
import UserLoginModel from "../src/models/user-login.model";
import UserService from "../src/services/user.service";

describe("User Tests", () => {
    it("should return true for validation of jwt token", () => {
        const userService: UserService = new UserService();
        const user: UserLoginModel = {
            email: '',
            password: '',
            id: 1
        }
        const jwt = require('jsonwebtoken');
        userService.login(user).then((res: any) => {
            if (res) {
                const token: string = res['accessToken'];
                if (token) {
                    let decoded = false;
                    try {
                        decoded = jwt.verify(token, 'accessToken');
                        console.log('Token is valid');
                    } catch (err) {
                        console.log('Token has expired');
                    }
                    assert.isTrue(decoded);
                }
            }
        });
    });
});