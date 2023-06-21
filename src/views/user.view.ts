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
    private logoutBtn: HTMLButtonElement;
    private loginShowModalBtn: HTMLButtonElement;
    private loginHideModalBtn: HTMLButtonElement;
    private registrationShowModalBtn: HTMLButtonElement;
    private registrationHideModalBtn: HTMLButtonElement;
    private loginDiv: HTMLElement;
    private registrationDiv: HTMLElement;

    constructor() {
        this.loginForm = qs('.app__login form') as HTMLFormElement;
        this.loginEmailInput = qs('.app__login input[id="email"]') as HTMLInputElement;
        this.loginPasswordInput = qs('.app__login input[id="password"]') as HTMLInputElement;
        this.registerForm = qs('.app__register form') as HTMLFormElement;
        this.registerEmailInput = qs('.app__register input[id="email"]') as HTMLInputElement;
        this.registerPasswordInput = qs('.app__register input[id="password"]') as HTMLInputElement;
        this.logoutBtn = qs('#logout') as HTMLButtonElement;

        this.loginHideModalBtn = qs('.app__login .close') as HTMLButtonElement;
        this.registrationHideModalBtn = qs('.app__register .close') as HTMLButtonElement;

        this.loginShowModalBtn = qs('#modal-login') as HTMLButtonElement;   
        this.loginDiv = qs('.app__login') as HTMLElement;

        this.registrationShowModalBtn = qs('#modal-reg') as HTMLButtonElement;   
        this.registrationDiv = qs('.app__register') as HTMLElement;
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

        this.loginShowModalBtn.addEventListener('click', () => this.showLoginModal());
        this.registrationShowModalBtn.addEventListener('click', () => this.showRegistrationModal());

        this.loginHideModalBtn.addEventListener('click', () => this.hideLoginModal());
        this.registrationHideModalBtn.addEventListener('click', () => this.hideRegistrationModal());

    }

    private showLoginModal() {
        this.loginDiv.style.display = 'block';
    }
    private showRegistrationModal() {
        this.registrationDiv.style.display = 'block';
    }
    private hideLoginModal() {
        this.loginDiv.style.display = 'none';
    }
    private hideRegistrationModal() {
        this.registrationDiv.style.display = 'none';
    }
}