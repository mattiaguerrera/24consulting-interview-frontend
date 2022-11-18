import UserController from "../controllers/user.controller";
import { qs } from "../helpers";
import UserModel from "../models/user.model";


export default class UserView {
    private submitButton: HTMLButtonElement;
    private loginForm: HTMLFormElement;
    private emailInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    constructor() {
        this.submitButton = qs('.app__login button') as HTMLButtonElement;
        this.loginForm = qs('.app__login form') as HTMLFormElement;
        this.emailInput = qs('.app__login input[id="email"]') as HTMLInputElement;
        this.passwordInput = qs('.app__login input[id="password"]') as HTMLInputElement;
    }

    bindEventListeners(controller: UserController): void {
        this.loginForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            
            console.log(this.emailInput?.value);
            console.log(this.passwordInput?.value);
            
            const user: UserModel = {
                email: 'johndoe@24consulting.it',
                password: '24consulting',
                id: 1
            }
            controller.login(user);
        });
    }
}