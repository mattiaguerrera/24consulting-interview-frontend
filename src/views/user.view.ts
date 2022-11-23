import UserController from "../controllers/user.controller";
import { qs } from "../helpers";
import UserLoginModel from "../models/user-login.model";
import UserRegistrationModel from "../models/user-registration.model";


export default class UserView {
    private loginForm: HTMLFormElement;    
    private loginEmailInput: HTMLInputElement;
    private loginPasswordInput: HTMLInputElement;
    private registerForm: HTMLFormElement;    
    private registerEmailInput: HTMLInputElement;
    private registerPasswordInput: HTMLInputElement;
    private logoutBtn: HTMLSpanElement;

    constructor() {
        this.loginForm = qs('.app__login form') as HTMLFormElement;                
        this.loginEmailInput = qs('.app__login input[id="email"]') as HTMLInputElement;
        this.loginPasswordInput = qs('.app__login input[id="password"]') as HTMLInputElement;
        this.registerForm = qs('.app__register form') as HTMLFormElement;        
        this.registerEmailInput = qs('.app__register input[id="email"]') as HTMLInputElement;
        this.registerPasswordInput = qs('.app__register input[id="password"]') as HTMLInputElement;
        this.logoutBtn = qs('#logout') as HTMLSpanElement;
    }

    bindEventListeners(controller: UserController): void {

        this.loginForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const user: UserLoginModel = {
                email: this.loginEmailInput?.value,
                password: this.loginPasswordInput?.value,
                id: 1
            }
            controller.login(user);
            this.loginForm.reset();
        });

        this.registerForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const user: UserRegistrationModel = {
                email: this.registerEmailInput?.value,
                password: this.registerPasswordInput?.value
            }
            controller.register(user);
            this.registerForm.reset();
        });

        this.logoutBtn.addEventListener('click', () => controller.logout());
    }
}