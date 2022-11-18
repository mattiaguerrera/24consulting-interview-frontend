import UserModel from "../models/user-registration.model";
import UserService from "../services/user.service";
import UserView from "../views/user.view";

export default class UserController {    


    private userView: UserView;
    constructor(public userService: UserService) {
        this.userView = new UserView();
    }

    init(): void {
        this.userView.bindEventListeners(this);
    }

    login(user: UserModel) {
        this.userService.login(user).then(res => {
            console.log(res);
        });
    };

    register(user: UserModel) {
        this.userService.register(user).then(res => {
            console.log(res);
        });
    };
    
}